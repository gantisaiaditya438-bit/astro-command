import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Rocket,
  Shield,
  Database,
  Award,
  Sparkles,
  ArrowRight,
  Orbit,
  Moon,
  Radio,
  Trophy
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const WelcomeScreen: React.FC = () => {
  const { setView } = useGame();

  const handleLaunchSolar = () => {
    soundEffects.playSuccess();
    setView('solar_system');
  };

  const handleLaunchMoon = () => {
    soundEffects.playSuccess();
    setView('explore_moon');
  };

  const handleLaunchMars = () => {
    soundEffects.playSuccess();
    setView('explore_mars');
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden text-slate-100">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto text-center space-y-6 relative z-10">
        {/* NASA Junior Astronaut Trainer Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/50 shadow-xl shadow-cyan-500/10 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SOLAR SYSTEM EXPLORATION & PLANETARY SURVIVAL</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400">JUNIOR ASTRONAUT 3D</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-tight text-white leading-none">
            ASTRO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400">
              COMMAND
            </span>
          </h1>
          <p className="text-base sm:text-xl font-mono text-cyan-300 font-semibold tracking-wide">
            3D Solar System Exploration & Space Survival Trainer
          </p>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Become a Junior Astronaut! Explore an interactive 3D solar system, fly to the Moon and Mars, control astronauts and rovers, survive solar storms and dust events, and learn authentic NASA space engineering through gameplay!
          </p>
        </div>

        {/* CTA Launch Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleLaunchSolar}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold font-mono text-sm tracking-wider transition transform hover:scale-105 shadow-2xl shadow-cyan-500/30 flex items-center space-x-2"
          >
            <Orbit className="w-5 h-5 text-black" />
            <span>EXPLORE SOLAR SYSTEM 3D</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleLaunchMoon}
            className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 font-bold font-mono text-xs transition flex items-center space-x-2"
          >
            <Moon className="w-4 h-4 text-cyan-400" />
            <span>LAND ON THE MOON</span>
          </button>

          <button
            onClick={handleLaunchMars}
            className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-red-300 border border-red-500/50 font-bold font-mono text-xs transition flex items-center space-x-2"
          >
            <Rocket className="w-4 h-4 text-red-400" />
            <span>EXPEDITION TO MARS</span>
          </button>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
          <div
            onClick={() => setView('solar_system')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm hover:border-cyan-500/50 transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition">
              <Orbit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white mb-1">Interactive Solar System</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Explore the Sun and 8 planets. Click any world to inspect temperature, gravity, atmosphere, and launch scientific probes!
            </p>
          </div>

          <div
            onClick={() => setView('space_survival')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm hover:border-blue-500/50 transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white mb-1">Planetary Survival Matrix</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Compare human survival challenges side-by-side: "Could humans live here without special equipment?" with authentic NASA data.
            </p>
          </div>

          <div
            onClick={() => setView('achievements')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm hover:border-amber-500/50 transition cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white mb-1">Astronaut Rank & Museum</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Collect lunar and Martian rock samples, advance from Cadet to Solar System Pioneer, and earn 10 achievement badges!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
