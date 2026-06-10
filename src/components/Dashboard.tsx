import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend, AreaChart, Area } from "recharts";
import { useStore } from "../store";
import { projectsData } from "../projectsData";
import { Cpu, Target, Award, CheckSquare, Zap, BookOpen, ChevronRight } from "lucide-react";

export default function Dashboard({ onNavigate }: { onNavigate?: (projectId: string) => void }) {
  const { completedObjectives, completedConcepts, completedSteps, documentExportCount, vivaAttempts, resetAll } = useStore();

  // Calculate quantitative learning progress
  const totalObjectivesCount = projectsData.reduce((acc, p) => acc + p.objectives.length, 0);
  const completedObjectivesCount = Object.values(completedObjectives).filter(Boolean).length;
  
  const totalConceptsCount = projectsData.reduce((acc, p) => acc + p.concepts.length, 0);
  const completedConceptsCount = Object.values(completedConcepts).filter(Boolean).length;

  const totalStepsCount = projectsData.reduce((acc, p) => acc + p.implementation.length, 0);
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;

  // Percentage calculations
  const objectivePercent = totalObjectivesCount > 0 ? Math.round((completedObjectivesCount / totalObjectivesCount) * 100) : 0;
  const conceptPercent = totalConceptsCount > 0 ? Math.round((completedConceptsCount / totalConceptsCount) * 100) : 0;
  const stepsPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  // Prepare Chart Data mapping per project
  const chartsData = projectsData.map((project) => {
    const projObjectives = project.objectives.length;
    const projConcepts = project.concepts.length;
    const projSteps = project.implementation.length;

    const completedObj = project.objectives.filter(o => completedObjectives[`${project.id}_${o.id}`]).length;
    const completedCon = project.concepts.filter(c => completedConcepts[`${project.id}_${c.id}`]).length;
    const completedSt = project.implementation.filter(s => completedSteps[`${project.id}_${s.stepNumber}`]).length;

    const aggregatePercent = Math.round(((completedObj + completedCon + completedSt) / (projObjectives + projConcepts + projSteps)) * 100) || 0;

    return {
      name: project.overview.domain,
      title: project.overview.title,
      Objectives: Math.round((completedObj / projObjectives) * 100),
      Concepts: Math.round((completedCon / projConcepts) * 100),
      Steps: Math.round((completedSt / projSteps) * 100),
      Aggregate: aggregatePercent,
    };
  });

  return (
    <div className="space-y-8">
      {/* 1. Project Directory Grid (Focus Area) */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-gold-100">Project Directory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select an ECE domain below to start your research and simulation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsData.map((project, idx) => {
            const progress = chartsData[idx].Aggregate;
            return (
              <button
                key={project.id}
                onClick={() => onNavigate?.(project.id)}
                className="group text-left bg-white dark:bg-slate-900 border border-gold-200/40 dark:border-gold-900/40 p-5 rounded-xl shadow-sm hover:border-gold-400 dark:hover:border-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between w-full relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 dark:bg-gold-950/40 flex items-center justify-center text-gold-600 dark:text-gold-400 border border-gold-100 dark:border-gold-800/30 group-hover:scale-105 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">{project.overview.domain}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{project.overview.title}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-gold-500 transition-colors" />
                </div>
                
                {/* Progress bar inside card */}
                <div className="w-full relative z-10">
                  <div className="flex justify-between text-[10px] mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Completion status</span>
                    <span className="text-gold-700 dark:text-gold-400 font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gold-400 dark:bg-gold-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Decorative background visual */}
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                   <Cpu className="w-24 h-24" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-200/50 dark:via-gold-900/50 to-transparent" />

      {/* Analytics stat cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-gold-100">Hub Analytics & Progress</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your overall accomplishments across all active projects.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Objectives card */}
        <div className="bg-white dark:bg-slate-900 border border-gold-200/40 dark:border-gold-900/30 p-4.5 rounded-xl flex items-center justify-between shadow-sm hover:border-gold-350 transition-all">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Milestone Objectives</span>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-gold-100 font-mono">
              {completedObjectivesCount} / {totalObjectivesCount}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-gold-700 dark:text-gold-400">
              <span className="font-medium">{objectivePercent}% Achieve Rate</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-200/20 dark:bg-gold-950/20 border border-gold-200/50 dark:border-gold-800/25 flex items-center justify-center text-gold-700 dark:text-gold-400">
            <Target className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Concepts card */}
        <div className="bg-white dark:bg-slate-900 border border-gold-200/40 dark:border-gold-900/30 p-4.5 rounded-xl flex items-center justify-between shadow-sm hover:border-gold-350 transition-all">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Theoretical Concepts</span>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-gold-100 font-mono">
              {completedConceptsCount} / {totalConceptsCount}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-gold-700 dark:text-gold-400">
              <span className="font-medium">{conceptPercent}% Comprehension</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-200/20 dark:bg-gold-950/20 border border-gold-200/50 dark:border-gold-800/25 flex items-center justify-center text-gold-700 dark:text-gold-400">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Milestones steps completed */}
        <div className="bg-white dark:bg-slate-900 border border-gold-200/40 dark:border-gold-900/30 p-4.5 rounded-xl flex items-center justify-between shadow-sm hover:border-gold-350 transition-all">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Timeline Execution</span>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-gold-100 font-mono">
              {completedStepsCount} / {totalStepsCount}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-gold-700 dark:text-gold-400">
              <span className="font-medium">{stepsPercent}% Completed Steps</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-200/20 dark:bg-gold-950/20 border border-gold-200/50 dark:border-gold-800/25 flex items-center justify-center text-gold-700 dark:text-gold-400">
            <Zap className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Documentation / Cert progress */}
        <div className="bg-white dark:bg-slate-900 border border-gold-200/40 dark:border-gold-900/30 p-4.5 rounded-xl flex items-center justify-between shadow-sm hover:border-gold-350 transition-all">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Exported Papers</span>
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-gold-100 font-mono">
              {documentExportCount}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-gold-700 dark:text-gold-400">
              <span className="font-medium">IEEE Templates Loaded</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-200/20 dark:bg-gold-950/20 border border-gold-200/50 dark:border-gold-800/25 flex items-center justify-center text-gold-700 dark:text-gold-400">
            <Award className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
      </div>
      </div>

      {/* Main Charts & Progress visual grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Double Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gold-100 dark:border-gold-900/30 p-5 rounded-xl space-y-4 shadow-sm">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-gold-100">Study metrics overview per ECE Domain</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Showing completed percentages for Objectives, Systems Concepts, and Timelines.</p>
          </div>

          <div className="h-64 mt-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} className="font-medium" />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} width={40} className="font-medium" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#ebc63e", borderWidth: "1px", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "11px", color: "#1e293b", fontWeight: "normal" }}
                  labelStyle={{ fontSize: "11px", fontWeight: "semibold", color: "#0f172a" }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "11px", paddingTop: 10, fontWeight: "medium", color: "#64748b" }} />
                <Bar dataKey="Objectives" fill="#d4af37" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Concepts" fill="#ecca54" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Steps" fill="#a88514" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Progress list */}
        <div className="bg-white dark:bg-slate-900 border border-gold-100 dark:border-gold-900/30 p-5 rounded-xl space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-gold-100">Aggregate Accomplishment Rate</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Aggregate learning scores across the entire hub directory.</p>
          </div>

          {/* Radial visual block list */}
          <div className="space-y-4 py-2">
            {projectsData.map((project, idx) => {
              const mappedData = chartsData[idx];
              return (
                <div key={project.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">{project.overview.title}</span>
                    <span className="text-slate-800 dark:text-gold-200 font-mono font-semibold">{mappedData ? mappedData.Aggregate : 0}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${mappedData ? mappedData.Aggregate : 0}%` }}
                      className={`h-full rounded-full transition-all duration-550 ${
                        idx === 0 ? "bg-gold-600" : idx === 1 ? "bg-gold-500" : idx === 2 ? "bg-gold-400" : idx === 3 ? "bg-gold-300" : "bg-gold-200"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset profile progress */}
          <div className="border-t border-gold-100 dark:border-slate-800 pt-4 flex items-center justify-between">
            <span className="text-[10px] text-slate-450 font-medium">Student Portals offline state</span>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete and reset all recorded achievements and checkmarks?")) {
                  resetAll();
                }
              }}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition cursor-pointer hover:underline"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
