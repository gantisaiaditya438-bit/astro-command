import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const MissionResultsModal: React.FC = () => {
  const {
    missionEvaluation,
    resetMission,
    setView,
    decisionLog,
    scenario,
    sciencePoints
  } = useGame();

  if (!missionEvaluation) return null;

  const getGradeStyle = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
      case 'B':
        return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/40';
      case 'C':
        return 'text-blue-400 border-blue-500/50 bg-blue-950/40';
      default:
        return 'text-red-400 border-red-500/50 bg-red-950/40';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn text-slate-100">
      <div className="bg-[#0b1023] border border-cyan-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Banner */}
        <div className="text-center space-y-2 pb-5 border-b border-slate-800">
          <div
            className={`w-20 h-20 rounded-2xl border-2 mx-auto flex items-center justify-center text-3xl font-extrabold font-mono shadow-xl ${getGradeStyle(
              missionEvaluation.grade
            )}`}
          >
            {missionEvaluation.grade}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
              NASA Post-Mission Debrief & Flight Rating
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {missionEvaluation.rankTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              {missionEvaluation.passed
                ? 'Mission objectives achieved! Outstanding leadership, Commander.'
                : 'Mission scrubbed. Review telemetry logs below to engineer a better outcome next time.'}
            </p>
          </div>
        </div>

        {/* Scorecard Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Overall Score</div>
            <div className="text-xl font-extrabold font-mono text-cyan-300 mt-0.5">
              {missionEvaluation.score}/100
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Crew Survival</div>
            <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">
              {missionEvaluation.crewSurvivalRate}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Resources Conserved</div>
            <div className="text-xl font-extrabold font-mono text-blue-400 mt-0.5">
              {missionEvaluation.resourcesConservedScore}/25 pts
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Science Yield</div>
            <div className="text-xl font-extrabold font-mono text-purple-400 mt-0.5">
              {sciencePoints}/{scenario.targetSciencePoints} pts
            </div>
          </div>
        </div>

        {/* What Went Well & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
            <h3 className="text-xs font-bold font-mono text-emerald-300 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
              What Went Well (Mission Highlights)
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200 font-sans">
              {missionEvaluation.highlights.map((h, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
            <h3 className="text-xs font-bold font-mono text-amber-300 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-400" />
              Areas for Engineering Improvement
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200 font-sans">
              {missionEvaluation.improvements.length > 0 ? (
                missionEvaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400">No major flight defects noted. Exemplary run!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Space Engineering Lessons */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-800/60 space-y-2">
          <h3 className="text-xs font-bold font-mono text-cyan-300 flex items-center">
            <Lightbulb className="w-4 h-4 mr-1.5 text-cyan-400" />
            NASA Space Engineering Lessons Reinforced:
          </h3>
          <div className="grid grid-cols-1 gap-2 text-xs text-slate-300 font-sans">
            {missionEvaluation.spaceEngineeringLessons.map((lesson, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{lesson}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Log History */}
        {decisionLog.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Mission Decision Audit Trail ({decisionLog.length} recorded events)
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {decisionLog.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans space-y-1"
                >
                  <div className="flex justify-between font-mono text-[10px] text-cyan-400">
                    <span className="font-bold">{log.eventTitle}</span>
                    <span>Sol {log.timestampSol}, {String(log.timestampHour).padStart(2, '0')}:00</span>
                  </div>
                  <div className="text-slate-200">
                    <strong className="text-white font-mono">Action:</strong> {log.choiceMade}
                  </div>
                  <div className="text-slate-400 text-[11px]">{log.impactSummary}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              soundEffects.playClick();
              setView('learning_center');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition flex items-center space-x-1.5 border border-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Open STEM Encyclopedia & Quiz</span>
          </button>

          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={resetMission}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition border border-slate-700 flex items-center justify-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry / Other Mission</span>
            </button>

            <button
              onClick={resetMission}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold font-mono text-xs transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-1"
            >
              <span>Next Mission Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

