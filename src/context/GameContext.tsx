import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  OutpostResources,
  SubsystemAllocations,
  CrewMember,
  MissionScenario,
  MissionEvent,
  MissionDecisionOption,
  DecisionLogEntry,
  MissionEvaluation
} from '../types';
import { PlanetId, ControlMode, ScienceSample, AchievementBadge } from '../types/solar';
import { MISSION_SCENARIOS, INITIAL_CREW } from '../data/scenarios';
import { evaluateMissionPerformance, generateAdvisorAdvice, AdvisorDialogue } from '../services/aiAdvisor';
import { soundEffects } from '../services/soundEffects';
import { INITIAL_ACHIEVEMENTS, ASTRONAUT_RANKS } from '../data/achievementsData';
import { DISCOVERABLE_SAMPLES } from '../data/planetaryMissions';
import confetti from 'canvas-confetti';

export type GameView =
  | 'welcome'
  | 'solar_system'
  | 'explore_moon'
  | 'explore_mars'
  | 'planet_discovery'
  | 'space_survival'
  | 'science_experiments'
  | 'mission_select'
  | 'mission_briefing'
  | 'dashboard'
  | 'outpost_3d'
  | 'learning_center'
  | 'nasa_data'
  | 'nasa_photos'
  | 'mission_results'
  | 'achievements';

interface GameContextType {
  view: GameView;
  setView: (v: GameView) => void;
  scenario: MissionScenario;
  selectScenario: (sc: MissionScenario) => void;
  startMission: () => void;
  resetMission: () => void;

  // Time & Simulation
  currentSol: number;
  currentHour: number;
  simSpeed: 0 | 1 | 2 | 5;
  setSimSpeed: (speed: 0 | 1 | 2 | 5) => void;
  advanceOneHour: () => void;

  // Resources & Systems
  resources: OutpostResources;
  subsystems: SubsystemAllocations;
  updateSubsystems: (alloc: Partial<SubsystemAllocations>) => void;

  // Crew & Science
  crew: CrewMember[];
  sciencePoints: number;
  dustLevel: number; // 0 to 100% on solar panels
  setDustLevel: (val: number | ((prev: number) => number)) => void;
  activeSolarStorm: boolean;

  // Dynamic Events
  activeEvent: MissionEvent | null;
  dismissEvent: () => void;
  resolveEventOption: (opt: MissionDecisionOption) => void;
  decisionLog: DecisionLogEntry[];

  // Advisor & Debrief
  advisorMessages: AdvisorDialogue[];
  askAdvisorQuestion: (question: string, answer: string) => void;
  missionEvaluation: MissionEvaluation | null;
  isMuted: boolean;
  toggleMute: () => void;

  // Solar System & Planetary Travel
  selectedPlanetId: PlanetId | null;
  setSelectedPlanetId: (id: PlanetId | null) => void;
  isTraveling: boolean;
  travelTarget: PlanetId | null;
  travelTo: (planetId: PlanetId) => void;

  // Player Controls & Interaction
  controlMode: ControlMode;
  setControlMode: (mode: ControlMode) => void;
  collectedSamples: ScienceSample[];
  collectSample: (sample: ScienceSample) => void;
  achievements: AchievementBadge[];
  unlockAchievement: (id: string) => void;
  astronautRank: { minScience: number; title: string; badge: string };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<GameView>('welcome');
  const [scenario, setScenario] = useState<MissionScenario>(MISSION_SCENARIOS[0]);
  const [currentSol, setCurrentSol] = useState<number>(1);
  const [currentHour, setCurrentHour] = useState<number>(8); // Starts at 08:00 AM
  const [simSpeed, setSimSpeed] = useState<0 | 1 | 2 | 5>(1);

  const [crew, setCrew] = useState<CrewMember[]>(INITIAL_CREW);
  const [sciencePoints, setSciencePoints] = useState<number>(0);
  const [dustLevel, setDustLevel] = useState<number>(10);
  const [activeSolarStorm, setActiveSolarStorm] = useState<boolean>(false);

