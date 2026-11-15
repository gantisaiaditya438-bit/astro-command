import React from 'react';
import { useGame } from '../context/GameContext';
import { MISSION_SCENARIOS } from '../data/scenarios';
import { Rocket, Shield, Clock, Award, AlertTriangle, ArrowRight } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const MissionSelect: React.FC = () => {
  const { selectScenario } = useGame();

  const getDifficultyBadge = (diff: string) => {
    if (diff.includes('Easy')) return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
    if (diff.includes('Medium')) return 'bg-amber-950 text-amber-300 border-amber-500/40';
    return 'bg-purple-950 text-purple-300 border-purple-500/40';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn text-slate-100">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
          Select Your Astronaut Mission
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl mx-auto">
          Progress from basic life support monitoring to advanced multi-hazard space engineering command.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MISSION_SCENARIOS.map(sc => (
          <div
            key={sc.id}
            onClick={() => selectScenario(sc)}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 transition group cursor-pointer shadow-xl flex flex-col justify-between hover:scale-[1.02] backdrop-blur-sm"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{sc.outpostType === 'lunar' ? '🌕' : '🔴'}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getDifficultyBadge(
                    sc.difficulty
                  )}`}
                >
                  {sc.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold font-mono text-white group-hover:text-cyan-300 transition mb-1">
                {sc.title}
              </h3>
              <p className="text-xs text-slate-400 mb-3 font-sans line-clamp-2">{sc.subtitle}</p>

              {/* Mission Specs */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono mb-3">
                <div className="flex items-center text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
                  <span>{sc.durationSols} Sols</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Award className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                  <span>{sc.targetSciencePoints} Science Target</span>
                </div>
              </div>

              {/* Hazards list */}
              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Key Challenges:</span>
                <ul className="text-[11px] text-slate-300 space-y-0.5 font-sans">
                  {sc.briefing.environmentalHazards.slice(0, 2).map((h, i) => (
                    <li key={i} className="flex items-center text-slate-300 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 shrink-0" />
                      <span className="truncate">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="w-full py-2.5 px-3 rounded-xl bg-cyan-600/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-black font-bold font-mono text-xs transition flex items-center justify-center space-x-1.5 border border-cyan-500/30">
              <span>Review Mission Briefing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

