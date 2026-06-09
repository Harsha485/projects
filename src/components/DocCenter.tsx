import { useState } from "react";
import { FileText, Copy, Check, Download, Layers } from "lucide-react";
import { ProjectData } from "../types";
import { useStore } from "../store";

interface DocCenterProps {
  project: ProjectData;
}

export default function DocCenter({ project }: DocCenterProps) {
  const [authorName, setAuthorName] = useState("ECE Student");
  const [collegeName, setCollegeName] = useState("Autonomous Engineering Institute of Technology");
  const [docType, setDocType] = useState<"IEEE" | "Report" | "PPT" | "LaTeX">("IEEE");
  const [copied, setCopied] = useState(false);
  const incrementExportCount = useStore((state) => state.incrementExportCount);

  const getTemplateContent = () => {
    const timestamp = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    switch (docType) {
      case "IEEE":
        return `\\documentclass[conference]{IEEEtran}
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}

\\title{${project.overview.title}}
\\author{\\IEEEauthorblockN{1\\textsuperscript{st} ${authorName}}
\\IEEEauthorblockA{\\textit{Department of Electronics and Communication Engineering} \\\\
\\textit{${collegeName}}\\\\}
}

\\begin{document}
\\maketitle

\\begin{abstract}
${project.abstract.proposedSolution} This paper compiles the baseline architecture of ${project.overview.title}. The overall industry relevance is indexed as: ${project.overview.industryRelevance}
\\end{abstract}

\\section{Introduction}
${project.abstract.background}
Our problem statement hinges on: ${project.abstract.problemStatement}.

\\section{Methodology}
The baseline hardware deployment mandates:
\\begin{itemize}
${project.hardware.map((h) => `  \\item ${h.component} - Qty: ${h.quantity}. Purpose: ${h.purpose}`).join("\n")}
\\end{itemize}

\\section{System Modules & Realization}
Our architectural partition segregates operations into discrete elements:
${project.modules.map((m) => `\\textbf{${m.name}}: ${m.description} (Subsystems: ${m.subcomponents.join(", ")})`).join("\n\n")}

\\section{Expected Results \\& Simulation}
The validation metrics yield performance capacities:
\\begin{itemize}
${project.analysisData.map((d) => `  \\item ${d.param}: ${d.value} (Target Baseline Benchmark: ${d.benchmark || "N/A"})`).join("\n")}
\\end{itemize}

\\section{Conclusion}
${project.conclusion.learningOutcomes.join(" ")} \\\\
\\textbf{Future Scope:} ${project.futureEnhancements.research[0]}

\\begin{thebibliography}{00}
\\bibitem{b1} B. Razavi, \\textit{Fundamentals of ECE Design Systems}, IEEE Transactions, Vol. 14, 2024.
\\end{thebibliography}
\\end{document}`;

      case "Report":
        return `PROJECT INVESTIGATION REPORT
=============================================================
Title: ${project.overview.title}
Domain: ${project.overview.domain}
Status: Complete / Active Simulation Verification
Author: ${authorName}
Affiliation: ${collegeName}
Date of Generation: ${timestamp}
=============================================================

1. PROJECT SUMMARY
------------------
${project.abstract.background}

2. PROBLEM DELINEATION
----------------------
${project.abstract.problemStatement}
Legacy systems suffer from: ${project.abstract.existingSystems}

3. PRIMARY SCHEMATIC DETAIL
---------------------------
The implementation requires the following specific bill of materials:
${project.hardware.map((h, i) => `[${i + 1}] Component: ${h.component} | Qty: ${h.quantity} | Est. Cost: ${h.estimatedCost}`).join("\n")}

The design depends on these environments:
${project.software.map((s, i) => `[${i + 1}] Software: ${s.software} | Version: ${s.version} | Purpose: ${s.purpose}`).join("\n")}

4. SYSTEM PRINCIPLE OF OPERATIONS
---------------------------------
To achieve our core benchmarks, the following principles are taught:
${project.concepts.map((c) => `- ${c.name}: ${c.definition}\n  Explanation: ${c.explanation}\n   Role inside implementation: ${c.whyNeeded}`).join("\n\n")}

5. SEQUENTIAL IMPLEMENTATION TIMELINE
-------------------------------------
${project.implementation.map((step) => `[Step ${step.stepNumber}] ${step.title}\nDescription: ${step.description}\nExpected Output: ${step.expectedOutput}\nHours/Time Required: ${step.estimatedTime}`).join("\n\n")}

6. CONCLUSION
-------------
- Acquired Skills: ${project.conclusion.skillsAcquired.join(", ")}
- Career Pipelines: ${project.conclusion.careerPaths.join(", ")}

Approved by Senior Board Lead: ____________________________`;

      case "PPT":
        return `SLIDE DECK OUTLINE: ${project.overview.domain} COMPREHENSIVE PRESENTATION
========================================================================
Project Ref: ${project.id.toUpperCase()} 

SLIDE 1: Title & Contributors (Splash Screen)
  - Title: ${project.overview.title}
  - Lead Presenter: ${authorName}
  - Institutional Affiliation: ${collegeName}
  - Department: ECE Systems Group

SLIDE 2: Problem Background & Legacy Gaps
  - Existing Systems: ${project.abstract.existingSystems}
  - The Core Challenge: ${project.abstract.problemStatement}

SLIDE 3: Proposed Architecture
  - Main Objective: ${project.abstract.proposedSolution}
  - Core Advantages: 
    * ${project.abstract.benefits.join("\n    * ")}

SLIDE 4: Hardware & Software Requirements
  - Core Modules: ${project.hardware.slice(0, 3).map((h) => h.component).join(", ")}
  - Simulation Environment: ${project.software.map((s) => s.software).join(" & ")}

SLIDE 5: Functional Layout & Modules
  - Layer Split:
    ${project.modules.map((m) => `* ${m.name} --> ${m.subcomponents.slice(0, 2).join(", ")}`).join("\n    ")}

SLIDE 6: Experimental Results & Benchmarks
  - Realized Parameters:
    ${project.analysisData.map((d) => `* ${d.param}: ${d.value} (vs. Benchmark: ${d.benchmark || "N/A"})`).join("\n    ")}

SLIDE 7: Future Milestones & Closing Remarks
  - Future Enhancements: ${project.futureEnhancements.industry[0]}
  - Career Pipeline Map: ${project.conclusion.careerPaths.slice(0, 2).join(" & ")}
========================================================================`;

      case "LaTeX":
        return `% LaTeX Document Structure for Project Report
\\documentclass[12pt,a4paper]{report}
\\usepackage[utf8]{inputenc}
\\usepackage{booktabs}

\\begin{document}
\\title{Project Synthesis Report: ${project.overview.title}}
\\author{${authorName} \\\\ \\small ${collegeName}}
\\date{${timestamp}}
\\maketitle

\\chapter{Introduction}
${project.abstract.background}

\\section{Problem Statement}
${project.abstract.problemStatement}

\\chapter{Requirements Analysis}
\\begin{table}[ht]
\\centering
\\caption{Hardware and Component Bill of Materials}
\\begin{tabular}{lll}
\\hline
\\textbf{Component} & \\textbf{Quantity} & \\textbf{Estimated Cost} \\\\ \\hline
${project.hardware.map((h) => `${h.component.replace("&", "\\&")} & ${h.quantity} & ${h.estimatedCost} \\\\`).join("\n")}
\\hline
\\end{tabular}
\\end{table}

\\end{document}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTemplateContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getTemplateContent();
    const ext = docType === "IEEE" || docType === "LaTeX" ? "tex" : "txt";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.id}_document_template.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    incrementExportCount();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Details Pane */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Report Meta Properties</span>
        </h4>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Student Lead Author</label>
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">University Collegiatum Affiliation</label>
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <label className="block text-xs font-medium text-slate-600 mb-2">Export Paper Layout Standard</label>
          <div className="grid grid-cols-2 gap-2">
            {(["IEEE", "Report", "PPT", "LaTeX"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDocType(type)}
                className={`py-2 px-3 text-xs rounded-lg font-medium transition cursor-pointer ${
                  docType === type
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {type === "IEEE" ? "IEEE Conf Paper" : type === "Report" ? "Formal Report" : type === "PPT" ? "PowerPoint PPT" : "LaTeX Code"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
          <p>💡 Export compiles all sections from Objectives, Hardware Tables, Concepts, and Code modules automatically.</p>
          <p>📝 Ideal for submit-ready semester portfolios and slide outlines.</p>
        </div>
      </div>

      {/* Compiled Document Preview Sandbox */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[400px] shadow-sm">
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
          <span className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Output Preview: {docType === "IEEE" || docType === "LaTeX" ? "main.tex" : "document.txt"}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1 px-3 rounded text-[11px] text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Copy details to system clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="p-1 px-3 rounded text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer font-medium shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Scrollable document viewport */}
        <pre className="flex-1 p-4 overflow-y-auto text-xs font-mono text-slate-700 bg-white select-text leading-relaxed whitespace-pre-wrap">
          {getTemplateContent()}
        </pre>
      </div>
    </div>
  );
}
