import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { OutpostCanvas } from './OutpostCanvas';
import { ResourcePanel } from './ResourcePanel';
import { CrewPanel } from './CrewPanel';
import { AIAdvisorChat } from './AIAdvisorChat';
import { SystemsControlModal } from './SystemsControlModal';
import { EventModal } from './EventModal';
import { Box, Sparkles, ArrowRight } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const DashboardView: React.FC = () => {
  const { setView } = useGame();
  const [isSystemsModalOpen, setIsSystemsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn">
      {/* 3D Outpost Quick-Switch Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-blue-950/70 to-indigo-950/70 border border-cyan-500/40 rounded-2xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow">
            <Box className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono text-white tracking-wide">
                Interactive 3D Lunar Environment Available
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                Three.js
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Switch to the 3D surface simulation to inspect facilities, astronauts, and rovers in real time.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.playSuccess();
            setView('outpost_3d');
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-xs transition flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Box className="w-4 h-4" />
          <span>ENTER 3D OUTPOST</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Animated Lunar / Mars Outpost Canvas */}
      <OutpostCanvas />

      {/* 2. 5 Primary Resource Gauges & Metrics */}
      <ResourcePanel onOpenSystemsModal={() => setIsSystemsModalOpen(true)} />

      {/* 3. Lower Control Grid: Crew Manifest (Left) + AI CAPCOM Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-4">
          <CrewPanel />
        </div>

        <div className="lg:col-span-5">
          <AIAdvisorChat />
        </div>
      </div>

      {/* Modals */}
      <SystemsControlModal
        isOpen={isSystemsModalOpen}
        onClose={() => setIsSystemsModalOpen(false)}
      />

      <EventModal />
    </div>
  );
};
