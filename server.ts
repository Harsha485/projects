import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI to prevent crash on missing key during boot
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI Assistant endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt, projectId, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let projectContext = "";
    if (projectId) {
      projectContext = `The user is currently studying the project ID: "${projectId}". Provide domain-specific explanations suited for an Electronics and Communication Engineering curriculum. \nContext about this project node: ${JSON.stringify(context || {})}`;
    }

    const ai = getAiClient();
    const systemPrompt = `You are "ece projects AI Assistant" - an elite Electronics and Communication Engineering Professor, hardware designer, and system architect.
Your task is to:
- Explain ECE concepts (analog, digital, VLSI, embedded, signal processing, power systems, EV BMS) in a practical, physical, and intuitive way.
- Guide step-by-step implementation, providing synthesizable RTL Verilog tricks, firmware C/C++ corrections, Matlab equations, or Python OpenCV algorithms.
- Explain schematics, pin connections, logic blockages, and how to debug real physical faults on breadboards/FPGAs.
- Generate high-quality practice viva or oral panel questions.
- Maintain a helpful, analytical, and highly structured scientific tone.
Avoid empty generalities. Use formatting, bullet points, and codeblocks where appropriate. If asked to write code, output clean, compilable snippets.

Current Project Scope:
${projectContext}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Endpoint Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI Core." });
  }
});

// Serve frontend based on environment
const isProd = process.env.NODE_ENV === "production";

async function startServer() {
  if (!isProd) {
    console.log("Starting server in DEVELOPMENT mode (Vite middleware)...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);

    // Serve index.html for spa
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(".", "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    console.log("Starting server in PRODUCTION mode (Static files)...");
    const distPath = path.resolve(".", "dist");
    
    // Serve static compiled assets
    app.use(express.static(distPath));

    // Fallback index.html for spa
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ece projects listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
