import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { soundEffects } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Wrench,
  Package,
  Wind,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { speakAstroBuddy } from '../../services/astroBuddyApi';

export type EmergencyStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface MarsEmergencyMissionProps {
  playerPosition: [number, number, number];
  onSetRepairing: (repairing: boolean) => void;
  onCloseMission: () => void;
}

export const MarsEmergencyMission: React.FC<MarsEmergencyMissionProps> = ({
  playerPosition,
  onSetRepairing,
  onCloseMission
}) => {
  const {
    resources,
    updateSubsystems,
    unlockAchievement,
    setDustLevel,
    isMuted
  } = useGame();

  const [step, setStep] = useState<EmergencyStep>(1);
  const [hasFilterInventory, setHasFilterInventory] = useState(false);
  const [repairProgress, setRepairProgress] = useState(0);
  const [isRepairingActive, setIsRepairingActive] = useState(false);
  const [showDebriefModal, setShowDebriefModal] = useState(false);

  // Locations of mission points
  const moxiePos = [-22, 0, 8];
  const supplyPodPos = [14, 0, 24];
  const habitatPos = [0, 0, 0];

  // Distances to points
  const distToMoxie = Math.sqrt(
    Math.pow(playerPosition[0] - moxiePos[0], 2) +
    Math.pow(playerPosition[2] - moxiePos[2], 2)
  );
  const distToSupply = Math.sqrt(
    Math.pow(playerPosition[0] - supplyPodPos[0], 2) +
    Math.pow(playerPosition[2] - supplyPodPos[2], 2)
  );
  const distToHabitat = Math.sqrt(
    Math.pow(playerPosition[0] - habitatPos[0], 2) +
    Math.pow(playerPosition[2] - habitatPos[2], 2)
  );

  // Step 2 & 3: Oxygen drains to simulate emergency
  useEffect(() => {
    if (step >= 2 && step <= 5) {
      const interval = setInterval(() => {
        // Drain O2 slightly to create realistic pressure
        if (resources.oxygen.current > 20) {
          resources.oxygen.current -= 0.25;
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resources]);

  // Step 6: Animated repair sequence
  const startRepairSequence = () => {
    soundEffects.playBeep();
    setIsRepairingActive(true);
    onSetRepairing(true);

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setRepairProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsRepairingActive(false);
        onSetRepairing(false);
        soundEffects.playSuccess();

        // Restore Oxygen production
        resources.oxygen.current = 96;

        // Transition to Step 7 (Dust storm emergency!)
        setStep(7);
        setDustLevel(85); // Triggers visual dust storm
        soundEffects.playAlert();
        speakAstroBuddy('Warning, Commander! A high-speed regional dust storm has been detected approaching Jezero Crater! Return to the habitat airlock immediately!');
      }
    }, 300);
  };

  // Step 7: Enter Habitat airlock
  const handleEnterAirlock = () => {
    soundEffects.playSuccess();
    setStep(8);
    setShowDebriefModal(true);
    unlockAchievement('badge-mars-emergency-savior');
    confetti({ particleCount: 100, spread: 70 });
    speakAstroBuddy('Spectacular work, Commander! You restored oxygen production and secured the habitat before the dust storm hit!');
  };

  return (
    <>
      {/* --- HUD Mission Task Box (Cleanly docked on upper right) --- */}
      <div className="absolute top-16 right-4 sm:right-6 z-30 pointer-events-auto max-w-md w-[92%] sm:w-96">
        <div className="bg-slate-950/90 border-2 border-red-500/80 rounded-2xl p-3 shadow-2xl backdrop-blur-xl text-slate-100 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-black text-red-400 uppercase tracking-wider">
                MISSION: MARS EMERGENCY (STEP {step} OF 8)
              </span>
            </div>
            {hasFilterInventory && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center space-x-1">
                <Package className="w-3 h-3" />
                <span>Filter Tube [In Inventory]</span>
              </span>
            )}
          </div>

          {/* Current Step Directive */}
          <div className="text-xs space-y-1">
            {step === 1 && (
              <div className="space-y-2">
                <p className="font-bold text-white">Touchdown Confirmed at Jezero Crater!</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Welcome Junior Astronaut! Mission Control reports the base MOXIE oxygen unit has suffered an electrolysis fault. Step out of the landing zone and locate the facility!
                </p>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setStep(2);
                    speakAstroBuddy('Follow your waypoint marker to locate the damaged MOXIE facility!');
                  }}
                  className="w-full py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs transition"
                >
                  Begin Exploration →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Locate the Damaged Oxygen Plant</p>
                  <p className="text-[11px] text-slate-400">
                    Follow the holographic waypoint marker to the MOXIE station ({Math.round(distToMoxie)}m away).
                  </p>
                </div>
                {distToMoxie < 7 && (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setStep(3);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs animate-bounce"
                  >
                    Inspect [E]
                  </button>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <p className="font-bold text-white">Investigation: Broken Solid Oxide Tube</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  MOXIE splits Martian $CO_2$ at 800°C into oxygen, but the ceramic filter cracked! You must retrieve a spare filter from the Supply Pod ({Math.round(distToSupply)}m away).
                </p>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setStep(4);
                    speakAstroBuddy('Head across the dunes to the supply pod and pick up the replacement filter tube.');
                  }}
                  className="w-full py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs transition flex items-center justify-center space-x-1"
                >
                  <span>Track Supply Pod</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Collect Replacement Filter Tube</p>
                  <p className="text-[11px] text-slate-400">
                    Walk or drive to the glowing Supply Pod crate ({Math.round(distToSupply)}m away).
                  </p>
                </div>
                {distToSupply < 7 && (
                  <button
                    onClick={() => {
                      soundEffects.playSuccess();
                      setHasFilterInventory(true);
                      setStep(5);
                      speakAstroBuddy('Filter collected! Return to the MOXIE generator to install it!');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs animate-bounce"
                  >
                    Collect Filter [E]
                  </button>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Return to MOXIE & Prepare Repair</p>
                  <p className="text-[11px] text-slate-400">
                    Head back to the oxygen unit ({Math.round(distToMoxie)}m away).
                  </p>
                </div>
                {distToMoxie < 7 && (
                  <button
                    onClick={() => {
                      setStep(6);
                      startRepairSequence();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs animate-pulse"
                  >
                    Weld & Repair [E]
                  </button>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-mono text-xs font-bold text-cyan-300">
                  <span className="flex items-center space-x-1">
                    <Wrench className="w-3.5 h-3.5 animate-spin" />
                    <span>Installing & Welding Electrolysis Tube...</span>
                  </span>
                  <span>{repairProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${repairProgress}%` }}
                  />
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                    <Wind className="w-4 h-4 animate-spin text-amber-400" />
                    <span>DUST STORM EMERGENCY!</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Solar power dropping! Run back to the Habitat Dome airlock ({Math.round(distToHabitat)}m away)!
                  </p>
                </div>
                {distToHabitat < 8 && (
                  <button
                    onClick={handleEnterAirlock}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs animate-bounce"
                  >
                    Enter Airlock [E]
                  </button>
                )}
              </div>
            )}

            {step === 8 && (
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mission Accomplished: Crew Saved!</span>
                </span>
                <button
                  onClick={() => setShowDebriefModal(true)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
                >
                  View Debrief
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Step 8: Comprehensive Mission Results Modal --- */}
      {showDebriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none pointer-events-auto">
          <div className="relative w-full max-w-lg bg-slate-950 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>MISSION EVALUATION: SUCCESS</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/50">
                +80 Science Points
              </span>
            </div>

            <div className="flex items-center space-x-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/30 to-amber-500/30 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg shrink-0">
                🚨
              </div>
              <div>
                <h3 className="font-mono font-black text-lg text-white">
                  Mars Emergency Hero
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  You successfully repaired the MOXIE oxygen generation system and sheltered the crew from an impending Martian dust storm!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 font-mono text-cyan-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>NASA Scientific Takeaways:</span>
              </div>
              <p className="text-[11px] text-cyan-100/90 leading-relaxed font-sans">
                1. <strong>MOXIE Technology:</strong> Real NASA rovers on Mars extract pure oxygen ($O_2$) by heating carbon dioxide ($CO_2$) to 800°C across solid oxide ceramic membranes.
              </p>
              <p className="text-[11px] text-cyan-100/90 leading-relaxed font-sans">
                2. <strong>Martian Dust Storms:</strong> Unlike Earth storms, Martian storms are driven by thin air (about 0.01 atm pressure), but the fine electrostatic dust coats solar arrays, blocking up to 99% of sunlight!
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowDebriefModal(false);
                  onCloseMission();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono font-bold text-xs shadow-lg transition"
              >
                Continue Free Exploration →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
