import { useState } from "react";
import { ProjectData } from "../types";
import { useStore } from "../store";
import CircularSchematic from "./CircularSchematic";
import DocCenter from "./DocCenter";
import VivaQuiz from "./VivaQuiz";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import { 
  BookOpen, Layers, CheckSquare, Settings, Play, Info, AlertTriangle, 
  Cpu, Zap, GitBranch, Terminal, List, BarChart3, HelpCircle, FileText, 
  ChevronRight, Compass, ChevronDown, CheckCircle2, Copy, Check, Download,
  Award
} from "lucide-react";

interface ProjectDetailProps {
  project: ProjectData;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<"docs" | "specs" | "circuit" | "timeline" | "code" | "results" | "viva">("specs");
  
  const { completedObjectives, toggleObjective, completedConcepts, toggleConcept, completedSteps, toggleStep } = useStore();
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>(project.codeStructure.children?.[0]?.name || "");
  const [copiedCode, setCopiedCode] = useState(false);

  // Parse total checklist achievements
  const fileNodes = project.codeStructure.children || [];
  const currentCodeFile = fileNodes.find(f => f.name === selectedFile) || fileNodes[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Helper render charts based on the project ID
  const renderAnalysisChart = () => {
    if (project.id === "vlsi_fpga") {
      return (
        <div className="h-64 bg-slate-50 p-4 rounded-xl border border-slate-205">
          <span className="text-xs text-slate-550 font-semibold uppercase tracking-wider block mb-3">Processor Simulation Run: Completes vs Stalls</span>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={project.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="clockCycles" stroke="#64748b" label={{ value: 'Clock Cycles', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#1e293b" }} />
              <Legend />
              <Line type="monotone" dataKey="instructionsCompleted" stroke="#059669" strokeWidth={2.5} name="Instructions Executed" />
              <Line type="monotone" dataKey="pipelineStalls" stroke="#d97706" strokeWidth={2} name="Pipeline stalls / Bubbles" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (project.id === "embedded_iot") {
      return (
        <div className="h-64 bg-slate-50 p-4 rounded-xl border border-slate-205">
          <span className="text-xs text-slate-550 font-semibold uppercase tracking-wider block mb-3">Live Telemetry: Sensor Reads vs Safety Core Relays</span>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={project.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="seconds" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#1e293b" }} />
              <Legend />
              <Area type="monotone" dataKey="smokePPM" stroke="#059669" fill="#059669" fillOpacity={0.1} name="MQ-2 Gas (PPM x10)" />
              <Area type="monotone" dataKey="temperature" stroke="#2563eb" fill="#2563eb" fillOpacity={0.03} name="DHT Temperature (°C)" />
              <Area type="monotone" dataKey="relayOn" stroke="#dc2626" fill="#dc2626" fillOpacity={0.03} name="Ventilation Relay (Active/Idle)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (project.id === "comms_mimo_ofdm") {
      return (
        <div className="h-64 bg-slate-50 p-4 rounded-xl border border-slate-205">
          <span className="text-xs text-slate-550 font-semibold uppercase tracking-wider block mb-3">MIMO-OFDM Simulation: Bit Error Rate (BER) vs SNR (dB)</span>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={project.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="snr" stroke="#64748b" label={{ value: 'Signal-to-Noise Ratio (SNR dB)', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
              <YAxis domain={[0.00001, 1]} scale="log" stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#1e293b" }} />
              <Legend />
              <Line type="monotone" dataKey="berSISO" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" name="SISO Baseline" />
              <Line type="monotone" dataKey="berMIMO_LS" stroke="#2563eb" strokeWidth={2} name="2x2 MIMO (LS Estimate)" />
              <Line type="monotone" dataKey="berMIMO_MMSE" stroke="#7c3aed" strokeWidth={2.5} name="2x2 MIMO (MMSE Optimal)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (project.id === "ai_electronics") {
      return (
        <div className="h-64 bg-slate-50 p-4 rounded-xl border border-slate-205">
          <span className="text-xs text-slate-550 font-semibold uppercase tracking-wider block mb-3">Intersection Delay Comparisons: Adaptive vs Static Timers</span>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={project.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#1e293b" }} />
              <Legend />
              <Bar dataKey="baselineDelayMinutes" fill="#db2777" opacity={0.5} name="Fixed-Timer Average Delay (Min)" />
              <Bar dataKey="waitingDelayMinutes" fill="#16a34a" name="Adaptive CV Delay (Min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (project.id === "power_ev_bms") {
      return (
        <div className="h-64 bg-slate-50 p-4 rounded-xl border border-slate-205">
          <span className="text-xs text-slate-550 font-semibold uppercase tracking-wider block mb-3">4S Cell Discharging Voltages & Thermals</span>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={project.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dischargeMinutes" stroke="#64748b" label={{ value: 'Discharge Duration (Min)', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
              <YAxis yAxisId="left" stroke="#0284c7" />
              <YAxis yAxisId="right" orientation="right" stroke="#e11d48" />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", color: "#1e293b" }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cell1" stroke="#0284c7" strokeWidth={2.5} name="Cell Voltage 1 (V)" />
              <Line yAxisId="left" type="monotone" dataKey="cell2" stroke="#059669" strokeWidth={2} name="Cell Voltage 2 (V)" />
              <Line yAxisId="right" type="monotone" dataKey="tempC" stroke="#e11d48" strokeWidth={2} name="Thermal Core Temp (°C)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Meta Information Header / Section 1 */}
      <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-250 uppercase tracking-widest">
              {project.overview.domain}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-2 font-display">
              {project.overview.title}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>{project.overview.difficulty}</span>
            </span>
            <span className="text-xs bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>{project.overview.estimatedTime}</span>
            </span>
          </div>
        </div>

        {/* Section 1 Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-450 font-mono tracking-wider uppercase">Placement Direct Careers</span>
            <ul className="text-xs text-slate-700 space-y-1">
              {project.overview.placementOpportunities.map((op, i) => (
                <li key={i} className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>{op}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 space-y-1.5">
            <span className="text-[10px] text-slate-450 font-mono tracking-wider uppercase">Core Industry Relevance</span>
            <p className="text-xs text-slate-650 leading-relaxed font-normal">
              {project.overview.industryRelevance}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.overview.requiredSkills.map((sk, i) => (
                <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded border border-slate-200 font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Study Room Secondary Tabs System */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-px">
        {[
          { id: "specs", label: "Abstract & Concepts", icon: Info },
          { id: "circuit", label: "Schematics & Connections", icon: Layers },
          { id: "timeline", label: "Implementation Steps", icon: GitBranch },
          { id: "code", label: "RTL & Code Library", icon: Terminal },
          { id: "results", label: "Simulation Output", icon: BarChart3 },
          { id: "viva", label: "Viva Panel Study", icon: HelpCircle },
          { id: "docs", label: "Export Drafts", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Sandbox rendering */}
      <div className="space-y-6">
        {/* TAB 1: SPECS & CONCEPTS */}
        {activeTab === "specs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left columns: Abstract & Objectives */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section 2: Abstract */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-blue-600" />
                  <span>Technical Investigation Synopsis (Abstract)</span>
                </h3>
                
                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-500 block mb-1 uppercase text-[10px] tracking-wider">Background Context</span>
                    <p>{project.abstract.background}</p>
                  </div>
                  <div>
                    <span className="font-bold text-rose-700 block mb-1 uppercase text-[10px] tracking-wider">The Problem Statement</span>
                    <p>{project.abstract.problemStatement}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block mb-1 uppercase text-[10px] tracking-wider">State of Existing Legacy Systems</span>
                    <p>{project.abstract.existingSystems}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-250">
                    <span className="font-bold text-emerald-800 block mb-1 font-display uppercase text-[10px] tracking-wider">Proposed Core Solution</span>
                    <p>{project.abstract.proposedSolution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-550 font-mono tracking-wider uppercase">Value Added Benefits</span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {project.abstract.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-1 font-medium">
                          <span className="text-emerald-600 mt-0.5">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-550 font-mono tracking-wider uppercase">Engineering Applications</span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {project.abstract.applications.map((ap, i) => (
                        <li key={i} className="flex items-start gap-1 font-medium">
                          <span className="text-indigo-600 mt-0.5">•</span>
                          <span>{ap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 6: Concepts modules */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Key Analytical Theoretical Concepts</span>
                </h3>
                <p className="text-xs text-slate-500 leading-normal">Master the core academic logic blocks inside the project core.</p>

                <div className="space-y-3">
                  {project.concepts.map((concept) => (
                    <div key={concept.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => setExpandedConcept(expandedConcept === concept.id ? null : concept.id)}
                        className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 px-4 flex items-center justify-between transition cursor-pointer border-b border-transparent"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleConcept(project.id, concept.id);
                            }}
                            className="text-slate-400 hover:text-emerald-600 transition"
                          >
                            <CheckCircle2 className={`w-4.5 h-4.5 cursor-pointer ${completedConcepts[`${project.id}_${concept.id}`] ? "text-emerald-600 fill-emerald-100" : "text-slate-400"}`} />
                          </div>
                          <span className="text-xs font-semibold text-slate-800">{concept.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold shadow-sm">
                            Level: {concept.difficulty}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedConcept === concept.id ? "rotate-180" : ""}`} />
                        </div>
                      </button>

                      {expandedConcept === concept.id && (
                        <div className="p-4 border-t border-slate-200 space-y-3 text-xs leading-relaxed text-slate-700 bg-white">
                          <div>
                            <span className="font-bold text-slate-500 block mb-0.5">Strict Definition</span>
                            <p>{concept.definition}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 block mb-0.5">In-Depth Physical Principle</span>
                            <p>{concept.explanation}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-2.5 rounded border border-slate-200 mt-1 shadow-inner">
                            <div>
                              <span className="font-semibold text-slate-800 block">Why it is needed?</span>
                              <span className="text-slate-600 text-[11px]">{concept.whyNeeded}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 block">Module Prerequisites</span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {concept.prerequisites.map((pr, idx) => (
                                  <span key={idx} className="text-[9px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-medium shadow-sm">{pr}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Objectives / Sec 3 */}
            <div className="space-y-6">
              {/* Section 3: Objectives progress list */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <CheckSquare className="w-4.5 h-4.5 text-amber-600" />
                    <span>Project Objectives Checklist</span>
                  </h3>
                </div>

                <p className="text-xs text-slate-500 leading-normal">
                  Tick off completed milestones to track study progress.
                </p>

                {/* Progress load */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Task Objectives Progress</span>
                    <span className="font-semibold font-mono text-slate-800">
                      {project.objectives.filter(o => completedObjectives[`${project.id}_${o.id}`]).length} / {project.objectives.length}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.round((project.objectives.filter(o => completedObjectives[`${project.id}_${o.id}`]).length / project.objectives.length) * 100)}%`
                      }}
                      className="h-full bg-amber-500 rounded-full transition-all duration-350"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  {project.objectives.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => toggleObjective(project.id, obj.id)}
                      className="w-full flex items-start gap-2.5 text-left p-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={!!completedObjectives[`${project.id}_${obj.id}`]}
                        onChange={() => {}} // Swapped by outer button click
                        className="mt-0.5 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-400"
                      />
                      <span className={`text-xs font-medium ${completedObjectives[`${project.id}_${obj.id}`] ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {obj.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections 4 & 5: Hardware Supply list */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-blue-600" />
                  <span>Hardware & Bill of Materials</span>
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[9px]">
                        <th className="pb-1.5 font-semibold">Component</th>
                        <th className="pb-1.5 font-semibold text-center">Qty</th>
                        <th className="pb-1.5 font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {project.hardware.map((hw, i) => (
                        <tr key={i} className="align-top py-2">
                          <td className="py-2.5 font-bold text-slate-800 pr-2 max-w-[110px] break-words">{hw.component}</td>
                          <td className="py-2.5 text-center pr-2 font-mono">{hw.quantity}</td>
                          <td className="py-2.5 text-[11px] text-slate-500 leading-normal">{hw.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Terminal className="w-4 h-4 text-emerald-650" />
                    <span>IDE / Engineering Tools</span>
                  </h3>
                  <div className="space-y-2">
                    {project.software.map((sw, i) => (
                      <div key={i} className="bg-white p-2.5 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{sw.software}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono select-none">v{sw.version}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{sw.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM SCHEMATS & CIRCUIT DESIGN / SECTION 9 */}
        {activeTab === "circuit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zoomable main schematic center */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest">
                    Section 9: Core Circuit Schematic Workspace
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                    {project.circuit.description} High-precision SVG diagrams represent exact connections.
                  </p>
                </div>

                {/* Circuit SVG zoom element nested */}
                <CircularSchematic projectId={project.id} />
              </div>

              {/* Module stages descriptions / Section 10 */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5 text-blue-600" />
                  <span>Section 10: Functional Logic Block breakdown</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.modules.map((m, i) => (
                    <div key={i} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 hover:border-slate-350 transition space-y-2 shadow-inner">
                      <span className="text-xs font-bold text-indigo-700 block">{m.name}</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{m.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.subcomponents.map((sub, idx) => (
                          <span key={idx} className="text-[9px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono shadow-sm">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side specifications panels */}
            <div className="space-y-6">
              {/* Connection Table list */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-widest">
                  Interchange Connections Log
                </h3>
                <div className="overflow-x-auto space-y-3">
                  {project.circuit.connectionTable.map((conn, i) => (
                    <div key={i} className="text-[11px] border-b border-slate-100 pb-2.5 last:border-b-0">
                      <div className="flex items-center justify-between font-mono text-[9px] font-bold text-slate-400">
                        <span className="text-blue-600">{conn.fromPin}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-emerald-600">{conn.toPin}</span>
                      </div>
                      <p className="text-slate-800 font-bold mt-0.5 text-xs">{conn.signalType}</p>
                      <p className="text-slate-500 mt-0.5 text-[10px] leading-normal">{conn.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pin configurations */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-widest">
                  GPIO Pin Configuration Map
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 font-mono text-[9px] text-slate-500 uppercase">
                        <th className="pb-1 font-semibold">Pin Name</th>
                        <th className="pb-1 font-semibold">Dir</th>
                        <th className="pb-1 font-semibold">Function</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {project.circuit.pinConfiguration.map((pin, i) => (
                        <tr key={i} className="align-middle">
                          <td className="py-2 font-bold font-mono text-slate-800">{pin.pinName}</td>
                          <td className="py-2 uppercase font-mono">{pin.direction === "Input" ? "In" : "Out"}</td>
                          <td className="py-2 text-[10px] text-slate-500 leading-normal">{pin.function}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMELINE AND ROADMAPS / SECTIONS 7 & 11 */}
        {activeTab === "timeline" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Timeline steps */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-xl space-y-6 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <GitBranch className="w-4.5 h-4.5 text-indigo-600" />
                  <span>Section 11: Realization timeline milestones</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  Follow this chronological development path matching laboratory curriculum requirements.
                </p>
              </div>

              {/* Progress Tracker */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs shadow-inner">
                <div>
                  <span className="text-slate-650 block font-medium">Timeline Execution Load</span>
                  <span className="text-[10px] text-slate-500">Tick off completed stages upon compiling files.</span>
                </div>
                <span className="text-indigo-700 font-bold text-sm bg-indigo-55 border border-indigo-205 px-3 py-1 rounded font-mono shadow-sm">
                  {project.implementation.filter(s => completedSteps[`${project.id}_${s.stepNumber}`]).length} / {project.implementation.length} Completed
                </span>
              </div>

              {/* Timeline layout list */}
              <div className="relative border-l-2 border-slate-105 pl-4 ml-2.5 space-y-6">
                {project.implementation.map((step) => {
                  const itemCompleted = !!completedSteps[`${project.id}_${step.stepNumber}`];
                  return (
                    <div key={step.stepNumber} className="relative space-y-2">
                      {/* Check anchor */}
                      <button
                        onClick={() => toggleStep(project.id, step.stepNumber)}
                        className={`absolute -left-[30px] w-6 h-6 rounded-full flex items-center justify-center border transition shadow cursor-pointer ${
                          itemCompleted
                            ? "bg-indigo-600 border-indigo-500 text-white font-bold animate-pulse"
                            : "bg-white border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-500"
                        }`}
                      >
                        <span className="text-[10px] font-bold font-mono">{step.stepNumber}</span>
                      </button>

                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition pl-10 shadow-inner">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-slate-200 pb-2 mb-2">
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{step.title}</h4>
                          <span className="text-[9px] bg-white border border-slate-205 text-slate-650 px-2 py-0.5 rounded font-mono shadow-sm">{step.estimatedTime}</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-2 border-t border-slate-200 text-[10px]">
                          <div>
                            <span className="text-slate-500 block uppercase font-mono font-bold">Expected Output</span>
                            <span className="text-slate-700 leading-normal block italic font-medium">"{step.expectedOutput}"</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase font-mono font-bold">Required Resources</span>
                            <span className="text-slate-700 block font-medium">{step.requiredResources}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Section 7 Concept Roadmap */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Section 7: ECE Career Roadmap Path</span>
              </h3>
              <p className="text-xs text-slate-500 leading-normal">An overview of academic learning prerequisites required for professional deployment.</p>

              <div className="space-y-2 pb-2">
                {project.roadmap.map((node, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-mono font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-white p-2.5 rounded border border-slate-200 text-xs text-slate-700 font-medium shadow-sm">
                      {node}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CODE STRUCTURE EXPLORER / SECTION 12 */}
        {activeTab === "code" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File navigator listings */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 h-[450px] flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest">
                  Custom Template Library
                </h3>
                <p className="text-xs text-slate-550 mt-0.5 leading-normal">
                  RTL codes and hardware configurations for physical verification.
                </p>

                <div className="space-y-1.5 mt-4">
                  <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wider uppercase block">Directory Structure: {project.codeStructure.name}/</span>
                  
                  {fileNodes.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => {
                        setSelectedFile(file.name);
                        setCopiedCode(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition cursor-pointer ${
                        selectedFile === file.name
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-sm"
                          : "bg-slate-50 text-slate-655 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-mono truncate">
                        <Terminal className="w-4 h-4 shrink-0 text-slate-500" />
                        <span>{file.name}</span>
                      </div>
                      <span className="text-[9px] bg-slate-200/55 text-slate-600 px-1.5 py-0.5 font-mono capitalize rounded border border-slate-250/30">
                        verilog
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-500 space-y-1.5 font-medium shadow-inner">
                <p>⚙️ High speed synthesizable code matrices matching Vivado / ModelSim specifications.</p>
              </div>
            </div>

            {/* Code Content display viewer */}
            <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[450px] shadow-inner">
              <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold font-mono text-slate-650">{project.codeStructure.name}/{selectedFile}</span>
                <button
                  onClick={() => handleCopyCode(currentCodeFile?.content || "")}
                  className="p-1 px-3 rounded-md text-[11px] text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition cursor-pointer font-bold border border-slate-250 shadow-sm"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="flex-1 p-4 overflow-y-auto text-xs font-mono text-indigo-900 leading-relaxed bg-white select-text whitespace-pre overflow-x-auto scrollbar-thin border-t border-slate-100">
                <code>{currentCodeFile?.content || "// Load file library..."}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: SIMULATIONS AND TESTING ARCH/RESULTS / SECTIONS 13 & 14 */}
        {activeTab === "results" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Recharts graphs representation of results */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest">
                    Section 14: Experimental Output analytics & Verification
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                    Interactive Recharts simulator plotting analytical metrics, fading coefficients, or battery degradation profiles.
                  </p>
                </div>

                {/* Render specific charts */}
                {renderAnalysisChart()}
              </div>

              {/* Testing Procedures / Section 13 */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600 font-extrabold animate-pulse" />
                  <span>Section 13: Laboratory Testing Procedures & Waveforms</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner font-medium">
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block font-bold">Test Procedures Checklist</span>
                    <ul className="text-xs text-slate-700 space-y-2">
                      {project.testingProcedure.map((p, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-700 mt-0.5 font-bold">[{idx + 1}]</span>
                          <span className="leading-normal">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner font-medium">
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block font-bold">Advanced Verification Protocols</span>
                    <ul className="text-xs text-slate-700 space-y-2">
                      {project.verificationMethods.map((v, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-blue-600 mt-0.5 font-bold">▪</span>
                          <span className="leading-normal">{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance analysis numbers details */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-widest">
                  Resource Utilization & Benchmarks
                </h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Realized physical parameters gathered on Artix-7 logic gates or EV high current testing environments.
                </p>

                <div className="space-y-3 mt-4">
                  {project.analysisData.map((data, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-inner_cool">
                      <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase block">{data.param}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-bold text-slate-800 font-mono">{data.value}</span>
                        {data.benchmark && (
                          <span className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium shadow-sm">
                            Ref: {data.benchmark}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 space-y-1.5 mt-4 shadow-inner">
                <p>⚙️ Benchmarks verify full compatibility with IEEE standards and automotive requirements.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: VIVA PANEL QUIZ QUESTIONS / SECTION 15 */}
        {activeTab === "viva" && (
          <VivaQuiz project={project} />
        )}

        {/* TAB 7: OUTLINE REPORT PAPER GENERATION / SECTION 16 */}
        {activeTab === "docs" && (
          <DocCenter project={project} />
        )}
      </div>

      {/* Sections 17 & 18: Research extensions and conclusions footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-850">
        {/* Future enhancements / Section 17 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 shadow">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
            <Settings className="w-4.5 h-4.5 text-indigo-400" />
            <span>Section 17: Research Extensions & Upgrades</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Expand this project baseline into high-impact academic master studies.
          </p>
          <div className="space-y-3 mt-1">
            <div>
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block mb-1">Proposed Academic Research Paths</span>
              <ul className="text-xs text-slate-300 space-y-1">
                {project.futureEnhancements.research.map((r, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block mb-1">Industrial & Commercialization Pipelines</span>
              <ul className="text-xs text-slate-350 space-y-1">
                {project.futureEnhancements.industry.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Conclusion outcomes / Section 18 */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 shadow">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-emerald-400" />
            <span>Section 18: Pedagogical Outcomes & Career path</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The core skills portfolio acquired upon concluding hardware physical testing and simulator algorithms.
          </p>
          <div className="space-y-3 mt-1">
            <div>
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block mb-1">Acquired Master Skills</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.conclusion.skillsAcquired.map((sk, i) => (
                  <span key={i} className="text-[10px] bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-slate-300">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block mb-1">Direct Recruitment Pipelines</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.conclusion.careerPaths.map((cp, i) => (
                  <span key={i} className="text-[10px] bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-slate-300">
                    {cp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
