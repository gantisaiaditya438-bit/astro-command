import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { PlanetId } from '../../types/solar';
import {
  Camera,
  Radio,
  Sparkles,
  ExternalLink,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Layers,
  Compass,
  ShieldCheck,
  Eye,
  Rocket,
  Info,
  Calendar,
  UserCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';
import { NasaImageRecord } from '../../types/nasaImages';
import {
  CURATED_NASA_PLANET_COLLECTIONS,
  searchNasaImageLibrary
} from '../../services/nasaImageLibraryService';

// Celestial body definition with robotic spacecraft history
interface BodyExplorationMeta {
  id: PlanetId;
  collectionKey: string;
  name: string;
  category: 'Terrestrial' | 'Moon' | 'Gas Giant' | 'Ice Giant';
  hasSolidSurface: boolean;
  surfaceSummary: string;
  scientificRule: string;
  color: string;
  spacecraftMissions: Array<{
    name: string;
    agency: string;
    type: 'Orbiter' | 'Surface Rover' | 'Crewed Mission' | 'Flyby Probe' | 'Radar Mapper';
    timeframe: string;
    discoveries: string[];
  }>;
}

const BODIES_METADATA: BodyExplorationMeta[] = [
  {
    id: 'mercury',
    collectionKey: 'Mercury',
    name: 'Mercury',
    category: 'Terrestrial',
    hasSolidSurface: true,
    color: '#94a3b8',
    surfaceSummary: 'Heavily cratered silicate crust with an enormous metallic iron core making up 85% of its planetary radius.',
    scientificRule: 'Solid surface with extreme temperature swings (+430°C day to -180°C night) and water ice sheltered inside permanently shadowed polar craters.',
    spacecraftMissions: [
      {
        name: 'MESSENGER',
        agency: 'NASA / JHUAPL',
        type: 'Orbiter',
        timeframe: '2004–2015',
        discoveries: [
          'Discovered water-ice in permanently shadowed polar craters',
          'Mapped vast volcanic smooth plains filling the Caloris Basin',
          'Measured global thrust fault scarps proving Mercury shrank as it cooled'
        ]
      },
      {
        name: 'Mariner 10',
        agency: 'NASA / JPL',
        type: 'Flyby Probe',
        timeframe: '1973–1975',
        discoveries: [
          'First spacecraft encounter with Mercury (3 close flybys)',
          'Discovered Mercury’s unexpected planetary magnetic field',
          'Photographed first 45% of heavily cratered terrain'
        ]
      }
    ]
  },
  {
    id: 'venus',
    collectionKey: 'Venus',
    name: 'Venus',
    category: 'Terrestrial',
    hasSolidSurface: true,
    color: '#eab308',
    surfaceSummary: 'Dense sulfuric acid clouds obscure volcanic basalt plains and towering shield volcanoes under crushing 92 bar pressure.',
    scientificRule: 'Optical cameras cannot penetrate Venus’s dense sulfuric acid haze; surface relief must be imaged using Synthetic Aperture Radar (SAR).',
    spacecraftMissions: [
      {
        name: 'Magellan',
        agency: 'NASA / JPL',
        type: 'Radar Mapper',
        timeframe: '1989–1994',
        discoveries: [
          'Used Synthetic Aperture Radar (SAR) to map 98% of the surface through opaque clouds at 100m resolution',
          'Discovered 85% of surface covered in volcanic lava flows, coronae, and shield volcanoes (Maat Mons)',
          'Proved surface is geologically young (~500M years old) due to cataclysmic volcanic resurfacing'
        ]
      },
      {
        name: 'Pioneer Venus & Mariner 2',
        agency: 'NASA',
        type: 'Flyby Probe',
        timeframe: '1962 / 1978',
        discoveries: [
          'First probe to encounter another planet (Mariner 2 in 1962)',
          'Confirmed 465°C surface heat and runaway greenhouse effect driven by 96.5% CO₂ atmosphere'
        ]
      }
    ]
  },
  {
    id: 'earth',
    collectionKey: 'Earth',
    name: 'Earth',
    category: 'Terrestrial',
    hasSolidSurface: true,
    color: '#3b82f6',
    surfaceSummary: 'Dynamic continental silicate crust, active plate tectonics, abundant liquid water oceans (71%), and protective geomagnetic field.',
    scientificRule: 'The solitary confirmed oasis of life in the universe; photographed from deep space to document planetary climate, oceans, and atmospheric dynamics.',
    spacecraftMissions: [
      {
        name: 'Apollo 8 & 17',
        agency: 'NASA',
        type: 'Crewed Mission',
        timeframe: '1968 / 1972',
        discoveries: [
          'Captured "Earthrise" (Apollo 8) and "The Blue Marble" (Apollo 17)',
          'Showed humanity our solitary, fragile biosphere suspended in deep space'
        ]
      },
      {
        name: 'Terra, Aqua & Landsat Fleet',
        agency: 'NASA / USGS',
        type: 'Orbiter',
        timeframe: '1972–Present',
        discoveries: [
          'Multi-decade satellite observation tracking polar ice sheets, cloud cover, and sea surface temperatures',
          'Continuous monitoring of global carbon cycles, vegetation, and ozone layer recovery'
        ]
      }
    ]
  },
  {
    id: 'moon',
    collectionKey: 'Moon',
    name: 'The Moon (Luna)',
    category: 'Moon',
    hasSolidSurface: true,
    color: '#cbd5e1',
    surfaceSummary: 'Ancient anorthosite highlands and dark volcanic basalt maria coated in fine, razor-sharp electrostatic regolith dust.',
    scientificRule: 'Vacuum environment without weather or atmosphere; footprints and impact craters remain preserved for hundreds of millions of years.',
    spacecraftMissions: [
      {
        name: 'Apollo Program (11–17)',
        agency: 'NASA',
        type: 'Crewed Mission',
        timeframe: '1969–1972',
        discoveries: [
          'Landed 12 astronauts across 6 lunar surface expeditions',
          'Returned 382 kg of lunar rocks, proving the Moon formed from a Mars-sized collision with early Earth',
          'Deployed active seismometers and laser retroreflectors still used today'
        ]
      },
      {
        name: 'Lunar Reconnaissance Orbiter (LRO)',
        agency: 'NASA / GSFC',
        type: 'Orbiter',
        timeframe: '2009–Present',
        discoveries: [
          'Created the highest resolution global 3D topographic map of lunar craters and mountains',
          'Discovered extensive cryogenic water-ice deposits inside polar Permanently Shadowed Regions (PSRs)',
          'Scouted candidate landing sites for NASA Artemis astronaut expeditions'
        ]
      }
    ]
  },
  {
    id: 'mars',
    collectionKey: 'Mars',
    name: 'Mars',
    category: 'Terrestrial',
    hasSolidSurface: true,
    color: '#ef4444',
    surfaceSummary: 'Oxidized iron regolith ("rust"), ancient river delta sedimentary strata, massive canyon systems, and extinct shield volcanoes.',
    scientificRule: 'Thin carbon dioxide atmosphere (0.006 atm) preserves ancient dry lakebeds and geological evidence of liquid water 3.5 billion years ago.',
    spacecraftMissions: [
      {
        name: 'Perseverance Rover & Ingenuity',
        agency: 'NASA / JPL-Caltech',
        type: 'Surface Rover',
        timeframe: '2020–Present',
        discoveries: [
          'Exploring Jezero Crater ancient river delta; caching pristine rock cores for Mars Sample Return',
          'MOXIE experiment proved extraction of breathable oxygen directly from Martian CO₂ atmosphere',
          'Ingenuity accomplished 72 powered, controlled aerial flights in the thin Martian atmosphere'
        ]
      },
      {
        name: 'Curiosity Rover',
        agency: 'NASA / JPL-Caltech',
        type: 'Surface Rover',
        timeframe: '2011–Present',
        discoveries: [
          'Confirmed Gale Crater was once an ancient freshwater lake with habitable chemistry',
          'Discovered organic carbon molecules and sulfur-bearing strata documenting Mars drying out'
        ]
      }
    ]
  },
  {
    id: 'jupiter',
    collectionKey: 'Jupiter',
    name: 'Jupiter',
    category: 'Gas Giant',
    hasSolidSurface: false,
    color: '#d97706',
    surfaceSummary: 'Colossal gas giant with NO solid surface: thousands of kilometers of hydrogen and helium swirling clouds over liquid metallic hydrogen.',
    scientificRule: 'CRITICAL SCIENCE RULE: Gas giant with no walkable ground. Robotic spacecraft study swirling cloud decks, polar cyclones, and icy moons (Europa).',
    spacecraftMissions: [
      {
        name: 'Juno Spacecraft',
        agency: 'NASA / SwRI',
        type: 'Orbiter',
        timeframe: '2011–Present',
        discoveries: [
          'Measured Great Red Spot depth extending 300 to 500 km deep into the atmosphere',
          'Discovered geometric clusters of Earth-sized cyclones churning at both north and south poles',
          'Mapped massive asymmetric magnetic field generated by metallic hydrogen dynamo'
        ]
      },
      {
        name: 'Galileo & Voyager 1/2',
        agency: 'NASA / JPL',
        type: 'Orbiter',
        timeframe: '1979 / 1989–2003',
        discoveries: [
          'Discovered Europa harbors a global subsurface liquid saltwater ocean beneath its icy crust',
          'Discovered active sulfur volcanism on moon Io (first active volcanoes beyond Earth)',
          'Discovered faint gossamer dust ring system around Jupiter'
        ]
      }
    ]
  },
  {
    id: 'saturn',
    collectionKey: 'Saturn',
    name: 'Saturn',
    category: 'Gas Giant',
    hasSolidSurface: false,
    color: '#facc15',
    surfaceSummary: 'Gas giant with NO solid ground: hydrogen-helium cloud bands encircled by a 282,000 km wide system of 99% pure water-ice rings.',
    scientificRule: 'CRITICAL SCIENCE RULE: Atmospheric cloud observations and ring dynamics. Surface exploration takes place on icy ocean moons (Titan, Enceladus).',
    spacecraftMissions: [
      {
        name: 'Cassini-Huygens',
        agency: 'NASA / ESA / ASI',
        type: 'Orbiter',
        timeframe: '1997–2017',
        discoveries: [
          '13-year mission; deployed ESA Huygens lander onto giant moon Titan, revealing liquid methane lakes',
          'Discovered water-ice geysers erupting from hydrothermal vents on ocean moon Enceladus',
          'Captured "The Day the Earth Smiled" backlit mosaic showing rings and pale blue dot Earth',
          'Flew between Saturn and its rings 22 times before plunging into Saturn’s atmosphere (Grand Finale)'
        ]
      },
      {
        name: 'Voyager 1 & 2',
        agency: 'NASA / JPL',
        type: 'Flyby Probe',
        timeframe: '1980–1981',
        discoveries: [
          'Resolved thousands of individual ringlets and mysterious dark radial "spokes" in B-ring',
          'Clocked ferocious equatorial jet streams exceeding 1,800 km/h'
        ]
      }
    ]
  },
  {
    id: 'uranus',
    collectionKey: 'Uranus',
    name: 'Uranus',
    category: 'Ice Giant',
    hasSolidSurface: false,
    color: '#67e8f9',
    surfaceSummary: 'Ice giant with NO solid ground: fluid mantle of water, methane, and ammonia ice under cyan-colored hydrogen atmosphere.',
    scientificRule: 'CRITICAL SCIENCE RULE: Atmospheric observations via Voyager 2. Sideways rotation (98° tilt) causes 42 years of continuous sunlight then darkness.',
    spacecraftMissions: [
      {
        name: 'Voyager 2',
        agency: 'NASA / JPL',
        type: 'Flyby Probe',
        timeframe: '1986 Flyby',
        discoveries: [
          'Sole robotic probe to ever visit Uranus (historic January 1986 close encounter)',
          'Discovered 10 new moons (including Puck) and 2 new narrow dark carbon dust rings',
          'Discovered Uranus’s bizarre 60° tilted magnetic field offset from planetary center',
          'Photographed Verona Rupes on moon Miranda—the tallest known cliff in the solar system (20 km high)'
        ]
      }
    ]
  },
  {
    id: 'neptune',
    collectionKey: 'Neptune',
    name: 'Neptune',
    category: 'Ice Giant',
    hasSolidSurface: false,
    color: '#2563eb',
    surfaceSummary: 'Ice giant with NO solid ground: turbulent deep blue hydrogen atmosphere with fastest supersonic winds in the solar system (>2,100 km/h).',
    scientificRule: 'CRITICAL SCIENCE RULE: Deep atmospheric clouds and flyby observations. Surface exploration takes place on cryogenic moon Triton.',
    spacecraftMissions: [
      {
        name: 'Voyager 2',
        agency: 'NASA / JPL',
        type: 'Flyby Probe',
        timeframe: '1989 Flyby',
        discoveries: [
          'Sole robotic probe to ever visit Neptune (historic August 1989 close encounter)',
          'Discovered the Great Dark Spot storm system and clocked supersonic winds of 2,100 km/h',
          'Discovered 6 new moons and mapped cantaloupe terrain of giant captured moon Triton',
          'Discovered active nitrogen cryovolcanic geysers on Triton erupting 8 km high into near-vacuum'
        ]
      }
    ]
  }
];

export const PlanetDiscoveryView: React.FC = () => {
  const { selectedPlanetId, setSelectedPlanetId, setView } = useGame();

  // Selected planet id from our 9 bodies
  const [activePlanetId, setActivePlanetId] = useState<PlanetId>(
    selectedPlanetId && BODIES_METADATA.some(b => b.id === selectedPlanetId)
      ? selectedPlanetId
      : 'mars'
  );

  // Active body metadata
  const currentBody = useMemo(() => {
    return BODIES_METADATA.find(b => b.id === activePlanetId) || BODIES_METADATA[4]; // Mars fallback
  }, [activePlanetId]);

  // Dynamic photo collection for currently selected body
  const [photoCollection, setPhotoCollection] = useState<NasaImageRecord[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isSearchingMore, setIsSearchingMore] = useState<boolean>(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  // Fullscreen inspector & Zoom modal state
  const [inspectingPhoto, setInspectingPhoto] = useState<NasaImageRecord | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update photo collection when active body changes
  useEffect(() => {
    const curated = CURATED_NASA_PLANET_COLLECTIONS[currentBody.collectionKey] || [];
    setPhotoCollection(curated);
    setSelectedPhotoIndex(0);
    setImageErrorMap({});
  }, [currentBody]);

  // Active photo being showcased
  const activePhoto = photoCollection[selectedPhotoIndex] || photoCollection[0];

  // Handle selecting a planet
  const handleSelectPlanet = (id: PlanetId) => {
    soundEffects.playClick();
    setActivePlanetId(id);
    setSelectedPlanetId(id);
  };

  // Fetch more live NASA photographs for the current planet from NASA API
  const handleFetchMorePhotos = async () => {
    soundEffects.playBeep();
    setIsSearchingMore(true);
    try {
      const result = await searchNasaImageLibrary(
        `${currentBody.name} surface observation`,
        currentBody.collectionKey
      );
      if (result.items && result.items.length > 0) {
        // Merge without duplicate nasa_id
        const existingIds = new Set(photoCollection.map(p => p.nasa_id));
        const newItems = result.items.filter(p => !existingIds.has(p.nasa_id));
        if (newItems.length > 0) {
          setPhotoCollection(prev => [...prev, ...newItems]);
        }
      }
    } catch (err) {
      console.warn('Failed to load extra NASA photos:', err);
    } finally {
      setIsSearchingMore(false);
    }
  };

  // Open photo inspector
  const handleOpenInspector = (photo: NasaImageRecord) => {
    soundEffects.playClick();
    setInspectingPhoto(photo);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3.5));
  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 animate-fadeIn select-none">
      {/* Header — EXACT matching component title */}
      <div className="bg-gradient-to-r from-[#090e23] via-[#0d1633] to-[#120e29] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>AUTHENTIC NASA DISCOVERY & TELEMETRY LAB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              Planetary Surface & Robotic Exploration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl font-sans leading-relaxed">
              Explore genuine NASA photographs for all eight planets and Earth's Moon. Compare robotic spacecraft discoveries—from Apollo and Perseverance surface exploration to Cassini and Voyager atmospheric deep-space observations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official NASA Image Library API</span>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                setView('nasa_photos');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>All Space Photos</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Planet Navigation Bar — ALL 8 Planets + Moon */}
      <div className="p-3 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center">
            <Compass className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Select Celestial Body (8 Planets + Moon):
          </span>
          <span className="text-[10px] font-mono text-cyan-300">
            Current: <strong className="text-white">{currentBody.name}</strong> ({currentBody.category})
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {BODIES_METADATA.map(body => {
            const isSelected = activePlanetId === body.id;
            const curatedThumbs = CURATED_NASA_PLANET_COLLECTIONS[body.collectionKey];
            const thumbSrc = curatedThumbs?.[0]?.thumb_url;

            return (
              <button
                key={body.id}
                onClick={() => handleSelectPlanet(body.id)}
                className={`px-3 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-500/30 border border-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {thumbSrc ? (
                  <img
                    src={thumbSrc}
                    alt={body.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/50 shadow-sm"
                    loading="lazy"
                  />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: body.color }} />
                )}
                <span>{body.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold ${
                    isSelected
                      ? 'bg-black/30 text-black'
                      : body.hasSolidSurface
                      ? 'bg-slate-800 text-emerald-400'
                      : 'bg-slate-800 text-amber-400'
                  }`}
                >
                  {body.hasSolidSurface ? 'Solid' : 'Gas/Ice'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Large NASA Photograph & Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            {/* Header above photo */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span
                  className="w-3 h-3 rounded-full shadow"
                  style={{ backgroundColor: currentBody.color }}
                />
                <h2 className="text-base sm:text-lg font-mono font-bold text-white">
                  {currentBody.name}: {activePhoto?.title || 'NASA Exploration Photograph'}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                Photo {selectedPhotoIndex + 1} of {photoCollection.length}
              </span>
            </div>

            {/* Large Real NASA Photograph Showcase */}
            <div
              className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 group cursor-pointer shadow-2xl"
              onClick={() => activePhoto && handleOpenInspector(activePhoto)}
            >
              {activePhoto && !imageErrorMap[activePhoto.nasa_id] ? (
                <img
                  src={activePhoto.image_url || activePhoto.thumb_url}
                  alt={activePhoto.title}
                  onError={() =>
                    setImageErrorMap(prev => ({ ...prev, [activePhoto.nasa_id]: true }))
                  }
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-400 space-y-2 font-mono text-xs">
                  <Camera className="w-8 h-8 text-cyan-400" />
                  <span>NASA Image Archive • Identifier: {activePhoto?.nasa_id}</span>
                </div>
              )}

              {/* Badges Overlaid on Large Image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-600/90 text-white font-mono text-[10px] font-bold shadow-md backdrop-blur">
                  <Camera className="w-3 h-3" />
                  <span>REAL NASA PHOTOGRAPH</span>
                </span>
                {activePhoto?.isRadarDerived && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-600/90 text-white font-mono text-[10px] font-bold shadow-md backdrop-blur">
                    <Radio className="w-3 h-3" />
                    <span>RADAR-DERIVED (MAGELLAN SAR)</span>
                  </span>
                )}
                {!currentBody.hasSolidSurface && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-900/90 text-purple-200 border border-purple-500/40 font-mono text-[10px] font-bold shadow-md backdrop-blur">
                    <span>ATMOSPHERIC OBSERVATION</span>
                  </span>
                )}
              </div>

              {/* Fullscreen Expand CTA */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  activePhoto && handleOpenInspector(activePhoto);
                }}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/75 hover:bg-cyan-500 hover:text-black text-white backdrop-blur-md transition shadow-lg cursor-pointer"
                title="Expand High-Resolution Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Metadata & Scientific Description */}
            {activePhoto && (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 text-xs font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-slate-400 border-b border-slate-900 pb-2">
                  <span className="text-white font-bold">{activePhoto.title}</span>
                  <div className="flex items-center space-x-2">
                    <span>Date: {new Date(activePhoto.date_created).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-cyan-300">ID: {activePhoto.nasa_id}</span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">
                  {activePhoto.description}
                </p>

                {activePhoto.isRadarDerived && (
                  <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 text-[11px] font-sans flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>
                      <strong>Venus Radar Notice:</strong> Because Venus is perpetually enveloped in thick sulfuric acid clouds, optical lenses see only featureless haze. NASA’s Magellan spacecraft pulsed synthetic aperture radar through the veil to reconstruct this topographic surface map.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400">
                  <span className="truncate mr-2">Official Credit: <strong className="text-slate-200">{activePhoto.credit}</strong></span>
                  <a
                    href={activePhoto.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold shrink-0"
                  >
                    <span>View on NASA Portal</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Multi-Photo Horizontal Gallery for Selected Planet */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase text-[10px] font-bold">
                  Browse {currentBody.name} Photographs ({photoCollection.length}):
                </span>
                <button
                  onClick={handleFetchMorePhotos}
                  disabled={isSearchingMore}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isSearchingMore ? 'animate-spin' : ''}`} />
                  <span>{isSearchingMore ? 'Loading...' : 'Load More from NASA API'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photoCollection.map((photo, idx) => {
                  const isCurrent = selectedPhotoIndex === idx;
                  return (
                    <button
                      key={photo.nasa_id}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedPhotoIndex(idx);
                      }}
                      className={`relative aspect-video rounded-xl overflow-hidden border transition text-left cursor-pointer group ${
                        isCurrent
                          ? 'border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg'
                          : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.thumb_url || photo.image_url}
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[9px] font-mono font-bold text-white truncate w-full">
                          {photo.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Surface Reality & Robotic Missions */}
        <div className="lg:col-span-5 space-y-4">
          {/* Surface Nature & Important Scientific Rule Card */}
          <div
            className={`p-5 rounded-2xl border shadow-xl space-y-3 ${
              currentBody.hasSolidSurface
                ? 'bg-slate-900/90 border-emerald-500/40'
                : 'bg-slate-900/90 border-amber-500/40'
            }`}
          >
            <div className="flex items-center space-x-2">
              {currentBody.hasSolidSurface ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <h3 className="font-mono font-bold text-sm text-white">
                {currentBody.hasSolidSurface
                  ? `${currentBody.name}: Solid Planetary Surface`
                  : `${currentBody.name}: Gas/Ice Giant (NO Solid Surface)`}
              </h3>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {currentBody.surfaceSummary}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="font-bold text-cyan-300 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Important Scientific Rule:</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                {currentBody.scientificRule}
              </p>
            </div>

            {/* Test in 3D CTA if Moon or Mars */}
            {(currentBody.id === 'moon' || currentBody.id === 'mars') && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setView(currentBody.id === 'moon' ? 'explore_moon' : 'explore_mars');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-extrabold transition flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>Launch 3D Astronaut on {currentBody.name}</span>
              </button>
            )}
          </div>

          {/* Robotic Spacecraft Exploration Cards */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-cyan-300 font-mono text-xs font-bold pb-2 border-b border-slate-800">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>ROBOTIC EXPLORATION OF {currentBody.name.toUpperCase()}</span>
            </div>

            <div className="space-y-3">
              {currentBody.spacecraftMissions.map((mission, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white text-xs">
                        {mission.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-950 text-cyan-300 border border-cyan-800">
                        {mission.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {mission.timeframe}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400">
                    Lead Agency: <strong className="text-slate-200">{mission.agency}</strong>
                  </div>

                  <ul className="space-y-1 text-[11px] font-sans text-slate-300">
                    {mission.discoveries.map((disc, dIdx) => (
                      <li key={dIdx} className="flex items-start space-x-1.5">
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span>{disc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Zoom & Pan Inspector Modal */}
      {inspectingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setInspectingPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[94vh] bg-slate-950 border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/70">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-cyan-500/30">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-mono font-bold text-white text-sm sm:text-base line-clamp-1">
                    {inspectingPhoto.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                    <span>NASA Identifier: <code className="text-cyan-300">{inspectingPhoto.nasa_id}</code></span>
                    <span>• Target: <strong className="text-white">{currentBody.name}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectingPhoto(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Photo Canvas with Zoom & Pan */}
            <div
              className="relative flex-1 bg-black overflow-hidden flex items-center justify-center select-none min-h-[300px] sm:min-h-[460px] cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={inspectingPhoto.image_url || inspectingPhoto.thumb_url}
                alt={inspectingPhoto.title}
                draggable={false}
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                className="max-h-[55vh] sm:max-h-[64vh] w-auto object-contain pointer-events-none"
              />

              {/* Floating Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-2xl text-white text-xs font-mono">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-cyan-300" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-cyan-300" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4 text-slate-300" />
                </button>
                <span className="px-2 font-bold text-cyan-300 text-[11px]">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>

              {/* Radar Disclaimer Overlay if Venus */}
              {inspectingPhoto.isRadarDerived && (
                <div className="absolute top-4 left-4 max-w-sm p-3 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs backdrop-blur-md shadow-xl">
                  <div className="flex items-center space-x-1.5 font-bold font-mono text-amber-300 mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Magellan Synthetic Aperture Radar (SAR)</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Venus is shrouded in opaque sulfuric acid clouds. Optical lenses see only yellow haze; Magellan used radar pulses to penetrate the veil and map this topography.
                  </p>
                </div>
              )}
            </div>

            {/* Details Footer */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 overflow-y-auto max-h-[30vh] space-y-3 text-xs">
              <div>
                <h4 className="font-mono font-bold text-cyan-300 text-xs uppercase tracking-wider mb-1">
                  Scientific Observation Description
                </h4>
                <p className="text-slate-200 font-sans leading-relaxed text-xs sm:text-sm">
                  {inspectingPhoto.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-900 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 flex items-center space-x-1 mb-0.5">
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                    <span>Official Credit</span>
                  </div>
                  <div className="text-white font-sans font-bold truncate">
                    {inspectingPhoto.credit || 'NASA'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 flex items-center space-x-1 mb-0.5">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    <span>Observation Date</span>
                  </div>
                  <div className="text-white font-bold">
                    {new Date(inspectingPhoto.date_created).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[10px]">Official NASA Details</div>
                    <div className="text-cyan-300 font-bold">images.nasa.gov</div>
                  </div>
                  <a
                    href={inspectingPhoto.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-mono text-[10px] transition flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};