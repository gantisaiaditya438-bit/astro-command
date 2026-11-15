import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Sliders,
  Zap,
  Wind,
  FlaskConical,
  Shield,
  Sprout,
  Radio,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface SystemsControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemsControlModal: React.FC<SystemsControlModalProps> = ({ isOpen, onClose }) => {
  const { subsystems, updateSubsystems } = useGame();

  if (!isOpen) return null;

  const totalPower =
    subsystems.lifeSupportPower +
    subsystems.scienceLabPower +
    subsystems.radiationShieldPower +
    subsystems.greenhousePower +
    subsystems.commsArrayPower;

  const isOverdrawn = totalPower > 100;

  const handleSliderChange = (subsystem: keyof typeof subsystems, value: number) => {
    updateSubsystems({ [subsystem]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b1021] border border-cyan-500/50 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 md:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono tracking-wide text-cyan-300">
                Habitat Systems & Power Grid Routing
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Balance electrical distribution across vital outpost infrastructure
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Power Budget Bar */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
            <span className="flex items-center text-slate-300 font-semibold">
              <Zap className="w-4 h-4 text-amber-400 mr-1" />
              Total Grid Power Draw
            </span>
            <span
              className={`font-bold text-sm ${
                isOverdrawn ? 'text-red-400 animate-pulse' : totalPower > 85 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {totalPower}% / 100% Max Solar Output
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverdrawn
                  ? 'bg-red-500 animate-pulse'
                  : totalPower > 85
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, totalPower)}%` }}
            />
          </div>

          {isOverdrawn && (
            <p className="mt-2 text-xs text-red-300 font-mono flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-400" />
              Warning: Overdrawing batteries! Electrical storage will drain during lunar nighttime.
            </p>
          )}
        </div>

        {/* Subsystem Sliders */}
        <div className="space-y-4 mb-6">
          {/* Life Support */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs font-mono">
              <span className="flex items-center font-bold text-cyan-300">
                <Wind className="w-4 h-4 mr-1.5 text-cyan-400" />
                ECLSS Life Support (Oxygen & Heaters)
              </span>
              <span className="text-cyan-400 font-bold">{subsystems.lifeSupportPower}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Maintains habitat atmospheric pressure, CO2 scrubbers, and thermal heating loops.
            </p>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={subsystems.lifeSupportPower}
              onChange={e => handleSliderChange('lifeSupportPower', Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Radiation Shield */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs font-mono">
              <span className="flex items-center font-bold text-purple-300">
                <Shield className="w-4 h-4 mr-1.5 text-purple-400" />
                Active Radiation Deflector Shielding
              </span>
              <span className="text-purple-400 font-bold">{subsystems.radiationShieldPower}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Electromagnetic deflection field that absorbs high-energy cosmic rays and solar storm protons.
            </p>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={subsystems.radiationShieldPower}
              onChange={e => handleSliderChange('radiationShieldPower', Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Science Laboratory */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs font-mono">
              <span className="flex items-center font-bold text-blue-300">
                <FlaskConical className="w-4 h-4 mr-1.5 text-blue-400" />
                Science Laboratory & Regolith Mass Spectrometer
              </span>
              <span className="text-blue-400 font-bold">{subsystems.scienceLabPower}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Powers scientific research instruments to generate mission discovery points.
            </p>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={subsystems.scienceLabPower}
              onChange={e => handleSliderChange('scienceLabPower', Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          {/* Space Greenhouse */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs font-mono">
              <span className="flex items-center font-bold text-emerald-300">
                <Sprout className="w-4 h-4 mr-1.5 text-emerald-400" />
                Hydroponic Greenhouse & LED Grow Arrays
              </span>
              <span className="text-emerald-400 font-bold">{subsystems.greenhousePower}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Produces fresh salad greens, absorbs carbon dioxide, and supplements oxygen levels.
            </p>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={subsystems.greenhousePower}
              onChange={e => handleSliderChange('greenhousePower', Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Comms Array */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs font-mono">
              <span className="flex items-center font-bold text-amber-300">
                <Radio className="w-4 h-4 mr-1.5 text-amber-400" />
                Deep Space Network Earth High-Gain Dish
              </span>
              <span className="text-amber-400 font-bold">{subsystems.commsArrayPower}%</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Maintains continuous telemetry link to NASA Mission Control in Houston.
            </p>
            <input
              type="range"
              min="5"
              max="25"
              step="5"
              value={subsystems.commsArrayPower}
              onChange={e => handleSliderChange('commsArrayPower', Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Operating Modes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Oxygen Scrubber Mode */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold font-mono text-cyan-300 mb-2 flex items-center">
              <Wind className="w-3.5 h-3.5 mr-1.5" />
              Oxygen Generation Mode
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {(['conserve', 'standard', 'boost'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    soundEffects.playOxygenHiss();
                    updateSubsystems({ oxygenMode: mode });
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition capitalize ${
                    subsystems.oxygenMode === mode
                      ? 'bg-cyan-600 text-black shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-2">
              {subsystems.oxygenMode === 'boost' && 'Boost: +50% O2 production, drains extra power.'}
              {subsystems.oxygenMode === 'standard' && 'Standard: Nominal ECLSS electrochemical balance.'}
              {subsystems.oxygenMode === 'conserve' && 'Conserve: Low power, reduced O2 generation.'}
            </p>
          </div>

          {/* Water Recovery Mode */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold font-mono text-blue-300 mb-2 flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Water Recovery Processor
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {(['standard', 'high_recovery'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    soundEffects.playClick();
                    updateSubsystems({ waterRecyclerMode: mode });
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition ${
                    subsystems.waterRecyclerMode === mode
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mode === 'high_recovery' ? '98% High Recovery' : 'Standard Loop'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-2">
              {subsystems.waterRecyclerMode === 'high_recovery'
                ? 'NASA ISS standard: Uses catalytic oxidation to recycle 98% of graywater.'
                : 'Standard Loop: Low energy consumption, moderate water loss.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              soundEffects.playSuccess();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono text-xs transition shadow-lg shadow-cyan-500/20"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Apply Power Distribution</span>
          </button>
        </div>
      </div>
    </div>
  );
};

