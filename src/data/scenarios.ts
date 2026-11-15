import { MissionScenario } from '../types';
import { MISSION_EVENTS } from './events';

export const MISSION_SCENARIOS: MissionScenario[] = [
  {
    id: 'level-1-first-steps',
    level: 1,
    title: 'Level 1: First Steps on the Moon',
    subtitle: 'Learn the fundamentals of life support & resource management',
    outpostType: 'lunar',
    durationSols: 3,
    targetSciencePoints: 30,
    difficulty: 'Cadet (Easy)',
    briefing: {
      summary: 'Welcome to Shackleton Base, Commander! Your first assignment is to get the outpost operational, ensure oxygen and water loops are steady, and extract initial geological samples.',
      primaryObjective: 'Survive 3 lunar sols with all resource meters above critical threshold (20%).',
      secondaryObjective: 'Accumulate at least 30 scientific discovery points.',
      environmentalHazards: [
        'Hard vacuum outside the habitat dome',
        'Lunar dust settling on exterior solar panels'
      ],
      crewSize: 4
    },
    initialResources: {
      oxygen: 95,
      energy: 90,
      food: 95,
      water: 90,
      radiationShielding: 85
    },
    scheduledEvents: [
      MISSION_EVENTS.find(e => e.id === 'evt-dust-accumulation')!,
      MISSION_EVENTS.find(e => e.id === 'evt-science-discovery')!
    ].filter(Boolean)
  },
  {
    id: 'level-2-power-crisis',
    level: 2,
    title: 'Level 2: Power Crisis at the South Pole',
    subtitle: 'Navigate solar panel dust storms & balance habitat electrical grid',
    outpostType: 'lunar',
    durationSols: 4,
    targetSciencePoints: 40,
    difficulty: 'Cadet (Easy)',
    briefing: {
      summary: 'A dust agitation event has blanketed the south ridge solar array. Energy generation is plummeting, threatening habitat temperature control and life support.',
      primaryObjective: 'Maintain base energy above 25% across 4 sols and keep life support powered.',
      secondaryObjective: 'Test the experimental electrodynamic dust shield to restore full array output.',
      environmentalHazards: [
        'Extreme thermal plunge in crater shadows',
        'Severe dust occlusion of photovoltaic panels'
      ],
      crewSize: 4
    },
    initialResources: {
      oxygen: 85,
      energy: 65,
      food: 80,
      water: 80,
      radiationShielding: 75
    },
    scheduledEvents: [
      MISSION_EVENTS.find(e => e.id === 'evt-dust-accumulation')!,
      MISSION_EVENTS.find(e => e.id === 'evt-comms-delay')!
    ].filter(Boolean)
  },
  {
    id: 'level-3-solar-storm',
    level: 3,
    title: 'Level 3: Solar Storm Defense',
    subtitle: 'Intercept real NASA DONKI alerts & shield crew from lethal CME particles',
    outpostType: 'lunar',
    durationSols: 5,
    targetSciencePoints: 50,
    difficulty: 'Officer (Medium)',
    briefing: {
      summary: 'NASA DONKI space weather satellites report an intense Class X solar flare and coronal mass ejection approaching the Moon. The outpost must activate radiation defenses before the proton storm hits.',
      primaryObjective: 'Keep crew radiation exposure below 50 mSv and maintain shield integrity above 30%.',
      secondaryObjective: 'Preserve water wall bladders without dehydrating the crew.',
      environmentalHazards: [
        'High-energy Solar Energetic Particles (SEPs > 100 MeV)',
        'Radio frequency ionization blackouts'
      ],
      crewSize: 4
    },
    initialResources: {
      oxygen: 80,
      energy: 85,
      food: 80,
      water: 85,
      radiationShielding: 70
    },
    scheduledEvents: [
      MISSION_EVENTS.find(e => e.id === 'evt-solar-storm-1')!,
      MISSION_EVENTS.find(e => e.id === 'evt-comms-delay')!
    ].filter(Boolean)
  },
  {
    id: 'level-4-life-support-emergency',
    level: 4,
    title: 'Level 4: Life Support Emergency',
    subtitle: 'Tackle cascading ECLSS oxygen & water recycling anomalies',
    outpostType: 'lunar',
    durationSols: 6,
    targetSciencePoints: 60,
    difficulty: 'Officer (Medium)',
    briefing: {
      summary: 'Multiple failures in the closed-loop Environmental Control and Life Support System (ECLSS) have occurred. The Sabatier reactor is overheating and a water distribution line is leaking.',
      primaryObjective: 'Stabilize oxygen and water loops, keeping crew health above 75%.',
      secondaryObjective: 'Harness greenhouse hydroponics to absorb CO2 and replenish drinking water.',
      environmentalHazards: [
        'Toxic carbon dioxide buildup in habitat air',
        'Graywater leakage near electrical manifolds'
      ],
      crewSize: 4
    },
    initialResources: {
      oxygen: 60,
      energy: 75,
      food: 70,
      water: 65,
      radiationShielding: 80
    },
    scheduledEvents: [
      MISSION_EVENTS.find(e => e.id === 'evt-oxygen-scrubber')!,
      MISSION_EVENTS.find(e => e.id === 'evt-water-leak')!
    ].filter(Boolean)
  },
  {
    id: 'level-5-mission-commander',
    level: 5,
    title: 'Level 5: Master Mission Commander',
    subtitle: 'The ultimate space engineering test: Survive multi-hazard lunar expedition',
    outpostType: 'lunar',
    durationSols: 7,
    targetSciencePoints: 80,
    difficulty: 'Commander (Hard)',
    briefing: {
      summary: 'You are in full command of Artemis Base Camp for a 7-sol rotation. Solar storms, life support glitches, regolith dust, and deep ice drilling will test every engineering principle you have learned.',
      primaryObjective: 'Complete the full 7-day lunar cycle with 100% crew survival.',
      secondaryObjective: 'Harvest Shackleton crater ice and achieve at least 80 science points.',
      environmentalHazards: [
        'Unpredictable NASA DONKI solar weather events',
        'ECLSS life support stress',
        'Lunar dust abrasion'
      ],
      crewSize: 4
    },
    initialResources: {
      oxygen: 75,
      energy: 75,
      food: 75,
      water: 75,
      radiationShielding: 75
    },
    scheduledEvents: MISSION_EVENTS
  },
  {
    id: 'scenario-mars-ares-alpha',
    level: 5,
    title: 'Red Planet Expedition: Ares Outpost Alpha',
    subtitle: 'Pioneer the first permanent human habitat on Mars at Jezero Crater',
    outpostType: 'mars',
    durationSols: 7,
    targetSciencePoints: 90,
    difficulty: 'Commander (Hard)',
    briefing: {
      summary: 'Welcome to Jezero Crater on Mars! At 225 million kilometers from Earth, there is no quick rescue. You must run the MOXIE oxygen generation system, manage thin atmosphere solar variations, and protect against global dust storms.',
      primaryObjective: 'Survive 7 Martian Sols and keep habitat pressure and oxygen stable.',
      secondaryObjective: 'Analyze ancient lakebed delta clays and harvest subsurface ice.',
      environmentalHazards: [
        'Toxic carbon dioxide atmosphere (95% CO2, 0.6% Earth pressure)',
        'Planet-wide Martian dust storms reducing solar radiance',
        '14-minute radio time-delay to Earth Mission Control'
      ],
      crewSize: 4
    },
    initialResources: {
      oxygen: 70,
      energy: 70,
      food: 70,
      water: 70,
      radiationShielding: 70
    },
    scheduledEvents: MISSION_EVENTS
  }
];

