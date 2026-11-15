import React, { useState } from 'react';
import { PlanetData } from '../../types/solar';
import {
  Rocket,
  Thermometer,
  Compass,
  Wind,
  Droplets,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  Camera,
  ExternalLink,
  Maximize2,
  Radio
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface PlanetCardProps {
  planet: PlanetData | null;
  onClose: () => void;
  onTravel: (planet: PlanetData) => void;
}

export const PlanetCard: React.FC<PlanetCardProps> = ({ planet, onClose, onTravel }) => {
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!planet) return null;

  return (
    <>
      <div className="absolute right-3 sm:right-5 top-16 bottom-5 w-full max-w-md bg-[#090d1f]/95 border border-cyan-500/60 rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-30 flex flex-col justify-between overflow-y-auto animate-fadeIn text-slate-100">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg"
                style={{ backgroundColor: `${planet.color}30`, borderColor: planet.color, borderWidth: 1 }}
              >
                🪐
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold font-mono tracking-tight text-white">{planet.name}</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 uppercase">
                    {planet.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-0.5">{planet.tagline}</p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Genuine NASA Planetary Photograph Card */}
          {planet.nasaPhoto && (
            <div className="mb-4 rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-950/80 shadow-lg group">
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setIsPhotoZoomed(true)}>
                {!imageError ? (
                  <img
                    src={planet.nasaPhoto.thumbUrl}
                    alt={planet.nasaPhoto.title}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                    NASA Image Archive
                  </div>
                )}

                {/* Overlaid Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-600/90 text-white font-mono text-[9px] font-bold shadow">
                    <Camera className="w-2.5 h-2.5" />
                    <span>REAL NASA PHOTO</span>
                  </span>
                  {planet.nasaPhoto.isRadarDerived && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-600/90 text-white font-mono text-[9px] font-bold shadow">
                      <Radio className="w-2.5 h-2.5" />
                      <span>RADAR-DERIVED (MAGELLAN SAR)</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPhotoZoomed(true);
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-cyan-600 text-white backdrop-blur transition"
                  title="Expand Full Photo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo Attribution & Metadata */}
              <div className="p-2.5 space-y-1 bg-slate-950/90">
                <div className="text-[11px] font-bold text-cyan-200 line-clamp-1">{planet.nasaPhoto.title}</div>
                {planet.nasaPhoto.isRadarDerived && (
                  <p className="text-[10px] text-amber-200/90 font-sans leading-relaxed">
                    Notice: Venus’s thick sulfuric acid atmosphere blocks visible light. This is a synthetic aperture radar surface topography map from NASA Magellan.
                  </p>
                )}
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <span className="truncate mr-2">Credit: {planet.nasaPhoto.credit}</span>
                  <a
                    href={planet.nasaPhoto.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-0.5 text-cyan-400 hover:text-cyan-300 shrink-0 font-bold"
                  >
                    <span>{planet.nasaPhoto.nasaId}</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Quick Physical Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center">
                <Compass className="w-3 h-3 text-cyan-400 mr-1" /> Distance from Sun
              </div>
              <div className="text-xs font-bold text-white mt-1">{planet.distanceFromSunKm}</div>
              <div className="text-[10px] text-slate-500">{planet.distanceFromSunAU} AU</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center">
                <Thermometer className="w-3 h-3 text-amber-400 mr-1" /> Surface Temp
              </div>
              <div className="text-xs font-bold text-amber-300 mt-1">{planet.temperatureRangeC.mean}°C</div>
              <div className="text-[10px] text-slate-500">{planet.temperatureDesc}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Surface Gravity</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">{planet.surfaceGravityG}g</div>
              <div className="text-[10px] text-slate-500 truncate">{planet.surfaceGravityDesc}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">Orbital Year / Day</div>
              <div className="text-xs font-bold text-cyan-300 mt-1">{planet.orbitalPeriodDays} Earth Days</div>
              <div className="text-[10px] text-slate-500">Day: {planet.rotationPeriodHours} hrs</div>
            </div>
          </div>

          {/* Atmosphere & Water */}
          <div className="space-y-2 mb-4 text-xs font-sans">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-mono text-cyan-400 font-bold flex items-center space-x-1.5 mb-1 text-[11px]">
                <Wind className="w-3.5 h-3.5" />
                <span>Atmospheric Composition</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {planet.atmosphereComposition.join(' • ')} (Pressure: {planet.atmosphericPressureAtm} atm)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-mono text-blue-400 font-bold flex items-center space-x-1.5 mb-1 text-[11px]">
                <Droplets className="w-3.5 h-3.5" />
                <span>Water Presence</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{planet.waterPresence}</p>
            </div>
          </div>

          {/* Can Humans Live Here Question Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-purple-500/40 text-xs space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              {planet.canHumansLiveWithoutGear ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="font-mono font-bold text-white text-[11px]">
                Could humans live here without special equipment?
              </span>
            </div>
            <div className={`font-mono text-[11px] font-bold ${planet.canHumansLiveWithoutGear ? 'text-emerald-400' : 'text-red-400'}`}>
              {planet.canHumansLiveWithoutGear ? 'YES — Earth is our biological home!' : 'NO — Immediate space survival hazard!'}
            </div>
            <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
              {planet.whyHumansCannotLiveHere}
            </p>
          </div>

          {/* NASA Fact */}
          <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-600/40 text-xs mb-3">
            <div className="font-mono text-cyan-300 font-bold text-[10px] flex items-center space-x-1 mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>NASA Scientific Takeaway:</span>
            </div>
            <p className="text-blue-100 font-sans text-[11px] leading-relaxed">{planet.educationalTakeaway}</p>
          </div>
        </div>

        {/* Travel / Explore CTA */}
        <div className="pt-2 border-t border-slate-800">
          {planet.id === 'sun' ? (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs text-center font-mono">
              ⚠️ The Sun is a thermonuclear star! Probes can only orbit from afar (Parker Solar Probe).
            </div>
          ) : planet.isPlayableDestination ? (
            <button
              onClick={() => onTravel(planet)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold font-mono text-xs tracking-wider transition flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/25 cursor-pointer"
            >
              <Rocket className="w-4 h-4 transform -rotate-45" />
              <span>TRAVEL TO {planet.name.toUpperCase()} (3D SURFACE)</span>
            </button>
          ) : (
            <button
              onClick={() => onTravel(planet)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold font-mono text-xs tracking-wider transition flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
            >
              <Rocket className="w-4 h-4 transform -rotate-45" />
              <span>LAUNCH SCIENTIFIC PROBE TO {planet.name.toUpperCase()}</span>
            </button>
          )}
        </div>
      </div>

      {/* High-Resolution NASA Photo Zoom Modal */}
      {isPhotoZoomed && planet.nasaPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setIsPhotoZoomed(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                <h3 className="font-mono font-bold text-white text-sm sm:text-base">
                  {planet.nasaPhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setIsPhotoZoomed(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={planet.nasaPhoto.photoUrl}
                alt={planet.nasaPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
              <div>
                <p className="text-slate-400">
                  Credit: <span className="text-white font-sans">{planet.nasaPhoto.credit}</span>
                </p>
                <p className="text-slate-400">
                  NASA Identifier: <span className="text-cyan-300">{planet.nasaPhoto.nasaId}</span> • Date: {new Date(planet.nasaPhoto.dateCreated).toLocaleDateString()}
                </p>
                {planet.nasaPhoto.isRadarDerived && (
                  <p className="text-amber-400 text-[11px] mt-0.5">
                    Magellan Synthetic Aperture Radar (SAR) topography map.
                  </p>
                )}
              </div>
              <a
                href={planet.nasaPhoto.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shrink-0"
              >
                <span>View on NASA Image Library</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};