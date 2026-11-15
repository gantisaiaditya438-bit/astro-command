import React from 'react';
import { ScienceSample } from '../../types/solar';
import { Sparkles, Compass, CheckCircle2, Award, X } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface SampleDiscoveryModalProps {
  sample: ScienceSample | null;
  onClose: () => void;
  onCollect: (sample: ScienceSample) => void;
  isAlreadyCollected?: boolean;
}

export const SampleDiscoveryModal: React.FC<SampleDiscoveryModalProps> = ({
  sample,
  onClose,
  onCollect,
  isAlreadyCollected = false
}) => {
  if (!sample) return null;

  const isIce = sample.category === 'life_support';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-950 border-2 border-amber-500/80 rounded-2xl p-6 text-slate-100 shadow-2xl shadow-amber-500/20 overflow-hidden">
        {/* Glow ambient background accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Planetary Geological Discovery</span>
        </div>

        {/* Sample Icon & Title */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border-2 border-amber-500/50 flex items-center justify-center text-3xl shadow-lg shrink-0">
            {isIce ? '🧊' : sample.category === 'astronomy' ? '🪐' : '💎'}
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-mono tracking-tight">
              {sample.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {sample.destination === 'moon' ? 'Moon (Shackleton)' : 'Mars (Jezero)'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 flex items-center space-x-1">
                <Award className="w-3 h-3 text-amber-400" />
                <span>+{sample.scienceValue} Science Pts</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          {sample.description}
        </p>

        {/* NASA Authentic Science Box */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs mb-5">
          <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-cyan-300 mb-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>NASA Planetary Science Note</span>
          </div>
          <p className="text-[11px] text-cyan-100/90 leading-relaxed font-sans">
            {sample.nasaFact}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition"
          >
            Leave in Field
          </button>

          {isAlreadyCollected ? (
            <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cataloged in Museum</span>
            </div>
          ) : (
            <button
              onClick={() => {
                onCollect(sample);
                onClose();
              }}
              className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/30 transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Collect & Catalog (+{sample.scienceValue} pts)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
