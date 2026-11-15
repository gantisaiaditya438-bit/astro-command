import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { soundEffects } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Sun,
  Wind,
  Shield,
  Droplets,
  Gauge,
  Flame,
  Award,
  RotateCcw,
  Play,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ScienceExperimentsView: React.FC = () => {
  const { sciencePoints } = useGame();
  const [activeTab, setActiveTab] = useState<'gravity' | 'solar' | 'oxygen' | 'water' | 'spacesuit'>('gravity');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Interactive NASA Science Simulator</span>
          </div>
          <h1 className="text-2xl font-black font-mono text-white tracking-tight mt-1">
            Planetary Physics & Survival Experiments
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Hands-on educational simulations for Junior Astronauts (Ages 7–12) • Authentic NASA Principles
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Total Science Pts:</span>
          <span className="text-emerald-400 font-bold">{sciencePoints} pts</span>
        </div>
      </div>

      {/* Experiment Selector Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-1 text-xs font-mono scrollbar-none">
        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('gravity');
          }}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 border ${
            activeTab === 'gravity'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <span>🦘</span>
          <span>1. Gravity Jump Sandbox</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('solar');
          }}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 border ${
            activeTab === 'solar'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <span>☀️</span>
          <span>2. Solar Angle Optimizer</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('oxygen');
          }}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 border ${
            activeTab === 'oxygen'
              ? 'bg-blue-500/20 text-blue-300 border-blue-400 font-bold shadow-lg shadow-blue-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <span>💨</span>
          <span>3. ECLSS Oxygen Loop</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('water');
          }}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 border ${
            activeTab === 'water'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400 font-bold shadow-lg shadow-indigo-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <span>💧</span>
          <span>4. Water Closed Loop</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('spacesuit');
          }}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 border ${
            activeTab === 'spacesuit'
              ? 'bg-purple-500/20 text-purple-300 border-purple-400 font-bold shadow-lg shadow-purple-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
          }`}
        >
          <span>🧑‍🚀</span>
          <span>5. Spacesuit Armor Layers</span>
        </button>
      </div>

      {/* Experiment Container */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {activeTab === 'gravity' && <GravityExperiment />}
        {activeTab === 'solar' && <SolarAngleExperiment />}
        {activeTab === 'oxygen' && <OxygenLoopExperiment />}
        {activeTab === 'water' && <WaterRecyclingExperiment />}
        {activeTab === 'spacesuit' && <SpacesuitLayersExperiment />}
      </div>
    </div>
  );
};

