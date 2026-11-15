import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Heart, ShieldAlert, Activity, ChevronRight, Dna } from 'lucide-react';
import { CrewMember } from '../types';

export const CrewPanel: React.FC = () => {
  const { crew, activeSolarStorm } = useGame();
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);

  const getStatusBadge = (status: CrewMember['status']) => {
    switch (status) {
      case 'in_shelter':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/40">In Storm Bunker</span>;
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-500/50 animate-pulse">Critical</span>;
      case 'fatigued':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/40">Fatigued</span>;
      case 'stable':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-500/40">Stable</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">Optimal</span>;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold font-mono tracking-wide uppercase text-slate-200">
            Astronaut Crew Manifest (4 Active)
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono flex items-center">
          <Dna className="w-3 h-3 text-cyan-400 mr-1" />
          NASA OSDR Bio-Telemetry
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {crew.map(member => (
          <div
            key={member.id}
            onClick={() => setSelectedCrew(member)}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 transition cursor-pointer group shadow relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">{member.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition">
                    {member.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">{member.role}</p>
                </div>
              </div>
              {getStatusBadge(member.status)}
            </div>

            {/* Health Bar */}
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-400 flex items-center">
                  <Heart className="w-3 h-3 text-rose-400 mr-1" /> Health
                </span>
                <span className="font-bold text-slate-200">{Math.round(member.health)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    member.health < 40 ? 'bg-red-500 animate-pulse' : member.health < 75 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${member.health}%` }}
                />
              </div>
            </div>

            {/* Radiation Dose */}
            <div className="flex items-center justify-between text-[10px] font-mono bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
              <span className="text-slate-400 flex items-center">
                <ShieldAlert className="w-3 h-3 text-purple-400 mr-1" /> Rad Dose:
              </span>
              <span className={`font-bold ${member.radiationDose > 25 ? 'text-red-400' : 'text-purple-300'}`}>
                {member.radiationDose.toFixed(1)} mSv
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Crew NASA OSDR Bio-Telemetry Detail Modal */}
      {selectedCrew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0c1224] border border-cyan-500/60 rounded-2xl w-full max-w-md p-5 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-3xl">{selectedCrew.avatar}</span>
                <div>
                  <h3 className="text-base font-bold text-cyan-300 font-mono">{selectedCrew.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedCrew.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrew(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 font-bold mb-1 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1.5" />
                  Specialty Assignment
                </div>
                <p className="text-xs text-slate-300">{selectedCrew.specialty}</p>
              </div>

              {/* NASA OSDR Biomarkers */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/40">
                <div className="text-xs font-mono text-purple-300 font-bold mb-2 flex items-center">
                  <Dna className="w-3.5 h-3.5 mr-1.5" />
                  NASA OSDR Spaceflight Biological Markers
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Bone Density Strain:</span>
                    <span className="text-slate-200">{selectedCrew.osdrBioMetric.boneDensityTrend}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Cardiovascular Shift:</span>
                    <span className="text-slate-200">{selectedCrew.osdrBioMetric.cardioStrain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Immune Readiness:</span>
                    <span className="text-emerald-400">{selectedCrew.osdrBioMetric.immuneReadiness}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono p-2.5 rounded bg-slate-950/60 border border-slate-800">
                NASA Fact: In deep space, cosmic radiation and fractional gravity cause bone loss of up to 1% per month without countermeasure exercise!
              </div>
            </div>

            <button
              onClick={() => setSelectedCrew(null)}
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition"
            >
              Close Bio-Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

