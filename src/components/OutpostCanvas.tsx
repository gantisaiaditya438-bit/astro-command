import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Zap, Sparkles, Wind, Info } from 'lucide-react';

export const OutpostCanvas: React.FC = () => {
  const {
    scenario,
    currentHour,
    dustLevel,
    activeSolarStorm,
    subsystems,
    resources
  } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeModuleTip, setActiveModuleTip] = useState<string | null>(null);

  const isLunar = scenario.outpostType === 'lunar';
  const isDaytime = currentHour >= 6 && currentHour <= 19;
  const shieldActive = subsystems.radiationShieldPower > 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    // Generate static stars once
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 260,
      radius: Math.random() * 1.5 + 0.5,
      twinkleSpeed: Math.random() * 0.05 + 0.02,
      baseAlpha: Math.random() * 0.5 + 0.3
    }));

    const render = () => {
      step += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Sky Gradient
      ctx.clearRect(0, 0, width, height);

      let skyGradient: CanvasGradient;
      if (isLunar) {
        // Space is black on Moon even during day, with sun glare
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#02040a');
        skyGradient.addColorStop(0.65, isDaytime ? '#080d1a' : '#020307');
        skyGradient.addColorStop(1, '#111726');
      } else {
        // Mars thin reddish sky
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#1c0c0b');
        skyGradient.addColorStop(0.65, isDaytime ? '#451f1c' : '#14080a');
        skyGradient.addColorStop(1, '#5a251e');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Stars
      stars.forEach((star) => {
        const alpha = star.baseAlpha + Math.sin(step * star.twinkleSpeed * 50) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
        ctx.beginPath();
        ctx.arc((star.x / 1000) * width, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Earth / Mars Celestial Body in Sky
      if (isLunar) {
        // The Blue Marble Earth rising over the lunar horizon
        const earthX = width * 0.82;
        const earthY = 70;
        const earthRad = 32;

        const earthGlow = ctx.createRadialGradient(earthX, earthY, earthRad * 0.8, earthX, earthY, earthRad * 1.6);
        earthGlow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        earthGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = earthGlow;
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRad * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Earth disc
        const earthBody = ctx.createRadialGradient(earthX - 10, earthY - 10, 5, earthX, earthY, earthRad);
        earthBody.addColorStop(0, '#60a5fa');
        earthBody.addColorStop(0.5, '#2563eb');
        earthBody.addColorStop(0.8, '#1e3a8a');
        earthBody.addColorStop(1, '#0f172a');
        ctx.fillStyle = earthBody;
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRad, 0, Math.PI * 2);
        ctx.fill();

        // White cloud swirls
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(earthX - 6, earthY - 8, 14, 5, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(earthX + 4, earthY + 6, 12, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Sun & Solar Flare FX
      const sunX = width * 0.18;
      const sunY = 55;
      const sunRad = isDaytime ? 24 : 14;

      if (isDaytime || activeSolarStorm) {
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, activeSolarStorm ? 90 : 60);
        sunGlow.addColorStop(0, activeSolarStorm ? 'rgba(255, 60, 0, 0.9)' : 'rgba(255, 250, 200, 0.8)');
        sunGlow.addColorStop(0.5, activeSolarStorm ? 'rgba(255, 120, 0, 0.4)' : 'rgba(253, 224, 71, 0.2)');
        sunGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, activeSolarStorm ? 90 : 60, 0, Math.PI * 2);
        ctx.fill();

        // Solar Flare Coronal Ejection trails if active
        if (activeSolarStorm) {
          ctx.strokeStyle = 'rgba(255, 100, 20, 0.75)';
          ctx.lineWidth = 2.5;
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI) / 2.5 + Math.sin(step + i) * 0.2;
            const len = 40 + Math.sin(step * 3 + i) * 18;
            ctx.beginPath();
            ctx.moveTo(sunX, sunY);
            ctx.lineTo(sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len);
            ctx.stroke();
          }
        }

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Lunar / Martian Terrain Horizon
      const groundY = height * 0.72;

      // Far hills
      ctx.fillStyle = isLunar ? '#1a2233' : '#421a16';
      ctx.beginPath();
      ctx.moveTo(0, groundY - 30);
      ctx.bezierCurveTo(width * 0.25, groundY - 65, width * 0.55, groundY - 15, width, groundY - 45);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Near crater rim
      ctx.fillStyle = isLunar ? '#242e42' : '#64261f';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.bezierCurveTo(width * 0.35, groundY - 20, width * 0.7, groundY + 15, width, groundY - 5);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Craters on surface
      ctx.fillStyle = isLunar ? '#161d2b' : '#3d1612';
      ctx.beginPath();
      ctx.ellipse(width * 0.15, groundY + 40, 45, 12, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(width * 0.78, groundY + 50, 60, 14, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // 6. OUTPOST HABITAT DOME (Center)
      const domeX = width * 0.5;
      const domeY = groundY + 10;
      const domeRad = Math.min(width * 0.16, 95);

      // Active Radiation Shield Forcefield Bubble (Holographic cyan/amber dome)
      if (shieldActive || activeSolarStorm) {
        const shieldPulse = Math.sin(step * 4) * 0.15 + 0.35;
        const shieldGrad = ctx.createRadialGradient(domeX, domeY - 20, domeRad * 0.6, domeX, domeY - 20, domeRad * 1.55);
        if (activeSolarStorm) {
          shieldGrad.addColorStop(0, `rgba(245, 158, 11, ${shieldPulse * 0.4})`);
          shieldGrad.addColorStop(1, `rgba(239, 68, 68, ${shieldPulse * 0.75})`);
        } else {
          shieldGrad.addColorStop(0, `rgba(56, 189, 248, ${shieldPulse * 0.25})`);
          shieldGrad.addColorStop(1, `rgba(14, 165, 233, ${shieldPulse * 0.6})`);
        }
        ctx.fillStyle = shieldGrad;
        ctx.beginPath();
        ctx.arc(domeX, domeY - 10, domeRad * 1.5, Math.PI, 0);
        ctx.fill();

        // Shield Hex Grid Arc
        ctx.strokeStyle = activeSolarStorm ? 'rgba(252, 165, 165, 0.7)' : 'rgba(125, 211, 252, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(domeX, domeY - 10, domeRad * 1.5, Math.PI, 0);
        ctx.stroke();
      }

      // Geodesic Dome Exterior Structure
      const domeGrad = ctx.createLinearGradient(domeX - domeRad, domeY - domeRad, domeX + domeRad, domeY);
      domeGrad.addColorStop(0, '#f1f5f9');
      domeGrad.addColorStop(0.4, '#94a3b8');
      domeGrad.addColorStop(1, '#475569');
      ctx.fillStyle = domeGrad;
      ctx.beginPath();
      ctx.arc(domeX, domeY, domeRad, Math.PI, 0);
      ctx.fill();

      // Geodesic Facet Lines
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(domeX - domeRad * 0.65, domeY);
      ctx.lineTo(domeX, domeY - domeRad * 0.85);
      ctx.lineTo(domeX + domeRad * 0.65, domeY);
      ctx.moveTo(domeX, domeY - domeRad);
      ctx.lineTo(domeX, domeY);
      ctx.moveTo(domeX - domeRad * 0.85, domeY - domeRad * 0.35);
      ctx.lineTo(domeX + domeRad * 0.85, domeY - domeRad * 0.35);
      ctx.stroke();

      // Habitat Observation Windows (Illuminated)
      const windowPulse = Math.sin(step * 2) * 0.1 + 0.9;
      ctx.fillStyle = `rgba(254, 240, 138, ${windowPulse})`;
      ctx.beginPath();
      ctx.ellipse(domeX - 22, domeY - 32, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(domeX + 22, domeY - 32, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Airlock Entrance Tunnel
      ctx.fillStyle = '#334155';
      ctx.fillRect(domeX - 18, domeY - 26, 36, 26);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(domeX - 12, domeY - 20, 24, 20);
      // Airlock status LED
      ctx.fillStyle = resources.oxygen.current > 30 ? '#10b981' : '#ef4444';
      ctx.beginPath();
      ctx.arc(domeX, domeY - 23, 3, 0, Math.PI * 2);
      ctx.fill();

      // 7. GREENHOUSE HYDROPONICS MODULE (Right Side)
      const ghX = domeX + domeRad + 25;
      const ghY = groundY + 12;
      const ghWidth = 65;
      const ghHeight = 42;

      // Translucent cylindrical bio-dome
      const ghGlow = ctx.createLinearGradient(ghX, ghY - ghHeight, ghX + ghWidth, ghY);
      ghGlow.addColorStop(0, 'rgba(168, 85, 247, 0.7)'); // LED UV violet grow lights
      ghGlow.addColorStop(0.5, 'rgba(34, 197, 94, 0.65)'); // Green foliage glow
      ghGlow.addColorStop(1, 'rgba(16, 185, 129, 0.4)');
      ctx.fillStyle = ghGlow;
      ctx.beginPath();
      ctx.roundRect(ghX, ghY - ghHeight, ghWidth, ghHeight, [16, 16, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Internal plant rows
      ctx.fillStyle = '#15803d';
      for (let p = 0; p < 4; p++) {
        ctx.beginPath();
        ctx.arc(ghX + 12 + p * 13, ghY - 10, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connector tube to main dome
      ctx.fillStyle = '#475569';
      ctx.fillRect(domeX + domeRad * 0.9, groundY - 14, ghX - (domeX + domeRad * 0.9), 16);

      // 8. SOLAR PHOTOVOLTAIC ARRAY (Left Side)
      const spX = domeX - domeRad - 90;
      const spY = groundY - 30;

      // Panel frame
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(spX, spY, 65, 42);

      // Blue solar cells
      ctx.fillStyle = isDaytime ? '#1d4ed8' : '#0f172a';
      ctx.fillRect(spX + 3, spY + 3, 59, 36);

      // Solar grid lines
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      for (let g = 1; g < 4; g++) {
        ctx.beginPath();
        ctx.moveTo(spX + 3, spY + g * 9);
        ctx.lineTo(spX + 62, spY + g * 9);
        ctx.stroke();
      }

      // Regolith dust accumulation layer over solar panels
      if (dustLevel > 15) {
        ctx.fillStyle = `rgba(148, 163, 184, ${(dustLevel / 100) * 0.75})`;
        ctx.fillRect(spX + 3, spY + 3, 59, 36);
      }

      // Stand & Mast
      ctx.fillStyle = '#64748b';
      ctx.fillRect(spX + 30, spY + 42, 6, 25);

      // 9. ECLSS SABATIER / O2 TANK MODULE (Far Left)
      const eclsX = spX - 50;
      const eclsY = groundY + 10;
      // White cryogenic cylinder
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(eclsX, eclsY - 38, 28, 38, [8, 8, 2, 2]);
      ctx.fill();
      // O2 label
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('O₂', eclsX + 8, eclsY - 20);

      // Sabatier steam vent pulse
      const ventPulse = Math.sin(step * 5);
      if (ventPulse > 0.6) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(eclsX + 14, eclsY - 42 - (ventPulse - 0.6) * 15, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 10. AUTONOMOUS ROVER "HERMES" (Driving on right)
      const roverX = (width * 0.76) + Math.sin(step * 0.8) * 15;
      const roverY = groundY + 22;

      // Rover chassis
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(roverX, roverY - 14, 28, 10);
      // Mast & camera
      ctx.fillStyle = '#475569';
      ctx.fillRect(roverX + 20, roverY - 24, 3, 10);
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(roverX + 21, roverY - 24, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // 6 Rover wheels
      ctx.fillStyle = '#0f172a';
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        ctx.arc(roverX + 4 + w * 10, roverY - 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 11. Astronaut on EVA near airlock
      const astroX = domeX + 32;
      const astroY = groundY + 5;
      // Suit body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(astroX, astroY - 18, 9, 14, 3);
      ctx.fill();
      // Helmet visor (gold reflective)
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(astroX + 4.5, astroY - 22, 4.5, 0, Math.PI * 2);
      ctx.fill();
      // Backpack (PLSS life support)
      ctx.fillStyle = '#64748b';
      ctx.fillRect(astroX - 3, astroY - 17, 3, 10);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scenario, currentHour, dustLevel, activeSolarStorm, subsystems, resources, isLunar, isDaytime, shieldActive]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-cyan-800/40 bg-space-darkest shadow-2xl">
      <canvas
        ref={canvasRef}
        width={1000}
        height={320}
        className="w-full h-56 sm:h-72 md:h-80 object-cover block"
      />

      {/* Atmospheric / Environmental Overlays */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-ping" />
          {scenario.outpostType === 'lunar' ? 'Shackleton Crater Base' : 'Jezero Delta Alpha'}
        </span>

        {activeSolarStorm && (
          <span className="px-2.5 py-1 rounded-lg bg-red-950/90 backdrop-blur-md border border-red-500 text-red-200 font-mono text-xs flex items-center animate-bounce shadow-lg">
            <Shield className="w-3.5 h-3.5 text-red-400 mr-1.5" />
            SOLAR FLARE FLUX ACTIVE
          </span>
        )}

        {dustLevel > 35 && (
          <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 backdrop-blur-md border border-amber-500 text-amber-300 font-mono text-xs flex items-center shadow-lg">
            <Wind className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            Dust Coating: {dustLevel}%
          </span>
        )}
      </div>

      {/* Interactive Module Indicator Pills for Children */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
          <button
            onClick={() => setActiveModuleTip('solar')}
            className="px-2 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center space-x-1"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>PV Array ({100 - dustLevel}% eff.)</span>
          </button>

          <button
            onClick={() => setActiveModuleTip('dome')}
            className="px-2 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center space-x-1"
          >
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Habitat Dome</span>
          </button>

          <button
            onClick={() => setActiveModuleTip('greenhouse')}
            className="px-2 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Hydroponics Lab</span>
          </button>
        </div>

        <div className="text-right text-[11px] text-slate-400 font-mono hidden md:block">
          NASA In-Situ Life Support Simulator (ECLSS)
        </div>
      </div>

      {/* Module Explainer Dialog */}
      {activeModuleTip && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-xl p-4 max-w-md text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono">
                <Info className="w-4 h-4" />
                <span>
                  {activeModuleTip === 'solar' && 'Photovoltaic Solar Array Farm'}
                  {activeModuleTip === 'dome' && 'Pressurized Geodesic Habitat'}
                  {activeModuleTip === 'greenhouse' && 'Hydroponic Space Greenhouse'}
                </span>
              </div>
              <button
                onClick={() => setActiveModuleTip(null)}
                className="text-slate-400 hover:text-white font-mono px-2 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {activeModuleTip === 'solar' &&
                'Generates power from sunlight along the crater rim. Lunar dust is electrostatic and coats the glass panels, reducing energy output. Electrodynamic vibration or astronaut brushing is required to clean them!'}
              {activeModuleTip === 'dome' &&
                'The central crew quarters and command bridge. It maintains 1 atmosphere of pressure, filters carbon dioxide with Sabatier reactors, and uses active electromagnetic shielding to deflect cosmic rays.'}
              {activeModuleTip === 'greenhouse' &&
                'Grows fast-growing microgreens and Arabidopsis under specialized full-spectrum LED light arrays. Plants recycle astronaut CO2 into pure oxygen and produce fresh food!'}
            </p>
            <button
              onClick={() => setActiveModuleTip(null)}
              className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs font-mono"
            >
              Understood, Commander!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

