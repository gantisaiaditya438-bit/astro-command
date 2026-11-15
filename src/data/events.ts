import { MissionEvent } from '../types';

export const MISSION_EVENTS: MissionEvent[] = [
  {
    id: 'evt-solar-storm-1',
    title: '⚠️ NASA DONKI ALERT: Class X-Ray Solar Flare & CME Incoming',
    category: 'solar_radiation',
    severity: 'critical',
    dayTrigger: 2,
    description: 'NASA\'s Deep Space Climate Observatory (DSCOVR) and SDO detected a Class X4.2 solar flare with a coronal mass ejection (CME) traveling at 1,450 km/s directly along the Sun-Moon orbital plane. Radiation levels on the lunar surface will surge to lethal levels within hours!',
    educationalContext: 'Because the Moon lacks Earth\'s protective magnetic field (magnetosphere) and thick atmosphere, solar energetic particles (SEPs) bombard the surface unimpeded. Astronauts must either activate magnetic electromagnetic shielding or retreat to deep underground regolith bunkers.',
    nasaDataConnection: {
      source: 'NASA DONKI (Space Weather Database)',
      dataset: 'Notification #202405-CME-004',
      detail: 'Measured solar wind proton flux > 150 MeV. High ionizing radiation hazard for lunar EVA crew.'
    },
    iconName: 'SunAlert',
    options: [
      {
        id: 'opt-shield-max',
        text: 'Divert Maximum Power to Active Electromagnetic Radiation Shields',
        tooltip: 'Consumes huge energy reserves to establish a localized magnetic deflection bubble over the habitat.',
        resourceDeltas: {
          energy: -38,
          radiationShielding: 25,
          crewHealth: 0,
          crewMorale: 5
        },
        nasaScienceFact: 'NASA\'s Advanced Exploration Systems (AES) is studying active superconducting magnetic shielding to deflect charged ions in deep space.',
        outcomeText: 'Active shielding held! Astronauts felt safe inside the habitat, though the power grid experienced heavy drain.'
      },
      {
        id: 'opt-regolith-bunker',
        text: 'Order Immediate Crew Evacuation to Subsurface Regolith Shelter',
        tooltip: 'Saves power by turning off exterior science modules and moving astronauts into a thick lunar dirt shelter.',
        resourceDeltas: {
          energy: -10,
          radiationShielding: 10,
          sciencePoints: -15,
          crewMorale: -8
        },
        nasaScienceFact: 'Just 2 meters of lunar soil (regolith) provides equivalent radiation protection to Earth\'s atmosphere!',
        outcomeText: 'Crew successfully evacuated to the subterranean shelter. Surface science experiments were paused.'
      },
      {
        id: 'opt-water-wall',
        text: 'Pump Water Reserves into Habitat Radiation Wall Bladders',
        tooltip: 'Water molecules contain hydrogen atoms which are exceptionally effective at absorbing high-energy solar protons.',
        resourceDeltas: {
          water: -18,
          energy: -15,
          radiationShielding: 35,
          crewHealth: 5
        },
        nasaScienceFact: 'Hydrogen is the lightest element and the best shield against cosmic protons. NASA designs habitats with water storage tanks encircling astronaut sleep quarters.',
        outcomeText: 'Water bladder shielding absorbed 92% of incoming cosmic rays! Some water was lost to radiator cooling loops.'
      }
    ]
  },
  {
    id: 'evt-dust-accumulation',
    title: 'Lunar Regolith Dust Storm on Photovoltaic Array',
    category: 'equipment_dust',
    severity: 'moderate',
    dayTrigger: 3,
    description: 'Electrostatic levitation of ultra-fine lunar regolith has coated the main solar panel farm. Power generation efficiency has dropped by 45%. Without cleaning, the batteries will deplete by nightfall.',
    educationalContext: 'Unlike rounded Earth sand, lunar dust is razor-sharp glass and crushed rock created by billions of years of meteorite impacts. It clings tenaciously to solar panels due to electrostatic charge from solar ultraviolet light.',
    nasaDataConnection: {
      source: 'NASA Lunar Reconnaissance Orbiter (LRO)',
      dataset: 'Regolith Triboelectric Charging Study',
      detail: 'Apollo 17 astronauts reported lunar dust jammed suit joints and covered equipment within hours.'
    },
    iconName: 'Sparkles',
    options: [
      {
        id: 'opt-dust-blower',
        text: 'Activate Electrodynamic Dust Shield (EDS) Ultrasonic Vibrators',
        tooltip: 'Uses pulsed electric fields to lift and flick abrasive dust off solar glass without scratching.',
        resourceDeltas: {
          energy: -22,
          sciencePoints: 10
        },
        nasaScienceFact: 'NASA\'s Electrodynamic Dust Shield (EDS) uses tiny invisible electrode wires to shake charged dust particles off solar panels and camera lenses.',
        outcomeText: 'The EDS pulses successfully cleared 85% of dust! Solar power generation restored to near 100%.'
      },
      {
        id: 'opt-eva-brush',
        text: 'Deploy Astronaut on EVA with Mechanical Carbon-Fiber Brushes',
        tooltip: 'Saves electrical power, but risks astronaut fatigue and suit abrasion.',
        resourceDeltas: {
          energy: -5,
          oxygen: -12,
          crewHealth: -5,
          crewMorale: -5
        },
        nasaScienceFact: 'Apollo astronauts found manual brushing caused microscopic scratches on optical visors due to jagged silica glass shards.',
        outcomeText: 'The crew wiped the panels clean manually, but the astronaut returned exhausted with minor suit seal abrasion.'
      },
      {
        id: 'opt-dust-ignore',
        text: 'Delay Cleaning & Switch to Emergency Fuel Cell Batteries',
        tooltip: 'Avoids spending resources right now, but burns precious chemical fuel reserve.',
        resourceDeltas: {
          energy: -30,
          crewMorale: -2
        },
        nasaScienceFact: 'Space missions carry auxiliary fuel cells (combining hydrogen and oxygen) as backup power when solar arrays are shaded.',
        outcomeText: 'Backup batteries kept systems humming, but total outpost energy reserves took a steep hit.'
      }
    ]
  },
  {
    id: 'evt-oxygen-scrubber',
    title: '🚨 ECLSS Anomaly: Carbon Dioxide Scrubber Overheating',
    category: 'life_support',
    severity: 'high',
    dayTrigger: 4,
    description: 'The Environmental Control and Life Support System (ECLSS) Sabatier reactor has overheated. $CO_2$ scrubbers are throttling down, and cabin carbon dioxide levels are beginning to rise. Crew is reporting headaches!',
    educationalContext: 'Humans inhale oxygen and exhale carbon dioxide. In an enclosed spacecraft or lunar base, $CO_2$ buildup is toxic and causes drowsiness, confusion, and suffocation if not removed continuously.',
    nasaDataConnection: {
      source: 'NASA ECLSS Engineering Directorate',
      dataset: 'ISS Environmental Life Support Metrics',
      detail: 'The ISS recycling system recovers over 98% of breathable oxygen using Sabatier catalytic reduction.'
    },
    iconName: 'Wind',
    options: [
      {
        id: 'opt-purge-backup-o2',
        text: 'Purge Backup Liquid Oxygen Reserves into the Habitat',
        tooltip: 'Rapidly dilutes cabin air with pure oxygen while cycling the scrubber cooling loop.',
        resourceDeltas: {
          oxygen: -25,
          energy: -10,
          crewHealth: 5,
          crewMorale: 5
        },
        nasaScienceFact: 'NASA bases store high-pressure cryogenic liquid oxygen tanks as an emergency lifeline when mechanical scrubbers fail.',
        outcomeText: 'Fresh oxygen rushed through the vents! Crew headaches dissipated immediately, but liquid $O_2$ reserves are lower.'
      },
      {
        id: 'opt-hydroponic-boost',
        text: 'Overclock Greenhouse Hydroponics to Absorb Excess CO2',
        tooltip: 'Plants naturally absorb carbon dioxide and emit oxygen through photosynthesis under full-spectrum LED arrays.',
        resourceDeltas: {
          energy: -20,
          water: -15,
          oxygen: 15,
          food: 10
        },
        nasaScienceFact: 'NASA\'s Advanced Plant Habitat (APH) on the space station tests biological life support where crops act as living air purifiers.',
        outcomeText: 'The greenhouse crops thrived under boosted LED lighting, absorbing $CO_2$ and providing a surge of oxygen and fresh microgreens!'
      },
      {
        id: 'opt-reboot-scrubber',
        text: 'Perform High-Pressure Nitrogen Flush on Sabatier Core',
        tooltip: 'Requires engineering precision. Consumes energy and risks partial failure if not timed right.',
        resourceDeltas: {
          energy: -18,
          oxygen: -10,
          sciencePoints: 15
        },
        nasaScienceFact: 'The Sabatier reaction combines waste $CO_2$ with $H_2$ at 400°C over a nickel catalyst to produce water and methane.',
        outcomeText: 'The engineer\'s quick thinking flushed out catalyst debris. The scrubber cooled down and resumed normal operation.'
      }
    ]
  },
  {
    id: 'evt-water-leak',
    title: 'Water Recycling Loop Pressure Drop & Leak Detected',
    category: 'life_support',
    severity: 'moderate',
    dayTrigger: 5,
    description: 'Telemetry indicates a 15% pressure drop in the water recovery distillation processor. Graywater lines are dripping into the service crawlspace near the battery racks!',
    educationalContext: 'Every liter of water weighs 1 kilogram. Launching water from Earth to the Moon costs thousands of dollars per kilo, making a closed-loop water recovery efficiency of >98% mandatory for lunar survival.',
    nasaDataConnection: {
      source: 'NASA OSDR Study #OSDR-529',
      dataset: 'Microbial Biofilm Formation in Space Water Filters',
      detail: 'Biofilms can clog micro-pores in space water processors, causing localized pipe pressure spikes.'
    },
    iconName: 'Droplets',
    options: [
      {
        id: 'opt-auto-sealant',
        text: 'Inject Smart Polymeric Sealant into Water Conduit Loop',
        tooltip: 'Seals microscopic fractures quickly from the inside, consuming chemical supplies.',
        resourceDeltas: {
          energy: -12,
          water: -8,
          crewHealth: 0
        },
        nasaScienceFact: 'Self-healing polymers developed for aerospace automatically polymerize upon contact with vacuum or pressure differentials.',
        outcomeText: 'Polymer sealant plugged the pinhole leaks inside the conduit. Water loss was kept to a minimum.'
      },
      {
        id: 'opt-manual-rewire',
        text: 'Reroute Plumbing via Greenhouse Irrigation System',
        tooltip: 'Diverts unfiltered water temporarily to plant soil, saving human drinking water.',
        resourceDeltas: {
          water: -15,
          food: 15,
          energy: -8
        },
        nasaScienceFact: 'Biological bio-filtration using engineered wetland root zones (rhizofiltration) can pre-clean graywater in space stations.',
        outcomeText: 'The plants filtered the runoff water, boosting crop harvest while engineers fixed the main line!'
      },
      {
        id: 'opt-isolate-loop',
        text: 'Isolate Damaged Manifold & Restrict Crew Water Rations to 2L/day',
        tooltip: 'Conserves water without spending energy, but impacts crew comfort and hydration.',
        resourceDeltas: {
          water: 0,
          crewMorale: -10,
          crewHealth: -5
        },
        nasaScienceFact: 'NASA flight surgeons establish minimum hydration levels of 2.5 liters daily to prevent kidney stones in microgravity.',
        outcomeText: 'Water was fully conserved, but astronauts reported dehydration fatigue and irritability.'
      }
    ]
  },
  {
    id: 'evt-science-discovery',
    title: '🔬 Rover Discovery: Pure Subsurface Ice Core in Shackleton Crater',
    category: 'science_discovery',
    severity: 'low',
    dayTrigger: 6,
    description: 'Autonomous Rover "Hermes" drilling into the permanently shadowed rim of Shackleton Crater has struck a deposit of ancient primordial ice at -220°C! The team can harvest and vapor-extract it.',
    educationalContext: 'Permanently shadowed craters at the lunar poles have acted as cold traps for billions of years, capturing cometary water ice. This ice can be split into hydrogen (rocket fuel) and oxygen (for breathing)!',
    nasaDataConnection: {
      source: 'NASA Lunar Reconnaissance Orbiter (LRO) LAMP/LEND Instruments',
      dataset: 'South Pole Hydrogen Neutron Flux Mapping',
      detail: 'Estimated hundreds of millions of metric tons of water ice sequestered in lunar polar cold traps.'
    },
    iconName: 'Compass',
    options: [
      {
        id: 'opt-harvest-ice',
        text: 'Deploy Thermal Drill to Extract & Melt 50 Liters of Ice',
        tooltip: 'Uses significant electrical energy to melt cryogenic ice, but yields abundant water reserves.',
        resourceDeltas: {
          energy: -28,
          water: 45,
          sciencePoints: 30
        },
        nasaScienceFact: 'In-Situ Resource Utilization (ISRU) is the cornerstone of NASA\'s Artemis missions — "living off the land" rather than shipping everything from Earth.',
        outcomeText: 'Spectacular success! 45 liters of clean cometary water extracted and pumped into base reservoirs!'
      },
      {
        id: 'opt-electrolysis-fuel',
        text: 'Electrolyze the Meltwater into Oxygen & Hydrogen Fuel',
        tooltip: 'Converts melted water molecules ($H_2O$) into breathable oxygen and energy cells.',
        resourceDeltas: {
          energy: -15,
          oxygen: 35,
          sciencePoints: 25
        },
        nasaScienceFact: 'Splitting lunar water with electricity produces liquid oxygen ($LOX$) and liquid hydrogen ($LH_2$), the same propellant used by the Saturn V and SLS rockets!',
        outcomeText: 'Electrolysis tanks generated a massive surplus of pure breathable oxygen for the outpost.'
      },
      {
        id: 'opt-sample-preservation',
        text: 'Preserve Pristine Core Samples in Cryogenic Vault for Earth Analysis',
        tooltip: 'Maximizes scientific discovery points at the expense of base resources.',
        resourceDeltas: {
          energy: -20,
          sciencePoints: 60,
          crewMorale: 10
        },
        nasaScienceFact: 'Pristine cometary ice samples from the Moon could reveal how water and prebiotic molecules first arrived on the early Earth 4 billion years ago.',
        outcomeText: 'NASA Headquarters and scientists worldwide are celebrating this historic discovery! Science score skyrocketed!'
      }
    ]
  },
  {
    id: 'evt-comms-delay',
    title: 'Deep Space Network Antenna Alignment Glitch',
    category: 'comms_anomaly',
    severity: 'low',
    dayTrigger: 7,
    description: 'The high-gain X-band parabolic dish tracking Earth\'s Goldstone tracking station has drifted off by 2.3 degrees due to thermal expansion. Live telemetry with Houston Mission Control has paused.',
    educationalContext: 'NASA\'s Deep Space Network (DSN) consists of giant 70-meter antennas situated in California, Spain, and Australia, ensuring 24/7 continuous line-of-sight communication with spacecraft throughout the solar system.',
    nasaDataConnection: {
      source: 'NASA Deep Space Network (DSN)',
      dataset: 'Lunar Communication & Navigation Architecture',
      detail: 'Communication delay to the Moon is ~1.3 seconds each way. To Mars, delay is up to 22 minutes!'
    },
    iconName: 'Radio',
    options: [
      {
        id: 'opt-laser-comms',
        text: 'Switch to Experimental Lunar Laser Communication System (LLCD)',
        tooltip: 'Uses infrared optical lasers for high-bandwidth data transmission directly to Earth.',
        resourceDeltas: {
          energy: -15,
          sciencePoints: 20,
          crewMorale: 5
        },
        nasaScienceFact: 'NASA\'s Optical Communications demonstrated 622 Mbps download speeds from the Moon, allowing 4K ultra-HD video streaming!',
        outcomeText: 'Optical laser lock established! Crystal-clear high-definition video link restored to Mission Control.'
      },
      {
        id: 'opt-autonomous-mode',
        text: 'Run on Local AI CAPCOM Autonomy & Recalibrate Dish Servos Slowly',
        tooltip: 'Saves energy and exercises outpost crew self-reliance.',
        resourceDeltas: {
          energy: -5,
          crewMorale: 0,
          sciencePoints: 10
        },
        nasaScienceFact: 'Astronauts on future deep space missions will operate with high autonomy because communication delays make real-time Earth guidance impossible.',
        outcomeText: 'Outpost AI CAPCOM seamlessly managed autonomous operations until dish alignment was re-indexed.'
      }
    ]
  }
];