  const [activeEvent, setActiveEvent] = useState<MissionEvent | null>(null);
  const [triggeredEventIds, setTriggeredEventIds] = useState<Set<string>>(new Set());
  const [decisionLog, setDecisionLog] = useState<DecisionLogEntry[]>([]);
  const [missionEvaluation, setMissionEvaluation] = useState<MissionEvaluation | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Solar System State
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId | null>('earth');
  const [isTraveling, setIsTraveling] = useState<boolean>(false);
  const [travelTarget, setTravelTarget] = useState<PlanetId | null>(null);

  // Controls, Discoveries & Achievements
  const [controlMode, setControlMode] = useState<ControlMode>('astronaut');
  const [collectedSamples, setCollectedSamples] = useState<ScienceSample[]>([DISCOVERABLE_SAMPLES[0]]);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENTS);

  // Subsystem allocations
  const [subsystems, setSubsystems] = useState<SubsystemAllocations>({
    lifeSupportPower: 30,
    scienceLabPower: 20,
    radiationShieldPower: 20,
    greenhousePower: 15,
    commsArrayPower: 15,
    oxygenMode: 'standard',
    waterRecyclerMode: 'standard'
  });

  // Resources state
  const [resources, setResources] = useState<OutpostResources>({
    oxygen: {
      current: 95,
      max: 100,
      ratePerHour: 0.1,
      unit: '%',
      dangerThreshold: 30,
      criticalThreshold: 15,
      description: 'Habitat air pressure & breathable O2 concentration.'
    },
    energy: {
      current: 90,
      max: 100,
      ratePerHour: 0.2,
      unit: 'kWh',
      dangerThreshold: 25,
      criticalThreshold: 12,
      description: 'Battery reserves powering all habitat modules & heaters.'
    },
    food: {
      current: 95,
      max: 100,
      ratePerHour: -0.3,
      unit: 'Rations',
      dangerThreshold: 25,
      criticalThreshold: 10,
      description: 'Pre-packaged astronaut rations and fresh hydroponic produce.'
    },
    water: {
      current: 90,
      max: 100,
      ratePerHour: -0.2,
      unit: 'Liters',
      dangerThreshold: 30,
      criticalThreshold: 15,
      description: 'Purified potable water in closed-loop recycling circulation.'
    },
    radiationShielding: {
      current: 85,
      max: 100,
      ratePerHour: 0,
      unit: '% Integrity',
      dangerThreshold: 35,
      criticalThreshold: 20,
      description: 'Electromagnetic deflectors & regolith barrier structural health.'
    }
  });

  const [advisorMessages, setAdvisorMessages] = useState<AdvisorDialogue[]>([
    {
      id: 'welcome-capcom',
      sender: 'CAPCOM-AI',
      text: 'Welcome aboard ASTRO COMMAND! I am CAPCOM-AI, your mission flight advisor. All telemetry systems are calibrated and ready for your commands.',
      type: 'info',
      timestamp: 'Sol 1'
    }
  ]);

  const toggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  const selectScenario = (sc: MissionScenario) => {
    soundEffects.playClick();
    setScenario(sc);
    setView('mission_briefing');
  };

  const startMission = () => {
    soundEffects.playSuccess();
    setCurrentSol(1);
    setCurrentHour(8);
    setSimSpeed(1);
    setSciencePoints(0);
    setDustLevel(10);
    setActiveSolarStorm(false);
    setActiveEvent(null);
    setTriggeredEventIds(new Set());
    setDecisionLog([]);
    setMissionEvaluation(null);

    setResources({
      oxygen: {
        current: scenario.initialResources.oxygen,
        max: 100,
        ratePerHour: 0.1,
        unit: '%',
        dangerThreshold: 30,
        criticalThreshold: 15,
        description: 'Habitat air pressure & breathable O2 concentration.'
      },
      energy: {
        current: scenario.initialResources.energy,
        max: 100,
        ratePerHour: 0.2,
        unit: 'kWh',
        dangerThreshold: 25,
        criticalThreshold: 12,
        description: 'Battery reserves powering all habitat modules & heaters.'
      },
      food: {
        current: scenario.initialResources.food,
        max: 100,
        ratePerHour: -0.3,
        unit: 'Rations',
        dangerThreshold: 25,
        criticalThreshold: 10,
        description: 'Pre-packaged astronaut rations and fresh hydroponic produce.'
      },
      water: {
        current: scenario.initialResources.water,
        max: 100,
        ratePerHour: -0.2,
        unit: 'Liters',
        dangerThreshold: 30,
        criticalThreshold: 15,
        description: 'Purified potable water in closed-loop recycling circulation.'
      },
      radiationShielding: {
        current: scenario.initialResources.radiationShielding,
        max: 100,
        ratePerHour: 0,
        unit: '% Integrity',
        dangerThreshold: 35,
        criticalThreshold: 20,
        description: 'Electromagnetic deflectors & regolith barrier structural health.'
      }
    });

    setCrew(INITIAL_CREW.map(c => ({ ...c, health: 98, morale: 95, radiationDose: 3.5, status: 'optimal' })));

    setAdvisorMessages([
      {
        id: `start-${Date.now()}`,
        sender: 'CAPCOM-AI',
        text: `Mission initialized: ${scenario.title}. Monitor your power grid and life support levels closely.`,
        type: 'info',
        timestamp: 'Sol 1, 08:00'
      }
    ]);

    // If scenario is Mars, open Mars view, else Lunar 3D view
    if (scenario.outpostType === 'mars') {
      setView('explore_mars');
    } else {
      setView('explore_moon');
    }
  };

  const resetMission = () => {
    soundEffects.playClick();
    setSimSpeed(0);
    setView('mission_select');
  };

  const updateSubsystems = (alloc: Partial<SubsystemAllocations>) => {
    soundEffects.playClick();
    setSubsystems(prev => ({ ...prev, ...alloc }));
  };

  const askAdvisorQuestion = (question: string, answer: string) => {
    soundEffects.playBeep();
    const userMsg: AdvisorDialogue = {
      id: `usr-${Date.now()}`,
      sender: 'User',
      text: question,
      type: 'info',
      timestamp: `Sol ${currentSol}, ${String(currentHour).padStart(2, '0')}:00`
    };
    const botMsg: AdvisorDialogue = {
      id: `bot-${Date.now() + 1}`,
      sender: 'CAPCOM-AI',
      text: answer,
      type: 'science',
      timestamp: `Sol ${currentSol}, ${String(currentHour).padStart(2, '0')}:00`
    };
    setAdvisorMessages(prev => [...prev.slice(-15), userMsg, botMsg]);
  };

  // Planetary Travel with warp launch transition
  const travelTo = (planetId: PlanetId) => {
    soundEffects.playSuccess();
    setIsTraveling(true);
    setTravelTarget(planetId);
    setSelectedPlanetId(planetId);

    setTimeout(() => {
      setIsTraveling(false);
      setTravelTarget(null);
      if (planetId === 'moon') {
        const lunarSc = MISSION_SCENARIOS.find(s => s.outpostType === 'lunar') || MISSION_SCENARIOS[0];
        setScenario(lunarSc);
        setView('explore_moon');
      } else if (planetId === 'mars') {
        const marsSc = MISSION_SCENARIOS.find(s => s.outpostType === 'mars') || MISSION_SCENARIOS[5];
        setScenario(marsSc);
        setView('explore_mars');
      } else {
        setView('planet_discovery');
      }
    }, 1800);
  };

  // Sample Collection handler
  const collectSample = (sample: ScienceSample) => {
    soundEffects.playSuccess();
    setSciencePoints(pts => pts + sample.scienceValue);
    setCollectedSamples(prev => {
      if (prev.some(s => s.id === sample.id)) return prev;
      return [...prev, { ...sample, collectedAt: `Sol ${currentSol}` }];
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    const sampleMsg: AdvisorDialogue = {
      id: `sample-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: `🔬 New Discovery Collected: "${sample.name}" (+${sample.scienceValue} Science Points). ${sample.nasaFact}`,
      type: 'science',
      timestamp: `Sol ${currentSol}, ${String(currentHour).padStart(2, '0')}:00`
    };
    setAdvisorMessages(prev => [...prev.slice(-15), sampleMsg]);
  };

  // Unlock achievement badge
  const unlockAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === id && !a.unlocked) {
          soundEffects.playVictory();
          confetti({ particleCount: 75, spread: 60 });
          return { ...a, unlocked: true, unlockedAt: `Sol ${currentSol}` };
        }
        return a;
      })
    );
  };

  // Compute current astronaut rank
  const astronautRank = useMemo(() => {
    let current = ASTRONAUT_RANKS[0];
    for (const r of ASTRONAUT_RANKS) {
      if (sciencePoints >= r.minScience) {
        current = r;
      }
    }
    return current;
  }, [sciencePoints]);

  // Turn Simulation Step
  const advanceOneHour = useCallback(() => {
    if (activeEvent) return;

    let nextHour = currentHour + 1;
    let nextSol = currentSol;
    if (nextHour >= 24) {
      nextHour = 0;
      nextSol += 1;
    }

    // Check Victory
    if (nextSol > scenario.durationSols) {
      setSimSpeed(0);
      soundEffects.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      const avgHealth = crew.reduce((acc, c) => acc + c.health, 0) / crew.length;
      const evaluation = evaluateMissionPerformance(
        true,
        undefined,
        resources,
        sciencePoints,
        scenario.targetSciencePoints,
        decisionLog,
        avgHealth
      );
      setMissionEvaluation(evaluation);
      setView('mission_results');
      return;
    }

    // Check Failures
    if (resources.oxygen.current <= 0) {
      setSimSpeed(0);
      soundEffects.playAlert();
      const avgHealth = crew.reduce((acc, c) => acc + c.health, 0) / crew.length;
      const evaluation = evaluateMissionPerformance(
        false,
        'Catastrophic ECLSS depletion: Outpost ran out of breathable oxygen.',
        resources,
        sciencePoints,
        scenario.targetSciencePoints,
        decisionLog,
        avgHealth
      );
      setMissionEvaluation(evaluation);
      setView('mission_results');
      return;
    }

    if (resources.energy.current <= 0) {
      setSimSpeed(0);
      soundEffects.playAlert();
      const avgHealth = crew.reduce((acc, c) => acc + c.health, 0) / crew.length;
      const evaluation = evaluateMissionPerformance(
        false,
        'Complete power blackout: Habitat heaters and life support scrubbers froze.',
        resources,
        sciencePoints,
        scenario.targetSciencePoints,
        decisionLog,
        avgHealth
      );
      setMissionEvaluation(evaluation);
      setView('mission_results');
      return;
    }

    // 1. Calculate Energy Generation & Drain
    const isDaytime = nextHour >= 6 && nextHour <= 19;
    const dustImpact = (100 - dustLevel) / 100;
    const baseSolarGeneration = isDaytime ? 3.5 * dustImpact : 0.4;

    const totalAlloc =
      subsystems.lifeSupportPower +
      subsystems.scienceLabPower +
      subsystems.radiationShieldPower +
      subsystems.greenhousePower +
      subsystems.commsArrayPower;

    const baseConsumption = 1.0 + (totalAlloc / 100) * 2.5;
    const netEnergyRate = Number((baseSolarGeneration - baseConsumption).toFixed(2));
    const newEnergy = Math.max(0, Math.min(100, Number((resources.energy.current + netEnergyRate).toFixed(1))));

    // 2. Oxygen Generation & Consumption
    const o2ModeMulti = subsystems.oxygenMode === 'boost' ? 1.5 : subsystems.oxygenMode === 'conserve' ? 0.7 : 1.0;
    const lifeSupportPowerFactor = subsystems.lifeSupportPower / 30;
    const greenhouseO2Yield = (subsystems.greenhousePower / 100) * 0.4;
    const o2Production = (0.9 * lifeSupportPowerFactor * o2ModeMulti) + greenhouseO2Yield;
    const o2Consumption = 0.85;
    const netO2Rate = Number((o2Production - o2Consumption).toFixed(2));
    const newO2 = Math.max(0, Math.min(100, Number((resources.oxygen.current + netO2Rate).toFixed(1))));

    // 3. Water Consumption & Recycling
    const waterRecyclerMulti = subsystems.waterRecyclerMode === 'high_recovery' ? 1.3 : 1.0;
    const waterConsumption = 0.7;
    const waterRecovery = 0.55 * waterRecyclerMulti * (subsystems.lifeSupportPower > 15 ? 1 : 0.5);
    const netWaterRate = Number((waterRecovery - waterConsumption).toFixed(2));
    const newWater = Math.max(0, Math.min(100, Number((resources.water.current + netWaterRate).toFixed(1))));

    // 4. Food Consumption & Greenhouse Production
    const foodConsumption = 0.4;
    const foodYield = (subsystems.greenhousePower / 100) * 0.25;
    const netFoodRate = Number((foodYield - foodConsumption).toFixed(2));
    const newFood = Math.max(0, Math.min(100, Number((resources.food.current + netFoodRate).toFixed(1))));

    // 5. Radiation & Shielding
    let shieldDrain = activeSolarStorm ? 2.5 : 0.2;
    if (subsystems.radiationShieldPower >= 30) {
      shieldDrain = Math.max(0, shieldDrain - 1.8);
    }
    const newShielding = Math.max(0, Math.min(100, Number((resources.radiationShielding.current - shieldDrain).toFixed(1))));

    // Update resources
    setResources(prev => ({
      oxygen: { ...prev.oxygen, current: newO2, ratePerHour: netO2Rate },
      energy: { ...prev.energy, current: newEnergy, ratePerHour: netEnergyRate },
      food: { ...prev.food, current: newFood, ratePerHour: netFoodRate },
      water: { ...prev.water, current: newWater, ratePerHour: netWaterRate },
      radiationShielding: { ...prev.radiationShielding, current: newShielding, ratePerHour: -shieldDrain }
    }));

    if (subsystems.scienceLabPower > 0 && newEnergy > 15) {
      const addedScience = Math.round((subsystems.scienceLabPower / 20) * 0.5);
      if (addedScience > 0) {
        setSciencePoints(pts => pts + addedScience);
      }
    }

    if (Math.random() < 0.15) {
      setDustLevel(d => Math.min(85, d + 2));
    }

    const currentRadHourlyDose = activeSolarStorm
      ? (subsystems.radiationShieldPower > 25 ? 0.05 : 0.35)
      : 0.005;

    setCrew(prevCrew =>
      prevCrew.map(c => {
        const newDose = Number((c.radiationDose + currentRadHourlyDose).toFixed(2));
        let healthDelta = 0;
        if (newO2 < 20) healthDelta -= 2;
        if (newEnergy < 15) healthDelta -= 1;
        if (newWater < 15) healthDelta -= 1;
        if (activeSolarStorm && subsystems.radiationShieldPower < 15) healthDelta -= 2;

        const newHealth = Math.max(10, Math.min(100, c.health + healthDelta));
        let status: 'optimal' | 'stable' | 'fatigued' | 'critical' | 'in_shelter' = 'optimal';
        if (activeSolarStorm && subsystems.radiationShieldPower < 20) {
          status = 'in_shelter';
        } else if (newHealth < 40) {
          status = 'critical';
        } else if (newHealth < 75) {
          status = 'fatigued';
        } else if (newHealth < 90) {
          status = 'stable';
        }

        return {
          ...c,
          health: newHealth,
          radiationDose: newDose,
          status
        };
      })
    );

    // Dynamic Event Check
    const upcomingEvent = scenario.scheduledEvents.find(
      evt => evt.dayTrigger === nextSol && !triggeredEventIds.has(evt.id)
    );

    if (upcomingEvent && (nextHour === 10 || nextHour === 14)) {
      soundEffects.playAlert();
      setActiveEvent(upcomingEvent);
      setTriggeredEventIds(prev => new Set(prev).add(upcomingEvent.id));
      if (upcomingEvent.category === 'solar_radiation') {
        setActiveSolarStorm(true);
      }
      setSimSpeed(0);
    }

    setCurrentHour(nextHour);
    setCurrentSol(nextSol);

    if (nextHour % 6 === 0) {
      const newAdvices = generateAdvisorAdvice(resources, subsystems, nextSol);
      if (newAdvices.length > 0) {
        setAdvisorMessages(prev => [...prev.slice(-12), ...newAdvices]);
      }
    }
  }, [
    activeEvent,
    currentHour,
    currentSol,
    scenario,
    crew,
    resources,
    sciencePoints,
    decisionLog,
    dustLevel,
    subsystems,
    activeSolarStorm,
    triggeredEventIds
  ]);

  // Simulation speed interval
  useEffect(() => {
    const isSimulatingView =
      view === 'dashboard' ||
      view === 'outpost_3d' ||
      view === 'explore_moon' ||
      view === 'explore_mars';

    if (simSpeed === 0 || !isSimulatingView || activeEvent) return;

    const intervalMs = simSpeed === 5 ? 360 : simSpeed === 2 ? 900 : 1800;
    const timer = setInterval(() => {
      advanceOneHour();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [simSpeed, view, activeEvent, advanceOneHour]);

  const dismissEvent = () => {
    soundEffects.playClick();
    setActiveEvent(null);
    setSimSpeed(1);
  };

  const resolveEventOption = (opt: MissionDecisionOption) => {
    if (!activeEvent) return;
    soundEffects.playSuccess();

    const deltas = opt.resourceDeltas;
    setResources(prev => ({
      oxygen: {
        ...prev.oxygen,
        current: Math.max(0, Math.min(100, prev.oxygen.current + (deltas.oxygen || 0)))
      },
      energy: {
        ...prev.energy,
        current: Math.max(0, Math.min(100, prev.energy.current + (deltas.energy || 0)))
      },
      food: {
        ...prev.food,
        current: Math.max(0, Math.min(100, prev.food.current + (deltas.food || 0)))
      },
      water: {
        ...prev.water,
        current: Math.max(0, Math.min(100, prev.water.current + (deltas.water || 0)))
      },
      radiationShielding: {
        ...prev.radiationShielding,
        current: Math.max(0, Math.min(100, prev.radiationShielding.current + (deltas.radiationShielding || 0)))
      }
    }));

    if (deltas.sciencePoints) {
      setSciencePoints(pts => pts + deltas.sciencePoints!);
    }

    if (deltas.crewHealth || deltas.crewMorale) {
      setCrew(prev =>
        prev.map(c => ({
          ...c,
          health: Math.max(10, Math.min(100, c.health + (deltas.crewHealth || 0))),
          morale: Math.max(10, Math.min(100, c.morale + (deltas.crewMorale || 0)))
        }))
      );
    }

    if (activeEvent.category === 'equipment_dust' && opt.id === 'opt-dust-blower') {
      setDustLevel(12);
      unlockAchievement('badge-moon-power-master');
    }

    if (activeEvent.category === 'solar_radiation') {
      unlockAchievement('badge-solar-storm-hero');
      setTimeout(() => setActiveSolarStorm(false), 8000);
    }

    const logEntry: DecisionLogEntry = {
      timestampSol: currentSol,
      timestampHour: currentHour,
      eventTitle: activeEvent.title,
      choiceMade: opt.text,
      impactSummary: opt.outcomeText,
      nasaConceptLearned: opt.nasaScienceFact
    };
    setDecisionLog(prev => [...prev, logEntry]);

    const feedbackMsg: AdvisorDialogue = {
      id: `decision-${Date.now()}`,
      sender: 'CAPCOM-AI',
      text: `Commander choice logged: "${opt.text}". Outcome: ${opt.outcomeText}`,
      type: 'science',
      timestamp: `Sol ${currentSol}, ${String(currentHour).padStart(2, '0')}:00`
    };
    setAdvisorMessages(prev => [...prev.slice(-15), feedbackMsg]);

    setActiveEvent(null);
    setSimSpeed(1);
  };

  const contextValue = useMemo<GameContextType>(
    () => ({
      view,
      setView,
      scenario,
      selectScenario,
      startMission,
      resetMission,
      currentSol,
      currentHour,
      simSpeed,
      setSimSpeed,
      advanceOneHour,
      resources,
      subsystems,
      updateSubsystems,
      crew,
      sciencePoints,
      dustLevel,
      setDustLevel,
      activeSolarStorm,
      activeEvent,
      dismissEvent,
      resolveEventOption,
      decisionLog,
      advisorMessages,
      askAdvisorQuestion,
      missionEvaluation,
      isMuted,
      toggleMute,
      selectedPlanetId,
      setSelectedPlanetId,
      isTraveling,
      travelTarget,
      travelTo,
      controlMode,
      setControlMode,
      collectedSamples,
      collectSample,
      achievements,
      unlockAchievement,
      astronautRank
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      view,
      scenario,
      currentSol,
      currentHour,
      simSpeed,
      advanceOneHour,
      resources,
      subsystems,
      crew,
      sciencePoints,
      dustLevel,
      setDustLevel,
      activeSolarStorm,
      activeEvent,
      decisionLog,
      advisorMessages,
      missionEvaluation,
      isMuted,
      selectedPlanetId,
      isTraveling,
      travelTarget,
      controlMode,
      collectedSamples,
      achievements,
      astronautRank
    ]
  );

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
