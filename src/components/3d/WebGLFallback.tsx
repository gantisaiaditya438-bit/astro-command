import React from 'react';
import { OutpostCanvas } from '../OutpostCanvas';
import { AlertCircle } from 'lucide-react';

export const WebGLFallback: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-200">
      <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-xs flex items-center space-x-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>3D WebGL Acceleration Unavailable – Seamless 2D Tactical Simulation Active</span>
      </div>
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <OutpostCanvas />
      </div>
    </div>
  );
};

