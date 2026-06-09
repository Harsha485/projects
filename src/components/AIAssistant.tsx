import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { ProjectData } from "../types";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AIAssistantProps {
  currentProject?: ProjectData;
  fullscreen?: boolean;
}

export default function AIAssistant({ currentProject, fullscreen = false }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: currentProject
        ? `Aha! You are currently exploring **"${currentProject.overview.title}"**. Ask me anything about the RTL designs, firmware code, active balancing MOSFET math, or hardware verification debugging! How may I assist you today?`
        : "Welcome to the ECE Project Master AI Lab! I can help you understand pipelined registers, verify Rayleigh fading parameters, calibrate MQ-2 smoke sensors, or construct active lithium balancing algorithms. Select a project or write your question below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    setErrorStatus(null);
    setLoading(true);
    setInput("");

    const newMessages = [...messages, { role: "user" as const, text: textToSend }];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          projectId: currentProject?.id,
          context: currentProject ? {
            title: currentProject.overview.title,
            domain: currentProject.overview.domain,
            concepts: currentProject.concepts.map(c => c.name),
            hardware: currentProject.hardware.map(h => h.component),
          } : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to receive a response from ECE AI core.");
      }

      setMessages((prev) => [...prev, { role: "model" as const, text: data.text || "I was unable to synthesize the query." }]);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Loss of signal. Ensure your GEMINI_API_KEY is configured.");
    } finally {
      setLoading(false);
    }
  };

  const handleShortcut = (topicType: string) => {
    if (!currentProject) return;
    let queryText = "";
    switch (topicType) {
      case "circuit":
        queryText = `Explain the wire interconnections, active pins, and potential physical fault-tolerances in the "${currentProject.overview.title}" circuit design.`;
        break;
      case "code":
        queryText = `Explain the core modules/code syntax of the custom template files inside the "${currentProject.id}" codebase. Point out synchronous vs asynchronous timing processes.`;
        break;
      case "debug":
        queryText = `Suggest a complete debugging routine for when the physical prototype of "${currentProject.overview.title}" is deployed but fails to capture telemetry or flashes error status LEDs.`;
        break;
      case "extend":
        queryText = `Propose 3 research extension papers and 1 commercial hardware upgrade path for the "${currentProject.overview.title}" project logic.`;
        break;
    }
    handleSend(queryText);
  };

  return (
    <div className={`flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden ${fullscreen ? "h-[650px]" : "h-[500px]"}`}>
      {/* Title block */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-600" />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-1">
              <span>ECE Lab Assistant AI</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-600 fill-yellow-500" />
            </h4>
            <p className="text-[10px] text-slate-500">Powered by Gemini 1.5 Flash</p>
          </div>
        </div>

        {currentProject && (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
            {currentProject.overview.domain}
          </span>
        )}
      </div>

      {/* Message viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-full">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
            {/* Avatar block */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
              msg.role === "user" ? "bg-slate-150 border-slate-200" : "bg-emerald-50 border-emerald-200"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-emerald-600" />}
            </div>

            {/* Bubble block */}
            <div className={`p-3 rounded-xl text-xs leading-relaxed break-words whitespace-pre-wrap ${
              msg.role === "user" ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-200 rounded-tl-none font-sans shadow-sm"
            }`}>
              {/* Parse headers and simple markdown bold markers */}
              {msg.text.split("\n").map((line, lIdx) => {
                if (line.startsWith("### ")) {
                  return <h5 key={lIdx} className="text-sm font-semibold text-emerald-700 mt-2 mb-1">{line.replace("### ", "")}</h5>;
                }
                if (line.startsWith("## ")) {
                  return <h4 key={lIdx} className="text-md font-bold text-slate-900 mt-2 mb-1">{line.replace("## ", "")}</h4>;
                }
                if (line.startsWith("- ") || line.startsWith("* ")) {
                  return <div key={lIdx} className="pl-3 list-disc text-slate-600">🌿 {line.substring(2)}</div>;
                }
                return <p key={lIdx} className="mb-1">{line}</p>;
              })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mr-auto items-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs text-slate-500 flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200" />
              <span>Analyzing telemetry variables...</span>
            </div>
          </div>
        )}

        {errorStatus && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">ECE Core Exception</p>
              <p className="mt-0.5">{errorStatus}</p>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts shortcut rail */}
      {currentProject && !loading && (
        <div className="px-4 py-2 border-t border-slate-200 bg-slate-100 flex flex-wrap gap-1.5">
          <button
            onClick={() => handleShortcut("circuit")}
            className="text-[10px] text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 transition cursor-pointer shadow-sm"
          >
            🔍 Explanation of Wiring
          </button>
          <button
            onClick={() => handleShortcut("code")}
            className="text-[10px] text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 transition cursor-pointer shadow-sm"
          >
            💻 Review Code Syntax
          </button>
          <button
            onClick={() => handleShortcut("debug")}
            className="text-[10px] text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 transition cursor-pointer shadow-sm"
          >
            🛠️ Debug Hardware Fault
          </button>
          <button
            onClick={() => handleShortcut("extend")}
            className="text-[10px] text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 transition cursor-pointer shadow-sm"
          >
            🚀 Extension Studies
          </button>
        </div>
      )}

      {/* Bottom text input wrapper */}
      <div className="bg-slate-100 border-t border-slate-200 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
            placeholder={currentProject ? `Ask about "${currentProject.overview.title}"...` : "Ask any engineering questions..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-900 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
            disabled={loading || !input.trim()}
          >
            <Send className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
}
