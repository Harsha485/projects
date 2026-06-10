import { useState, useEffect } from "react";
import { useStore } from "./store";
import { projectsData } from "./projectsData";
import Dashboard from "./components/Dashboard";
import ProjectDetail from "./components/ProjectDetail";
import AIAssistant from "./components/AIAssistant";
import { 
  Cpu, BookOpen, Layers, Settings, Compass, HelpCircle, 
  Sun, Moon, Menu, ChevronRight, Award, FolderHeart, 
  GraduationCap, Terminal, Sparkles, Book, Link as LinkIcon, Database, Bookmark
} from "lucide-react";

export default function App() {
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "project" | "resources" | "ai" | "settings">("dashboard");
  const [activeProjectId, setActiveProjectId] = useState<string>("vlsi_fpga");
  // Open sidebar by default only on desktop screens
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  
  const { theme, setTheme, completedObjectives, completedConcepts } = useStore();

  // Handle visual dark / light mode document mapping
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Aggregate stats across all nodes
  const totalObjectives = projectsData.reduce((acc, p) => acc + p.objectives.length, 0);
  const completedObjectivesCount = Object.values(completedObjectives).filter(Boolean).length;
  const globalCompletionPercent = totalObjectives > 0 ? Math.round((completedObjectivesCount / totalObjectives) * 105 / 1.05) : 0; 

  const activeProject = projectsData.find(p => p.id === activeProjectId) || projectsData[0];

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-250 ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"}`}>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 dark:bg-black/40 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR NAVIGATION PANELS */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 shrink-0 border-r transition-all duration-300 flex flex-col justify-between ${
        theme === "dark" ? "bg-slate-950 border-slate-900" : "bg-[#fefdf6] border-gold-100"
      } ${sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full w-64 md:translate-x-0 md:w-16 overflow-hidden md:p-1"}`}>
        
        {/* Top Header Block */}
        <div>
          <div className="p-4 flex items-center justify-between border-b border-gold-100/40">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/10">
                  <GraduationCap className="w-5 h-5 text-white stroke-[2]" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold uppercase tracking-widest text-gold-700 dark:text-gold-450 block truncate max-w-[150px]">
                    ECE Projects
                  </h1>
                  <span className="text-[10px] text-gold-650 dark:text-gold-400 font-mono font-medium block">Project Sandbox</span>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center mx-auto shadow-md">
                <GraduationCap className="w-5 h-5 text-white stroke-[2]" />
              </div>
            )}
          </div>

          {/* Navigation Links body */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => {
                setActiveMenu("dashboard");
                if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={`w-full text-left p-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition cursor-pointer ${
                activeMenu === "dashboard"
                  ? (theme === "dark" ? "bg-slate-900 text-gold-400 font-semibold border-l-2 border-gold-400" : "bg-gold-100/60 text-gold-805 font-semibold border-l-2 border-gold-500 shadow-sm")
                  : "text-slate-700 dark:text-slate-300 font-medium hover:text-gold-700 dark:hover:text-gold-450 hover:bg-gold-50/30 dark:hover:bg-slate-900/30"
              }`}
            >
              <Compass className="w-4 h-4 shrink-0 text-gold-600 dark:text-gold-400" />
              {sidebarOpen && <span>Analytics Dashboard</span>}
            </button>

            {/* Project workspaces selection tree */}
            <div className="space-y-1 pt-3">
              {sidebarOpen && (
                <span className="text-[11px] text-gold-700 dark:text-gold-400 uppercase tracking-widest font-semibold px-2.5 pb-1 block">
                  Project Workspace
                </span>
              )}
              {projectsData.map((project) => {
                const isSelected = activeMenu === "project" && activeProjectId === project.id;
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      setActiveMenu("project");
                      setActiveProjectId(project.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition cursor-pointer ${
                      isSelected
                        ? (theme === "dark" ? "bg-slate-900 text-gold-400 border-l-2 border-gold-400 font-semibold" : "bg-gold-100/60 text-gold-805 border-l-2 border-gold-500 font-semibold shadow-sm")
                        : "text-slate-700 dark:text-slate-300 font-medium hover:text-gold-700 dark:hover:text-gold-450 hover:bg-gold-100/10 dark:hover:bg-slate-900/15"
                    }`}
                  >
                    <Cpu className={`w-4 h-4 shrink-0 ${isSelected ? 'text-gold-655 dark:text-gold-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    {sidebarOpen && <span className="truncate">{project.overview.domain}</span>}
                  </button>
                );
              })}
            </div>

            {/* Extra views */}
            <div className="space-y-1 pt-4 border-t border-gold-100/30 dark:border-slate-900/40">
              {sidebarOpen && (
                <span className="text-[11px] text-gold-700 dark:text-gold-400 uppercase tracking-widest font-semibold px-2.5 pb-1 block">
                  Extras & Labs
                </span>
              )}

              <button
                onClick={() => {
                  setActiveMenu("resources");
                  if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition cursor-pointer ${
                  activeMenu === "resources"
                    ? (theme === "dark" ? "bg-slate-900 text-gold-400 font-semibold border-l-2 border-gold-400" : "bg-gold-100/60 text-gold-805 font-semibold border-l-2 border-gold-500 shadow-sm")
                    : "text-slate-700 dark:text-slate-300 font-medium hover:text-gold-700 dark:hover:text-gold-450 hover:bg-gold-100/10 dark:hover:bg-slate-900/30"
                }`}
              >
                <BookOpen className={`w-4 h-4 shrink-0 ${activeMenu === "resources" ? 'text-gold-600' : 'text-slate-450 dark:text-slate-405'}`} />
                {sidebarOpen && <span>Resource Library</span>}
              </button>

              <button
                onClick={() => {
                  setActiveMenu("ai");
                  if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition cursor-pointer relative ${
                  activeMenu === "ai"
                    ? (theme === "dark" ? "bg-slate-900 text-gold-400 font-semibold border-l-2 border-gold-400" : "bg-gold-100/60 text-gold-805 border-l-2 border-gold-500 font-semibold shadow-sm")
                    : "text-slate-700 dark:text-slate-300 font-medium hover:text-gold-700 dark:hover:text-gold-450 hover:bg-gold-100/10 dark:hover:bg-slate-900/30"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-gold-500 dark:text-gold-400 animate-pulse" />
                {sidebarOpen && (
                  <div className="flex items-center justify-between w-full font-medium">
                    <span>AI Assistant Lab</span>
                    <span className="w-2 h-2 rounded-full bg-gold-400" />
                  </div>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveMenu("settings");
                  if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition cursor-pointer ${
                  activeMenu === "settings"
                    ? (theme === "dark" ? "bg-slate-900 text-gold-400 font-semibold border-l-2 border-gold-400" : "bg-gold-100/60 text-gold-805 border-l-2 border-gold-500 font-semibold shadow-sm")
                    : "text-slate-700 dark:text-slate-300 font-medium hover:text-gold-700 dark:hover:text-gold-450 hover:bg-gold-100/10 dark:hover:bg-slate-900/30"
                }`}
              >
                <Settings className={`w-4 h-4 shrink-0 ${activeMenu === "settings" ? 'text-gold-600' : 'text-slate-450'}`} />
                {sidebarOpen && <span>Hub Config & Profile</span>}
              </button>
            </div>
          </nav>
        </div>

      </aside>

      {/* 2. MAIN HEADER AND COMPONENT SANDBOX */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic unified Top Header Bar */}
        <header className={`h-14 px-4 border-b flex items-center justify-between shrink-0 glassmorphism z-20 ${
          theme === "dark" ? "bg-slate-950/80 border-slate-900 backdrop-blur" : "bg-white/80 border-gold-100/55 backdrop-blur"
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-800/10 dark:hover:bg-slate-900 transition text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <Menu className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-550 dark:text-slate-350 font-medium">Workspace Hub</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="font-semibold text-gold-800 dark:text-gold-400 capitalize bg-gold-100/40 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-gold-200/20">{activeMenu}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Aggregate Progress gauge bar */}
            <div className="hidden lg:flex items-center gap-2.5 bg-gold-50/5 dark:bg-slate-900/40 p-1.5 px-3 rounded-lg border border-gold-100/30 dark:border-slate-900 shadow-inner">
              <div className="text-right">
                <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold block uppercase">Course Completion</span>
                <span className="text-xs font-medium font-mono text-slate-800 dark:text-slate-200">{completedObjectivesCount} / {totalObjectives} Objectives</span>
              </div>
              <div className="w-20 h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-gold-100/40 dark:border-slate-850/60">
                <div
                  style={{ width: `${globalCompletionPercent}%` }}
                  className="h-full bg-gold-500 dark:bg-gold-500 rounded-full transition-all duration-350"
                />
              </div>
            </div>

            {/* Theme selection toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-slate-800/10 dark:hover:bg-slate-900 text-slate-400 hover:text-gold-500 transition cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        {/* Main View Area (Scrollable viewport) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeMenu === "dashboard" && <Dashboard onNavigate={(id) => {
            setActiveMenu("project");
            setActiveProjectId(id);
            if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
          }} />}

          {activeMenu === "project" && <ProjectDetail project={activeProject} />}

          {activeMenu === "ai" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <span>ECE Lab AI Research Lab</span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Our advanced ECE tutor uses Gemini to write custom Verilog testbenches, verify analog filter poles, and debug physical setups.
                </p>
              </div>

              {/* Fullscreen AI Chat template */}
              <AIAssistant currentProject={activeProject} fullscreen={true} />
            </div>
          )}

          {activeMenu === "resources" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Book className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Consolidated Academic Resource Library</span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Access textbook references, standardized datasheets, and reference equations for our 5 ECE branches.
                </p>
              </div>

              {/* Resource Categories cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-3 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Recommended Technical Literature</span>
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-850 shadow-inner">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">1. Digital Design and Computer Architecture</p>
                      <p className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5">Author: David Harris & Sarah Harris. Core guide for Register file design and RISC logic pipelines.</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-850 shadow-inner">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">2. Wireless Communications: Principles & Practice</p>
                      <p className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5">Author: Theodore-S Rappaport. Mathematical matrices for Rayleigh fading and 5G MIMO layouts.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-3 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Reference Manuals & IC Datasheets</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-850 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">Artix-7 FPGA Packaging Guide</p>
                        <span className="text-[9px] text-slate-500 block font-medium">Xilinx Inc. Ref manual UG475</span>
                      </div>
                      <span className="text-[9px] bg-white dark:bg-slate-900 font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded uppercase font-bold select-none shadow-sm">PDF specs</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-850 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">Espressif ESP32 WROOM Datasheet</p>
                        <span className="text-[9px] text-slate-500 block font-medium">Wi-Fi TCP/IP and ADC calibration values</span>
                      </div>
                      <span className="text-[9px] bg-white dark:bg-slate-900 font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded uppercase font-bold select-none shadow-sm">PDF specs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "settings" && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-6 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Hub Configuration & Academic Profile</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Configure study parameters and local persistent states.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Student Academic Profile</label>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-850 space-y-1.5 text-xs font-mono text-slate-705 dark:text-slate-300 shadow-inner">
                    <p>👤 Role: ECE Student / Researcher</p>
                    <p>🏢 Institution: Academic Affiliate Group</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-1.5">Academic Status Portfolio</label>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-850 space-y-1.5 text-xs font-mono text-slate-705 dark:text-slate-300 shadow-inner">
                    <p>🎓 Node Connection: Online</p>
                    <p>🔋 State Persistence: Synchronized with Local Storage</p>
                    <p>📦 Mounted Modules: v1.0.0 Stable</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating small shortcut trigger to toggle AI assistant directly */}
      {activeMenu !== "ai" && (
        <div className="fixed bottom-6 right-6 z-55">
          <button
            onClick={() => setActiveMenu("ai")}
            className="w-12 h-12 rounded-full bg-gold-500 hover:bg-gold-600 text-white shadow-xl shadow-gold-500/10 flex items-center justify-center transition cursor-pointer hover:scale-105"
            title="Launch ECE AI Assistant Panel"
          >
            <Sparkles className="w-5 h-5 text-white fill-white shrink-0" />
          </button>
        </div>
      )}

    </div>
  );
}
