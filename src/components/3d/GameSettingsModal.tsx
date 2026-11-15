import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { soundEffects } from '../../services/soundEffects';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Monitor,
  Maximize2,
  RotateCcw,
  Play,
  Pause,
  HelpCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface GameSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetCamera?: () => void;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  onResetCamera
}) => {
  const {
    isMuted,
    toggleMute,
    simSpeed,
    setSimSpeed
  } = useGame();

  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'med' | 'high'>('high');
  const [cameraSensitivity, setCameraSensitivity] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    soundEffects.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleResetCamera = () => {
    soundEffects.playClick();
    if (onResetCamera) onResetCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none pointer-events-auto">
      <div className="relative w-full max-w-md bg-slate-950/95 border-2 border-cyan-500/80 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-sm">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>MISSION SETTINGS & ACCESSIBILITY</span>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Simulation Clock Control (Pause / Resume) */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-white block">Simulation Engine</span>
            <span className="text-[10px] text-slate-400">
              {simSpeed === 0 ? 'Simulation Paused' : `Running at ${simSpeed}x Realtime`}
            </span>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              setSimSpeed(simSpeed === 0 ? 1 : 0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              simSpeed === 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
            }`}
          >
            {simSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{simSpeed === 0 ? 'Resume Play' : 'Pause Sim'}</span>
          </button>
        </div>

        {/* 2. Audio & Sound FX */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-white block">Synthesizer Audio & FX</span>
            <span className="text-[10px] text-slate-400">
              {isMuted ? 'All sounds muted' : 'Web Audio procedures active'}
            </span>
          </div>
          <button
            onClick={() => {
              toggleMute();
              soundEffects.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              isMuted
                ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
        </div>

        {/* 3. Graphics Quality (Optimized for laptops) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>Graphics Fidelity</span>
            <span className="text-cyan-400 uppercase text-[10px]">{graphicsQuality}</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: 'Low (Battery)' },
              { id: 'med', label: 'Medium' },
              { id: 'high', label: 'High (AAA)' }
            ].map(q => (
              <button
                key={q.id}
                onClick={() => {
                  soundEffects.playClick();
                  setGraphicsQuality(q.id as any);
                }}
                className={`py-1.5 rounded-xl text-xs font-mono transition border ${
                  graphicsQuality === q.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Camera Sensitivity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>Camera Rotation Sensitivity</span>
            <span className="text-cyan-400">{cameraSensitivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={cameraSensitivity}
            onChange={e => setCameraSensitivity(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* 5. Utility Buttons (Fullscreen & Reset Camera) */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={toggleFullscreen}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono flex items-center justify-center space-x-1.5 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono flex items-center justify-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Camera</span>
          </button>
        </div>
      </div>
    </div>
  );
};
