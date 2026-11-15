import { AchievementBadge } from '../types/solar';

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'badge-moon-first-footprint',
    title: 'First Footprint',
    description: 'Walk on the lunar regolith at the Moon’s South Pole.',
    icon: '👣',
    category: 'exploration',
    unlocked: true,
    unlockedAt: 'Sol 1'
  },
  {
    id: 'badge-moon-geologist',
    title: 'Lunar Geologist',
    description: 'Collect and analyze ancient Apollo-grade lunar basalt samples.',
    icon: '🪨',
    category: 'science',
    unlocked: false
  },
  {
    id: 'badge-moon-life-saver',
    title: 'Life Support Guardian',
    description: 'Diagnose and repair an ECLSS Sabatier oxygen scrubber emergency.',
    icon: '💨',
    category: 'survival',
    unlocked: false
  },
  {
    id: 'badge-moon-power-master',
    title: 'Solar Engineer',
    description: 'Clear regolith dust and restore photovoltaic arrays to 90%+ efficiency.',
    icon: '⚡',
    category: 'survival',
    unlocked: false
  },
  {
    id: 'badge-moon-ice-prospector',
    title: 'Deep Ice Miner',
    description: 'Extract primordial cometary water-ice from a permanently shadowed crater.',
    icon: '💎',
    category: 'science',
    unlocked: false
  },
  {
    id: 'badge-solar-storm-hero',
    title: 'Solar Storm Shield',
    description: 'Deflect a NASA DONKI Class X solar flare CME using active magnetic shielding.',
    icon: '🛡️',
    category: 'survival',
    unlocked: false
  },
  {
    id: 'badge-mars-first-footprint',
    title: 'Red Planet Pioneer',
    description: 'Establish humanity’s first permanent research outpost at Jezero Crater, Mars.',
    icon: '🔴',
    category: 'exploration',
    unlocked: false
  },
  {
    id: 'badge-mars-explorer',
    title: 'Rover Commander',
    description: 'Drive the exploration rover across ancient riverbed delta sediments.',
    icon: '🚜',
    category: 'exploration',
    unlocked: false
  },
  {
    id: 'badge-mars-farmer',
    title: 'Off-World Botanist',
    description: 'Harvest fresh microgreen salad crops in the Mars greenhouse bio-dome.',
    icon: '🌱',
    category: 'science',
    unlocked: false
  },
  {
    id: 'badge-solar-cartographer',
    title: 'Solar System Cartographer',
    description: 'Explore all 8 planets and inspect their survival characteristics.',
    icon: '🪐',
    category: 'mastery',
    unlocked: false
  },
  {
    id: 'badge-mars-emergency-savior',
    title: 'Mars Emergency Hero',
    description: 'Repaired the MOXIE oxygen generator and saved the crew from a catastrophic Martian dust storm.',
    icon: '🚨',
    category: 'survival',
    unlocked: false
  }
];

export const ASTRONAUT_RANKS = [
  { minScience: 0, title: 'Cadet Trainee', badge: '🥉 Cadet Wings' },
  { minScience: 50, title: 'Junior Mission Specialist', badge: '🥈 Specialist Wings' },
  { minScience: 120, title: 'Senior Flight Engineer', badge: '⭐ Flight Officer Wings' },
  { minScience: 250, title: 'Master Artemis Commander', badge: '🌟 Gold Wings' },
  { minScience: 400, title: 'Solar System Pioneer', badge: '👑 Diamond Exploration Crest' }
];