export const INITIAL_CREW = [
  {
    id: 'crew-1',
    name: 'Dr. Maya Lin',
    role: 'Commander & Geochemist',
    specialty: 'Lunar Ice Petrology',
    avatar: '👩‍🚀',
    health: 98,
    morale: 95,
    radiationDose: 4.2, // mSv
    status: 'optimal' as const,
    osdrBioMetric: {
      boneDensityTrend: 'Stable (-0.1%/mo)',
      cardioStrain: 'Normal (HR 68 bpm)',
      immuneReadiness: 'Optimal (98%)'
    }
  },
  {
    id: 'crew-2',
    name: 'Alex Vance',
    role: 'Chief Life Support Engineer',
    specialty: 'ECLSS Sabatier & Water Recycling',
    avatar: '👨‍🚀',
    health: 95,
    morale: 90,
    radiationDose: 4.8,
    status: 'optimal' as const,
    osdrBioMetric: {
      boneDensityTrend: 'Stable',
      cardioStrain: 'Elevated during EVA (HR 82 bpm)',
      immuneReadiness: 'Good (94%)'
    }
  },
  {
    id: 'crew-3',
    name: 'Kiran Patel',
    role: 'Power & Robotics Specialist',
    specialty: 'Photovoltaic Arrays & Autonomous Rovers',
    avatar: '👨‍💻',
    health: 96,
    morale: 92,
    radiationDose: 3.9,
    status: 'optimal' as const,
    osdrBioMetric: {
      boneDensityTrend: 'Stable',
      cardioStrain: 'Normal (HR 71 bpm)',
      immuneReadiness: 'Optimal (97%)'
    }
  },
  {
    id: 'crew-4',
    name: 'Dr. Elena Rossi',
    role: 'Space Botanist & Flight Surgeon',
    specialty: 'Hydroponics & Regolith Agriculture',
    avatar: '👩‍🔬',
    health: 99,
    morale: 96,
    radiationDose: 3.5,
    status: 'optimal' as const,
    osdrBioMetric: {
      boneDensityTrend: 'Optimal (+0.2% resistance training)',
      cardioStrain: 'Normal (HR 64 bpm)',
      immuneReadiness: 'Optimal (99%)'
    }
  }
];

