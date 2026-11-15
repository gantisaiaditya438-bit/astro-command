import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Wind,
  Shield,
  Zap,
  Sprout
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Why is water one of the best materials for shielding astronauts against solar storm radiation?',
    options: [
      'Because water makes spacesuits shiny and reflective',
      'Because water contains hydrogen atoms, which match the size of cosmic protons and absorb them safely',
      'Because water freezes into ice immediately in space',
      'Because water creates artificial gravity'
    ],
    correctIndex: 1,
    explanation: 'Correct! Hydrogen atoms have nuclei of the exact same size as solar protons, causing incoming radiation particles to bounce away harmlessly like colliding billiard balls!'
  },
  {
    question: 'What is the primary danger of lunar regolith (Moon dust) to base machinery?',
    options: [
      'It is wet and causes rust on rover engines',
      'It is flammable and catches fire in vacuum',
      'It is made of razor-sharp volcanic glass shards with electrostatic charge that stick to and scratch solar panels',
      'It turns into radioactive green slime'
    ],
    correctIndex: 2,
    explanation: 'Spot on! Because the Moon has no wind or water to erode rocks, lunar regolith is sharp as broken glass and carries a static charge from the Sun\'s UV rays.'
  },
  {
    question: 'What percentage of water is recycled aboard closed-loop life support systems like NASA\'s ISS ECLSS?',
    options: [
      'About 25%',
      'About 50%',
      'Over 98%',
      'Water cannot be recycled in space'
    ],
    correctIndex: 2,
    explanation: 'Awesome! NASA\'s advanced filtration and catalytic distillation system recovers over 98% of all water from sweat, breath moisture, and urine.'
  },
  {
    question: 'How do plants in a space greenhouse help human astronauts survive?',
    options: [
      'They absorb carbon dioxide and emit breathable oxygen through photosynthesis',
      'They frighten away alien microbes',
      'They warm up the habitat during cold nights',
      'They create artificial atmospheric pressure'
    ],
    correctIndex: 0,
    explanation: 'Exactly right! Plants inhale the CO2 exhaled by astronauts, drink recycled water, and release fresh oxygen while producing nutritious greens.'
  },
  {
    question: 'What does NASA\'s DONKI space weather system do?',
    options: [
      'It predicts rain and snow on Mars',
      'It tracks solar flares and coronal mass ejections (CMEs) to warn astronauts before radiation arrives',
      'It controls the rover\'s steering wheel',
      'It orders freeze-dried ice cream for the crew'
    ],
    correctIndex: 1,
    explanation: 'Bingo! DONKI monitors solar eruptions in real time, calculating travel speeds so mission commanders can order astronauts into storm shelters before solar energetic particles hit.'
  }
];

