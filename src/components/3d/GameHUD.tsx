import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { CameraMode, InteractiveBuildingId } from './types';
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
  Eye,
  Sliders,
  RotateCcw,
  Bot,
  Users,
  Database,
  FastForward,
  Play,
  Pause,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface GameHUDProps {
  cameraMode: CameraMode;
  onSetCameraMode: (mode: CameraMode) => void;
  onSelectBuilding: (id: InteractiveBuildingId | null) => void;
  onOpenPowerGrid: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  cameraMode,
  onSetCameraMode,
  onSelectBuilding,
  onOpenPowerGrid
}) => {
  const {
    scenario,
    currentSol,
    currentHour,
    simSpeed,
    setSimSpeed,
    advanceOneHour,
    resources,
    dustLevel,
    activeSolarStorm,
    crew,
    sciencePoints,
    advisorMessages,
    setView,
    isMuted,
    toggleMute
  } = useGame();

  const [advisorExpanded, setAdvisorExpanded] = useState(false);
  const [quickNavOpen, setQuickNavOpen] = useState(false);

  const latestAdvisorMsg = advisorMessages[advisorMessages.length - 1];

  const handleCameraChange = (mode: CameraMode) => {
    soundEffects.playClick();
    onSelectBuilding(null);
    onSetCameraMode(mode);
  };

  const getMeterColor = (val: number, danger: number) => {
    if (val <= danger) return 'from-red-600 to-rose-500 text-red-400 border-red-500/50 bg-red-950/40';
    if (val <= danger * 1.5) return 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/50 bg-amber-950/40';
    return 'from-cyan-500 to-blue-500 text-cyan-400 border-cyan-500/30 bg-slate-900/60';
  };

  const buildingQuickList: Array<{ id: InteractiveBuildingId; label: string; icon: string }> = [
    { id: 'habitat', label: 'Habitat Dome', icon: '🏠' },
    { id: 'solar_station', label: 'PV Solar Array', icon: '⚡' },
    { id: 'oxygen_facility', label: 'Oxygen Facility', icon: '💨' },
    { id: 'greenhouse', label: 'Greenhouse', icon: '🌱' },
    { id: 'research_lab', label: 'Research Lab', icon: '🔬' },
    { id: 'radiation_shelter', label: 'Blast Shelter', icon: '🛡️' },
    { id: 'rover', label: 'Rover Hermes', icon: '🚜' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-4 z-20">
      {/* 1. TOP HUD */}
      <header className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Branding & Mission Sol */}
        <div className="flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-cyan-500/40 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow shadow-cyan-500/30">
            <Rocket className="w-4 h-4 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold font-mono text-cyan-300 text-sm tracking-wide">
                ASTRO COMMAND 3D
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-700 font-mono font-bold">
                SIM
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 flex items-center space-x-1.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span className="font-bold text-white">Sol {currentSol}</span>
              <span className="text-slate-500">/ {scenario.durationSols}</span>
              <span className="text-amber-400 font-bold ml-1">
                {String(currentHour).padStart(2, '0')}:00
              </span>
            </div>
          </div>
        </div>

        {/* Center: Solar Storm Banner if active */}
        {activeSolarStorm && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono animate-bounce shadow-2xl">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-bold">DONKI ALERT: CLASS X CME INCOMING</span>
          </div>
        )}

        {/* Right: Camera Mode Switcher & Dashboard Return */}
        <div className="flex items-center space-x-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          {/* Camera Modes */}
          <div className="flex items-center space-x-1 pr-1.5 border-r border-slate-800">
            <button
              onClick={() => handleCameraChange('overview')}
              title="Overview Mode (High Angle)"
              className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition flex items-center space-x-1 ${
                cameraMode === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Overview</span>
            </button>

            <button
              onClick={() => handleCameraChange('exploration')}
              title="Exploration Mode (Surface Level)"
              className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition flex items-center space-x-1 ${
                cameraMode === 'exploration'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Explore</span>
            </button>

            <button
              onClick={() => handleCameraChange('emergency')}
              title="Emergency Mode (Focus Facility)"
              className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition flex items-center space-x-1 ${
                cameraMode === 'emergency'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Emergency</span>
            </button>
          </div>

          {/* NASA Data Link */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setView('nasa_data');
            }}
            title="NASA Verified Open Data Repository"
            className="px-2 py-1 rounded-lg text-xs font-mono text-blue-300 hover:bg-slate-800 transition flex items-center space-x-1"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">NASA Data</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={toggleMute}
            className="p-1 rounded-lg text-slate-300 hover:bg-slate-800 transition"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Toggle 2D Mission Control Dashboard */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setView('dashboard');
            }}
            className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-medium transition flex items-center space-x-1"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>2D Dashboard</span>
          </button>
        </div>
      </header>

      {/* 2. MIDDLE VIEWPORT (Left Resources + Right Intelligence) */}
      <div className="flex justify-between items-start my-auto w-full gap-3 overflow-hidden pointer-events-none">
        {/* Left: 5 Resource Gauges */}
        <div className="w-48 sm:w-56 space-y-2 pointer-events-auto">
          {[
            {
              key: 'oxygen',
              name: 'Oxygen (O₂)',
              val: resources.oxygen.current,
              unit: '%',
              danger: resources.oxygen.dangerThreshold,
              icon: Wind,
              rate: resources.oxygen.ratePerHour
            },
            {
              key: 'energy',
              name: 'Energy Grid',
              val: resources.energy.current,
              unit: 'kWh',
              danger: resources.energy.dangerThreshold,
              icon: Zap,
              rate: resources.energy.ratePerHour
            },
            {
              key: 'food',
              name: 'Food Rations',
              val: resources.food.current,
              unit: 'R',
              danger: resources.food.dangerThreshold,
              icon: UtensilsCrossed,
              rate: resources.food.ratePerHour
            },
            {
              key: 'water',
              name: 'Water (H₂O)',
              val: resources.water.current,
              unit: 'L',
              danger: resources.water.dangerThreshold,
              icon: Droplets,
              rate: resources.water.ratePerHour
            },
            {
              key: 'radiationShielding',
              name: 'Shielding',
              val: resources.radiationShielding.current,
              unit: '%',
              danger: resources.radiationShielding.dangerThreshold,
              icon: Shield,
              rate: resources.radiationShielding.ratePerHour
            }
          ].map(res => {
            const Icon = res.icon;
            const isDanger = res.val <= res.danger;
            return (
              <div
                key={res.key}
                className={`p-2 rounded-xl border backdrop-blur-md shadow-lg transition ${getMeterColor(
                  res.val,
                  res.danger
                )}`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="flex items-center font-bold text-slate-200 truncate">
                    <Icon className="w-3 h-3 mr-1 text-cyan-400 shrink-0" />
                    {res.name}
                  </span>
                  <span className="font-extrabold text-white">
                    {Math.round(res.val)}
                    <span className="text-[9px] text-slate-400 ml-0.5">{res.unit}</span>
                  </span>
                </div>
                {/* Meter bar */}
                <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDanger
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                    }`}
                    style={{ width: `${Math.max(4, Math.min(100, res.val))}%` }}
                  />
                </div>
              </div>
            );
          })}

          <button
            onClick={onOpenPowerGrid}
            className="w-full py-1.5 px-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold flex items-center justify-center space-x-1.5 transition shadow"
          >
            <Sliders className="w-3 h-3" />
            <span>Power Grid Router</span>
          </button>
        </div>

        {/* Right: Mission Intelligence & CAPCOM Feed */}
        <div className="w-60 sm:w-72 space-y-2 pointer-events-auto">
          {/* Mission Objective Pill */}
          <div className="p-2.5 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md shadow-lg text-xs font-mono">
            <div className="flex items-center justify-between mb-1 text-slate-400 text-[10px]">
              <span className="font-bold text-cyan-300 uppercase">Primary Directive</span>
              <span className="text-emerald-400 font-bold">{sciencePoints} Science Pts</span>
            </div>
            <p className="text-[11px] text-slate-200 line-clamp-2 font-sans">
              {scenario.briefing.primaryObjective}
            </p>
          </div>

          {/* Astronaut Condition Summary */}
          <div className="p-2.5 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
              <span className="flex items-center text-slate-300 font-bold">
                <Users className="w-3 h-3 text-cyan-400 mr-1" /> Crew Manifest (4)
              </span>
              <span className="text-emerald-400">All Vital</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {crew.map(c => (
                <div
                  key={c.id}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-center"
                  title={`${c.name} - ${Math.round(c.health)}% HP`}
                >
                  <div className="text-base leading-none mb-0.5">{c.avatar}</div>
                  <div className="text-[9px] font-mono text-emerald-400 font-bold">
                    {Math.round(c.health)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI CAPCOM Advisor Drawer */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-800/60 backdrop-blur-md shadow-lg text-xs">
            <div
              onClick={() => setAdvisorExpanded(!advisorExpanded)}
              className="flex items-center justify-between cursor-pointer font-mono text-[11px] text-cyan-300 font-bold"
            >
              <div className="flex items-center space-x-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>CAPCOM Telemetry</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              </div>
              {advisorExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>

            {latestAdvisorMsg && (
              <p className="text-[11px] text-slate-300 font-sans mt-1.5 leading-snug line-clamp-3">
                {latestAdvisorMsg.text}
              </p>
            )}

            {advisorExpanded && (
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1.5 max-h-36 overflow-y-auto">
                {advisorMessages.slice(-4).map(msg => (
                  <div key={msg.id} className="text-[10px] text-slate-300 font-sans p-1.5 rounded bg-slate-900/60">
                    <span className="font-mono text-cyan-400 font-bold">{msg.sender}:</span> {msg.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM PANEL – ACTION BAR */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-auto bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Quick Building Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-1 hidden md:inline">
            Focus:
          </span>
          {buildingQuickList.map(b => (
            <button
              key={b.id}
              onClick={() => {
                soundEffects.playClick();
                onSelectBuilding(b.id);
              }}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono text-slate-200 transition flex items-center space-x-1 shrink-0"
            >
              <span>{b.icon}</span>
              <span className="hidden sm:inline">{b.label}</span>
            </button>
          ))}
        </div>

        {/* Sim Speed & Advance Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
            className={`p-1.5 rounded-lg text-xs transition ${
              simSpeed === 0
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {simSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setSimSpeed(1)}
            className={`px-2 py-1 rounded text-xs font-mono font-bold transition ${
              simSpeed === 1
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1x
          </button>

          <button
            onClick={() => setSimSpeed(2)}
            className={`px-2 py-1 rounded text-xs font-mono font-bold transition ${
              simSpeed === 2
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2x
          </button>

          <button
            onClick={() => setSimSpeed(5)}
            className={`p-1.5 rounded text-xs font-mono font-bold transition flex items-center ${
              simSpeed === 5
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FastForward className="w-3.5 h-3.5 mr-0.5" />
            5x
          </button>

          <button
            onClick={() => advanceOneHour()}
            className="ml-1 px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition shadow"
          >
            +1 Hour
          </button>
        </div>
      </footer>
    </div>
  );
};

