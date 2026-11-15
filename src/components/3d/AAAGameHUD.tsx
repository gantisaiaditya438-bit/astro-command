import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CameraMode, InteractiveBuildingId } from './types';
import { GameSettingsModal } from './GameSettingsModal';
import { soundEffects } from '../../services/soundEffects';
import {
  Rocket,
  Wind,
  Zap,
  UtensilsCrossed,
  Droplets,
  Shield,
  ShieldAlert,
  Clock,
  Compass,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Target
} from 'lucide-react';

interface AAAGameHUDProps {
  destination: 'moon' | 'mars';
  cameraMode: CameraMode;
  onSetCameraMode: (mode: CameraMode) => void;
  onSelectBuilding: (id: InteractiveBuildingId | null) => void;
  onOpenPowerGrid: () => void;
  emergencyStep?: number;
}

export const AAAGameHUD: React.FC<AAAGameHUDProps> = ({
  destination,
  cameraMode,
  onSetCameraMode,
  onSelectBuilding,
  onOpenPowerGrid,
  emergencyStep
}) => {
  const {
    scenario,
    currentSol,
    currentHour,
    simSpeed,
    setSimSpeed,
    resources,
    dustLevel,
    activeSolarStorm,
    crew,
    sciencePoints,
    setView,
    controlMode,
    setControlMode
  } = useGame();

  // Collapsible panels state for AAA immersion
  const [isResourcePanelOpen, setIsResourcePanelOpen] = useState(true);
  const [isMissionPanelOpen, setIsMissionPanelOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Compute average crew health
  const avgCrewHealth = Math.round(
    crew.reduce((acc, c) => acc + c.health, 0) / crew.length
  );

  const getMeterColor = (val: number, danger: number) => {
    if (val <= danger) return 'bg-red-500 animate-pulse';
    if (val <= danger * 1.6) return 'bg-amber-400';
    return 'bg-gradient-to-r from-emerald-400 to-cyan-400';
  };

  const isMars = destination === 'mars';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-20 select-none overflow-hidden">
      {/* ============================================================== */}
      {/* 1. TOP COMPACT NAVIGATION BAR                                 */}
      {/* ============================================================== */}
      <header className="flex items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Brand Logo & Destination Pill */}
        <div className="flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-cyan-500/40 shadow-xl">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow shadow-cyan-500/30">
            <Rocket className="w-4 h-4 transform -rotate-45" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono font-black text-cyan-300 text-xs tracking-wider">
              ASTRO COMMAND
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
              {isMars ? '🔴 Mars (Jezero)' : '🌕 Moon (Shackleton)'}
            </span>
          </div>
        </div>

        {/* Center: Mission Clock & Live Event Warning */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 shadow-xl text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white">Sol {currentSol}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 font-bold">
            {String(currentHour).padStart(2, '0')}:00
          </span>
          {activeSolarStorm && (
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500 animate-pulse font-bold">
              SOLAR STORM ALERT
            </span>
          )}
          {dustLevel > 70 && (
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500 animate-pulse font-bold">
              DUST STORM
            </span>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl text-xs font-mono">
          {/* Pause / Resume Simulation */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSimSpeed(simSpeed === 0 ? 1 : 0);
            }}
            title={simSpeed === 0 ? 'Resume Simulation' : 'Pause Simulation'}
            className={`p-1.5 rounded-xl border transition ${
              simSpeed === 0
                ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            {simSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsSettingsOpen(true);
            }}
            title="Settings & Accessibility"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Switch to 2D Dashboard */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setView('dashboard');
            }}
            title="Return to 2D Mission Control"
            className="px-2.5 py-1 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono transition flex items-center space-x-1"
          >
            <LayoutDashboard className="w-3 h-3" />
            <span className="hidden md:inline">2D Dashboard</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MIDDLE VIEWPORT (COLLAPSIBLE LEFT RESOURCES & RIGHT MISSION) */}
      {/* ============================================================== */}
      <div className="flex justify-between items-start my-auto w-full pointer-events-none gap-4">
        {/* --- LEFT: COLLAPSIBLE RESOURCE PANEL --- */}
        <div className="pointer-events-auto flex items-start">
          {isResourcePanelOpen ? (
            <div className="w-48 sm:w-56 p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-slate-100 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-mono">
                <span className="font-bold text-cyan-400 uppercase tracking-wider">
                  Outpost Vitals
                </span>
                <button
                  onClick={() => setIsResourcePanelOpen(false)}
                  title="Collapse Resources"
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Horizontal Resource Progress Bars */}
              <div className="space-y-2">
                {[
                  {
                    name: 'Oxygen',
                    unit: '%',
                    val: resources.oxygen.current,
                    danger: 25,
                    icon: Wind
                  },
                  {
                    name: 'Water',
                    unit: '%',
                    val: resources.water.current,
                    danger: 20,
                    icon: Droplets
                  },
                  {
                    name: 'Food',
                    unit: '%',
                    val: resources.food.current,
                    danger: 20,
                    icon: UtensilsCrossed
                  },
                  {
                    name: 'Power',
                    unit: '%',
                    val: resources.energy.current,
                    danger: 25,
                    icon: Zap
                  },
                  {
                    name: 'Crew Health',
                    unit: '%',
                    val: avgCrewHealth,
                    danger: 40,
                    icon: Rocket
                  },
                  {
                    name: 'Shielding',
                    unit: '%',
                    val: resources.radiationShielding.current,
                    danger: 30,
                    icon: Shield
                  }
                ].map(item => {
                  const Icon = item.icon;
                  const isLow = item.val <= item.danger;

                  return (
                    <div key={item.name} className="space-y-0.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1 text-slate-300">
                          <Icon className="w-3 h-3 text-cyan-400" />
                          <span>{item.name}</span>
                        </span>
                        <span className={`font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
                          {Math.round(item.val)}
                          <span className="text-[9px] text-slate-500 ml-0.5">{item.unit}</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${getMeterColor(
                            item.val,
                            item.danger
                          )}`}
                          style={{ width: `${Math.max(4, Math.min(100, item.val))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={onOpenPowerGrid}
                className="w-full py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold flex items-center justify-center space-x-1 transition"
              >
                <Sliders className="w-3 h-3" />
                <span>Configure Grid</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsResourcePanelOpen(true)}
              className="p-2 rounded-2xl bg-slate-950/90 border border-cyan-500/50 text-cyan-300 shadow-xl backdrop-blur-md flex items-center space-x-1 text-xs font-mono font-bold hover:bg-slate-900 transition"
              title="Expand Resource Vitals"
            >
              <span>Vitals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* --- RIGHT: COLLAPSIBLE MISSION PANEL --- */}
        <div className="pointer-events-auto flex items-start">
          {isMissionPanelOpen ? (
            <div className="w-60 sm:w-72 p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-slate-100 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] font-mono">
                <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mission Telemetry</span>
                </span>
                <button
                  onClick={() => setIsMissionPanelOpen(false)}
                  title="Collapse Mission Panel"
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Mission Title */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Active Objective
                </span>
                <h4 className="text-xs font-bold font-mono text-white leading-snug">
                  {isMars
                    ? 'Mars Emergency: Repair MOXIE & Shield Base'
                    : 'First Steps at Shackleton Crater'}
                </h4>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {isMars
                    ? 'Restore broken solid oxide electrolysis tube before dust storm obscures sunlight.'
                    : 'Harvest lunar basalt and water-ice while maintaining habitat life support.'}
                </p>
              </div>

              {/* Progress & Science Points */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono">
                <span className="text-slate-400">Total Science:</span>
                <span className="text-emerald-400 font-bold">{sciencePoints} Pts</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsMissionPanelOpen(true)}
              className="p-2 rounded-2xl bg-slate-950/90 border border-cyan-500/50 text-cyan-300 shadow-xl backdrop-blur-md flex items-center space-x-1 text-xs font-mono font-bold hover:bg-slate-900 transition"
              title="Expand Mission Directives"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Mission</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM STREAMLINED GAME CONTROLS DOCK                       */}
      {/* ============================================================== */}
      <footer className="self-center pointer-events-auto flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 text-[11px] font-mono text-slate-300 shadow-2xl">
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">W</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">A</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">S</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">D</kbd>
          <span className="hidden sm:inline">Move</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 font-bold border border-slate-700">SHIFT</kbd>
          <span className="hidden sm:inline">Run</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center space-x-1">
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">SPACE</kbd>
          <span className="hidden sm:inline">Jump</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold border border-slate-700">E</kbd>
          <span className="hidden sm:inline">Interact</span>
        </span>
        <span className="text-slate-600">•</span>

        {/* Rover / Astronaut Switcher */}
        <button
          onClick={() => {
            soundEffects.playClick();
            setControlMode(controlMode === 'astronaut' ? 'rover' : 'astronaut');
          }}
          className={`px-2 py-0.5 rounded-lg border font-bold transition flex items-center space-x-1 ${
            controlMode === 'rover'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
          }`}
        >
          <span>{controlMode === 'rover' ? '🚜 Rover' : '🧑‍🚀 Astronaut'}</span>
        </button>
      </footer>

      {/* Settings Modal */}
      <GameSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetCamera={() => onSetCameraMode('overview')}
      />
    </div>
  );
};
