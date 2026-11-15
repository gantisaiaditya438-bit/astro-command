import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  Bot,
  Sparkles,
  Send,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FREQUENT_QUESTIONS } from '../services/aiAdvisor';
import { soundEffects } from '../services/soundEffects';

export const AIAdvisorChat: React.FC = () => {
  const { advisorMessages, askAdvisorQuestion } = useGame();
  const [customInput, setCustomInput] = useState('');
  const [showQDrawer, setShowQDrawer] = useState(false);

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    soundEffects.playClick();

    // Check if question matches known topics, else answer intelligently
    const query = customInput.toLowerCase();
    let reply =
      'Commander, NASA flight principles mandate keeping your oxygen and energy above 25% at all times! Balance your power grid so life support scrubbers stay warm during cold lunar nights.';

    if (query.includes('dust') || query.includes('regolith') || query.includes('dirt')) {
      reply =
        'Lunar dust is electrostatic and sharp as glass because there is no wind or water erosion on the Moon! Use the electrodynamic dust shield to vibrate particles away without scratching solar glass.';
    } else if (query.includes('solar') || query.includes('flare') || query.includes('radiation') || query.includes('cme')) {
      reply =
        'Solar flares and CMEs eject billions of high-energy protons. Retreat into subterranean regolith shelters or pump water into habitat wall bladders, because hydrogen atoms absorb proton impacts safely!';
    } else if (query.includes('oxygen') || query.includes('air') || query.includes('breathe')) {
      reply =
        'The Moon has no atmosphere. The base uses electrolysis to split mined water ice into breathable oxygen ($O_2$) and uses a Sabatier reactor to recycle exhaled carbon dioxide!';
    } else if (query.includes('water') || query.includes('ice') || query.includes('drink')) {
      reply =
        'We extract cometary water ice from permanently shadowed craters like Shackleton! The ECLSS water loop recycles 98% of crew moisture and graywater.';
    } else if (query.includes('mars') || query.includes('red planet')) {
      reply =
        'Mars has a thin carbon dioxide atmosphere. NASA\'s MOXIE experiment proved we can convert Martian CO2 directly into oxygen for rocket fuel and breathing!';
    }

    askAdvisorQuestion(customInput, reply);
    setCustomInput('');
  };

  const handleSelectQuestion = (q: string, a: string) => {
    soundEffects.playBeep();
    askAdvisorQuestion(q, a);
    setShowQDrawer(false);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col h-[380px] shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow shadow-cyan-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-cyan-300 flex items-center space-x-1.5">
              <span>CAPCOM-AI Mission Advisor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">NASA Flight Telemetry & STEM Guide</p>
          </div>
        </div>

        <button
          onClick={() => setShowQDrawer(!showQDrawer)}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 text-[11px] font-mono transition"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Ask Questions</span>
          {showQDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Suggested Questions Drawer */}
      {showQDrawer && (
        <div className="p-3 bg-slate-950 border-b border-cyan-900/50 space-y-1.5 max-h-48 overflow-y-auto">
          <p className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
            Frequently Asked Space Engineering Questions:
          </p>
          {FREQUENT_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuestion(item.q, item.answer)}
              className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-600/50 text-[11px] text-slate-200 transition font-sans flex items-center justify-between group"
            >
              <span>{item.q}</span>
              <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                Ask ↵
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Message Feed */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
        {advisorMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'User' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-0.5 text-[10px] font-mono text-slate-400">
              <span>{msg.sender}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[90%] p-2.5 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'User'
                  ? 'bg-blue-600 text-white font-sans rounded-tr-none'
                  : msg.type === 'urgent'
                  ? 'bg-red-950/80 border border-red-500/50 text-red-200 font-mono rounded-tl-none'
                  : msg.type === 'science'
                  ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 font-sans rounded-tl-none'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 font-sans rounded-tl-none'
              }`}
            >
              {msg.type === 'urgent' && <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-red-400" />}
              {msg.type === 'science' && <Sparkles className="w-3.5 h-3.5 inline mr-1 text-indigo-300" />}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendCustom} className="p-2.5 bg-slate-950 border-t border-slate-800 flex space-x-2">
        <input
          type="text"
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          placeholder="Ask CAPCOM about solar storms, dust, oxygen..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

