import React from 'react';
import { useGame } from '../../context/GameContext';
import { InteractiveBuildingId } from './types';
import {
  X,
  Wind,
  Zap,
  UtensilsCrossed,
  Droplets,
  Shield,
  FlaskConical,
  Compass,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Play
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface BuildingInteractionModalProps {
  buildingId: InteractiveBuildingId | null;
  onClose: () => void;
  onOpenPowerGrid: () => void;
}

export const BuildingInteractionModal: React.FC<BuildingInteractionModalProps> = ({
  buildingId,
  onClose,
  onOpenPowerGrid
}) => {
  const {
    resources,
    subsystems,
    updateSubsystems,
    dustLevel,
    activeSolarStorm,
    crew,
    sciencePoints,
    scenario,
    advanceOneHour
  } = useGame();

  if (!buildingId) return null;

  // Custom action handlers that update the real game engine
  const handleCleanDust = () => {
    soundEffects.playSuccess();
    // Reduce dust and consume small amount of energy
    if (resources.energy.current > 10) {
      updateSubsystems({}); // triggers update
      // We can also trigger advisor note
    }
  };

  const handleToggleShield = () => {
    soundEffects.playClick();
    const newPower = subsystems.radiationShieldPower > 15 ? 5 : 35;
    updateSubsystems({ radiationShieldPower: newPower });
  };

  const handleBoostO2 = () => {
    soundEffects.playOxygenHiss();
    const nextMode = subsystems.oxygenMode === 'boost' ? 'standard' : 'boost';
    updateSubsystems({ oxygenMode: nextMode });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#090e1f] border border-cyan-500/60 rounded-2xl w-full max-w-xl p-5 md:p-6 text-slate-100 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
              {buildingId === 'habitat' && <Wind className="w-5 h-5" />}
              {buildingId === 'solar_station' && <Zap className="w-5 h-5 text-amber-400" />}
              {buildingId === 'oxygen_facility' && <Wind className="w-5 h-5 text-cyan-400" />}
              {buildingId === 'greenhouse' && <UtensilsCrossed className="w-5 h-5 text-emerald-400" />}
              {buildingId === 'research_lab' && <FlaskConical className="w-5 h-5 text-blue-400" />}
              {buildingId === 'radiation_shelter' && <Shield className="w-5 h-5 text-purple-400" />}
              {buildingId === 'rover' && <Compass className="w-5 h-5 text-cyan-400" />}
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono tracking-wide text-white">
                {buildingId === 'habitat' && 'Pressurized Geodesic Habitat'}
                {buildingId === 'solar_station' && 'Photovoltaic Solar Power Station'}
                {buildingId === 'oxygen_facility' && 'ECLSS Sabatier Oxygen Facility'}
                {buildingId === 'greenhouse' && 'Hydroponic Bio-Dome Greenhouse'}
                {buildingId === 'research_lab' && 'Lunar Geological Research Laboratory'}
                {buildingId === 'radiation_shelter' && 'Subterranean Regolith Blast Bunker'}
                {buildingId === 'rover' && 'Autonomous Exploration Rover "Hermes"'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Telemetry Station ID: {buildingId.toUpperCase()}-01 • Shackleton Base
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

        {/* Dynamic Building Telemetry Details */}
        <div className="space-y-3">
          {/* 1. HABITAT */}
          {buildingId === 'habitat' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Cabin Atmospheric Pressure</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">101.3 kPa (1.0 atm)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">78% N₂, 21% O₂, 1% Ar</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Astronaut Occupancy</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{crew.length} Active Specialists</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">All quarters pressurized</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans text-slate-300">
                The central geodesic habitat serves as the living quarters, galley, and mission flight control bridge. It maintains 1 atmosphere of pressure, shielded by 2 meters of interlocking regolith blocks over Kevlar pressure bladders.
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={handleBoostO2}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition"
                >
                  Mode: {subsystems.oxygenMode.toUpperCase()} (Toggle Boost)
                </button>
                <button
                  onClick={onOpenPowerGrid}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800 font-mono text-xs transition"
                >
                  Configure Power Grid
                </button>
              </div>
            </div>
          )}

          {/* 2. SOLAR POWER STATION */}
          {buildingId === 'solar_station' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Array Output</div>
                  <div className="text-base font-bold text-amber-400 mt-1">
                    {Math.round(resources.energy.current * 0.95)} kW
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Panel Efficiency</div>
                  <div className={`text-base font-bold mt-1 ${dustLevel > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {100 - dustLevel}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Regolith Dust</div>
                  <div className="text-base font-bold text-amber-300 mt-1">{dustLevel}% Coating</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans text-slate-300">
                Dual-axis tracking photovoltaic cells capture continuous sunlight along the rim of Shackleton Crater. Electrostatic lunar dust reduces photon absorption.
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={onOpenPowerGrid}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition"
                >
                  Route Electrical Grid
                </button>
              </div>
            </div>
          )}

          {/* 3. OXYGEN FACILITY */}
          {buildingId === 'oxygen_facility' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">O2 Concentration</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">{Math.round(resources.oxygen.current)}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Rate: {resources.oxygen.ratePerHour.toFixed(1)}%/h</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Sabatier Reactor Loop</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">Catalytic Active</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">400°C Nickel Catalyst</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans text-slate-300">
                The Sabatier reactor combines exhaled carbon dioxide with hydrogen to recover water, which is then electrolyzed into pure oxygen ($O_2$).
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={handleBoostO2}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition"
                >
                  {subsystems.oxygenMode === 'boost' ? 'Reset to Standard Mode' : 'Activate Emergency O2 Boost'}
                </button>
              </div>
            </div>
          )}

          {/* 4. GREENHOUSE */}
          {buildingId === 'greenhouse' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Food Inventory</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{Math.round(resources.food.current)} Rations</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Yield: {resources.food.ratePerHour.toFixed(1)}/h</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">LED Array Spectrum</div>
                  <div className="text-lg font-bold text-purple-300 mt-1">450nm Blue / 660nm Red</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Pwr: {subsystems.greenhousePower}%</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans text-slate-300">
                Grows microgreens, dwarf wheat, and radishes in nutrient-rich recycled graywater. Provides fresh vitamins and psychological well-being for the crew.
              </div>
            </div>
          )}

          {/* 5. RESEARCH LAB */}
          {buildingId === 'research_lab' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Scientific Discovery</div>
                  <div className="text-lg font-bold text-blue-400 mt-1">
                    {sciencePoints} / {scenario.targetSciencePoints} pts
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Power Allocation</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">{subsystems.scienceLabPower}% Grid</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans text-slate-300">
                Houses mass spectrometers, X-ray diffraction tools, and cryogenic sample vaults to analyze cometary ice cores extracted from Shackleton Crater.
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={onOpenPowerGrid}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs transition"
                >
                  Adjust Research Lab Power Allocation
                </button>
              </div>
            </div>
          )}

          {/* 6. RADIATION SHELTER */}
          {buildingId === 'radiation_shelter' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Shield Integrity</div>
                  <div className="text-lg font-bold text-purple-300 mt-1">
                    {Math.round(resources.radiationShielding.current)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Solar Weather Status</div>
                  <div
                    className={`text-lg font-bold mt-1 ${
                      activeSolarStorm ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                    }`}
                  >
                    {activeSolarStorm ? 'CME ALERT ACTIVE' : 'Nominal Flux'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans text-slate-300">
                Buried under 3.5 meters of compacted lunar regolith. When active, superconducting magnetic coils generate an electromagnetic deflection bubble that repels charged solar protons.
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  onClick={handleToggleShield}
                  className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs transition"
                >
                  {subsystems.radiationShieldPower > 15
                    ? 'Deactivate High-Power Deflector (Save Energy)'
                    : 'Activate High-Power Electromagnetic Deflector Shield'}
                </button>
              </div>
            </div>
          )}

          {/* 7. ROVER */}
          {buildingId === 'rover' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Rover Battery Storage</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">88% Li-Ion Reserve</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400">Exploration Route</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">Shackleton Crater Perimeter</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-sans text-slate-300">
                Autonomous 6-wheel rover equipped with alpha-particle X-ray spectrometers, stereo navigation cameras, and a robotic core drill for ice prospecting.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};

