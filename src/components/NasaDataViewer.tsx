import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  Database,
  Sun,
  Dna,
  Moon,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Camera,
  Layers,
  Sparkles,
  Calendar,
  AlertTriangle,
  Radio,
  FileText,
  Clock,
  Compass,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { getNasaDataCenterState, triggerNasaSync } from '../services/nasaDataService';
import { NasaDataCenterState, NasaSpaceWeatherRecord, NasaPlanetaryImageRecord, NasaResearchRecord, NasaDatasetRecord } from '../types/nasa';

export const NasaDataViewer: React.FC = () => {
  const { setView } = useGame();
  const [dataState, setDataState] = useState<NasaDataCenterState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'weather' | 'rovers' | 'apod' | 'biology' | 'geology' | 'logs'>('weather');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState<string>('ALL');
  const [selectedImageModal, setSelectedImageModal] = useState<NasaPlanetaryImageRecord | null>(null);

  // Load NASA data on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setIsLoading(true);
      const state = await getNasaDataCenterState();
      if (mounted) {
        setDataState(state);
        setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle manual sync trigger
  const handleForceSync = async () => {
    soundEffects.playClick();
    setIsSyncing(true);
    try {
      const updated = await triggerNasaSync();
      setDataState(updated);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter helpers
  const weatherList = (dataState?.spaceWeather || []).filter(item => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.classification && item.classification.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const roverImagesList = (dataState?.roverImages || []).filter(item => {
    const matchesSearch =
      (item.camera_name && item.camera_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.rover_name && item.rover_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.planet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlanet = selectedPlanetFilter === 'ALL' || item.planet.toUpperCase() === selectedPlanetFilter;
    return matchesSearch && matchesPlanet;
  });

  const biologyList = (dataState?.researchStudies || []).filter(item => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.research_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const datasetsList = (dataState?.datasets || []).filter(item => {
    const matchesSearch =
      item.dataset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn text-slate-100">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-1 tracking-wider">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>NASA OPEN DATA REPOSITORY & MISSION ARCHIVE</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px]">
                <span
                  className={`w-2 h-2 rounded-full ${dataState?.dataSourceType === 'LIVE_API'
                      ? 'bg-emerald-400 animate-pulse'
                      : dataState?.dataSourceType === 'SUPABASE_DB'
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                />
                <span className="font-semibold text-slate-200">
                  {dataState?.dataSourceType === 'LIVE_API'
                    ? 'LIVE NASA API'
                    : dataState?.dataSourceType === 'SUPABASE_DB'
                      ? 'SUPABASE POSTGRES'
                      : 'CACHED NASA ARCHIVE'}
                </span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white flex items-center gap-3">
              NASA Science & Planetary Mission Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl font-sans leading-relaxed">
              Real spaceflight observations ingested from NASA DONKI, Mars Rovers (Perseverance & Curiosity),
              Planetary Data System (PDS), and Open Science Data Repository (OSDR).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 font-mono text-xs font-bold transition flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Syncing NASA...' : 'Sync NASA APIs'}</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setView('dashboard');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition shadow-lg shadow-cyan-500/20"
            >
              Return to Outpost
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Last Ingested:</span>
              <strong className="text-slate-200">
                {dataState?.lastUpdated ? new Date(dataState.lastUpdated).toLocaleTimeString() : 'Updating...'}
              </strong>
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Verified Records: <strong className="text-cyan-400">
                {(dataState?.spaceWeather.length || 0) + (dataState?.roverImages.length || 0) + (dataState?.datasets.length || 0)}
              </strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-blue-300 bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-800/50">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>100% Genuine NASA open data attribution. Never fabricated.</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs & Search Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center flex-wrap gap-1.5 w-full lg:w-auto">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('weather');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${activeTab === 'weather'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:bg-slate-800'
              }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Space Weather (DONKI)</span>
            <span className="text-[10px] bg-amber-950 px-1.5 py-0.2 rounded-full text-amber-400">
              {weatherList.length}
            </span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('rovers');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${activeTab === 'rovers'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-lg shadow-rose-500/10'
                : 'text-slate-400 hover:bg-slate-800'
              }`}
          >
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>Mars & Moon Imagery</span>
            <span className="text-[10px] bg-rose-950 px-1.5 py-0.2 rounded-full text-rose-400">
              {roverImagesList.length}
            </span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('apod');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${activeTab === 'apod'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                : 'text-slate-400 hover:bg-slate-800'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>NASA APOD</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('biology');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${activeTab === 'biology'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:bg-slate-800'
              }`}
          >
            <Dna className="w-3.5 h-3.5 text-purple-400" />
            <span>Space Biology (OSDR)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('geology');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${activeTab === 'geology'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:bg-slate-800'
              }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>PDS Datasets</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('logs');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${activeTab === 'logs'
                ? 'bg-slate-700 text-cyan-300 border border-cyan-400/50'
                : 'text-slate-400 hover:bg-slate-800'
              }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync Logs</span>
          </button>
        </div>

        {/* Search and Planet Filters */}
        <div className="flex items-center space-x-2 w-full lg:w-auto">
          {activeTab === 'rovers' && (
            <select
              value={selectedPlanetFilter}
              onChange={e => setSelectedPlanetFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Targets</option>
              <option value="MARS">Mars</option>
              <option value="MOON">Moon</option>
            </select>
          )}

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter records..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
        </div>
      </div>

      {/* 3. Content Views */}

      {/* View 1: DONKI Space Weather */}
      {activeTab === 'weather' && (
        <div className="space-y-4">
          <div className="bg-amber-950/20 border border-amber-600/30 p-4 rounded-2xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 leading-relaxed font-sans">
              <strong className="text-amber-300 font-mono">Live Space Weather Architecture: </strong>
              NASA Space Weather Database of Notifications, Knowledge, Information (DONKI) monitors real solar active regions, coronal mass ejections, and flare radiation bursts. In the ASTRO COMMAND simulation, high-energy events trigger base radiation alarms!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherList.map(item => (
              <div
                key={item.event_identifier}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                        {item.event_type} EVENT
                      </span>
                      {item.classification && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-red-950/80 text-rose-300 border border-rose-500/30">
                          {item.classification}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(item.start_time).toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                    title="Open official NASA DONKI observation"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-slate-200 font-sans leading-relaxed">
                  {item.description}
                </p>

                {item.educationalTakeaway && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-cyan-200/90 space-y-1">
                    <div className="flex items-center space-x-1 font-mono font-bold text-cyan-400 text-[10px]">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>WHY THIS MATTERS FOR ASTRONAUTS</span>
                    </div>
                    <p className="font-sans leading-relaxed">{item.educationalTakeaway}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>ID: {item.event_identifier}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> NASA Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Mars & Moon Imagery Gallery */}
      {activeTab === 'rovers' && (
        <div className="space-y-4">
          <div className="bg-rose-950/20 border border-rose-600/30 p-4 rounded-2xl flex items-start space-x-3">
            <Camera className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200 leading-relaxed font-sans">
              <strong className="text-rose-300 font-mono">Real Planetary Surface Photographs: </strong>
              Compare ASTRO COMMAND's 3D exploration terrain with authentic images captured by NASA's Perseverance and Curiosity rovers on Mars, and the Lunar Reconnaissance Orbiter (LROC) at the Moon's South Pole.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roverImagesList.map((img, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition group flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => setSelectedImageModal(img)}>
                  <img
                    src={img.image_url}
                    alt={img.camera_name || 'NASA surface image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40">
                      {img.planet}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/40">
                      {img.rover_name}
                    </span>
                  </div>
                  {img.sol !== undefined && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/90 text-white border border-slate-700">
                      Sol {img.sol}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition">
                        {img.camera_name || 'Surface Camera'}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400">Earth Date: {img.earth_date}</p>
                    </div>
                    <a
                      href={img.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-400 p-1"
                      title="View on NASA raw image portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {img.metadata?.location && (
                    <p className="text-[11px] text-slate-300 font-sans">
                      <strong className="text-slate-400">Target Area:</strong> {img.metadata.location}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                    <span>NASA JPL-Caltech</span>
                    <span className="text-cyan-400">Click to enlarge</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Astronomy Picture of the Day (APOD) */}
      {activeTab === 'apod' && (
        <div className="space-y-4">
          {dataState?.apod ? (
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
                {dataState.apod.media_type === 'video' ? (
                  <iframe
                    src={dataState.apod.url}
                    title={dataState.apod.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={dataState.apod.hdurl || dataState.apod.url}
                    alt={dataState.apod.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ASTRONOMY PICTURE OF THE DAY • {dataState.apod.date}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {dataState.apod.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {dataState.apod.explanation}
                </p>

                {dataState.apod.copyright && (
                  <p className="text-[11px] font-mono text-slate-400">
                    Image Credit & Copyright: {dataState.apod.copyright}
                  </p>
                )}

                <div className="pt-2 flex items-center space-x-3">
                  <a
                    href="https://apod.nasa.gov/apod/astropix.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition flex items-center space-x-1.5"
                  >
                    <span>View on NASA APOD Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 font-mono text-xs">
              Loading Astronomy Picture of the Day from NASA...
            </div>
          )}
        </div>
      )}

      {/* View 4: Space Biology (NASA OSDR) */}
      {activeTab === 'biology' && (
        <div className="space-y-4">
          <div className="bg-purple-950/20 border border-purple-600/30 p-4 rounded-2xl flex items-start space-x-3">
            <Dna className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-200 leading-relaxed font-sans">
              <strong className="text-purple-300 font-mono">NASA Open Science Data Repository (OSDR): </strong>
              Scientific studies conducted aboard the International Space Station, parabolic flights, and simulated lunar habitats researching how deep space radiation, microgravity, and regolith affect astronauts and greenhouse crops.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {biologyList.map((study, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                      {study.research_category}
                    </span>
                    <h3 className="text-sm font-bold font-mono text-white mt-1.5">
                      {study.title}
                    </h3>
                  </div>
                  <a
                    href={study.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                    title="Open study in NASA Biological Repository"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {study.summary}
                </p>

                {study.metadata && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
                    {Object.entries(study.metadata).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500 capitalize">{k.replace('_', ' ')}:</span>
                        <span className="text-slate-300 font-sans text-right max-w-xs">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                  <span>NASA Ames / Johnson Space Center</span>
                  <a href={study.dataset_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    View OSDR Dataset
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 5: PDS Geological Datasets */}
      {activeTab === 'geology' && (
        <div className="space-y-4">
          <div className="bg-cyan-950/20 border border-cyan-600/30 p-4 rounded-2xl flex items-start space-x-3">
            <Layers className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-cyan-200 leading-relaxed font-sans">
              <strong className="text-cyan-300 font-mono">NASA Planetary Data System (PDS): </strong>
              The primary archive for NASA planetary mission telemetry, topographic laser altimetry, and mineralogical maps from lunar orbiters and Mars reconnaissance spacecraft.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datasetsList.map(ds => (
              <div
                key={ds.dataset_identifier}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/50 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      {ds.source_name}
                    </span>
                    <h3 className="text-sm font-bold font-mono text-white mt-1.5">
                      {ds.dataset_name}
                    </h3>
                  </div>
                  <a
                    href={ds.original_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                    title="Open official NASA PDS portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {ds.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Identifier:</span>
                    <span className="text-cyan-400">{ds.dataset_identifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="text-slate-200">{ds.category}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between items-center">
                  <span>NASA Geosciences Node</span>
                  <a href={ds.original_source_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    Download PDS Data
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 6: Ingestion Sync Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-mono font-bold text-white mb-3 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>NASA Ingestion Service Audit Trail (nasa_sync_logs)</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 px-3">Data Source</th>
                    <th className="py-2 px-3">Sync Status</th>
                    <th className="py-2 px-3">Records Processed</th>
                    <th className="py-2 px-3">Started At</th>
                    <th className="py-2 px-3">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(dataState?.lastSyncLogs || []).map((log, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-bold text-white">{log.source_name}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.sync_status === 'SUCCESS'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            }`}
                        >
                          {log.sync_status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-cyan-400">{log.records_processed}</td>
                      <td className="py-2 px-3 text-slate-400">{new Date(log.started_at).toLocaleTimeString()}</td>
                      <td className="py-2 px-3 text-slate-400">
                        {log.completed_at ? new Date(log.completed_at).toLocaleTimeString() : 'In progress'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 p-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-mono font-bold text-white">
                  {selectedImageModal.camera_name} — {selectedImageModal.planet}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedImageModal.rover_name} • Sol {selectedImageModal.sol} • {selectedImageModal.earth_date}
                </p>
              </div>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg"
              >
                Close (ESC)
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={selectedImageModal.image_url}
                alt="NASA Mars or Moon Surface Observation"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>Authentic NASA JPL Raw Image Portal</span>
              <a
                href={selectedImageModal.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View Original Telemetry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
