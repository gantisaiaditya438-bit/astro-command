import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { AstroBuddyCharacter, AstroBuddyMood } from './AstroBuddyCharacter';
import { AstroBuddyPanel } from './AstroBuddyPanel';
import { soundEffects } from '../../services/soundEffects';
import { Sparkles, X } from 'lucide-react';

export const AstroBuddyFloatingWidget: React.FC = () => {
  const {
    view,
    resources,
    activeSolarStorm,
    dustLevel
  } = useGame();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);
  const [mood, setMood] = useState<AstroBuddyMood>('idle');

  // Proactive speech bubble alerts based on live game state
  useEffect(() => {
    if (resources.oxygen.current < 25) {
      setSpeechBubbleText('⚠️ CRITICAL: Oxygen below 25%! Return to the habitat dome!');
      setMood('warning');
    } else if (resources.energy.current < 25) {
      setSpeechBubbleText('⚡ WARNING: Low battery reserves! Conserve base power!');
      setMood('warning');
    } else if (activeSolarStorm) {
      setSpeechBubbleText('🛡️ SOLAR STORM! Seek shelter from high-energy protons!');
      setMood('warning');
    } else {
      setSpeechBubbleText(null);
      setMood('idle');
    }

    const timer = setTimeout(() => {
      // Auto-hide non-critical bubbles after 9s to keep screen uncluttered
      if (resources.oxygen.current >= 25 && resources.energy.current >= 25 && !activeSolarStorm) {
        setSpeechBubbleText(null);
      }
    }, 9000);

    return () => clearTimeout(timer);
  }, [view, resources.oxygen.current, resources.energy.current, activeSolarStorm, dustLevel]);

  return (
    <>
      {/* Floating Astro Buddy on Bottom-Right */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto flex items-end space-x-2 select-none">
        {/* Dynamic Speech Bubble */}
        {speechBubbleText && !isPanelOpen && (
          <div
            onClick={() => {
              soundEffects.playBeep();
              setIsPanelOpen(true);
            }}
            className="cursor-pointer max-w-[210px] sm:max-w-[260px] bg-slate-950/95 border border-cyan-400/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md text-slate-100 text-[11px] leading-snug animate-fadeIn relative group"
          >
            {/* Bubble pointer triangle */}
            <div className="absolute right-[-6px] bottom-6 w-3 h-3 bg-slate-950 border-t border-r border-cyan-400 rotate-45" />

            <div className="flex items-start justify-between">
              <span className="font-mono text-[9px] font-bold text-cyan-400 flex items-center space-x-1 uppercase mb-0.5">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-spin" />
                <span>Astro Buddy</span>
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setSpeechBubbleText(null);
                }}
                className="text-slate-500 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <p className="font-sans text-slate-200">{speechBubbleText}</p>
          </div>
        )}

        {/* Floating Robot Character Button */}
        <div
          onClick={() => {
            soundEffects.playBeep();
            setIsPanelOpen(true);
          }}
          className="relative rounded-full p-1 bg-slate-950/80 border-2 border-cyan-400/80 hover:border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:scale-105 active:scale-95 transition backdrop-blur-md cursor-pointer"
          title="Open ASTRO BUDDY AI Companion"
        >
          <AstroBuddyCharacter mood={mood} size="sm" />

          {/* Tiny Notification Dot */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center animate-ping" />
        </div>
      </div>

      {/* Full AI Companion Console Modal */}
      <AstroBuddyPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  );
};
