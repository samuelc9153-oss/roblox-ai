const express = require("express");
const cors = require("cors");
const path = require("path");
const { keepAlive } = require("./keepalive");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "YOUR_KEY_HERE";

// Best FREE models on OpenRouter (smart + free)
const FREE_MODELS = [
  "deepseek/deepseek-r1:free",          // Best reasoning, like o1
  "meta-llama/llama-3.3-70b-instruct:free", // Very smart
  "google/gemini-2.0-flash-exp:free",   // Fast + smart
  "mistralai/mistral-7b-instruct:free", // Fallback
];

const ROBLOX_SYSTEM_PROMPT = `You are RobloxGPT, the world's best Roblox Luau script writer. You are an expert in:
- Roblox Studio scripting with Luau
- RemoteEvents, RemoteFunctions, BindableEvents
- DataStoreService for saving player data
- Tweening, animations, and visual effects
- Game systems: combat, inventory, shops, leaderboards, pets, gamepasses
- Anti-cheat and exploit prevention
- Module scripts and OOP patterns
- Physics, raycasting, and hitboxes
- UI (ScreenGui, Frames, TextLabels, Buttons)
- Popular games like Adopt Me, Blox Fruits, Brookhaven, Pet Simulator

When writing scripts:
1. Always use Luau syntax (not Lua 5.1)
2. Add clear comments explaining every section
3. Label which service the script goes in (ServerScript, LocalScript, ModuleScript)
4. Include error handling with pcall when appropriate
5. Make scripts production-ready and optimized
6. If the user asks for a system (like a shop), give ALL scripts needed

Format your response like this:
- Brief explanation of what the script does
- Each script in its own code block labeled with the script type
- Setup instructions at the end

Be thorough, creative, and write code that actually works.`;

app.post("/api/generate", async (req, res) => {
  const { prompt, model = FREE_MODELS[0], history = [] } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const messages = [
    ...history,
    { role: "user", content: prompt }
  ];

  // Try models in order until one works
  for (const tryModel of [model, ...FREE_MODELS.filter(m => m !== model)]) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://robloxai.app",
          "X-Title": "RobloxAI Script Builder"
        },
        body: JSON.stringify({
          model: tryModel,
          messages: [
            { role: "system", content: ROBLOX_SYSTEM_PROMPT },
            ...messages
          ],
          max_tokens: 4000,
          temperature: 0.3,
          stream: true
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`Model ${tryModel} failed:`, err);
        continue;
      }

      // Stream the response back to client
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Model-Used", tryModel);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            res.write("data: [DONE]\n\n");
            res.end();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) {
              res.write(`data: ${JSON.stringify({ content, model: tryModel })}\n\n`);
            }
          } catch {}
        }
      }

      res.end();
      return;

    } catch (err) {
      console.error(`Error with model ${tryModel}:`, err.message);
    }
  }

  res.status(500).json({ error: "All models failed. Check your API key." });
});

// ── PLUGIN ENDPOINT ──────────────────────────────────────────────────────────
// Roblox Studio's HttpService can't do SSE streaming, so this returns plain JSON.
// Also accepts an apiKey param so the plugin can be locked to trusted users.
app.post("/api/plugin", async (req, res) => {
  const { prompt, model = FREE_MODELS[0], history = [], apiKey } = req.body;

  // Optional: require a simple plugin password set via PLUGIN_KEY env var
  const pluginKey = process.env.PLUGIN_KEY;
  if (pluginKey && apiKey !== pluginKey) {
    return res.status(401).json({ error: "Invalid plugin API key." });
  }

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const messages = [...(history || []), { role: "user", content: prompt }];

  for (const tryModel of [model, ...FREE_MODELS.filter(m => m !== model)]) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://robloxai.app",
          "X-Title": "RobloxAI Studio Plugin"
        },
        body: JSON.stringify({
          model: tryModel,
          messages: [{ role: "system", content: ROBLOX_SYSTEM_PROMPT }, ...messages],
          max_tokens: 4000,
          temperature: 0.3,
          stream: false   // plain JSON for Studio
        })
      });

      if (!response.ok) { console.error(`Plugin: model ${tryModel} failed`); continue; }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";

      return res.json({ result: text, model: tryModel });
    } catch (err) {
      console.error(`Plugin error with ${tryModel}:`, err.message);
    }
  }

  res.status(500).json({ error: "All models failed. Check your OpenRouter key." });
});

// Health check for uptime monitoring
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

app.get("/api/models", (req, res) => res.json({ models: FREE_MODELS }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🤖 RobloxAI running on port ${PORT}`);
  setTimeout(keepAlive, 10000);
});