// ==========================================
// 1. GRAVITY EXPERIMENT
// ==========================================
const GravityExperiment: React.FC = () => {
  const bodies = [
    { name: 'Earth', g: 1.0, desc: '1.0g (Standard Home Gravity)', color: '#38bdf8' },
    { name: 'Mars', g: 0.38, desc: '0.38g (You weigh 62% less!)', color: '#f97316' },
    { name: 'The Moon', g: 0.166, desc: '0.166g (Giant floating leaps)', color: '#94a3b8' },
    { name: 'Jupiter', g: 2.53, desc: '2.53g (Crushing heavyweight pull)', color: '#fbbf24' },
    { name: 'Pluto', g: 0.063, desc: '0.06g (Near weightlessness)', color: '#c084fc' }
  ];

  const [selectedBody, setSelectedBody] = useState(bodies[2]); // Moon default
  const [jumpProgress, setJumpProgress] = useState(0); // 0 to 1
  const [isJumping, setIsJumping] = useState(false);

  // Jump physics calculation: v0 = 4 m/s
  const v0 = 4.0;
  const maxHeightMeters = Number(((v0 * v0) / (2 * 9.8 * selectedBody.g)).toFixed(2));
  const hangTimeSec = Number(((2 * v0) / (9.8 * selectedBody.g)).toFixed(2));

  const handleJump = () => {
    if (isJumping) return;
    soundEffects.playBeep();
    setIsJumping(true);

    const duration = Math.min(3500, Math.max(700, hangTimeSec * 600));
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      // Parabolic jump curve
      const heightFraction = 4 * t * (1 - t);
      setJumpProgress(heightFraction);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setJumpProgress(0);
        setIsJumping(false);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
            <span>🦘 Gravitational Acceleration & Kinetic Jump Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Observe how planetary mass dictates surface gravity and human athletic performance!
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
          Simulated Physical Model
        </span>
      </div>

      {/* Planet Selector Chips */}
      <div className="flex flex-wrap gap-2">
        {bodies.map(b => (
          <button
            key={b.name}
            onClick={() => {
              soundEffects.playClick();
              setSelectedBody(b);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center space-x-1.5 border ${
              selectedBody.name === b.name
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <span>{b.name}</span>
            <span className="text-[10px] opacity-75">({b.g}g)</span>
          </button>
        ))}
      </div>

      {/* Interactive Jump Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Animated Jump Column */}
        <div className="lg:col-span-2 h-64 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-end p-4">
          {/* Height Meter Lines */}
          <div className="absolute left-4 top-4 bottom-4 w-12 border-r border-dashed border-slate-700 flex flex-col justify-between text-[10px] font-mono text-slate-500">
            <span>12m</span>
            <span>8m</span>
            <span>4m</span>
            <span>0m (Surface)</span>
          </div>

          {/* Jumping Astronaut Sprite */}
          <div
            className="self-center flex flex-col items-center transition-all"
            style={{
              transform: `translateY(-${jumpProgress * Math.min(180, maxHeightMeters * 16)}px)`
            }}
          >
            <div className="text-4xl filter drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              🧑‍🚀
            </div>
            {isJumping && (
              <span className="text-[10px] font-mono font-bold text-cyan-300 animate-pulse mt-1">
                {(jumpProgress * maxHeightMeters).toFixed(1)}m
              </span>
            )}
          </div>

          {/* Surface Ground Line */}
          <div className="w-full h-3 rounded-full bg-slate-800 border-t border-cyan-500/40 mt-2" />
        </div>

        {/* Live Telemetry & Jump Trigger */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">Selected Body</span>
            <h4 className="text-base font-bold text-white font-sans">{selectedBody.name}</h4>
            <p className="text-[11px] text-slate-300 font-sans">{selectedBody.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Peak Jump Height</span>
              <span className="text-cyan-300 font-bold text-sm">{maxHeightMeters} meters</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Hang Time</span>
              <span className="text-amber-300 font-bold text-sm">{hangTimeSec} seconds</span>
            </div>
          </div>

          <button
            onClick={handleJump}
            disabled={isJumping}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-extrabold font-mono text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <span>{isJumping ? 'In Low-G Leap...' : 'Perform Jump [SPACEBAR]'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SOLAR ANGLE OPTIMIZER EXPERIMENT
// ==========================================
const SolarAngleExperiment: React.FC = () => {
  const [panelAngle, setPanelAngle] = useState(45); // degrees
  const sunElevation = 50; // simulated sun angle

  // Calculate efficiency based on cosine of difference angle
  const diffAngle = Math.abs(panelAngle - sunElevation);
  const efficiency = Math.round(Math.max(0, Math.cos((diffAngle * Math.PI) / 180)) * 100);
  const wattage = Math.round((efficiency / 100) * 450);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
            <span>☀️ Photovoltaic Solar Incident Angle & Cosine Efficiency</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Rotate the solar panel azimuth and tilt to align perpendicular to the incident solar rays.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
          Simulated Solar Farm
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Interactive Visual Graphic */}
        <div className="lg:col-span-2 h-64 rounded-2xl bg-slate-900 border border-slate-800 relative flex items-center justify-center overflow-hidden p-6">
          {/* Simulated Sun */}
          <div className="absolute top-6 left-12 flex flex-col items-center">
            <Sun className="w-12 h-12 text-amber-400 animate-spin" />
            <span className="text-[10px] font-mono text-amber-300 mt-1">Sun Angle: 50°</span>
          </div>

          {/* Sunlight Rays Stream */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent" />

          {/* Solar Panel Rotating Mesh */}
          <div
            className="w-40 h-8 rounded-lg bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-transform duration-150 flex items-center justify-center"
            style={{ transform: `rotate(${-panelAngle}deg)` }}
          >
            <div className="grid grid-cols-4 w-full h-full divide-x divide-cyan-600/50">
              <div /><div /><div /><div />
            </div>
          </div>

          {/* Ground pedestal */}
          <div className="absolute bottom-6 w-4 h-24 bg-slate-700 rounded-t-lg" />
        </div>

        {/* Controls & Power Output Readout */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Panel Tilt Angle</span>
              <span className="text-cyan-300 font-bold">{panelAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={panelAngle}
              onChange={e => setPanelAngle(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Incident Efficiency</span>
              <span className={`font-black text-sm ${efficiency > 90 ? 'text-emerald-400' : efficiency > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {efficiency}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Power Generated</span>
              <span className="text-white font-bold">{wattage} Watts / panel</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {efficiency > 92
              ? '⭐ Peak Alignment! The panel is perpendicular to the light, absorbing maximum photon energy!'
              : 'Tip: Rotate the panel closer to 50° to match the Sun’s incoming beam angle!'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ECLSS OXYGEN LOOP EXPERIMENT
// ==========================================
const OxygenLoopExperiment: React.FC = () => {
  const [electrolysisPower, setElectrolysisPower] = useState(70);
  const [crewCount, setCrewCount] = useState(4);

  // Oxygen generation vs consumption
  const o2GenRate = Number(((electrolysisPower / 100) * 1.8).toFixed(2));
  const o2ConsumeRate = Number((crewCount * 0.35).toFixed(2));
  const netO2Rate = Number((o2GenRate - o2ConsumeRate).toFixed(2));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
            <span>💨 Environmental Control & Life Support (ECLSS) Closed Loop</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Balance water electrolysis ($2H_2O \rightarrow 2H_2 + O_2$) against crew respiratory metabolic consumption!
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
          Simulated ECLSS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Astronauts */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
          <span className="text-slate-400 uppercase text-[10px]">1. Crew Respiration</span>
          <div className="flex justify-between items-center">
            <span>Crew Members:</span>
            <span className="text-cyan-300 font-bold text-sm">{crewCount} Astronauts</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={crewCount}
            onChange={e => setCrewCount(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="text-[11px] text-red-300">
            Consuming: -{o2ConsumeRate} kg $O_2$ / hour
          </div>
        </div>

        {/* Step 2: Electrolysis */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
          <span className="text-slate-400 uppercase text-[10px]">2. Water Electrolysis Power</span>
          <div className="flex justify-between items-center">
            <span>Power Level:</span>
            <span className="text-amber-300 font-bold text-sm">{electrolysisPower}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={electrolysisPower}
            onChange={e => setElectrolysisPower(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="text-[11px] text-emerald-300">
            Producing: +{o2GenRate} kg $O_2$ / hour
          </div>
        </div>

        {/* Step 3: Net Balance */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs flex flex-col justify-between">
          <div>
            <span className="text-slate-400 uppercase text-[10px]">3. Net Oxygen Balance</span>
            <div className={`text-2xl font-black mt-2 ${netO2Rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {netO2Rate >= 0 ? `+${netO2Rate}` : netO2Rate} kg/hr
            </div>
          </div>
          <div className="text-[11px] font-sans text-slate-300 leading-snug">
            {netO2Rate >= 0
              ? '✅ Safe breathing atmosphere maintained in base habitats!'
              : '⚠️ Deficit! Habitat oxygen reserves will slowly deplete. Increase electrolysis power!'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. WATER CLOSED LOOP EXPERIMENT
// ==========================================
const WaterRecyclingExperiment: React.FC = () => {
  const [recoveryTier, setRecoveryTier] = useState<75 | 90 | 98>(98);

  const dailyCrewUseLiters = 40; // 4 crew * 10L/day
  const recycledLiters = Number(((dailyCrewUseLiters * recoveryTier) / 100).toFixed(1));
  const lossPerDay = Number((dailyCrewUseLiters - recycledLiters).toFixed(1));
  const missionLifespanDays = Math.round(1000 / lossPerDay);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
            <span>💧 Closed-Loop Water Recovery & Graywater Distillation</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            NASA ISS Environmental Control recycles 98% of crew moisture, sweat, and condensate!
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
          Simulated Hydrology Loop
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { tier: 75, name: 'Basic Distillation (75%)', desc: 'Loses 25% to sludge waste' },
          { tier: 90, name: 'Advanced Reverse Osmosis (90%)', desc: 'Good efficiency' },
          { tier: 98, name: 'NASA ISS Urine Processor Assembly (98%)', desc: 'Ultra-pure closed loop' }
        ].map(item => (
          <button
            key={item.tier}
            onClick={() => {
              soundEffects.playClick();
              setRecoveryTier(item.tier as any);
            }}
            className={`p-4 rounded-2xl border text-left font-mono text-xs transition ${
              recoveryTier === item.tier
                ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400 font-bold shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <div className="text-sm font-bold text-white mb-1">{item.name}</div>
            <p className="text-[11px] font-sans text-slate-300">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase">Recycled per Sol</span>
          <div className="text-lg font-bold text-cyan-300 mt-1">{recycledLiters} Liters</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase">Lost to Evaporation/Waste</span>
          <div className="text-lg font-bold text-amber-300 mt-1">{lossPerDay} Liters/day</div>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase">1,000L Tank Endurance</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">{missionLifespanDays} Sols</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. SPACESUIT LAYERS EXPERIMENT
// ==========================================
const SpacesuitLayersExperiment: React.FC = () => {
  const [layers, setLayers] = useState({
    lcvg: true,
    pressure: true,
    thermal: true,
    visor: true
  });

  const toggleLayer = (key: keyof typeof layers) => {
    soundEffects.playClick();
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSafe = layers.lcvg && layers.pressure && layers.thermal && layers.visor;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
            <span>🧑‍🚀 Extravehicular Mobility Unit (Spacesuit) Armor Layers</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Explore how NASA engineering stacks multiple protective layers to defeat vacuum, cold, and radiation.
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
          Simulated Spacesuit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Layer Toggles */}
        <div className="space-y-2.5 font-mono text-xs">
          <button
            onClick={() => toggleLayer('lcvg')}
            className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
              layers.lcvg
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span>Layer 1: Liquid Cooling Garment (400ft water tubes)</span>
            <span>{layers.lcvg ? 'INSTALLED' : 'REMOVED'}</span>
          </button>

          <button
            onClick={() => toggleLayer('pressure')}
            className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
              layers.pressure
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span>Layer 2: Urethane Pressure Bladder (4.3 psi)</span>
            <span>{layers.pressure ? 'INSTALLED' : 'REMOVED'}</span>
          </button>

          <button
            onClick={() => toggleLayer('thermal')}
            className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
              layers.thermal
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span>Layer 3: 7-Layer Mylar Thermal Micrometeoroid Garment</span>
            <span>{layers.thermal ? 'INSTALLED' : 'REMOVED'}</span>
          </button>

          <button
            onClick={() => toggleLayer('visor')}
            className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
              layers.visor
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span>Layer 4: Gold-Coated Visor (Filters blinding UV sunlight)</span>
            <span>{layers.visor ? 'INSTALLED' : 'REMOVED'}</span>
          </button>
        </div>

        {/* Live Suit Integrity Status */}
        <div className={`p-6 rounded-2xl border text-center space-y-3 font-mono ${
          isSafe
            ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
            : 'bg-red-950/40 border-red-500/80 text-red-200'
        }`}>
          <div className="text-4xl">{isSafe ? '🛡️' : '⚠️'}</div>
          <h3 className="text-base font-bold">
            {isSafe ? 'Spacesuit Status: 100% EVA Certified' : 'CRITICAL SAFETY DEFICIENCY!'}
          </h3>
          <p className="text-xs font-sans text-slate-300">
            {isSafe
              ? 'Astronaut is fully protected against the vacuum of space, temperatures from -150°C to +120°C, and cosmic radiation!'
              : 'Warning: Missing suit layers expose the astronaut to fatal vacuum decompression or thermal extremes!'}
          </p>
        </div>
      </div>
    </div>
  );
};
