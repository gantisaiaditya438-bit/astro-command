import { PlanetData, PlanetaryMissionTask, ScienceSample, ControlMode } from '../types/solar';
import { OutpostResources } from '../types';

export interface AstroBuddyContext {
  currentView: string;
  selectedPlanet?: PlanetData;
  controlMode?: ControlMode;
  currentMission?: PlanetaryMissionTask | null;
  resources?: OutpostResources;
  dustLevel?: number;
  activeSolarStorm?: boolean;
  collectedSamplesCount?: number;
  recentSample?: ScienceSample | null;
  crewStatus?: { avgHealth: number; inShelter: boolean };
  astronautRank?: string;
  sciencePoints?: number;
}

export interface AstroQuizQuestion {
  id: string;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: 'A' | 'B' | 'C';
  explanation: string;
  points: number;
}

export const ASTRO_BUDDY_QUIZZES: AstroQuizQuestion[] = [
  {
    id: 'quiz-spacesuit',
    question: 'Why do astronauts have to wear spacesuits on the Moon and Mars?',
    options: [
      { label: 'A', text: 'To look cool for space photos' },
      { label: 'B', text: 'To provide oxygen, air pressure, and thermal protection from extreme temperatures' },
      { label: 'C', text: 'To help them fly faster like a rocket' }
    ],
    correctAnswer: 'B',
    explanation: 'Awesome job! Space is a freezing vacuum without air pressure or oxygen. Spacesuits act like miniature, personal one-person spacecraft that keep astronauts safe and breathing!',
    points: 15
  },
  {
    id: 'quiz-mars-red',
    question: 'Why does Mars look red when viewed through telescopes from Earth?',
    options: [
      { label: 'A', text: 'Its surface is covered in iron-rich minerals that oxidized into rust' },
      { label: 'B', text: 'It is hot and made of molten lava' },
      { label: 'C', text: 'Red plants and moss grow all over the valleys' }
    ],
    correctAnswer: 'A',
    explanation: 'Correct! The Martian soil and rocks are rich in iron. When exposed to ancient water and trace oxygen, the iron turned into rusty iron oxide dust!',
    points: 15
  },
  {
    id: 'quiz-lunar-gravity',
    question: 'How does gravity on the Moon compare to gravity on Earth?',
    options: [
      { label: 'A', text: 'Moon gravity is 10 times stronger' },
      { label: 'B', text: 'There is zero gravity on the Moon' },
      { label: 'C', text: 'Moon gravity is about 1/6th of Earth gravity (0.166g)' }
    ],
    correctAnswer: 'C',
    explanation: 'Spot on, Commander! Because the Moon has much less mass than Earth, its gravity is only 1/6th as strong. That is why astronauts could bound and hop in giant leaps across the craters!',
    points: 15
  },
  {
    id: 'quiz-moxie',
    question: 'How does NASA’s MOXIE instrument create oxygen on Mars?',
    options: [
      { label: 'A', text: 'It pumps air from secret underground caverns' },
      { label: 'B', text: 'It uses solid oxide electrolysis to split carbon dioxide (CO2) into oxygen (O2) and carbon monoxide' },
      { label: 'C', text: 'It uses solar panels to melt red Martian rocks' }
    ],
    correctAnswer: 'B',
    explanation: 'Brilliant engineering knowledge! Mars atmosphere is 95% carbon dioxide. MOXIE heats it to 800°C and strips out the oxygen atoms so future astronauts can breathe and fuel their return rockets!',
    points: 15
  },
  {
    id: 'quiz-solar-storm',
    question: 'What dangerous hazard does the Sun unleash during a solar storm?',
    options: [
      { label: 'A', text: 'Giant flaming comets' },
      { label: 'B', text: 'High-energy cosmic radiation protons traveling near the speed of light' },
      { label: 'C', text: 'A blackout of all sunlight for 20 years' }
    ],
    correctAnswer: 'B',
    explanation: 'Exactly right! Coronal Mass Ejections blast billions of tons of high-energy protons. Deep regolith shelters and water-filled walls stop these protons from damaging astronaut cells!',
    points: 15
  },
  {
    id: 'quiz-saturn-rings',
    question: 'What are Saturn’s spectacular rings made of?',
    options: [
      { label: 'A', text: 'Solid sheets of polished steel' },
      { label: 'B', text: 'Billions of chunks of glittering water-ice and rock, from tiny pebbles to house-sized boulders' },
      { label: 'C', text: 'Glowing neon gas' }
    ],
    correctAnswer: 'B',
    explanation: 'You got it! Saturn’s rings are 99% pure water-ice debris from destroyed icy moons and comets. They reflect sunlight like thousands of floating diamonds!',
    points: 15
  }
];

