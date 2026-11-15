# ASTRO COMMAND – Solar System Exploration & Planetary Survival Game 🚀🪐

> **Vision:** An interactive 3D Solar System Exploration and Planetary Survival Game designed for children aged 7–12, students, and educators.  
> **Platform:** React 18, Three.js, React Three Fiber, Drei, TypeScript, Tailwind CSS, Web Audio API  
> **Scientific Integrity:** Powered by authentic **NASA open science** (NASA DONKI, NASA OSDR, NASA Planetary Fact Sheets, and LRO/MRO data).

---

## 🌟 Expansion Highlights

### 1. 🪐 Interactive 3D Solar System Hub
- **Orbital Visualization:** Sun and all 8 major planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune) plus the Moon orbiting with educational scales.
- **Interactive Planet Selection:** Click any planet or use the bottom carousel to inspect its 3D model, distance from Sun in AU and km, orbital period, surface gravity, and temperature range.
- **"Could humans live here without special equipment?":** Clear, scientifically grounded, child-friendly explanations explaining why each celestial body is habitable or hazardous.
- **Hyper-Drive Travel Trajectory:** Travel directly to playable destinations (the Moon and Mars) with an animated warp sequence.

---

### 2. 🌕 Playable Destination A: The Moon (Shackleton Crater Base)
- **3D Surface Environment:** South Pole landing site, permanently shadowed water-ice craters, geodesic habitat dome, dual-axis tracking solar panels, Sabatier oxygen plant, greenhouse bio-dome, and autonomous rover "Hermes".
- **Player Controls:**
  - **Walk as Astronaut:** Keyboard **WASD** / Arrow keys to walk, **Spacebar** to leap in fractional 1/6th lunar gravity!
  - **Drive Rover:** Steer the 6-wheel rover across the regolith.
  - **Touch / Mobile Friendly:** Responsive on-screen controls and camera panning.
- **Geological Sample Collection:** Pick up ancient Apollo-grade lunar basalt and cometary water-ice cores for science points.
- **6 Lunar Missions:**
  1. *First Steps on the Moon*
  2. *Collect Lunar Samples*
  3. *Repair Oxygen Generator*
  4. *Restore Solar Power*
  5. *Find and Study Lunar Ice*
  6. *Survive a Solar Storm*

---

### 3. 🔴 Playable Destination B: Mars (Ares Base Alpha at Jezero Crater)
- **3D Martian Landscape:** Iron-oxide red dunes, Jezero river delta sediment channels, dust devils, and butterscotch atmospheric sky.
- **Mars Survival Infrastructure:**
  - **NASA MOXIE $O_2$ Extraction Plant:** Solid oxide electrolysis converting 95% Martian $CO_2$ into breathable oxygen.
  - **Pressurized Greenhouse Bio-Dome:** Hydroponic microgreens with full-spectrum LED grow arrays.
  - **Subsurface Ice Melting Station:** Heated conduit loops preventing freeze-up in -70°C nights.
  - **Mars Exploration Rover "Perseverance II":** Rocker-bogie rover exploring ancient clays.
- **6 Mars Missions:**
  1. *First Landing on Mars*
  2. *Explore the Red Planet*
  3. *Investigate a Dust Storm*
  4. *Repair the Water System*
  5. *Grow Food in the Greenhouse*
  6. *Maintain the Mars Habitat*

---

### 4. 🛰️ Other Planet Exploration & Deep Space Probes
- **Mercury:** Extreme temperature swings (-180°C to +430°C) and MESSENGER polar ice radar scans.
- **Venus:** DAVINCI simulated heat-shield probe descent through 92 atm sulfuric acid cloud decks.
- **Earth:** The fragile oasis: oceans, nitrogen-oxygen atmosphere, and the geomagnetic shield.
- **Jupiter:** Simulated Juno orbital probe flyby of the Great Red Spot and radiation belts (clearly explaining gas giants have no solid surface to walk on!).
- **Saturn:** Cassini probe exploration of shimmering water-ice rings and geyser moon Enceladus.
- **Uranus & Neptune:** Ice giants with supersonic winds, methane atmospheres, and extreme orbital tilts.

---

### 5. ⚖️ Planetary Survival Matrix
- Interactive side-by-side comparison matrix comparing any two planets:
  - Surface temperature (°C / °F)
  - Surface gravity (% of Earth)
  - Atmospheric pressure & composition
  - Water availability & radiation risks
  - Habitability verdict with NASA scientific insights.

---

### 6. 🏅 Junior Astronaut Profile & Achievements
- **Rank Progression:** Cadet Trainee ➔ Junior Mission Specialist ➔ Senior Flight Engineer ➔ Master Artemis Commander ➔ Solar System Pioneer.
- **Achievement Cabinet:** 10 collectible badges (*First Footprint*, *Off-World Driver*, *Deep Ice Miner*, *Solar Storm Shield*, *Red Planet Pioneer*, *Solar Cartographer*, etc.).
- **Planetary Discovery Museum:** Geological sample catalog with descriptions and authentic NASA science facts.

---

### 7. 🤖 ASTRO BUDDY – Your AI Space Companion
- **Animated Robot Character:** Futuristic floating astronaut robot with expressive digital LED eyes, blinking signals, talking mouth visualizer, and levitation thruster.
- **7 AI Capabilities:**
  1. **Space Teacher:** Answers questions about the solar system, gravity, rockets, spacesuits, and black holes for ages 7–12.
  2. **Planet Expert:** Automatically adapts to whichever celestial body the player selects (Moon, Mars, Earth, Jupiter, etc.).
  3. **Mission Guide:** Provides real-time guidance on active directives from the simulation state.
  4. **Survival Advisor:** Proactive monitoring of oxygen, energy, water, dust, and solar storm radiation.
  5. **Game Tutor:** Teaches astronaut walking, rover steering, sample harvesting, and base systems management.
  6. **Quiz Master:** Interactive multiple-choice trivia awarding +15 Science Points for correct answers.
  7. **Discovery Explainer:** Detailed scientific analysis of any extraterrestrial sample collected.
- **Live AI & Fallback:** Server-side API endpoint (`/api/astro-buddy`) reading `GEMINI_API_KEY` or `OPENAI_API_KEY` with automatic fallback to the local NASA knowledge engine.
- **Speech Synthesis:** Optional voice narration with child-friendly robot tone and live subtitle bar.

---

## 🗺️ Main Navigation

1. 🪐 **Solar System** – Interactive 3D orbital hub
2. 🌕 **The Moon** – 3D Shackleton Base & astronaut controller
3. 🔴 **Mars Base** – 3D Jezero Crater expedition
4. 🔭 **Discovery** – Deep space probe telemetry missions
5. ⚖️ **Survival Matrix** – Planetary comparison tool
6. 📚 **Learning Lab** – STEM encyclopedia & certification quiz
7. 🖥️ **Mission Control** – 2D tactical ECLSS dashboard
8. 🏅 **Achievements** – Astronaut rank & specimen museum

---

## 🎮 How to Run

The development server is actively running at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

To run or build in terminal:
```powershell
npm run dev      # Start development server
npm run build    # Build production bundle
npm run preview  # Preview production build
```
