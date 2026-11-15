import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { AstroBuddyCharacter, AstroBuddyMood } from './AstroBuddyCharacter';
import {
  sendQueryToAstroBuddy,
  speakAstroBuddy,
  stopSpeakingAstroBuddy,
  ChatMessage
} from '../../services/astroBuddyApi';
import {
  ASTRO_BUDDY_QUIZZES,
  SUGGESTED_BUDDY_QUESTIONS,
  AstroQuizQuestion,
  AstroBuddyContext
} from '../../services/astroBuddyKnowledge';
import {
  SOLAR_SYSTEM_PLANETS,
  getPlanetById
} from '../../data/planetsData';
import { MOON_MISSIONS, MARS_MISSIONS } from '../../data/planetaryMissions';
import { soundEffects } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import {
  X,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  HelpCircle,
  Compass,
  AlertTriangle,
  Award,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Bot
} from 'lucide-react';

interface AstroBuddyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AstroBuddyPanel: React.FC<AstroBuddyPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    view,
    selectedPlanetId,
    controlMode,
    resources,
    dustLevel,
    activeSolarStorm,
    crew,
    sciencePoints,
    astronautRank,
    collectedSamples
  } = useGame();

  const [activeTab, setActiveTab] = useState<'chat' | 'mission' | 'survival' | 'quiz'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'buddy',
      text: "Beep-boop! Hi there, Junior Astronaut! I'm ASTRO BUDDY, your personal AI space companion! What cosmic mystery shall we explore together today?",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState<AstroBuddyMood>('idle');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [subtitles, setSubtitles] = useState<string>('');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Context bundle for AI
  const currentPlanet = selectedPlanetId ? getPlanetById(selectedPlanetId) : undefined;
  const currentMission =
    view === 'explore_moon'
      ? MOON_MISSIONS[0]
      : view === 'explore_mars'
      ? MARS_MISSIONS[0]
      : null;

  const currentContext: AstroBuddyContext = {
    currentView: view,
    selectedPlanet: currentPlanet,
    controlMode,
    currentMission,
    resources,
    dustLevel,
    activeSolarStorm,
    collectedSamplesCount: collectedSamples.length,
    recentSample: collectedSamples.length > 0 ? collectedSamples[collectedSamples.length - 1] : null,
    crewStatus: {
      avgHealth: Math.round(crew.reduce((acc, c) => acc + c.health, 0) / crew.length),
      inShelter: activeSolarStorm
    },
    astronautRank: astronautRank.title,
    sciencePoints
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    soundEffects.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);
    setMood('thinking');

    try {
      const response = await sendQueryToAstroBuddy(query, messages, currentContext);
      const buddyMsg: ChatMessage = {
        id: `buddy-${Date.now()}`,
        sender: 'buddy',
        text: response.text,
        timestamp: 'Just now',
        isLiveAI: response.isLiveAI
      };

      setMessages(prev => [...prev, buddyMsg]);
      setMood('talking');

      // Voice Narration
      if (isVoiceEnabled) {
        setSubtitles(response.text);
        setIsSpeaking(true);
        speakAstroBuddy(
          response.text,
          () => setIsSpeaking(true),
          () => {
            setIsSpeaking(false);
            setMood('idle');
          }
        );
      } else {
        setTimeout(() => setMood('idle'), 3000);
      }
    } catch {
      setMood('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (option: 'A' | 'B' | 'C') => {
    if (quizAnswered) return;
    setSelectedOption(option);
    setQuizAnswered(true);

    const quiz = ASTRO_BUDDY_QUIZZES[currentQuizIndex];
    const isCorrect = option === quiz.correctAnswer;

    if (isCorrect) {
      soundEffects.playVictory();
      setMood('celebrating');
      confetti({ particleCount: 70, spread: 60 });
    } else {
      soundEffects.playAlert();
      setMood('talking');
    }

    if (isVoiceEnabled) {
      speakAstroBuddy(isCorrect ? quiz.explanation : `Good try! The correct answer was ${quiz.correctAnswer}. ${quiz.explanation}`);
    }
  };

  const handleNextQuiz = () => {
    soundEffects.playClick();
    setSelectedOption(null);
    setQuizAnswered(false);
    setMood('idle');
    setCurrentQuizIndex(prev => (prev + 1) % ASTRO_BUDDY_QUIZZES.length);
  };

  if (!isOpen) return null;

  const currentQuiz = ASTRO_BUDDY_QUIZZES[currentQuizIndex];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Semi-transparent Backdrop click to close */}
      <div
        onClick={() => {
          stopSpeakingAstroBuddy();
          onClose();
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      {/* Futuristic Movable Console Window */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-950/95 border-2 border-cyan-500/80 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.35)] backdrop-blur-xl flex flex-col pointer-events-auto overflow-hidden text-slate-100 animate-scaleUp">
        {/* Holographic Glowing Top Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AstroBuddyCharacter mood={mood} size="sm" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-mono font-black text-sm text-cyan-300 tracking-wider">
                  ASTRO BUDDY
                </h2>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                  AI COMPANION
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                NASA STEM Exploration & Survival Assistant
              </p>
            </div>
          </div>

          {/* Controls: Audio Toggle & Close */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (isSpeaking) stopSpeakingAstroBuddy();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              title={isVoiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              className={`p-2 rounded-xl border transition ${
                isVoiceEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                stopSpeakingAstroBuddy();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/40 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs font-mono px-3 pt-2 space-x-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-t-xl transition flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'bg-slate-950 text-cyan-300 border-t-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask Astro Buddy</span>
          </button>

          <button
            onClick={() => setActiveTab('mission')}
            className={`px-3 py-1.5 rounded-t-xl transition flex items-center space-x-1.5 ${
              activeTab === 'mission'
                ? 'bg-slate-950 text-cyan-300 border-t-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Mission Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('survival')}
            className={`px-3 py-1.5 rounded-t-xl transition flex items-center space-x-1.5 ${
              activeTab === 'survival'
                ? 'bg-slate-950 text-cyan-300 border-t-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Survival Vitals</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-t-xl transition flex items-center space-x-1.5 ${
              activeTab === 'quiz'
                ? 'bg-slate-950 text-purple-300 border-t-2 border-purple-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Space Quiz (+15 pts)</span>
          </button>
        </div>

        {/* Subtitle Bar (If speaking) */}
        {isSpeaking && subtitles && (
          <div className="bg-cyan-950/80 px-4 py-1.5 border-b border-cyan-500/30 text-[11px] font-sans text-cyan-200 flex items-center space-x-2 animate-fadeIn">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <p className="line-clamp-1 italic">"{subtitles}"</p>
          </div>
        )}

        {/* Tab 1: Chat & Free Questions */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden min-h-[340px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'buddy' && (
                    <div className="w-7 h-7 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center shrink-0 text-sm shadow">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-tr-none font-sans'
                        : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none font-sans'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span>{msg.timestamp}</span>
                      {msg.isLiveAI && (
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Live AI Powered</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-blue-900 border border-blue-400 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-white shadow">
                      YOU
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-xs text-cyan-300 font-mono animate-pulse p-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Astro Buddy is analyzing NASA flight databases...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Question Pills (Part 3) */}
            <div className="pt-2 pb-2">
              <p className="text-[10px] font-mono text-slate-400 mb-1 flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                <span>Suggested Questions for Junior Astronauts:</span>
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                {SUGGESTED_BUDDY_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-slate-900 hover:bg-cyan-950/80 text-cyan-200 border border-slate-800 hover:border-cyan-500/50 transition font-sans"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2 pt-2 border-t border-slate-800"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask Astro Buddy anything about space, planets, or missions..."
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-extrabold rounded-xl text-xs font-mono transition flex items-center space-x-1 shadow-lg shadow-cyan-500/20"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Mission Guide */}
        {activeTab === 'mission' && (
          <div className="p-5 space-y-4 overflow-y-auto max-h-[380px]">
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest">
                Active Destination Directives
              </span>
              <h3 className="text-base font-bold text-white font-mono">
                {view === 'explore_moon'
                  ? 'Moon Base Camp (Shackleton Crater)'
                  : view === 'explore_mars'
                  ? 'Mars Base Alpha (Jezero Crater)'
                  : 'Solar System Planetary Survey'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {view === 'explore_moon'
                  ? 'Establish lunar self-sufficiency. Mined cometary ice will yield oxygen for the base and rocket propellant for deep space missions.'
                  : view === 'explore_mars'
                  ? 'Survive the Martian frontier. Run the MOXIE CO2 electrolysis plant, insulate water lines against -70°C subzero cold, and cultivate hydroponic greens.'
                  : 'Survey the planetary bodies of our solar system. Click on celestial objects to learn about extreme environments, gravity differences, and human habitability.'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                Step-by-Step Astronaut Checklist:
              </h4>

              {(view === 'explore_moon' ? MOON_MISSIONS : MARS_MISSIONS).slice(0, 3).map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {m.title}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      +{m.targetSciencePoints} pts
                    </span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    {m.objectives.map((obj, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setActiveTab('chat');
                handleSendMessage('What is my current mission objective and how do I complete it?');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-xs font-bold hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4" />
              <span>Ask Astro Buddy for In-Game Navigation Help</span>
            </button>
          </div>
        )}

        {/* Tab 3: Survival Vitals */}
        {activeTab === 'survival' && (
          <div className="p-5 space-y-4 overflow-y-auto max-h-[380px]">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Oxygen Supply</span>
                <div className="text-xl font-mono font-black text-white mt-1">
                  {Math.round(resources.oxygen.current)}%
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${resources.oxygen.current < 25 ? 'bg-red-500' : 'bg-cyan-400'}`}
                    style={{ width: `${Math.min(100, resources.oxygen.current)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 uppercase">Power Battery</span>
                <div className="text-xl font-mono font-black text-white mt-1">
                  {Math.round(resources.energy.current)}%
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${resources.energy.current < 25 ? 'bg-red-500' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, resources.energy.current)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-blue-400 uppercase">Water Reservoir</span>
                <div className="text-xl font-mono font-black text-white mt-1">
                  {Math.round(resources.water.current)}%
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-400"
                    style={{ width: `${Math.min(100, resources.water.current)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-purple-400 uppercase">Radiation Shield</span>
                <div className="text-xl font-mono font-black text-white mt-1">
                  {Math.round(resources.radiationShielding.current)}%
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-purple-400"
                    style={{ width: `${Math.min(100, resources.radiationShielding.current)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Astro Buddy Diagnostic Assessment */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-mono text-cyan-300 font-bold">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Astro Buddy Health & Safety Evaluation:</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans">
                {resources.oxygen.current < 25
                  ? 'CRITICAL WARNING: Base oxygen reserves are below safe thresholds! Immediately return to the habitat dome or divert power to the oxygen generators.'
                  : resources.energy.current < 25
                  ? 'BATTERY ALERT: Solar array batteries are critically drained. Clean dust off the solar panels and shut down the science lab heaters.'
                  : activeSolarStorm
                  ? 'SOLAR RADIATION STORM IN PROGRESS: High-energy protons are bombarding the outpost! Ensure all astronauts remain inside regolith-shielded bunkers.'
                  : 'All life support and environmental controls are functioning normally within NASA flight safety margins. Keep up the great work, Commander!'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Space Quiz Master */}
        {activeTab === 'quiz' && (
          <div className="p-5 space-y-4 overflow-y-auto max-h-[380px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-purple-400">
                Question {currentQuizIndex + 1} of {ASTRO_BUDDY_QUIZZES.length}
              </span>
              <span className="text-xs font-mono text-amber-400 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5" />
                <span>Reward: +{currentQuiz.points} Science Pts</span>
              </span>
            </div>

            <h3 className="text-sm font-bold text-white font-mono leading-snug">
              {currentQuiz.question}
            </h3>

            <div className="space-y-2">
              {currentQuiz.options.map(opt => {
                const isSelected = selectedOption === opt.label;
                const isCorrect = opt.label === currentQuiz.correctAnswer;
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500/60';

                if (quizAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                  }
                }

                return (
                  <button
                    key={opt.label}
                    disabled={quizAnswered}
                    onClick={() => handleQuizAnswer(opt.label as 'A' | 'B' | 'C')}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center space-x-3 text-xs font-sans ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 font-mono font-bold flex items-center justify-center shrink-0">
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {quizAnswered && (
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs space-y-2 animate-fadeIn">
                <div className="font-mono font-bold text-purple-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    {selectedOption === currentQuiz.correctAnswer
                      ? '⭐ Correct! +15 Science Points Earned!'
                      : 'NASA Science Explanation:'}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans">
                  {currentQuiz.explanation}
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleNextQuiz}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition"
                  >
                    Next Question →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
