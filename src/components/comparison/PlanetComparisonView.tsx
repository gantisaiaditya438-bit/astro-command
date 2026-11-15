import React, { useState } from 'react';
import { SOLAR_SYSTEM_PLANETS } from '../../data/planetsData';
import { PlanetData, PlanetId } from '../../types/solar';
import {
  Thermometer,
  Compass,
  Wind,
  Droplets,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRightLeft
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export const PlanetComparisonView: React.FC = () => {
  const [planetAId, setPlanetAId] = useState<PlanetId>('earth');
  const [planetBId, setPlanetBId] = useState<PlanetId>('mars');

  const planetA = SOLAR_SYSTEM_PLANETS.find(p => p.id === planetAId) || SOLAR_SYSTEM_PLANETS[3];
  const planetB = SOLAR_SYSTEM_PLANETS.find(p => p.id === planetBId) || SOLAR_SYSTEM_PLANETS[5];

  const handleSelectA = (id: PlanetId) => {
    soundEffects.playClick();
    setPlanetAId(id);
  };

  const handleSelectB = (id: PlanetId) => {
    soundEffects.playClick();
    setPlanetBId(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span>PLANETARY SURVIVAL & HABITABILITY MATRIX</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
          Planet Survival Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
          Compare environmental conditions across our solar system to understand why Earth is unique, and what specialized engineering systems astronauts need to survive on other worlds.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Planet A Selector */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-mono text-slate-400 font-bold uppercase block">
            Select World A:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SOLAR_SYSTEM_PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectA(p.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition flex items-center space-x-1 ${
                  planetAId === p.id
                    ? 'bg-cyan-500 text-black font-bold shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Planet B Selector */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-mono text-slate-400 font-bold uppercase block">
            Select World B:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SOLAR_SYSTEM_PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectB(p.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition flex items-center space-x-1 ${
                  planetBId === p.id
                    ? 'bg-purple-500 text-white font-bold shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { data: planetA, badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50', border: 'border-cyan-500/50' },
          { data: planetB, badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/50', border: 'border-purple-500/50' }
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-slate-900/80 border ${item.border} shadow-2xl space-y-4`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold font-mono text-white">{item.data.name}</h2>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${item.badgeColor}`}>
                    {item.data.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-0.5">{item.data.tagline}</p>
              </div>
            </div>

            {/* Environmental Indicators */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 flex items-center">
                  <Thermometer className="w-4 h-4 text-amber-400 mr-1.5" /> Mean Temperature:
                </span>
                <span className="font-bold text-amber-300">{item.data.temperatureRangeC.mean}°C ({item.data.temperatureDesc})</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 flex items-center">
                  <Compass className="w-4 h-4 text-cyan-400 mr-1.5" /> Surface Gravity:
                </span>
                <span className="font-bold text-emerald-400">{item.data.surfaceGravityG}g ({item.data.surfaceGravityDesc})</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 flex items-center">
                  <Wind className="w-4 h-4 text-cyan-400 mr-1.5" /> Atmospheric Pressure:
                </span>
                <span className="font-bold text-white">{item.data.atmosphericPressureAtm} atm</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">Atmospheric Gases:</span>
                <span className="font-sans text-slate-200 text-[11px]">{item.data.atmosphereComposition.join(', ')}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 flex items-center mb-1">
                  <Droplets className="w-4 h-4 text-blue-400 mr-1" /> Water Availability:
                </span>
                <span className="font-sans text-slate-200 text-[11px]">{item.data.waterPresence}</span>
              </div>
            </div>

            {/* Can Humans Live Here? */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2">
                {item.data.canHumansLiveWithoutGear ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="font-mono font-bold text-white">Can humans live here without special gear?</span>
              </div>
              <div className={`font-mono font-bold text-[11px] ${item.data.canHumansLiveWithoutGear ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.data.canHumansLiveWithoutGear ? 'YES — Natural habitat' : 'NO — Lethal space environment'}
              </div>
              <p className="font-sans text-slate-300 text-[11px] leading-relaxed">
                {item.data.whyHumansCannotLiveHere}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
