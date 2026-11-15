import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { executeNasaSync } from './src/services/nasaBackendService';
import { searchNasaImageLibrary } from './src/services/nasaImageLibraryService';

function nasaApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'nasa-open-data-api-server',
    configureServer(server) {
      // 1. GET /api/nasa-images: Queries the official NASA Image and Video Library
      server.middlewares.use('/api/nasa-images', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        const url = new URL(req.url || '', 'http://localhost:5173');
        const q = url.searchParams.get('q') || 'Mars';
        const planet = url.searchParams.get('planet') || undefined;

        res.setHeader('Content-Type', 'application/json');
        try {
          const results = await searchNasaImageLibrary(q, planet);
          res.statusCode = 200;
          return res.end(JSON.stringify(results));
        } catch (err: any) {
          console.error('NASA Image Library API Error:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message, items: [] }));
        }
      });

      // 2. GET /api/nasa-data: Returns cached or freshly fetched NASA open data
      server.middlewares.use('/api/nasa-data', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        try {
          const apiKey = process.env.NASA_API_KEY || env.NASA_API_KEY || 'DEMO_KEY';
          const data = await executeNasaSync({ nasaApiKey: apiKey });
          res.statusCode = 200;
          return res.end(JSON.stringify(data));
        } catch (err: any) {
          console.error('NASA Data API Error:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message, status: 'FAILED' }));
        }
      });

      // 2. POST /api/nasa-sync: Forces a fresh synchronization with NASA Open APIs
      server.middlewares.use('/api/nasa-sync', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        try {
          const apiKey = process.env.NASA_API_KEY || env.NASA_API_KEY || 'DEMO_KEY';
          const data = await executeNasaSync({ nasaApiKey: apiKey });
          res.statusCode = 200;
          return res.end(JSON.stringify({
            success: true,
            recordsProcessed: data.spaceWeather.length + data.roverImages.length + data.datasets.length,
            lastSync: data.lastUpdated,
            syncLogs: data.lastSyncLogs
          }));
        } catch (err: any) {
          console.error('NASA Sync Error:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    }
  };
}

function astroBuddyApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'astro-buddy-api-server',
    configureServer(server) {
      server.middlewares.use('/api/astro-buddy', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');

          try {
            const data = JSON.parse(body || '{}');
            const message = data.message || '';
            const history = data.history || [];
            const context = data.context || {};

            const geminiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
            const openAiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;

            const systemPrompt = `You are ASTRO BUDDY, an intelligent, friendly AI astronaut robot companion inside the educational space game ASTRO COMMAND.
Target Audience: Children aged 7–12, young astronauts, students, and educators.
Tone: Enthusiastic, encouraging, curious, friendly, and scientifically grounded in NASA planetary science.

STRICT SAFETY AND CHILD-FRIENDLY RULES:
1. Keep responses concise (1 to 2 short, easy-to-read paragraphs).
2. Explain complex scientific words with fun, clear real-world analogies (e.g. "rust like an old bicycle", "billiard balls bouncing").
3. NEVER ask for or collect personal information (no real names, addresses, schools, or phone numbers).
4. Do not pretend to be a real human or living astronaut; you are ASTRO BUDDY, a futuristic AI exploration robot!
5. Use authentic NASA facts (Apollo, Artemis, Perseverance, Curiosity, MOXIE, Cassini, Voyager).
6. Provide helpful advice using the player's live game context:
- Current Location: ${context.currentView || 'Space Outpost'} (Planet/Moon: ${context.selectedPlanet || 'Not selected'})
- Active Mission: ${context.currentMission ? context.currentMission.title : 'None active'}
- Base Resources: ${context.resources ? `O2: ${context.resources.oxygen}%, Power: ${context.resources.energy}%, Water: ${context.resources.water}%` : 'Normal'}
- Active Hazard: ${context.activeSolarStorm ? 'WARNING: ACTIVE SOLAR STORM' : 'None'}
7. Do not claim you can cheat the game or magically fill up resources; coach the child on how THEY can solve it using the habitat systems and rover!
8. NASA DATA GROUNDING & INTEGRITY:
When answering scientific questions or space weather queries, clearly distinguish between:
- [Verified NASA Fact]: Real data from NASA DONKI, OSDR, Mars rovers, or PDS. Never invent fake scientific measurements!
- [AI Explanation]: Simple child-friendly analogies and explanations.
- [Simulated Gameplay Value]: In-game habitat values or mission mechanics inspired by real science.
Include authentic NASA source links (e.g. https://api.nasa.gov, https://osdr.nasa.gov, https://mars.nasa.gov) when relevant.`;

            // 1. Try Gemini Provider
            if (geminiKey) {
              const contents = [
                {
                  role: 'user',
                  parts: [{ text: systemPrompt + '\n\nPlayer question: ' + message }]
                }
              ];

              const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents,
                    generationConfig: {
                      temperature: 0.7,
                      maxOutputTokens: 250
                    }
                  })
                }
              );

              if (geminiRes.ok) {
                const geminiData = await geminiRes.json();
                const replyText =
                  geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
                if (replyText) {
                  res.statusCode = 200;
                  return res.end(
                    JSON.stringify({ reply: replyText, provider: 'gemini' })
                  );
                }
              }
            }

            // 2. Try OpenAI Provider
            if (openAiKey) {
              const messages = [
                { role: 'system', content: systemPrompt },
                ...history,
                { role: 'user', content: message }
              ];

              const openAiRes = await fetch(
                'https://api.openai.com/v1/chat/completions',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openAiKey}`
                  },
                  body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages,
                    max_tokens: 220,
                    temperature: 0.7
                  })
                }
              );

              if (openAiRes.ok) {
                const openAiData = await openAiRes.json();
                const replyText = openAiData.choices?.[0]?.message?.content;
                if (replyText) {
                  res.statusCode = 200;
                  return res.end(
                    JSON.stringify({ reply: replyText, provider: 'openai' })
                  );
                }
              }
            }

            // 3. Fallback signaling (no key configured or external API unavailable)
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                reply: null,
                fallback: true,
                note: 'Using local NASA knowledge base'
              })
            );
          } catch (err: any) {
            console.error('Astro Buddy server API error:', err);
            res.statusCode = 200;
            return res.end(
              JSON.stringify({ reply: null, fallback: true, error: err.message })
            );
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), nasaApiPlugin(env), astroBuddyApiPlugin(env)],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            vendor: ['react', 'react-dom', 'lucide-react', 'canvas-confetti']
          }
        }
      }
    }
  };
});
