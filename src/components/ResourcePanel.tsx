import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Wind,
  Zap,
  UtensilsCrossed,
  Droplets,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface ResourcePanelProps {
  onOpenSystemsModal: () => void;
}

export const ResourcePanel: React.FC<ResourcePanelProps> = ({ onOpenSystemsModal }) => {
  const { resources, dustLevel, subsystems } = useGame();

  const getMeterColor = (val: number, danger: number) => {
    if (val <= danger) return 'from-red-600 to-rose-500 text-red-400 border-red-500/40 bg-red-950/20';
    if (val <= danger * 1.5) return 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'from-cyan-500 to-blue-500 text-cyan-400 border-cyan-500/30 bg-slate-900/40';
  };

  const getRateBadge = (rate: number) => {
    if (rate > 0.05) {
      return (
        <span className="flex items-center text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
          <TrendingUp className="w-3 h-3 mr-0.5" />
          +{rate.toFixed(1)}/h
        </span>
      );
    }
    if (rate < -0.05) {
      return (
        <span className="flex items-center text-[11px] font-mono font-semibold text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-500/30">
          <TrendingDown className="w-3 h-3 mr-0.5" />
          {rate.toFixed(1)}/h
        </span>
      );
    }
    return (
      <span className="flex items-center text-[11px] font-mono text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/40">
        <Minus className="w-3 h-3 mr-0.5" />
        0.0/h
      </span>
    );
  };

  const resourceItems = [
    {
      key: 'oxygen',
      name: 'Oxygen (O₂)',
      val: resources.oxygen.current,
      unit: resources.oxygen.unit,
      rate: resources.oxygen.ratePerHour,
      danger: resources.oxygen.dangerThreshold,
      desc: 'Cabin atmospheric pressure & ECLSS scrubbers',
      icon: Wind,
      color: 'cyan'
    },
    {
      key: 'energy',
      name: 'Energy & Power',
      val: resources.energy.current,
      unit: resources.energy.unit,
      rate: resources.energy.ratePerHour,
      danger: resources.energy.dangerThreshold,
      desc: 'Solar panel generation & battery banks',
      icon: Zap,
      color: 'amber'
    },
    {
      key: 'food',
      name: 'Food & Rations',
      val: resources.food.current,
      unit: resources.food.unit,
      rate: resources.food.ratePerHour,
      danger: resources.food.dangerThreshold,
      desc: 'Astronaut daily rations & fresh crops',
      icon: UtensilsCrossed,
      color: 'emerald'
    },
    {
      key: 'water',
      name: 'Water (H₂O)',
      val: resources.water.current,
      unit: resources.water.unit,
      rate: resources.water.ratePerHour,
      danger: resources.water.dangerThreshold,
      desc: 'Closed-loop 98% ECLSS recovery loop',
      icon: Droplets,
      color: 'blue'
    },
    {
      key: 'radiationShielding',
      name: 'Radiation Shielding',
      val: resources.radiationShielding.current,
      unit: resources.radiationShielding.unit,
      rate: resources.radiationShielding.ratePerHour,
      danger: resources.radiationShielding.dangerThreshold,
      desc: 'Electromagnetic deflector & regolith bunker',
      icon: Shield,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-cyan-300 flex items-center space-x-2">
          <span>Life Support & Core Consumables</span>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
            5/5 Systems Active
          </span>
        </h3>
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenSystemsModal();
          }}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium transition shadow-sm hover:scale-[1.02]"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Route Power Grid</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {resourceItems.map(item => {
          const Icon = item.icon;
          const isDanger = item.val <= item.danger;

          return (
            <div
              key={item.key}
              className={`p-3.5 rounded-xl border backdrop-blur-md transition shadow-lg relative overflow-hidden group hover:border-cyan-500/60 ${getMeterColor(
                item.val,
                item.danger
              )}`}
            >
              {/* Background gradient hint */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-white shadow">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 font-mono tracking-wide">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                  </div>
                </div>
              </div>

              {/* Numerical readout & Rate */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-extrabold font-mono tracking-tight text-white">
                    {Math.round(item.val)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{item.unit}</span>
                </div>
                {getRateBadge(item.rate)}
              </div>

              {/* Visual meter bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                    isDanger ? 'from-red-500 to-rose-400 animate-pulse' : 'from-cyan-500 via-blue-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.max(4, Math.min(100, item.val))}%` }}
                />
              </div>

              {/* Danger Warning Pill */}
              {isDanger && (
                <div className="mt-2 flex items-center space-x-1 text-[10px] text-red-300 font-mono font-bold animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>CRITICAL SHORTAGE</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

