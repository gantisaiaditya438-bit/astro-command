import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGame } from '../../context/GameContext';
import { SolarSystem3D } from './SolarSystem3D';
import { PlanetCard } from './PlanetCard';
import { SOLAR_SYSTEM_PLANETS } from '../../data/planetsData';
import { PlanetData, PlanetId } from '../../types/solar';
import { Compass, Info, Rocket, Sparkles, Orbit } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export const SolarSystemView: React.FC = () => {
  const {
    selectedPlanetId,
    setSelectedPlanetId,
    isTraveling,
    travelTarget,
    travelTo
  } = useGame();

  const [showScaleInfo, setShowScaleInfo] = useState(false);

  const selectedPlanet =
    SOLAR_SYSTEM_PLANETS.find(p => p.id === selectedPlanetId) || SOLAR_SYSTEM_PLANETS[3]; // Earth default

  const handleSelect = (id: PlanetId) => {
    soundEffects.playBeep();
    setSelectedPlanetId(id);
  };

  return (
    <div className="relative w-full h-[calc(100vh-62px)] overflow-hidden bg-[#030611] select-none text-slate-100 animate-fadeIn">
      {/* 3D Solar System Canvas */}
      <Canvas
        camera={{ position: [0, 65, 85], fov: 45, near: 0.5, far: 500 }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <SolarSystem3D
          selectedPlanetId={selectedPlanetId}
          onSelectPlanet={handleSelect}
        />
      </Canvas>

      {/* Top Overlay Badge & Scale Disclaimer */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <div className="flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-cyan-500/40 shadow-xl">
          <Orbit className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-sm font-bold font-mono text-white tracking-wide">
              Solar System Exploration Hub
            </h1>
            <p className="text-[10px] text-cyan-300 font-mono">
              Select any planet to inspect physical data or travel to surface base
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowScaleInfo(!showScaleInfo)}
          className="self-start flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-mono text-slate-300 transition"
        >
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Scale Disclaimer</span>
        </button>

        {showScaleInfo && (
          <div className="max-w-xs p-3 rounded-xl bg-slate-950/95 border border-cyan-800 text-[11px] font-sans text-slate-300 space-y-1 shadow-2xl backdrop-blur-md">
            <div className="font-bold font-mono text-cyan-300">Educational Scale Notice:</div>
            <p className="leading-relaxed">
              In real space, planets are separated by vast millions of kilometers! We use an educational visualization scale so you can see all orbits and compare planets together.
            </p>
          </div>
        )}
      </div>

      {/* Slide-out Planet Information Card */}
      {selectedPlanet && (
        <PlanetCard
          planet={selectedPlanet}
          onClose={() => setSelectedPlanetId(null)}
          onTravel={p => travelTo(p.id)}
        />
      )}

      {/* Bottom Planet Quick-Select Carousel */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-20 pointer-events-auto">
        <div className="flex items-center space-x-2 overflow-x-auto p-2 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-2 hidden sm:inline">
            Planets:
          </span>
          {SOLAR_SYSTEM_PLANETS.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition flex items-center space-x-2 shrink-0 ${
                selectedPlanetId === p.id
                  ? 'bg-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-500/25 border border-white'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {p.nasaPhoto ? (
                <img
                  src={p.nasaPhoto.thumbUrl}
                  alt={p.name}
                  className="w-4 h-4 rounded-full object-cover border border-white/50 shadow-sm"
                  loading="lazy"
                />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              )}
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Warp Travel Launch Animation Overlay */}
      {isTraveling && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin flex items-center justify-center">
            <Rocket className="w-8 h-8 text-cyan-300 transform -rotate-45" />
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-mono font-bold text-cyan-300 tracking-wider animate-pulse">
              INITIATING HYPER-DRIVE TRAJECTORY
            </div>
            <p className="text-xs text-slate-300 font-mono">
              Traveling to {travelTarget ? travelTarget.toUpperCase() : 'DESTINATION'}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
