// ASTRO COMMAND - TypeScript Type Definitions

export type OutpostType = 'lunar' | 'mars';

export type MissionLevel = 1 | 2 | 3 | 4 | 5;

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  health: number; // 0 - 100%
  morale: number; // 0 - 100%
  radiationDose: number; // in millisieverts (mSv)
  status: 'optimal' | 'stable' | 'fatigued' | 'critical' | 'in_shelter';
  osdrBioMetric: {
    boneDensityTrend: string;
    cardioStrain: string;
    immuneReadiness: string;
  };
}

export interface ResourceState {
  current: number;
  max: number;
  ratePerHour: number; // Net change (+ / -)
  unit: string;
  dangerThreshold: number;
  criticalThreshold: number;
  description: string;
}

export interface OutpostResources {
  oxygen: ResourceState;
  energy: ResourceState;
  food: ResourceState;
  water: ResourceState;
  radiationShielding: ResourceState;
}

export interface SubsystemAllocations {
  lifeSupportPower: number; // 0 to 100 %
  scienceLabPower: number; // 0 to 100 %
  radiationShieldPower: number; // 0 to 100 %
  greenhousePower: number; // 0 to 100 %
  commsArrayPower: number; // 0 to 100 %
  oxygenMode: 'conserve' | 'standard' | 'boost';
  waterRecyclerMode: 'standard' | 'high_recovery';
}

export interface NasaDonkiEvent {
  messageID: string;
  messageType: 'FLR' | 'CME' | 'SEP' | 'GST';
  messageIssueTime: string;
  eventTime: string;
  classType?: string;
  speed?: number;
  halfAngle?: number;
  summary: string;
  scientificContext: string;
  educationalTakeaway: string;
  dataSource: 'NASA DONKI Space Weather Database';
}

export interface NasaOsdrStudy {
  studyId: string;
  title: string;
  organism: string;
  category: 'Space Radiation' | 'Microgravity Muscle/Bone' | 'Plant Biology in Regolith' | 'Immune System';
  finding: string;
  kidSummary: string;
  missionRelevance: string;
}

export interface MissionDecisionOption {
  id: string;
  text: string;
  tooltip: string;
  resourceDeltas: {
    oxygen?: number;
    energy?: number;
    food?: number;
    water?: number;
    radiationShielding?: number;
    sciencePoints?: number;
    crewHealth?: number;
    crewMorale?: number;
  };
  nasaScienceFact: string;
  outcomeText: string;
}

export interface MissionEvent {
  id: string;
  title: string;
  category: 'solar_radiation' | 'power_crisis' | 'life_support' | 'equipment_dust' | 'science_discovery' | 'comms_anomaly';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  dayTrigger: number;
  description: string;
  educationalContext: string;
  nasaDataConnection?: {
    source: string;
    dataset: string;
    detail: string;
  };
  options: MissionDecisionOption[];
  iconName: string;
}

export interface DecisionLogEntry {
  timestampSol: number;
  timestampHour: number;
  eventTitle: string;
  choiceMade: string;
  impactSummary: string;
  nasaConceptLearned: string;
}

export interface MissionScenario {
  id: string;
  level: MissionLevel;
  title: string;
  subtitle: string;
  outpostType: OutpostType;
  durationSols: number;
  targetSciencePoints: number;
  difficulty: 'Cadet (Easy)' | 'Officer (Medium)' | 'Commander (Hard)';
  briefing: {
    summary: string;
    primaryObjective: string;
    secondaryObjective: string;
    environmentalHazards: string[];
    crewSize: number;
  };
  initialResources: {
    oxygen: number;
    energy: number;
    food: number;
    water: number;
    radiationShielding: number;
  };
  scheduledEvents: MissionEvent[];
}

export interface MissionEvaluation {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  rankTitle: string;
  passed: boolean;
  score: number;
  crewSurvivalRate: number;
  resourcesConservedScore: number;
  scienceCompletedScore: number;
  highlights: string[];
  improvements: string[];
  spaceEngineeringLessons: string[];
}

