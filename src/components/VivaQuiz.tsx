import { useState } from "react";
import { useStore } from "../store";
import { ProjectData } from "../types";
import { HelpCircle, ChevronLeft, ChevronRight, CheckCircle2, RefreshCw } from "lucide-react";

interface VivaQuizProps {
  project: ProjectData;
}

export default function VivaQuiz({ project }: VivaQuizProps) {
  const [level, setLevel] = useState<"basic" | "intermediate" | "advanced">("basic");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [userScore, setUserScore] = useState<Record<string, "correct" | "incorrect">>({});
  
  const recordVivaResult = useStore((state) => state.recordVivaResult);

  const questions = project.viva[level] || [];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLevelChange = (newLevel: "basic" | "intermediate" | "advanced") => {
    setLevel(newLevel);
    setCurrentIndex(0);
    setFlipped(false);
    setUserScore({});
  };

  const handleVote = (status: "correct" | "incorrect") => {
    const key = `${level}_${currentIndex}`;
    setUserScore((prev) => {
      const updated = { ...prev, [key]: status };
      
      // Calculate totals
      let correctCount = 0;
      Object.keys(updated).forEach((k) => {
        if (updated[k] === "correct") correctCount++;
      });
      
      recordVivaResult(project.id, correctCount, Object.keys(updated).length);
      return updated;
    });
    // Autoreveal/flip back for smoothness
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setUserScore({});
    recordVivaResult(project.id, 0, 0);
  };

  const currentKey = `${level}_${currentIndex}`;
  const voted = userScore[currentKey];

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-sm">
      {/* Header levels toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <span>Interactive Oral Board (Viva) Sandbox</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">Study and evaluate yourself against standard university board questions.</p>
        </div>

        {/* Difficulty Level tabs */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
          {(["basic", "intermediate", "advanced"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition uppercase tracking-wider cursor-pointer ${
                level === lvl
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No quiz modules available for this level currently.
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Progress gauge header */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-[10px] text-purple-700 font-mono border border-purple-200">
              Score: {Object.values(userScore).filter(s => s === "correct").length} Correct
            </span>
          </div>

          {/* Flashcard Body */}
          <div
            onClick={() => setFlipped(!flipped)}
            className="group relative h-64 w-full cursor-pointer perspective"
          >
            {/* Inner Flip wrapper */}
            <div
              className={`relative h-full w-full rounded-2xl border transition-all duration-500 transform-style preserve-3d ${
                flipped
                  ? "rotate-y-180 bg-purple-50/10 border-purple-300"
                  : "bg-white border-slate-200 hover:border-slate-350 hover:shadow-md"
              }`}
            >
              {/* Front side */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 backface-hidden">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-purple-600 uppercase font-bold">QUESTION</span>
                  <p className="text-slate-800 text-sm sm:text-base font-medium font-sans leading-relaxed">
                    {questions[currentIndex].question}
                  </p>
                </div>
                <div className="text-[11px] text-center text-slate-400 font-medium">
                  💡 Click card to reveal explanation
                </div>
              </div>

              {/* Back side */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 rotate-y-180 backface-hidden overflow-y-auto">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-600 uppercase font-bold">ANSWER</span>
                  <p className="text-slate-800 text-sm leading-relaxed font-sans font-medium">
                    {questions[currentIndex].answer}
                  </p>
                  
                  <div className="border-t border-slate-100 pt-2.5 mt-2">
                    <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold">ECE ANALYSIS</span>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      {questions[currentIndex].explanation}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-center text-slate-400 font-medium pt-2">
                  🔁 Click to rotate card back
                </div>
              </div>
            </div>
          </div>

          {/* Mark Correct / Incorrect triggers */}
          {flipped && (
            <div className="flex items-center justify-center gap-4 animate-fade-in p-1">
              <span className="text-xs text-slate-500 font-medium">Evaluate your memory:</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote("correct");
                }}
                className={`py-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  voted === "correct"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark Correct</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote("incorrect");
                }}
                className={`py-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  voted === "incorrect"
                    ? "bg-rose-50 border-rose-500 text-rose-700 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Mark Hard</span>
              </button>
            </div>
          )}

          {/* Navigation controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition text-xs flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 px-3 rounded-md text-[11px] text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Reset scores and current indexes"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>Reset Board</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="p-2 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition text-xs flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
