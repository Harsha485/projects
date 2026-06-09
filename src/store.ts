import { create } from "zustand";

interface StateStore {
  completedObjectives: Record<string, boolean>; // key: projectId_objectiveId
  completedConcepts: Record<string, boolean>; // key: projectId_conceptId
  completedSteps: Record<string, boolean>;     // key: projectId_stepNum
  completedRoadmap: Record<string, number>;     // key: projectId -> index
  documentExportCount: number;
  vivaAttempts: Record<string, { correct: number; total: number }>;
  theme: "dark" | "light";

  toggleObjective: (projectId: string, objectiveId: string) => void;
  toggleConcept: (projectId: string, conceptId: string) => void;
  toggleStep: (projectId: string, stepNumber: number) => void;
  setRoadmapStep: (projectId: string, stepIndex: number) => void;
  incrementExportCount: () => void;
  recordVivaResult: (projectId: string, correct: number, total: number) => void;
  setTheme: (theme: "dark" | "light") => void;
  resetAll: () => void;
}

const STORAGE_KEY = "ece-master-hub-state";

const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      completedObjectives: {},
      completedConcepts: {},
      completedSteps: {},
      completedRoadmap: {},
      documentExportCount: 0,
      vivaAttempts: {},
      theme: "light" as const,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
  }

  return {
    completedObjectives: {},
    completedConcepts: {},
    completedSteps: {},
    completedRoadmap: {},
    documentExportCount: 0,
    vivaAttempts: {},
    theme: "light" as const,
  };
};

export const useStore = create<StateStore>((set) => {
  const initial = getInitialState();

  const syncStorage = (state: Partial<StateStore>) => {
    try {
      const current = {
        completedObjectives: state.completedObjectives,
        completedConcepts: state.completedConcepts,
        completedSteps: state.completedSteps,
        completedRoadmap: state.completedRoadmap,
        documentExportCount: state.documentExportCount,
        vivaAttempts: state.vivaAttempts,
        theme: state.theme,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    ...initial,

    toggleObjective: (projectId, objectiveId) =>
      set((state) => {
        const key = `${projectId}_${objectiveId}`;
        const updated = {
          ...state.completedObjectives,
          [key]: !state.completedObjectives[key],
        };
        const nextState = { ...state, completedObjectives: updated };
        syncStorage(nextState);
        return { completedObjectives: updated };
      }),

    toggleConcept: (projectId, conceptId) =>
      set((state) => {
        const key = `${projectId}_${conceptId}`;
        const updated = {
          ...state.completedConcepts,
          [key]: !state.completedConcepts[key],
        };
        const nextState = { ...state, completedConcepts: updated };
        syncStorage(nextState);
        return { completedConcepts: updated };
      }),

    toggleStep: (projectId, stepNumber) =>
      set((state) => {
        const key = `${projectId}_${stepNumber}`;
        const updated = {
          ...state.completedSteps,
          [key]: !state.completedSteps[key],
        };
        const nextState = { ...state, completedSteps: updated };
        syncStorage(nextState);
        return { completedSteps: updated };
      }),

    setRoadmapStep: (projectId, stepIndex) =>
      set((state) => {
        const updated = {
          ...state.completedRoadmap,
          [projectId]: stepIndex,
        };
        const nextState = { ...state, completedRoadmap: updated };
        syncStorage(nextState);
        return { completedRoadmap: updated };
      }),

    incrementExportCount: () =>
      set((state) => {
        const count = state.documentExportCount + 1;
        const nextState = { ...state, documentExportCount: count };
        syncStorage(nextState);
        return { documentExportCount: count };
      }),

    recordVivaResult: (projectId, correct, total) =>
      set((state) => {
        const updated = {
          ...state.vivaAttempts,
          [projectId]: { correct, total },
        };
        const nextState = { ...state, vivaAttempts: updated };
        syncStorage(nextState);
        return { vivaAttempts: updated };
      }),

    setTheme: (theme) =>
      set((state) => {
        const nextState = { ...state, theme };
        syncStorage(nextState);
        return { theme };
      }),

    resetAll: () =>
      set(() => {
        const fresh = {
          completedObjectives: {},
          completedConcepts: {},
          completedSteps: {},
          completedRoadmap: {},
          documentExportCount: 0,
          vivaAttempts: {},
          theme: "light" as "dark" | "light",
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
      }),
  };
});
