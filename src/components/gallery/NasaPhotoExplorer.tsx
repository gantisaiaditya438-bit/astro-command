import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Camera,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Radio,
  Layers,
  Calendar,
  UserCheck,
  Compass,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { NasaImageRecord } from '../../types/nasaImages';
import {
  searchNasaImageLibrary,
  CURATED_NASA_PLANET_COLLECTIONS
} from '../../services/nasaImageLibraryService';
import { soundEffects } from '../../services/soundEffects';

const PLANET_FILTER_OPTIONS = [
  'All',
  'Moon',
  'Mars',
  'Mercury',
  'Venus',
  'Earth',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Sun'
];

const MISSION_TAGS = [
  'All',
  'Apollo',
  'Perseverance',
  'Curiosity',
  'Juno',
  'Cassini',
  'Voyager',
  'SDO',
  'LRO',
  'Magellan'
];

export const NasaPhotoExplorer: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<string>('All');
  const [selectedMission, setSelectedMission] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [photos, setPhotos] = useState<NasaImageRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('CURATED_ARCHIVE');
  const [inspectingPhoto, setInspectingPhoto] = useState<NasaImageRecord | null>(null);

  // Zoom & Pan state for inspector modal
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch photos whenever search query or planet filter changes
  useEffect(() => {
    let isCancelled = false;

    async function loadPhotos() {
      setIsLoading(true);
      const queryParam = debouncedQuery.trim()
        ? debouncedQuery.trim()
        : selectedPlanet !== 'All'
        ? `${selectedPlanet} space`
        : 'solar system planets';

      const planetParam = selectedPlanet !== 'All' ? selectedPlanet : undefined;

      try {
        const result = await searchNasaImageLibrary(queryParam, planetParam);
        if (!isCancelled) {
          setPhotos(result.items);
          setDataSource(result.source);
        }
      } catch (err) {
        console.error('Error fetching NASA images:', err);
        if (!isCancelled) {
          // Fallback to all curated
          const allCurated: NasaImageRecord[] = [];
          Object.values(CURATED_NASA_PLANET_COLLECTIONS).forEach(c => allCurated.push(...c));
          setPhotos(allCurated);
          setDataSource('CURATED_FALLBACK');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPhotos();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, selectedPlanet]);

  // Filter photos by mission tag if specified
  const filteredPhotos = useMemo(() => {
    if (selectedMission === 'All') return photos;
    const missionLower = selectedMission.toLowerCase();
    return photos.filter(p => {
      const inTitle = p.title.toLowerCase().includes(missionLower);
      const inDesc = p.description.toLowerCase().includes(missionLower);
      const inKeywords = p.keywords?.some(k => k.toLowerCase().includes(missionLower));
      const inCredit = p.credit?.toLowerCase().includes(missionLower);
      return inTitle || inDesc || inKeywords || inCredit;
    });
  }, [photos, selectedMission]);

  // Open photo inspector
  const handleOpenInspector = (photo: NasaImageRecord) => {
    soundEffects.playClick();
    setInspectingPhoto(photo);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3.5));
  };
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

  // Drag pan handlers
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn text-slate-100">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-purple-950/70 border border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/50 text-blue-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>Genuine NASA Photography</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[10px]">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Scientific Archives</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              NASA Planetary Space Photo Explorer
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore authentic high-resolution space photographs captured by Apollo astronauts, Mars rovers, and interplanetary deep-space probes directly via the official NASA Image Library API (<code className="text-cyan-300 font-mono">images-api.nasa.gov</code>).
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:items-end justify-center text-xs font-mono text-slate-400 space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Status: {dataSource === 'LIVE_API' ? 'Live NASA API' : 'Curated Verified Archive'}</span>
            </div>
            <div>{filteredPhotos.length} Photographs Available</div>
            <div className="text-[10px] text-slate-500">Free of AI Generation • Genuine NASA Data</div>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Educational Notice: Real Photography vs 3D Simulation */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-900/40 text-cyan-400 shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold font-mono text-cyan-300 mr-2">Astronomy Learning Note:</span>
            <span className="text-slate-300 font-sans">
              These are <strong>genuine scientific photographs</strong> captured in deep space by physical robotic lenses and cameras. They show real planetary surfaces, contrast against our interactive 3D computer game graphics, and prove the reality of human space exploration!
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NASA photo archive (e.g., 'Perseverance delta', 'Apollo 11 footprint', 'Cassini rings', 'Juno red spot')..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm font-sans text-white placeholder-slate-500 transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Planet Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-thin">
          <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1 text-cyan-400" /> Planet:
          </span>
          {PLANET_FILTER_OPTIONS.map((planet) => (
            <button
              key={planet}
              onClick={() => {
                soundEffects.playBeep();
                setSelectedPlanet(planet);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer font-bold ${
                selectedPlanet === planet
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {planet}
            </button>
          ))}
        </div>

        {/* Mission Filter Tags */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] font-mono border-t border-slate-900 pt-2.5">
          <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0 mr-1 flex items-center">
            <Compass className="w-3 h-3 mr-1 text-purple-400" /> Mission / Instrument:
          </span>
          {MISSION_TAGS.map((mission) => (
            <button
              key={mission}
              onClick={() => {
                soundEffects.playBeep();
                setSelectedMission(mission);
              }}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition cursor-pointer ${
                selectedMission === mission
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {mission}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-3 animate-pulse"
            >
              <div className="w-full aspect-video bg-slate-800/70 rounded-lg" />
              <div className="h-4 bg-slate-800/70 rounded w-3/4" />
              <div className="h-3 bg-slate-800/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <Camera className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold font-mono text-white">No NASA Photographs Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords or switching the planet/mission filter tab.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPlanet('All');
              setSelectedMission('All');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.nasa_id}
              onClick={() => handleOpenInspector(photo)}
              className="group rounded-2xl border border-slate-800/80 hover:border-cyan-500/60 bg-slate-950/80 hover:bg-slate-900/80 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo Aspect Ratio Box */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={photo.thumb_url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlaid Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-600/90 text-white font-mono text-[9px] font-bold shadow">
                      <Camera className="w-2.5 h-2.5" />
                      <span>{photo.planet || 'NASA'}</span>
                    </span>

                    {photo.isRadarDerived && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-600/90 text-white font-mono text-[9px] font-bold shadow">
                        <Radio className="w-2.5 h-2.5" />
                        <span>RADAR SAR</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur group-hover:bg-cyan-500 group-hover:text-black text-white transition">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-2">
                  <h3 className="font-mono font-bold text-white text-xs line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>

              {/* Attribution Footer */}
              <div className="px-3.5 py-2.5 border-t border-slate-900 bg-slate-950 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="truncate mr-2">ID: {photo.nasa_id}</span>
                <span className="shrink-0 text-cyan-400/80">Inspect</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* High-Resolution Photo Inspector Modal */}
      {inspectingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setInspectingPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] bg-slate-950 border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
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
                    {inspectingPhoto.planet && (
                      <span>• Target: <span className="text-white font-bold">{inspectingPhoto.planet}</span></span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectingPhoto(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Photo Canvas / Viewport */}
            <div
              className="relative flex-1 bg-black overflow-hidden flex items-center justify-center select-none min-h-[300px] sm:min-h-[440px] cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={inspectingPhoto.image_url}
                alt={inspectingPhoto.title}
                draggable={false}
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                className="max-h-[55vh] sm:max-h-[62vh] w-auto object-contain pointer-events-none"
              />

              {/* Floating Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-2xl text-white text-xs font-mono">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg hover:bg-slate-800 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-cyan-300" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg hover:bg-slate-800 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-cyan-300" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-2 rounded-lg hover:bg-slate-800 transition"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4 text-slate-300" />
                </button>
                <span className="px-2 font-bold text-cyan-300 text-[11px]">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>

              {/* Radar Disclaimer Overlay if Venus SAR */}
              {inspectingPhoto.isRadarDerived && (
                <div className="absolute top-4 left-4 max-w-sm p-3 rounded-xl bg-amber-950/85 border border-amber-500/50 text-amber-200 text-xs backdrop-blur-md shadow-xl">
                  <div className="flex items-center space-x-1.5 font-bold font-mono text-amber-300 mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Magellan Synthetic Aperture Radar</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Venus is shrouded in opaque sulfuric acid clouds. Optical lenses see only yellow haze; Magellan used radar pulses penetrating the clouds to reconstruct this topographic relief.
                  </p>
                </div>
              )}
            </div>

            {/* Photo Details & Science Metadata */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 overflow-y-auto max-h-[32vh] space-y-3 text-xs">
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
                    <span>Official Credit / Photographer</span>
                  </div>
                  <div className="text-white font-sans font-bold truncate">
                    {inspectingPhoto.credit || 'NASA'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 flex items-center space-x-1 mb-0.5">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    <span>Observation / Record Date</span>
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
                    <div className="text-slate-400 text-[10px]">Official NASA Page</div>
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

              {/* Keywords */}
              {inspectingPhoto.keywords && inspectingPhoto.keywords.length > 0 && (
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-500">Keywords:</span>
                  {inspectingPhoto.keywords.slice(0, 7).map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};