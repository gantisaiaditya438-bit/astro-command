// Solar System & Planetary Survival Types

export type PlanetId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export type PlanetType = 'star' | 'terrestrial' | 'moon' | 'gas_giant' | 'ice_giant';

export interface PlanetData {
  id: PlanetId;
  name: string;
  type: PlanetType;
  tagline: string;
  distanceFromSunAU: number; // in Astronomical Units
  distanceFromSunKm: string;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  radiusKm: number;
  surfaceGravityG: number; // relative to Earth (1.0 = 9.8 m/s²)
  surfaceGravityDesc: string;
  temperatureRangeC: { min: number; max: number; mean: number };
  temperatureDesc: string;
  atmosphereComposition: string[];
  atmosphericPressureAtm: number;
  waterPresence: string;
  radiationHazard: 'low' | 'moderate' | 'high' | 'extreme';
  canHumansLiveWithoutGear: boolean;
  whyHumansCannotLiveHere: string;
  specialFeatures: string[];
  nasaMissions: string[];
  color: string;
  emissiveColor?: string;
  ringSystem?: boolean;
  scale3D: number;
  orbitRadius3D: number;
  orbitSpeed: number;
  isPlayableDestination: boolean;
  isUnlockedDefault: boolean;
  educationalTakeaway: string;
  nasaPhoto?: {
    nasaId: string;
    title: string;
    photoUrl: string;
    thumbUrl: string;
    credit: string;
    dateCreated: string;
    sourceUrl: string;
    isRadarDerived?: boolean;
  };
}

export interface PlanetaryMissionTask {
  id: string;
  title: string;
  description: string;
  destination: 'moon' | 'mars' | 'probe';
  objectives: string[];
  targetSciencePoints: number;
  rewardBadgeId: string;
  completed: boolean;
}

export interface ScienceSample {
  id: string;
  name: string;
  location: string;
  destination?: 'moon' | 'mars' | 'probe';
  category: 'geology' | 'astronomy' | 'life_support' | 'space_weather';
  description: string;
  scienceValue: number;
  collectedAt?: string;
  nasaFact: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'survival' | 'science' | 'mastery';
  unlocked: boolean;
  unlockedAt?: string;
}

export type ControlMode = 'astronaut' | 'rover' | 'free_cam';
