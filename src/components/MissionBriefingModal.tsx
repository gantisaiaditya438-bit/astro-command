import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Rocket,
  Target,
  ShieldAlert,
  Users,
  CheckCircle,
  ArrowLeft,
  Wind,
  Zap,
  UtensilsCrossed,
  Droplets,
  Shield
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const MissionBriefingModal: React.FC = () => {
  const { scenario, startMission, setView, crew } = useGame();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn text-slate-100">
      <div className="bg-[#0a0f21] border border-cyan-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NASA PRE-FLIGHT BRIEFING PROTOCOL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {scenario.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">{scenario.subtitle}</p>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              setView('mission_select');
            }}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center space-x-1.5 transition border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Mission</span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {scenario.briefing.summary}
        </div>

        {/* Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-300 font-mono font-bold text-xs">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>PRIMARY MISSION OBJECTIVE</span>
            </div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {scenario.briefing.primaryObjective}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-300 font-mono font-bold text-xs">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>SECONDARY SCIENTIFIC OBJECTIVE</span>
            </div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {scenario.briefing.secondaryObjective}
            </p>
          </div>
        </div>

        {/* Initial Resources Manifest */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
            Initial Outpost Reserves Manifest
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-mono">Oxygen</div>
              <div className="text-sm font-bold font-mono text-white">{scenario.initialResources.oxygen}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-mono">Energy</div>
              <div className="text-sm font-bold font-mono text-white">{scenario.initialResources.energy} kWh</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <UtensilsCrossed className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-mono">Food</div>
              <div className="text-sm font-bold font-mono text-white">{scenario.initialResources.food} Rations</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-mono">Water</div>
              <div className="text-sm font-bold font-mono text-white">{scenario.initialResources.water}L</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-xs text-slate-400 font-mono">Shielding</div>
              <div className="text-sm font-bold font-mono text-white">{scenario.initialResources.radiationShielding}%</div>
            </div>
          </div>
        </div>

        {/* Assigned Crew */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-400 uppercase">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Assigned Expedition Crew (4 Specialists)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {crew.map(c => (
              <div key={c.id} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                <span className="text-xl">{c.avatar}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate font-mono">{c.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => {
              startMission();
              setView('dashboard');
            }}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition border border-slate-700"
          >
            Launch in 2D Dashboard
          </button>

          <button
            onClick={() => {
              startMission();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold font-mono text-sm tracking-wider transition flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/20"
          >
            <Rocket className="w-4 h-4 transform -rotate-45" />
            <span>LAUNCH 3D LUNAR OUTPOST (SOL 1)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

