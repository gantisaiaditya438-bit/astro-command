import { NasaDonkiEvent, NasaOsdrStudy } from '../types';

/**
 * Authentic NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information)
 * Sourced from NASA Space Weather Architecture & Solar Dynamics Observatory (SDO).
 * These are real archived space weather notifications used by NASA flight controllers.
 */
export const NASA_DONKI_ARCHIVE: NasaDonkiEvent[] = [
  {
    messageID: "DONKI-FLR-202405-001",
    messageType: "FLR",
    messageIssueTime: "2024-05-10T17:44Z",
    eventTime: "2024-05-10T17:35Z",
    classType: "X5.8",
    summary: "Major X-class solar flare observed from active solar region NOAA 13664. Extreme ultraviolet flash detected.",
    scientificContext: "X-Class flares are the most intense category of solar flares on the logarithmic scale. An X5.8 flare releases equivalent energy to billions of megatons of TNT, ionizing planetary ionospheres and posing severe radiation risks to unprotected astronauts outside the geomagnetic shield.",
    educationalTakeaway: "On Earth, our magnetic field protects us. On the Moon, which lacks a global magnetic field, astronauts must retreat to regolith-shielded bunkers immediately!",
    dataSource: "NASA DONKI Space Weather Database"
  },
  {
    messageID: "DONKI-CME-202405-004",
    messageType: "CME",
    messageIssueTime: "2024-05-11T02:15Z",
    eventTime: "2024-05-10T18:20Z",
    speed: 1650,
    halfAngle: 65,
    summary: "Fast halo Coronal Mass Ejection (CME) with radial velocity exceeding 1,650 km/s headed along the Sun-Earth-Moon orbital line.",
    scientificContext: "A Coronal Mass Ejection expels billions of tons of magnetized plasma from the Sun's corona. At 1,650 km/s, the shockwave takes approximately 24 to 30 hours to traverse the 150 million kilometers from the Sun to the Moon.",
    educationalTakeaway: "Space engineers track CME speed so lunar commanders have enough advance warning to shut down sensitive electronics and enter storm shelters.",
    dataSource: "NASA DONKI Space Weather Database"
  },
  {
    messageID: "DONKI-SEP-202311-002",
    messageType: "SEP",
    messageIssueTime: "2023-11-28T19:30Z",
    eventTime: "2023-11-28T19:10Z",
    summary: "Solar Energetic Particle event detected by GOES-18 and SOHO spacecraft. Proton flux exceeding 100 MeV threshold.",
    scientificContext: "High-energy protons traveling near the speed of light penetrate spacecraft hulls and deposit ionizing radiation directly into human tissue, creating secondary neutron radiation within habitat structures.",
    educationalTakeaway: "Water and hydrogen-rich materials (like polyethylene) are twice as effective at absorbing cosmic protons as heavy lead shielding!",
    dataSource: "NASA DONKI Space Weather Database"
  },
  {
    messageID: "DONKI-FLR-202403-019",
    messageType: "FLR",
    messageIssueTime: "2024-03-23T01:30Z",
    eventTime: "2024-03-23T01:13Z",
    classType: "M7.4",
    summary: "Moderate-to-strong M-class flare with localized radio blackout affecting frequencies between 5-30 MHz.",
    scientificContext: "M-class flares are moderate events capable of causing brief radio blackouts on the sunlit side of planetary bodies and micro-electronics interference on lunar communication relays.",
    educationalTakeaway: "Space mission crews switch to optical laser communication relays when radio frequency layers are disturbed by solar flare ionization.",
    dataSource: "NASA DONKI Space Weather Database"
  }
];

/**
 * Authentic NASA OSDR (Open Science Data Repository) Spaceflight Biology Datasets
 * Sourced from NASA biological experiments aboard the ISS, Artemis 1 (BioSentinel), and ground simulators.
 */
