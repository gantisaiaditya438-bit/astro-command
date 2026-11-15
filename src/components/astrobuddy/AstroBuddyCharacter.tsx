import React, { useEffect, useState } from 'react';

export type AstroBuddyMood = 'idle' | 'talking' | 'thinking' | 'celebrating' | 'warning';

interface AstroBuddyCharacterProps {
  mood?: AstroBuddyMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const AstroBuddyCharacter: React.FC<AstroBuddyCharacterProps> = ({
  mood = 'idle',
  size = 'md',
  className = '',
  onClick
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural blinking interval every 3-5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-14 h-16',
    md: 'w-20 h-24',
    lg: 'w-28 h-32'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative select-none flex items-center justify-center cursor-pointer group ${sizeClasses} ${className}`}
    >
      {/* Floating Levitation Hover Animation */}
      <div
        className={`w-full h-full flex flex-col items-center justify-center transition-transform ${
          mood === 'celebrating'
            ? 'animate-bounce'
            : mood === 'warning'
            ? 'animate-pulse'
            : 'animate-float'
        }`}
      >
        {/* Holographic Aura Glow */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-60 transition-colors ${
            mood === 'warning'
              ? 'bg-amber-500/40'
              : mood === 'celebrating'
              ? 'bg-purple-500/50'
              : mood === 'thinking'
              ? 'bg-indigo-500/40'
              : 'bg-cyan-500/40'
          }`}
        />

        {/* --- Top Antenna with Blinking Signal Beacon --- */}
        <div className="flex flex-col items-center -mb-0.5 z-10">
          <div
            className={`w-2 h-2 rounded-full border border-white shadow-md transition-colors ${
              mood === 'thinking'
                ? 'bg-amber-400 animate-ping'
                : mood === 'warning'
                ? 'bg-red-500 animate-ping'
                : 'bg-cyan-400 animate-pulse'
            }`}
          />
          <div className="w-0.5 h-2 bg-slate-400" />
        </div>

        {/* --- Robot Head / Helmet --- */}
        <div className="relative w-14 h-11 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 rounded-[18px] border-2 border-white shadow-xl flex items-center justify-center overflow-hidden z-10">
          {/* Side Headset Ear Modules */}
          <div className="absolute -left-1 w-2 h-4 rounded-full bg-cyan-600 border border-cyan-300" />
          <div className="absolute -right-1 w-2 h-4 rounded-full bg-cyan-600 border border-cyan-300" />

          {/* Glossy Curved Visor Screen */}
          <div className="w-11 h-8 rounded-xl bg-slate-950 border border-cyan-500/60 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Visor Glare Reflection */}
            <div className="absolute top-0.5 left-1 w-8 h-2 bg-white/20 rounded-full rotate-[-12deg] pointer-events-none" />

            {/* Expressive Digital LED Eyes */}
            <div className="flex items-center space-x-2.5 z-10">
              {mood === 'celebrating' ? (
                // Star Eyes (⭐ ⭐)
                <>
                  <span className="text-yellow-300 text-[10px] leading-none animate-spin">★</span>
                  <span className="text-yellow-300 text-[10px] leading-none animate-spin">★</span>
                </>
              ) : mood === 'thinking' ? (
                // Thinking Eyes (Looking up-right)
                <>
                  <div className="w-2.5 h-1.5 bg-cyan-300 rounded-full -translate-y-1 translate-x-0.5 shadow-sm shadow-cyan-400" />
                  <div className="w-2.5 h-1.5 bg-cyan-300 rounded-full -translate-y-1 translate-x-0.5 shadow-sm shadow-cyan-400" />
                </>
              ) : mood === 'warning' ? (
                // Warning Eyes (Amber Triangles)
                <>
                  <div className="w-2 h-2 bg-amber-400 rotate-45 animate-pulse" />
                  <div className="w-2 h-2 bg-amber-400 rotate-45 animate-pulse" />
                </>
              ) : isBlinking ? (
                // Blinking Eyes (Closed slits)
                <>
                  <div className="w-2.5 h-0.5 bg-cyan-300 rounded-full" />
                  <div className="w-2.5 h-0.5 bg-cyan-300 rounded-full" />
                </>
              ) : (
                // Happy Open Eyes
                <>
                  <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8] transition-transform group-hover:scale-110" />
                  <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8] transition-transform group-hover:scale-110" />
                </>
              )}
            </div>

            {/* Voice Visualizer Mouth Wave (when talking) */}
            {mood === 'talking' && (
              <div className="flex items-center space-x-0.5 mt-1">
                <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-0.5 h-2.5 bg-cyan-300 rounded-full animate-bounce delay-75" />
                <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150" />
              </div>
            )}
          </div>
        </div>

        {/* --- Robotic Torso with Chest Badge --- */}
        <div className="w-10 h-7 -mt-1 bg-gradient-to-b from-slate-200 to-slate-400 rounded-b-xl border border-slate-300 shadow-md flex flex-col items-center justify-between p-1 z-10">
          <div className="w-4 h-1.5 rounded-full bg-cyan-600/80 border border-cyan-400 flex items-center justify-center">
            <span className="text-[6px] font-mono font-bold text-white leading-none">NASA</span>
          </div>

          {/* Cute Little Robot Arms */}
          <div className="w-full flex justify-between px-0.5">
            <div className={`w-1.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 ${mood === 'talking' || mood === 'celebrating' ? 'rotate-45 -translate-y-1' : ''}`} />
            <div className={`w-1.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 ${mood === 'celebrating' ? '-rotate-45 -translate-y-1' : ''}`} />
          </div>
        </div>

        {/* --- Micro Ion Thruster Flame Glow --- */}
        <div className="w-3 h-2 -mt-0.5 bg-gradient-to-b from-cyan-400 via-sky-500 to-transparent rounded-b-full blur-[1px] animate-pulse" />
      </div>
    </div>
  );
};
