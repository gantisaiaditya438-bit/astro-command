import React, { useState } from 'react';
import { useGame, GameView } from '../context/GameContext';
import {
  Rocket,
  BookOpen,
  Database,
  Volume2,
  VolumeX,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Clock,
  ShieldAlert,
  Orbit,
  Moon,
  LayoutDashboard,
  Trophy,
  ArrowRightLeft,
  Radio,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Camera
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const Navbar: React.FC = () => {
  const {
    view,
    setView,
    scenario,
    currentSol,
    currentHour,
    simSpeed,
    setSimSpeed,
    advanceOneHour,
    resetMission,
    activeSolarStorm,
    sciencePoints,
    isMuted,
    toggleMute,
    astronautRank
  } = useGame();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (targetView: GameView) => {
    soundEffects.playClick();
    setView(targetView);
    setMobileMenuOpen(false);
  };

  const isSimActive =
    view === 'dashboard' ||
    view === 'outpost_3d' ||
    view === 'explore_moon' ||
    view === 'explore_mars';

  const navItems: Array<{ view: GameView; label: string; icon: any; highlight?: boolean }> = [
    { view: 'solar_system', label: 'Solar System', icon: Orbit, highlight: true },
    { view: 'explore_moon', label: 'The Moon', icon: Moon },
    { view: 'explore_mars', label: 'Mars Base', icon: Rocket },
    { view: 'science_experiments', label: 'Science Lab', icon: Sparkles },
    { view: 'nasa_photos', label: 'NASA Photos', icon: Camera, highlight: true },
    { view: 'nasa_data', label: 'NASA Data Center', icon: Database },
    { view: 'planet_discovery', label: 'Discovery', icon: Radio },
    { view: 'space_survival', label: 'Survival Matrix', icon: ArrowRightLeft },
    { view: 'dashboard', label: 'Mission Control', icon: LayoutDashboard },
    { view: 'learning_center', label: 'Learning Lab', icon: BookOpen },
    { view: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b19]/95 backdrop-blur-md border-b border-cyan-900/40 px-3 sm:px-4 py-2 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Brand & Mission Badge */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div
            onClick={() => handleNav('welcome')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-400/40">
              <Rocket className="w-4 h-4 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-200 to-indigo-300 font-display text-sm sm:text-base">
                  ASTRO COMMAND
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-900/60 text-cyan-300 border border-cyan-700/50 uppercase tracking-widest font-mono">
                  SOLAR 3D
                </span>
              </div>
              <p className="text-[10px] text-amber-400 font-mono hidden sm:block truncate max-w-[140px]">
                {astronautRank.title}
              </p>
            </div>
          </div>

          {activeSolarStorm && (
            <div className="hidden xl:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 text-[11px] font-mono animate-pulse">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span>DONKI CME ALERT</span>
            </div>
          )}
        </div>

        {/* Center: In-Game Clock & Speed (if active simulation) */}
        {isSimActive && (
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-700/60 text-xs font-mono shadow-inner">
            <div className="flex items-center space-x-1 text-cyan-300 font-semibold pr-2 border-r border-slate-700">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sol {currentSol}</span>
              <span className="text-amber-400 ml-1">{String(currentHour).padStart(2, '0')}:00</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
                className={`p-1 rounded text-xs transition ${simSpeed === 0 ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
              >
                {simSpeed === 0 ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setSimSpeed(1)}
                className={`px-1.5 py-0.5 rounded font-bold ${simSpeed === 1 ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
              >
                1x
              </button>
              <button
                onClick={() => setSimSpeed(2)}
                className={`px-1.5 py-0.5 rounded font-bold ${simSpeed === 2 ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
              >
                2x
              </button>
              <button
                onClick={() => advanceOneHour()}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600"
              >
                +1h
              </button>
            </div>

            <div className="pl-2 border-l border-slate-700 text-emerald-400 font-bold">
              {sciencePoints} pts
            </div>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = view === item.view || (item.view === 'explore_moon' && view === 'outpost_3d');
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition flex items-center space-x-1 border ${isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-md shadow-cyan-500/10 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 border-transparent hover:border-slate-700'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Utility Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => handleNav('nasa_data')}
            title="NASA Verified Open Datasets"
            className={`p-1.5 rounded-xl border text-xs font-mono transition hidden sm:flex items-center space-x-1 ${view === 'nasa_data'
              ? 'bg-blue-600/30 text-blue-300 border-blue-500/60'
              : 'text-slate-400 hover:text-white border-slate-700/60 hover:bg-slate-800'
              }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xl:inline">NASA Data</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-xl text-slate-300 hover:bg-slate-800 transition border border-slate-700/60"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Reset / Select Mission */}
          <button
            onClick={resetMission}
            title="Mission Select"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition border border-slate-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl text-slate-300 hover:bg-slate-800 transition border border-slate-700/60"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-800 mt-2 grid grid-cols-2 gap-1.5 animate-fadeIn font-mono text-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = view === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={`p-2 rounded-xl text-left transition flex items-center space-x-1.5 ${isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/60'
                  : 'bg-slate-900/70 text-slate-300 border border-slate-800'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
