import React from 'react';
import { useGame } from '../../context/GameContext';
import { ASTRONAUT_RANKS } from '../../data/achievementsData';
import {
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  Compass,
  Star,
  Rocket
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export const AchievementsView: React.FC = () => {
  const { sciencePoints, achievements, collectedSamples, astronautRank } = useGame();

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Next rank calculation
  const nextRank = ASTRONAUT_RANKS.find(r => r.minScience > sciencePoints);
  const prevRank = ASTRONAUT_RANKS.slice().reverse().find(r => r.minScience <= sciencePoints) || ASTRONAUT_RANKS[0];
  const progressPercent = nextRank
    ? Math.min(100, Math.round(((sciencePoints - prevRank.minScience) / (nextRank.minScience - prevRank.minScience)) * 100))
    : 100;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 animate-fadeIn">
      {/* Astronaut Profile Header */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/80 to-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20 text-black font-extrabold border-2 border-white">
              👨‍🚀
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/50">
                  {astronautRank.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">NASA Cadet #AC-2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
                {astronautRank.title}
              </h1>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Official Flight Log & Scientific Discovery Portfolio
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center font-mono">
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400">Total Science</div>
              <div className="text-xl font-bold text-cyan-300">{sciencePoints} pts</div>
            </div>
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400">Badges Earned</div>
              <div className="text-xl font-bold text-amber-400">{unlockedCount}/{achievements.length}</div>
            </div>
            <div className="px-2">
              <div className="text-[10px] text-slate-400">Samples Found</div>
              <div className="text-xl font-bold text-emerald-400">{collectedSamples.length}</div>
            </div>
          </div>
        </div>

        {/* Rank Progress Bar */}
        {nextRank && (
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">
                Progress to <strong className="text-amber-300">{nextRank.title}</strong>:
              </span>
              <span className="text-cyan-400 font-bold">
                {sciencePoints} / {nextRank.minScience} pts ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Achievement Badges Grid */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold font-mono tracking-wide uppercase text-white">
            Astronaut Achievement Cabinet ({unlockedCount} Unlocked)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {achievements.map(a => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl border transition shadow-lg flex items-start space-x-3 backdrop-blur-sm ${
                a.unlocked
                  ? 'bg-slate-900/90 border-amber-500/50 hover:border-amber-400'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  a.unlocked
                    ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                }`}
              >
                {a.unlocked ? a.icon : <Lock className="w-5 h-5 text-slate-500" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <h3 className={`text-xs font-bold font-mono ${a.unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {a.title}
                  </h3>
                  {a.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-snug">{a.description}</p>
                {a.unlockedAt && (
                  <span className="text-[9px] font-mono text-cyan-400 font-bold block pt-1">
                    Unlocked: {a.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discovery Museum (Collected Geological Samples) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold font-mono tracking-wide uppercase text-white">
            Planetary Discovery Museum ({collectedSamples.length} Geological Specimens)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectedSamples.map(sample => (
            <div
              key={sample.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-800/60 shadow-xl space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800 uppercase font-bold">
                    {sample.category}
                  </span>
                  <h3 className="text-sm font-bold font-mono text-white mt-1.5">{sample.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{sample.location}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  +{sample.scienceValue} Science
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">{sample.description}</p>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-sans">
                <span className="font-mono text-cyan-400 font-bold block mb-0.5">NASA Planetary Science Fact:</span>
                {sample.nasaFact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