export const SUGGESTED_BUDDY_QUESTIONS = [
  'What is a Coronal Mass Ejection?',
  'Explain the real Mars rover photos',
  'What did NASA discover at the Moon’s South Pole?',
  'How does space radiation affect astronaut blood cells?',
  'Why is Mars red?',
  'Can humans breathe on Mars?',
  'What should I do right now?',
  'Why is lunar dust so dangerous?'
];

/**
 * Intelligent Fallback & Knowledge Engine
 * Context-aware, child-friendly (ages 7-12), NASA science grounded.
 */
export function generateAstroBuddyFallbackResponse(
  userQuery: string,
  context: AstroBuddyContext
): string {
  const query = userQuery.toLowerCase().trim();

  // 1. Coronal Mass Ejection & Space Weather (NASA DONKI)
  if (
    query.includes('coronal mass') ||
    query.includes('cme') ||
    query.includes('solar flare') ||
    query.includes('space weather')
  ) {
    return `[Verified NASA Fact] A Coronal Mass Ejection (CME) expels billions of tons of magnetized solar plasma from the Sun's corona at velocities often exceeding 1,500 km/s, as monitored by NASA SDO and DONKI.\n\n[AI Explanation] Think of it like a giant cosmic solar sneeze that blasts high-energy protons across the solar system!\n\n[Simulated Gameplay Value] In ASTRO COMMAND, space weather alerts trigger base alarms, requiring you to divert power to electromagnetic shields or retreat to the regolith shelter.\n\nSource: https://kauai.ccmc.gsfc.nasa.gov/DONKI/`;
  }

  // 2. Real Mars Rover Photographs (Perseverance & Curiosity)
  if (
    query.includes('rover photo') ||
    query.includes('rover image') ||
    query.includes('mars photo') ||
    query.includes('perseverance photo') ||
    query.includes('curiosity photo')
  ) {
    return `[Verified NASA Fact] The images in our NASA Data Center were taken by NASA’s Perseverance and Curiosity rovers using Mastcam-Z and Navigation Cameras at Jezero and Gale craters.\n\n[AI Explanation] These cameras capture high-resolution panoramas of ancient river deltas and layered mudstones to search for signs of ancient microbial life!\n\n[Simulated Gameplay Value] Our 3D Mars terrain replicates the red dust and rock obstacles photographed by the rovers so you can test driving in low gravity.\n\nSource: https://mars.nasa.gov/mars2020/multimedia/raw-images/`;
  }

  // 3. Lunar South Pole & Shackleton Crater Discovery (NASA PDS / LRO)
  if (
    query.includes('south pole') ||
    query.includes('shackleton') ||
    query.includes('lunar discovery') ||
    query.includes('moon water') ||
    query.includes('lola')
  ) {
    return `[Verified NASA Fact] NASA’s Lunar Reconnaissance Orbiter (LRO) and the LOLA laser altimeter confirmed billions of kilograms of water-ice frozen in Permanently Shadowed Regions inside Shackleton Crater (-233°C / -388°F).\n\n[AI Explanation] Because sunlight strikes the lunar poles at a grazing angle, the crater rims receive continuous sunlight for solar power, while the dark floors preserve ice for rocket fuel and drinking water!\n\n[Simulated Gameplay Value] That’s why our ASTRO COMMAND lunar outpost is built on the Shackleton Crater rim!\n\nSource: https://pds-geosciences.wustl.edu/missions/lro/lola.htm`;
  }

  // 4. Astronaut Biology & Radiation (NASA OSDR)
  if (
    query.includes('blood') ||
    query.includes('stem cell') ||
    query.includes('osdr') ||
    query.includes('biology') ||
    query.includes('radiation health')
  ) {
    return `[Verified NASA Fact] NASA OSDR-194 research revealed that deep space radiation and heavy ions temporarily suppress bone marrow stem cells, inducing space anemia in astronauts.\n\n[AI Explanation] Without Earth’s protective magnetic umbrella, cosmic rays can damage cell division. Astronauts require hydrogen-rich water shielding and iron-rich nutrition.\n\n[Simulated Gameplay Value] In ASTRO COMMAND, crew health drops if your radiation shielding fails or if life support exercise racks lose power.\n\nSource: https://osdr.nasa.gov/bio/repo/data/studies/OSD-194`;
  }

  // 5. Mission Guidance: "What should I do now?" / "What is my mission?"
  if (
    query.includes('what should i do') ||
    query.includes('what do i do') ||
    query.includes('current mission') ||
    query.includes('next objective') ||
    query.includes('objective') ||
    query.includes('help me with mission')
  ) {
    if (context.currentMission) {
      const remainingObjectives = context.currentMission.objectives.slice(0, 2).join('; ');
      return `🚀 Mission Directive in progress, Commander! You are working on "${context.currentMission.title}". Your key objectives are: ${remainingObjectives}. Head towards the marked waypoint or building on your HUD to complete it!`;
    }
    if (context.currentView === 'explore_moon') {
      return `🌕 You are at Shackleton Base Camp on the Moon! Try opening the "Moon Directives" drawer in the top-left to pick your next task, or use WASD to explore the crater rim and look for glowing cometary ice crystals!`;
    }
    if (context.currentView === 'explore_mars') {
      return `🔴 Welcome to Ares Base Alpha at Jezero Crater, Mars! Check your "Mars Directives" drawer. You can inspect the MOXIE Oxygen plant, harvest microgreens in the Greenhouse, or drive the Perseverance rover across the sand dunes!`;
    }
    return `🪐 You are currently exploring the 3D Solar System! Click on any planet or the Moon to open its science dossier. When you find The Moon or Mars, hit the glowing "Explore Destination" button to fly down to the 3D surface base!`;
  }

  // 2. Survival & Life Support Diagnostics: "Are we safe?" / "Check resources"
  if (
    query.includes('oxygen') ||
    query.includes('water') ||
    query.includes('energy') ||
    query.includes('power') ||
    query.includes('resources') ||
    query.includes('life support') ||
    query.includes('survival')
  ) {
    if (context.resources) {
      const o2 = Math.round(context.resources.oxygen.current);
      const pwr = Math.round(context.resources.energy.current);
      const h2o = Math.round(context.resources.water.current);

      let advice = '';
      if (o2 < 30) {
        advice = '⚠️ Warning: Oxygen is under 30%! Divert power to the ECLSS scrubbers or greenhouse!';
      } else if (pwr < 25) {
        advice = '⚡ Caution: Battery storage is low! Switch the science lab to idle to conserve heat.';
      } else {
        advice = '✅ Life support is currently stable. Good job managing the base reserves!';
      }

      return `Telemetry Check: Oxygen is at ${o2}%, Energy at ${pwr}%, and Water at ${h2o}%. ${advice}`;
    }
    return `In space survival, astronauts rely on ECLSS (Environmental Control and Life Support Systems). We split water ice into breathable oxygen ($O_2$), recycle graywater with 98% efficiency, and collect solar photons with solar panel arrays!`;
  }

  // 3. Rover & Movement Controls: "How to drive" / "Controls"
  if (
    query.includes('control') ||
    query.includes('move') ||
    query.includes('drive') ||
    query.includes('walk') ||
    query.includes('rover') ||
    query.includes('jump')
  ) {
    return `🧑‍🚀 Movement Guide: Use W, A, S, D or the Arrow Keys to walk and steer. Press the SPACEBAR to perform a high low-gravity leap! You can switch between walking astronaut mode and the 6-wheel rover using the mode switcher in the top-right corner. If you are on a touch screen, use the on-screen virtual D-pad and LEAP button!`;
  }

  // 4. Sample Collection & Discoveries: "How to collect" / "Rocks"
  if (
    query.includes('sample') ||
    query.includes('collect') ||
    query.includes('rock') ||
    query.includes('crystal') ||
    query.includes('ice') ||
    query.includes('discovery')
  ) {
    if (context.recentSample) {
      return `🔬 Discovery Log: You inspected "${context.recentSample.name}"! ${context.recentSample.description}. NASA scientists study this because: ${context.recentSample.nasaFact}`;
    }
    return `💎 To collect extraterrestrial specimens, walk or drive your rover up to the glowing vertical light pillars scattered around the base. When you get close, press the 'E' key on your keyboard or tap the amber 'COLLECT' button on your screen to analyze and catalog it!`;
  }

  // 5. Planetary Specifics: "Why is Mars red?"
  if (query.includes('why is mars red') || (query.includes('mars') && query.includes('red'))) {
    return `Mars looks rusty red because its surface rocks and regolith are rich in iron! Over billions of years, trace amounts of oxygen and ancient liquid water rusted the iron into iron oxide (just like rusty metal on Earth). Winds blow this red dust across the whole planet!`;
  }

  // 6. Breathing on Mars: "Can humans breathe on Mars?"
  if (query.includes('breathe on mars') || (query.includes('mars') && query.includes('air'))) {
    return `No, humans cannot breathe on Mars without spacesuits! The Martian atmosphere is 100 times thinner than Earth’s and is 95% toxic carbon dioxide (CO2). But NASA’s MOXIE instrument proved we can split that CO2 into breathable oxygen!`;
  }

  // 7. Sleeping in space
  if (query.includes('sleep') && query.includes('space')) {
    return `Astronauts on the International Space Station sleep in sleeping bags strapped tightly to the walls! Because there is no gravity pulling them down, they don’t need mattresses or pillows. If they didn't strap themselves down, they would float around and bump into computers in the middle of the night!`;
  }

  // 8. Solar storm questions
  if (query.includes('solar storm') || query.includes('solar flare') || query.includes('radiation')) {
    return `A solar storm happens when magnetic tangles on the Sun erupt, blasting billions of tons of high-energy protons into space! These protons travel millions of miles an hour. On our Moon base, astronauts must retreat into subterranean radiation shelters shielded by thick lunar rock and water bladders.`;
  }

  // 9. Lunar Dust
  if (query.includes('dust') || query.includes('regolith')) {
    return `Moon dust is made of sharp, jagged pulverized glass created by billions of meteorite impacts! Because the Moon has no wind or rain to round the edges, lunar dust is sharp like microscopic crushed glass and clings to spacesuits with static electricity!`;
  }

  // 10. Saturn Rings
  if (query.includes('saturn') && (query.includes('ring') || query.includes('rings'))) {
    return `Saturn’s rings are huge—spanning 175,000 miles across—yet they are only about 30 feet thick! They are made of billions of chunks of 99% pure water-ice and dust, ranging in size from tiny ice cubes to giant house-sized icebergs!`;
  }

  // 11. Gravity
  if (query.includes('gravity') || query.includes('what is gravity')) {
    return `Gravity is the invisible force that pulls masses toward each other! Earth’s large mass gives it 1.0g gravity. The Moon has less mass, so its gravity is only 1/6th of Earth’s (you can jump 6 times higher!). In deep space, you feel weightless because you are in free-fall!`;
  }

  // 12. Contextual default based on active planet
  if (context.selectedPlanet) {
    const p = context.selectedPlanet;
    return `Commander, you are looking at ${p.name}! ${p.tagline}. Surface temperature: ${p.temperatureDesc}, with gravity of ${p.surfaceGravityDesc}. ${p.whyHumansCannotLiveHere}`;
  }

  // General child-friendly fallback
  return `That’s a stellar question, Junior Astronaut! Exploring the cosmos is all about curiosity. You can ask me about rockets, spacesuits, planetary gravity, survival life support, or how to steer your rover across the craters!`;
}