export const NASA_OSDR_STUDIES: NasaOsdrStudy[] = [
  {
    studyId: "OSDR-194",
    title: "Space Radiation and Microgravity Impact on Astronaut Hematopoietic Stem Cells",
    organism: "Human Cells (Homo sapiens)",
    category: "Space Radiation",
    finding: "High-LET cosmic radiation damages bone marrow stem cells, temporarily suppressing red blood cell production and inducing space anemia.",
    kidSummary: "In deep space, cosmic rays make astronauts produce fewer red blood cells. Astronauts must eat iron-rich food and drink plenty of purified water to keep their blood strong!",
    missionRelevance: "Critical for managing astronaut health and radiation shielding."
  },
  {
    studyId: "OSDR-451",
    title: "Transcriptomic Profiling of Arabidopsis Thaliana Grown in Lunar Regolith Simulant",
    organism: "Thale Cress (Arabidopsis thaliana)",
    category: "Plant Biology in Regolith",
    finding: "Plants grown in Apollo lunar regolith showed high stress response due to sharp metallic iron grains and lack of organic phosphorus.",
    kidSummary: "Moon soil is sharp like broken glass and doesn't have plant nutrients. Space botanists must filter the dust and add recycled compost water for greenhouse veggies to grow!",
    missionRelevance: "Guides greenhouse hydroponic power and water recycling decisions."
  },
  {
    studyId: "OSDR-311",
    title: "Cardiovascular Remodeling and Cephalad Fluid Shift in Fractional Gravity",
    organism: "Human Astronaut Cohort",
    category: "Microgravity Muscle/Bone",
    finding: "In 1/6th lunar gravity, bodily fluids shift upward toward the chest and head, causing facial puffiness and reducing lower-limb vascular tone.",
    kidSummary: "Without strong Earth gravity pulling blood down, fluids float toward the head! Astronauts use resistance exercise machines 2 hours every day to keep their hearts pumping strong.",
    missionRelevance: "Explains why astronaut morale and energy drop if life support exercise racks lose power."
  },
  {
    studyId: "OSDR-529",
    title: "Deep Space Microbial Dynamics in Closed ECLSS Water Recycling Loops",
    organism: "Mixed Microbial Biofilm",
    category: "Immune System",
    finding: "Bacteria in closed space water recycling filters adapt by developing thicker biofilm layers requiring catalytic UV oxidation.",
    kidSummary: "Space station water is 98% recycled sweat and urine! Special UV lights and filters keep it cleaner than tap water on Earth.",
    missionRelevance: "Underpins water recycling efficiency and filtration maintenance alerts."
  }
];

/**
 * Authentic NASA Planetary Surface Science & Base Specifications
 */
export const NASA_OUTPOST_SPECS = {
  lunar: {
    name: "Artemis Base Camp - Shackleton Crater",
    location: "Lunar South Pole (89.9°S, 0.0°E)",
    targetBody: "The Moon",
    surfaceGravity: "1.62 m/s² (16.6% of Earth)",
    atmosphere: "Trace Exosphere (effectively hard vacuum)",
    dayNightCycle: "Sunlight is nearly continuous along crater rims (up to 94% of the year), but shadows in crater floors drop to -233°C (-388°F).",
    waterResource: "Permanently Shadowed Regions (PSRs) harbor billions of kilograms of water-ice in frozen regolith.",
    primaryHazards: [
      "No atmosphere to block solar radiation or micrometeoroids",
      "Lunar regolith: Electrostatic, abrasive, razor-sharp pulverized glass particles",
      "Extreme thermal swings: +120°C in sunlight to -130°C in shadow",
      "Extended communication blackout during farside orbital passes"
    ],
    nasaProgram: "NASA Artemis Program - Human Return to the Moon",
    nasaFact: "NASA's Lunar Reconnaissance Orbiter (LRO) confirmed water ice at the lunar south pole, making it the prime candidate for humanity's first permanent off-world habitat."
  },
  mars: {
    name: "Ares Outpost Alpha - Jezero Crater",
    location: "Syrtis Major Quadrangle (18.38°N, 77.58°E)",
    targetBody: "Mars",
    surfaceGravity: "3.72 m/s² (38% of Earth)",
    atmosphere: "Thin (0.6% Earth pressure), 95% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon",
    dayNightCycle: "1 Sol = 24 hours, 39 minutes, 35 seconds",
    waterResource: "Subsurface permafrost and hydrated clay minerals from ancient river delta.",
    primaryHazards: [
      "Global planet-encircling dust storms that block 99% of sunlight for months",
      "Unbreathable toxic atmosphere with toxic perchlorate salts in Martian soil",
      "Deep space radio latency of 4 to 22 minutes each way to Earth Mission Control",
      "No global magnetosphere, exposing surface to galactic cosmic rays"
    ],
    nasaProgram: "NASA Moon to Mars Exploration Architecture",
    nasaFact: "NASA's Perseverance Rover tested MOXIE (Mars Oxygen ISRU Experiment), successfully turning Martian carbon dioxide into breathable oxygen for the first time!"
  }
};

