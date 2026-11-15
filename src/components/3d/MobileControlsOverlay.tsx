import React from 'react';
import { useGame } from '../../context/GameContext';
import { ControlMode } from '../../types/solar';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface MobileControlsOverlayProps {
  onCollectSample?: () => void;
}

export const MobileControlsOverlay: React.FC<MobileControlsOverlayProps> = ({
  onCollectSample
}) => {
  const { controlMode, setControlMode } = useGame();

  const simulateKey = (code: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    const event = new KeyboardEvent(eventType, { code, bubbles: true });
    window.dispatchEvent(event);
  };

  const handleJump = () => {
    soundEffects.playClick();
    simulateKey('Space', true);
    setTimeout(() => simulateKey('Space', false), 150);
  };

  const handleInteract = () => {
    soundEffects.playSuccess();
    simulateKey('KeyE', true);
    setTimeout(() => simulateKey('KeyE', false), 150);
    if (onCollectSample) {
      onCollectSample();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end p-3 sm:p-5 select-none">
      {/* Desktop Keyboard Controls Legend */}
      <div className="self-center mb-16 hidden lg:flex items-center space-x-3 bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 text-[11px] font-mono text-slate-300 shadow-xl pointer-events-auto">
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">W</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">A</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">S</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">D</kbd>
          <span>Walk</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 font-bold border border-slate-700">SHIFT</kbd>
          <span>Sprint</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center space-x-1">
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">SPACE</kbd>
          <span>Low-G Leap</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-bold border border-slate-700">E</kbd>
          <span>Interact / Repair</span>
        </span>
      </div>

      {/* Touch Screen Virtual Buttons (visible on all screens for accessibility) */}
      <div className="flex justify-between items-end w-full mb-14 pointer-events-auto">
        {/* Left Touch D-Pad */}
        <div className="grid grid-cols-3 gap-1.5 w-32 h-32 p-1.5 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-slate-800 shadow-2xl">
          <div />
          <button
            onPointerDown={() => simulateKey('KeyW', true)}
            onPointerUp={() => simulateKey('KeyW', false)}
            onPointerLeave={() => simulateKey('KeyW', false)}
            className="rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black text-slate-300 flex items-center justify-center border border-slate-700"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          <button
            onPointerDown={() => simulateKey('KeyA', true)}
            onPointerUp={() => simulateKey('KeyA', false)}
            onPointerLeave={() => simulateKey('KeyA', false)}
            className="rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black text-slate-300 flex items-center justify-center border border-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="rounded-xl bg-slate-900/60 flex items-center justify-center text-[10px] font-mono text-slate-500">
            PAD
          </div>
          <button
            onPointerDown={() => simulateKey('KeyD', true)}
            onPointerUp={() => simulateKey('KeyD', false)}
            onPointerLeave={() => simulateKey('KeyD', false)}
            className="rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black text-slate-300 flex items-center justify-center border border-slate-700"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div />
          <button
            onPointerDown={() => simulateKey('KeyS', true)}
            onPointerUp={() => simulateKey('KeyS', false)}
            onPointerLeave={() => simulateKey('KeyS', false)}
            className="rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black text-slate-300 flex items-center justify-center border border-slate-700"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <div />
        </div>

        {/* Right Touch Action Cluster (Jump, Sprint & Interact) */}
        <div className="flex flex-col space-y-2 items-end">
          <button
            onPointerDown={() => simulateKey('ShiftLeft', true)}
            onPointerUp={() => simulateKey('ShiftLeft', false)}
            onPointerLeave={() => simulateKey('ShiftLeft', false)}
            className="w-13 h-11 rounded-2xl bg-purple-600/90 active:bg-purple-400 text-white font-extrabold flex items-center justify-center space-x-1 shadow-lg border border-purple-300 px-3"
          >
            <span className="text-xs">⚡</span>
            <span className="text-[10px] font-mono">SPRINT</span>
          </button>

          <button
            onClick={handleInteract}
            className="w-14 h-14 rounded-2xl bg-amber-500/90 active:bg-amber-400 text-black font-extrabold flex flex-col items-center justify-center shadow-xl shadow-amber-500/25 border-2 border-white"
          >
            <Hand className="w-5 h-5" />
            <span className="text-[9px] font-mono mt-0.5">INTERACT</span>
          </button>

          <button
            onClick={handleJump}
            className="w-14 h-14 rounded-2xl bg-cyan-600/90 active:bg-cyan-400 text-black font-extrabold flex flex-col items-center justify-center shadow-xl shadow-cyan-500/25 border-2 border-white"
          >
            <span className="text-xl">🦘</span>
            <span className="text-[9px] font-mono mt-0.5">LEAP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
