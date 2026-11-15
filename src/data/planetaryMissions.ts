import { PlanetaryMissionTask, ScienceSample } from '../types/solar';

export const MOON_MISSIONS: PlanetaryMissionTask[] = [
  {
    id: 'lunar-m1-first-steps',
    title: '1. First Steps on the Moon',
    description: 'Step out onto the lunar south pole at Shackleton Crater. Inspect habitat pressure and establish communication with Houston.',
    destination: 'moon',
    objectives: [
      'Exit the airlock onto the lunar regolith',
      'Verify life support pressure is stable at 101.3 kPa',
      'Walk 30 meters to calibrate suit telemetry'
    ],
    targetSciencePoints: 20,
    rewardBadgeId: 'badge-moon-first-footprint',
    completed: false
  },
  {
    id: 'lunar-m2-collect-samples',
    title: '2. Collect Lunar Samples',
    description: 'Search the landing site perimeter for Apollo-grade mare basalt and highland anorthosite rock samples.',
    destination: 'moon',
    objectives: [
      'Locate and collect 2 geological lunar rock samples',
      'Deposit samples into the research lab mass spectrometer'
    ],
    targetSciencePoints: 35,
    rewardBadgeId: 'badge-moon-geologist',
    completed: false
  },
  {
    id: 'lunar-m3-repair-oxygen',
    title: '3. Repair Oxygen Generator',
    description: 'The Sabatier catalyst loop has a thermal pressure buildup. Inspect the ECLSS Oxygen Plant and purge the lines.',
    destination: 'moon',
    objectives: [
      'Approach the ECLSS Oxygen Facility',
      'Initiate high-pressure nitrogen flush',
      'Verify oxygen concentration stabilizes above 90%'
    ],
    targetSciencePoints: 40,
    rewardBadgeId: 'badge-moon-life-saver',
    completed: false
  },
  {
    id: 'lunar-m4-restore-power',
    title: '4. Restore Solar Power',
    description: 'Abrasive lunar dust has coated the south ridge photovoltaic arrays. Clear the panels to restore power.',
    destination: 'moon',
    objectives: [
      'Inspect the Photovoltaic Array Farm',
      'Trigger the Electrodynamic Dust Shield (EDS) vibration pulse',
      'Restore solar array efficiency to 90%+'
    ],
    targetSciencePoints: 45,
    rewardBadgeId: 'badge-moon-power-master',
    completed: false
  },
  {
    id: 'lunar-m5-study-ice',
    title: '5. Find and Study Lunar Ice',
    description: 'Drive the Hermes rover into the permanently shadowed rim of Shackleton Crater to extract cryo-ice cores.',
    destination: 'moon',
    objectives: [
      'Take control of Autonomous Rover "Hermes"',
      'Navigate to the permanently shadowed ice zone',
      'Extract a 50-liter primordial water-ice sample'
    ],
    targetSciencePoints: 60,
    rewardBadgeId: 'badge-moon-ice-prospector',
    completed: false
  },
  {
    id: 'lunar-m6-survive-storm',
    title: '6. Survive a Solar Storm',
    description: 'A NASA DONKI Class X solar flare CME is inbound. Activate the electromagnetic deflector shield and protect the crew.',
    destination: 'moon',
    objectives: [
      'Acknowledge NASA DONKI emergency alert',
      'Route maximum power to the radiation shield',
      'Retreat into the regolith blast shelter until flux clears'
    ],
    targetSciencePoints: 75,
    rewardBadgeId: 'badge-solar-storm-hero',
    completed: false
  }
];

