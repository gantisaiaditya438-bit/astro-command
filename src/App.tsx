import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MissionSelect } from './components/MissionSelect';
import { MissionBriefingModal } from './components/MissionBriefingModal';
import { DashboardView } from './components/DashboardView';
import { MoonView } from './components/moon/MoonView';
import { MarsView } from './components/mars/MarsView';
import { SolarSystemView } from './components/solar/SolarSystemView';
import { PlanetDiscoveryView } from './components/discovery/PlanetDiscoveryView';
import { PlanetComparisonView } from './components/comparison/PlanetComparisonView';
import { AchievementsView } from './components/profile/AchievementsView';
import { LearningCenter } from './components/LearningCenter';
import { NasaDataViewer } from './components/NasaDataViewer';
import { NasaPhotoExplorer } from './components/gallery/NasaPhotoExplorer';
import { MissionResultsModal } from './components/MissionResultsModal';
import { AstroBuddyFloatingWidget } from './components/astrobuddy/AstroBuddyFloatingWidget';
import { ScienceExperimentsView } from './components/experiments/ScienceExperimentsView';

const AppContent: React.FC = () => {
  const { view } = useGame();

  const isFullscreen3D =
    view === 'solar_system' ||
    view === 'explore_moon' ||
    view === 'explore_mars' ||
    view === 'outpost_3d';

  return (
    <div className="min-h-screen bg-[#04060e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className={`flex-1 ${isFullscreen3D ? 'overflow-hidden' : 'pb-10'}`}>
        {view === 'welcome' && <WelcomeScreen />}
        {view === 'solar_system' && <SolarSystemView />}
        {(view === 'explore_moon' || view === 'outpost_3d') && <MoonView />}
        {view === 'explore_mars' && <MarsView />}
        {view === 'planet_discovery' && <PlanetDiscoveryView />}
        {view === 'space_survival' && <PlanetComparisonView />}
        {view === 'science_experiments' && <ScienceExperimentsView />}
        {view === 'dashboard' && <DashboardView />}
        {view === 'mission_select' && <MissionSelect />}
        {view === 'mission_briefing' && <MissionBriefingModal />}
        {view === 'learning_center' && <LearningCenter />}
        {view === 'nasa_data' && <NasaDataViewer />}
        {view === 'nasa_photos' && <NasaPhotoExplorer />}
        {view === 'achievements' && <AchievementsView />}
        {view === 'mission_results' && <MissionResultsModal />}
      </main>

      {/* Floating ASTRO BUDDY AI Space Companion */}
      <AstroBuddyFloatingWidget />

      {/* Footer (hidden during fullscreen 3D exploration) */}
      {!isFullscreen3D && (
        <footer className="border-t border-slate-900 bg-[#020409] py-4 text-center text-xs text-slate-500 font-mono">
          ASTRO COMMAND – 3D Solar System Exploration & Planetary Survival Game • NASA Open Science & DONKI Integration • For Students & Educators
        </footer>
      )}
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
