export interface ProjectOverview {
  title: string;
  domain: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  industryRelevance: string;
  placementOpportunities: string[];
  requiredSkills: string[];
}

export interface Abstract {
  background: string;
  problemStatement: string;
  existingSystems: string;
  proposedSolution: string;
  benefits: string[];
  applications: string[];
}

export interface ObjectiveItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface HardwareItem {
  component: string;
  quantity: string;
  purpose: string;
  estimatedCost: string;
}

export interface SoftwareItem {
  software: string;
  purpose: string;
  version: string;
}

export interface ConceptItem {
  id: string;
  name: string;
  definition: string;
  explanation: string;
  whyNeeded: string;
  applications: string[];
  difficulty: string;
  prerequisites: string[];
}

export interface CircuitDesignData {
  description: string;
  wiringDescription: string;
  connectionTable: { fromPin: string; toPin: string; signalType: string; description: string }[];
  pinConfiguration: { pinName: string; direction: string; function: string }[];
  signalFlow: string[];
}

export interface ModuleItem {
  name: string;
  description: string;
  subcomponents: string[];
}

export interface ImplementationStep {
  stepNumber: number;
  title: string;
  description: string;
  expectedOutput: string;
  requiredResources: string;
  estimatedTime: string;
}

export interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
}

export interface SimulationWaveform {
  name: string;
  time: number;
  clock: number;
  reset: number;
  [key: string]: any;
}

export interface PerformanceAnalysisData {
  param: string;
  value: string | number;
  benchmark?: string | number;
  unit?: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
  explanation: string;
}

export interface DocumentationTemplate {
  title: string;
  type: "IEEE Paper" | "Project Report" | "PPT Outline" | "Research Paper";
  sections: { heading: string; content: string }[];
}

export interface ProjectData {
  id: string;
  overview: ProjectOverview;
  abstract: Abstract;
  objectives: ObjectiveItem[];
  hardware: HardwareItem[];
  software: SoftwareItem[];
  concepts: ConceptItem[];
  roadmap: string[];
  modules: ModuleItem[];
  circuit: CircuitDesignData;
  implementation: ImplementationStep[];
  codeStructure: FileNode;
  testingProcedure: string[];
  verificationMethods: string[];
  waveforms?: any[]; // for charting, tailored based on project
  analysisData: PerformanceAnalysisData[];
  chartData?: any[]; // Recharts plotting
  viva: {
    basic: VivaQuestion[];
    intermediate: VivaQuestion[];
    advanced: VivaQuestion[];
  };
  documentation: DocumentationTemplate[];
  futureEnhancements: {
    research: string[];
    industry: string[];
    commercial: string[];
    advanced: string[];
  };
  conclusion: {
    learningOutcomes: string[];
    skillsAcquired: string[];
    careerPaths: string[];
  };
}

export interface GlobalDashboardState {
  completedObjectives: Record<string, boolean>; // key: projectId_objectiveId
  completedConcepts: Record<string, boolean>; // key: projectId_conceptId
  completedSteps: Record<string, boolean>; // key: projectId_stepNum
  completedRoadmap: Record<string, number>; // key: projectId -> last active step
  documentExportCount: number;
  vivaAttempts: Record<string, { correct: number; total: number }>;
}