export const MARS_MISSIONS: PlanetaryMissionTask[] = [
  {
    id: 'mars-m1-first-landing',
    title: '1. First Landing on Mars',
    description: 'Land safely at Jezero Crater. Step onto the Martian soil and verify habitat pressurization.',
    destination: 'mars',
    objectives: [
      'Touch down at Jezero Crater Delta Base',
      'Deploy the external telemetry antenna',
      'Verify MOXIE atmospheric oxygen extraction'
    ],
    targetSciencePoints: 25,
    rewardBadgeId: 'badge-mars-first-footprint',
    completed: false
  },
  {
    id: 'mars-m2-explore-planet',
    title: '2. Explore the Red Planet',
    description: 'Drive the Mars rover to investigate ancient river delta clay sediments where water flowed billions of years ago.',
    destination: 'mars',
    objectives: [
      'Board the Mars Exploration Rover',
      'Drive across the ancient Jezero river delta',
      'Collect red iron-oxide clay core samples'
    ],
    targetSciencePoints: 35,
    rewardBadgeId: 'badge-mars-explorer',
    completed: false
  },
  {
    id: 'mars-m3-dust-storm',
    title: '3. Investigate a Dust Storm',
    description: 'A regional Martian dust storm is obscuring sunlight. Switch to RTG nuclear backup power and safeguard the habitat.',
    destination: 'mars',
    objectives: [
      'Detect dust storm atmospheric opacity increase',
      'Switch non-essential systems to standby mode',
      'Seal habitat airlock filters against fine silica dust'
    ],
    targetSciencePoints: 45,
    rewardBadgeId: 'badge-mars-dust-survivor',
    completed: false
  },
  {
    id: 'mars-m4-repair-water',
    title: '4. Repair the Water System',
    description: 'Permafrost melter lines have frozen in the sub-zero night (-70°C). Reheat the extraction conduit.',
    destination: 'mars',
    objectives: [
      'Inspect the subsurface ice melter unit',
      'Route electrical heating tape along plumbing lines',
      'Restore flow of liquid water to base tanks'
    ],
    targetSciencePoints: 50,
    rewardBadgeId: 'badge-mars-water-engineer',
    completed: false
  },
  {
    id: 'mars-m5-grow-food',
    title: '5. Grow Food in the Greenhouse',
    description: 'Mix filtered Martian regolith with compost nutrients to plant fresh radishes and microgreens under LED grow lights.',
    destination: 'mars',
    objectives: [
      'Enter the Mars Hydroponic Greenhouse Bio-Dome',
      'Adjust LED light spectrum to 450nm Blue / 660nm Red',
      'Harvest 15 fresh microgreen rations for the crew'
    ],
    targetSciencePoints: 55,
    rewardBadgeId: 'badge-mars-farmer',
    completed: false
  },
  {
    id: 'mars-m6-maintain-habitat',
    title: '6. Maintain the Mars Habitat',
    description: 'Run a full Sol-cycle diagnostic on MOXIE $O_2$ production, thermal insulation, and life support loops.',
    destination: 'mars',
    objectives: [
      'Ensure all 4 astronauts maintain >90% health',
      'Keep base energy and oxygen above safety thresholds',
      'Transmit discovery catalog back to Earth Mission Control'
    ],
    targetSciencePoints: 80,
    rewardBadgeId: 'badge-mars-commander',
    completed: false
  }
];

export const DISCOVERABLE_SAMPLES: ScienceSample[] = [
  {
    id: 'sample-moon-basalt',
    name: 'Apollo South Pole Lunar Basalt',
    location: 'Shackleton Crater Rim, The Moon',
    destination: 'moon',
    category: 'geology',
    description: 'Dark, fine-grained volcanic rock formed 3.8 billion years ago when molten lava welled up and flooded giant lunar impact basins.',
    scienceValue: 20,
    nasaFact: 'Lunar basalt is rich in titanium, iron, and ilmenite minerals which can be processed to yield pure oxygen and metal construction alloys.'
  },
  {
    id: 'sample-moon-ice',
    name: 'Primordial Shackleton Cometary Water-Ice',
    location: 'Permanently Shadowed Floor, The Moon',
    destination: 'moon',
    category: 'life_support',
    description: 'Ultra-cold frozen water (-230°C) delivered by ancient icy comet collisions, locked away in total darkness for billions of years.',
    scienceValue: 35,
    nasaFact: 'Splitting lunar water with electrolysis provides liquid oxygen ($LOX$) and liquid hydrogen ($LH_2$), the rocket propellant used by NASA’s SLS and Starship!'
  },
  {
    id: 'sample-mars-clay',
    name: 'Jezero Riverbed Phyllosilicate Clay',
    location: 'Ancient Delta Sediments, Mars',
    destination: 'mars',
    category: 'geology',
    description: 'Layered clay mudstones deposited when a fast-flowing river emptied into a giant lake inside Jezero Crater 3.5 billion years ago.',
    scienceValue: 25,
    nasaFact: 'NASA’s Perseverance rover collects samples of Jezero clay because clays on Earth are exceptional at trapping and preserving fossilized microscopic biosignatures.'
  },
  {
    id: 'sample-mars-meteorite',
    name: 'Martian Shergottite Volcanic Basalt',
    location: 'Dune Fields, Mars',
    destination: 'mars',
    category: 'geology',
    description: 'Magnesium-rich volcanic rock identical to rare Martian meteorites blasted off Mars by asteroid impacts that eventually landed on Earth.',
    scienceValue: 30,
    nasaFact: 'Over 300 Martian meteorites have been identified on Earth, recognized by tiny bubbles of trapped Martian gas with the exact chemical fingerprint measured by Viking!'
  },
  {
    id: 'sample-saturn-ring',
    name: 'Cassini Ring Water-Ice Crystal',
    location: 'Saturn B-Ring Edge, Orbital Probe',
    destination: 'probe',
    category: 'astronomy',
    description: 'Pristine, 99% pure crystalline water-ice particle reflecting sunlight like a glittering diamond.',
    scienceValue: 40,
    nasaFact: 'Saturn’s rings are estimated to be only 10 to 100 million years old—meaning dinosaurs on Earth looked up into the night sky before Saturn even had rings!'
  }
];