export const LearningCenter: React.FC = () => {
  const { setView } = useGame();
  const [activeSection, setActiveSection] = useState<'lessons' | 'quiz'>('lessons');

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === QUIZ_QUESTIONS[currentQIndex].correctIndex;
    if (isCorrect) {
      soundEffects.playSuccess();
      setScore(s => s + 1);
    } else {
      soundEffects.playAlert();
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(q => q + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (score >= 3) {
        soundEffects.playVictory();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    soundEffects.playClick();
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs mb-1">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>NASA JUNIOR ASTRONAUT FIELD GUIDE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
              Space Engineering Learning Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
              Discover how real NASA scientists and flight engineers keep humans alive on the Moon and Mars!
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setView('dashboard');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition shadow-lg shadow-cyan-500/20"
            >
              Back to Mission
            </button>
          </div>
        </div>

        {/* Section Switcher */}
        <div className="flex space-x-2 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveSection('lessons');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              activeSection === 'lessons'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Engineering Lessons</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveSection('quiz');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
              activeSection === 'quiz'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Cadet Certification Quiz</span>
          </button>
        </div>
      </div>

      {/* LESSONS VIEW */}
      {activeSection === 'lessons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: ECLSS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-cyan-300">
              1. ECLSS: How Astronauts Breathe in Space
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              ECLSS stands for <strong>Environmental Control and Life Support System</strong>. Inside an outpost, humans constantly exhale carbon dioxide ($CO_2$). If $CO_2$ isn\'t removed, it causes severe headaches and suffocation.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-sans">
              <span className="font-bold text-cyan-400 font-mono block mb-1">The Sabatier Reaction:</span>
              NASA uses a nickel catalyst reactor that combines waste $CO_2$ with $H_2$ at 400°C to create pure water ($H_2O$) and methane! Electricity then zaps water molecules to make fresh $O_2$.
            </div>
          </div>

          {/* Card 2: Radiation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-purple-300">
              2. Cosmic Rays & Solar Flares
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Earth has a giant magnetic shield (the magnetosphere) and a thick atmosphere that stops cosmic rays. The Moon has <strong>neither</strong>!
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-sans">
              <span className="font-bold text-purple-400 font-mono block mb-1">Water Walls & Regolith:</span>
              High-energy solar protons pass through heavy metals like lead and create dangerous secondary radiation. But lightweight hydrogen atoms (found in water and plastic) safely absorb protons!
            </div>
          </div>

          {/* Card 3: Regolith Dust */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-amber-300">
              3. The Problem with Lunar Dust
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              On Earth, wind and rain tumble sand grains until they are smooth and round. On the Moon, billions of years of meteorite collisions pulverized rocks into jagged, razor-sharp volcanic glass shards!
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-sans">
              <span className="font-bold text-amber-400 font-mono block mb-1">Electrodynamic Cleaning:</span>
              Apollo astronauts reported lunar dust smelled like spent gunpowder and ate away suit gaskets. NASA now uses invisible electrode grids to shake dust off solar panels using electrostatic repulsion!
            </div>
          </div>

          {/* Card 4: Space Farming */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-emerald-300">
              4. Hydroponics & Space Farming
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Shipping fresh food from Earth to the Moon costs thousands of dollars per kilogram. Growing fresh crops inside the base gives astronauts crisp salad vitamins and psychological happiness!
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-sans">
              <span className="font-bold text-emerald-400 font-mono block mb-1">NASA OSDR Space Crops:</span>
              NASA proved microgreens and Arabidopsis grow under red and blue LEDs with mineral-rich hydroponic liquid, recycling astronaut air 24/7!
            </div>
          </div>
        </div>
      )}

      {/* QUIZ VIEW */}
      {activeSection === 'quiz' && (
        <div className="bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto space-y-5">
          {!quizFinished ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Current Score: <strong className="text-emerald-400">{score}</strong>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold font-sans text-white mb-4 leading-snug">
                {QUIZ_QUESTIONS[currentQIndex].question}
              </h3>

              <div className="space-y-2.5 mb-5">
                {QUIZ_QUESTIONS[currentQIndex].options.map((option, idx) => {
                  let optStyle = 'bg-slate-950/70 border-slate-800 hover:border-cyan-500 text-slate-200';
                  if (isAnswered) {
                    if (idx === QUIZ_QUESTIONS[currentQIndex].correctIndex) {
                      optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                    } else if (idx === selectedOption) {
                      optStyle = 'bg-red-950/80 border-red-500 text-red-200';
                    } else {
                      optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === QUIZ_QUESTIONS[currentQIndex].correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== QUIZ_QUESTIONS[currentQIndex].correctIndex && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-slate-200 space-y-1 animate-fadeIn font-sans">
                  <div className="font-bold font-mono text-cyan-400">Engineering Explanation:</div>
                  <p>{QUIZ_QUESTIONS[currentQIndex].explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition shadow-lg"
                  >
                    <span>{currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black mx-auto shadow-xl">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold font-mono text-white">
                Certification Completed!
              </h2>

              <p className="text-sm text-slate-300 font-sans">
                You scored <strong className="text-cyan-400 font-mono text-lg">{score}</strong> out of{' '}
                <strong className="font-mono text-lg">{QUIZ_QUESTIONS.length}</strong>!
              </p>

              {score >= 4 ? (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-mono max-w-md mx-auto">
                  🌟 Outstanding Space Engineer! You have achieved NASA Junior Flight Certification with High Honors!
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-500/50 text-blue-200 text-xs font-mono max-w-md mx-auto">
                  Good work Cadet! Review the engineering field guide and retry to earn your gold wings!
                </div>
              )}

              <div className="flex justify-center space-x-3 pt-3">
                <button
                  onClick={handleRestartQuiz}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setView('dashboard');
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition shadow-lg shadow-cyan-500/20"
                >
                  Command Outpost
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

