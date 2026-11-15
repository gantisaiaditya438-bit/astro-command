import { AstroBuddyContext, generateAstroBuddyFallbackResponse } from './astroBuddyKnowledge';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'buddy';
  text: string;
  timestamp: string;
  isLiveAI?: boolean;
}

export interface AstroBuddyResponse {
  text: string;
  isLiveAI: boolean;
  provider?: string;
}

/**
 * Send question to Astro Buddy API endpoint.
 * Automatically falls back to local NASA knowledge base if offline or no key configured.
 */
export async function sendQueryToAstroBuddy(
  message: string,
  history: ChatMessage[],
  context: AstroBuddyContext
): Promise<AstroBuddyResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s timeout

    const payload = {
      message,
      history: history.slice(-6).map(h => ({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text
      })),
      context: {
        currentView: context.currentView,
        selectedPlanet: context.selectedPlanet?.name,
        controlMode: context.controlMode,
        currentMission: context.currentMission
          ? {
              title: context.currentMission.title,
              objectives: context.currentMission.objectives
            }
          : null,
        resources: context.resources
          ? {
              oxygen: Math.round(context.resources.oxygen.current),
              energy: Math.round(context.resources.energy.current),
              water: Math.round(context.resources.water.current),
              radiationShielding: Math.round(context.resources.radiationShielding.current)
            }
          : undefined,
        activeSolarStorm: context.activeSolarStorm,
        dustLevel: context.dustLevel,
        recentSample: context.recentSample?.name,
        astronautRank: context.astronautRank,
        sciencePoints: context.sciencePoints
      }
    };

    const response = await fetch('/api/astro-buddy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.reply && typeof data.reply === 'string' && data.reply.trim().length > 0) {
        return {
          text: data.reply.trim(),
          isLiveAI: true,
          provider: data.provider || 'gemini'
        };
      }
    }
  } catch (error) {
    // Network offline, timeout, or server unavailable -> use local fallback
    console.debug('Astro Buddy: Server API unavailable, using local NASA knowledge engine', error);
  }

  // Graceful, guaranteed fallback
  const fallbackText = generateAstroBuddyFallbackResponse(message, context);
  return {
    text: fallbackText,
    isLiveAI: false,
    provider: 'local-stem-engine'
  };
}

/**
 * Web Speech API text-to-speech for friendly voice narration
 */
export function speakAstroBuddy(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop previous utterance

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/\$[^$]+\$/g, '') // remove math $H_2O$
      .replace(/[*_#`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05; // Slightly lively
    utterance.pitch = 1.25; // Friendly, youthful robot tone

    // Try to pick a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      v =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('David')) &&
        v.lang.startsWith('en')
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
    if (onEnd) onEnd();
  }
}

export function stopSpeakingAstroBuddy(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
