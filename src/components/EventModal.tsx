import React from 'react';
import { useGame } from '../context/GameContext';
import {
  AlertOctagon,
  ShieldAlert,
  Zap,
  Wind,
  Droplets,
  BookOpen,
  ArrowRight,
  Database
} from 'lucide-react';
import { MissionDecisionOption } from '../types';

export const EventModal: React.FC = () => {
  const { activeEvent, resolveEventOption } = useGame();

  if (!activeEvent) return null;

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'border-red-500 bg-red-950/90 text-red-300 shadow-red-900/50';
      case 'high':
        return 'border-amber-500 bg-amber-950/90 text-amber-300 shadow-amber-900/50';
      default:
        return 'border-cyan-500 bg-slate-900/95 text-cyan-300 shadow-cyan-900/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border p-5 md:p-6 shadow-2xl ${getSeverityStyle(
          activeEvent.severity
        )}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-white shadow">
              <AlertOctagon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 uppercase tracking-widest border border-white/20">
                  {activeEvent.severity} Priority Event
                </span>
                <span className="text-xs text-white/70 font-mono">Mission Sol Alert</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-mono tracking-tight text-white mt-0.5">
                {activeEvent.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed mb-4 bg-black/40 p-3.5 rounded-xl border border-white/10 font-sans">
          {activeEvent.description}
        </p>

        {/* NASA Open Data Attribution Box */}
        {activeEvent.nasaDataConnection && (
          <div className="mb-4 p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs font-mono">
            <div className="flex items-center space-x-1.5 font-bold text-cyan-300 mb-1">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>NASA Authentic Open Dataset Citation</span>
            </div>
            <div className="text-[11px] text-blue-100">
              <span className="text-cyan-400 font-semibold">{activeEvent.nasaDataConnection.source}</span> –{' '}
              {activeEvent.nasaDataConnection.dataset}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 font-sans">
              {activeEvent.nasaDataConnection.detail}
            </p>
          </div>
        )}

        {/* Educational STEM Context */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold font-mono mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Real NASA Engineering Science</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">{activeEvent.educationalContext}</p>
        </div>

        {/* Decision Options */}
        <div>
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white mb-2.5">
            Commander Action Required – Choose Your Course of Action:
          </h3>

          <div className="space-y-2.5">
            {activeEvent.options.map(option => (
              <button
                key={option.id}
                onClick={() => resolveEventOption(option)}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-white/15 hover:border-cyan-400/80 transition group shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-cyan-300 transition font-mono mb-1">
                      {option.text}
                    </h4>
                    <p className="text-[11px] text-slate-300 mb-2 font-sans">{option.tooltip}</p>

                    {/* Resource Delta Badges */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                      {option.resourceDeltas.energy !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            option.resourceDeltas.energy > 0
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-red-950 text-red-300'
                          }`}
                        >
                          ⚡ {option.resourceDeltas.energy > 0 ? '+' : ''}
                          {option.resourceDeltas.energy} kWh
                        </span>
                      )}
                      {option.resourceDeltas.oxygen !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            option.resourceDeltas.oxygen > 0
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-red-950 text-red-300'
                          }`}
                        >
                          💨 {option.resourceDeltas.oxygen > 0 ? '+' : ''}
                          {option.resourceDeltas.oxygen}% O₂
                        </span>
                      )}
                      {option.resourceDeltas.water !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            option.resourceDeltas.water > 0
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-red-950 text-red-300'
                          }`}
                        >
                          💧 {option.resourceDeltas.water > 0 ? '+' : ''}
                          {option.resourceDeltas.water}L
                        </span>
                      )}
                      {option.resourceDeltas.radiationShielding !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            option.resourceDeltas.radiationShielding > 0
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-red-950 text-red-300'
                          }`}
                        >
                          🛡️ {option.resourceDeltas.radiationShielding > 0 ? '+' : ''}
                          {option.resourceDeltas.radiationShielding}% Shield
                        </span>
                      )}
                      {option.resourceDeltas.sciencePoints !== undefined && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">
                          🔬 +{option.resourceDeltas.sciencePoints} Science
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500 group-hover:text-black text-white/50 transition self-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

