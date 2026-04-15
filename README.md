# 🤖 RobloxAI – Free Roblox Script Builder

AI-powered Roblox Luau script generator using FREE models via OpenRouter. Runs 24/7 at $0 cost.

---

## 🚀 Setup (5 Minutes)

### Step 1: Get your FREE OpenRouter API Key
1. Go to **https://openrouter.ai/**
2. Click **Sign Up** (free)
3. Go to **Keys** → **Create Key**
4. Copy your key (starts with `sk-or-v1-...`)
5. Free models = **$0 forever**, no credit card needed for free models

### Step 2: Put the code on GitHub
1. Go to **https://github.com/new**
2. Create a repo called `roblox-ai`
3. Upload all these files (drag & drop them all)

### Step 3: Deploy FREE on Railway (Recommended)
Railway gives you **500 free hours/month** (enough to run 24/7)

1. Go to **https://railway.app** → Sign up with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `roblox-ai` repo
4. Click **Variables** → Add:
   - `OPENROUTER_API_KEY` = your key from Step 1
5. Railway auto-deploys and gives you a live URL!

### Alternative: Deploy on Render (Also Free)
1. Go to **https://render.com** → Sign up with GitHub
2. **New** → **Web Service** → Connect your repo
3. Set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add Environment Variable: `OPENROUTER_API_KEY`
5. Choose **Free** plan → Deploy

### Alternative: Deploy on Hugging Face Spaces
1. Go to **https://huggingface.co/spaces**
2. Create new Space → **Docker** type
3. Upload all files
4. Add `OPENROUTER_API_KEY` as a Secret

---

## 💻 Run Locally (For Testing)

```bash
# Install dependencies
npm install

# Copy env file and add your key
cp .env.example .env
# Edit .env and paste your OpenRouter key

# Run!
npm start
# Open http://localhost:3000
```

---

## 🧠 Models Used (All FREE)

| Model | Why It's Good |
|-------|--------------|
| DeepSeek R1 | Best reasoning, like OpenAI o1 but free |
| Llama 3.3 70B | Meta's smartest open model |
| Gemini 2.0 Flash | Google's fast + smart model |
| Mistral 7B | Fast fallback |

The app **automatically tries the next model** if one fails. You get the best result always.

---

## 📁 File Structure

```
roblox-ai/
├── server.js          ← Backend API (Node.js/Express)
├── package.json       ← Dependencies
├── Dockerfile         ← For Docker/Railway deployment
├── .env.example       ← Copy to .env and add your key
├── .gitignore
└── public/
    └── index.html     ← Frontend UI
```

---

## ✨ Features

- 🆓 **100% Free** – Uses OpenRouter free tier models
- 🔄 **Auto-fallback** – If one model fails, tries the next
- 💬 **Chat history** – Follow-up questions work
- 📋 **One-click copy** – Copy any code block instantly
- ⚡ **Streaming** – See code appear in real-time
- 🎮 **10 quick prompts** – Click to generate popular systems
- 🌙 **Dark theme** – Easy on the eyes

---

## 🔧 Keep It Running 24/7 (Free)

### Option A: Railway (Best)
Railway's free tier runs continuously. Just deploy once and it stays up.

### Option B: UptimeRobot (Keeps Render awake)
Render's free tier sleeps after 15 min. Use UptimeRobot to ping it:
1. Go to **https://uptimerobot.com** → Free account
2. Add monitor → HTTP → paste your Render URL + `/health`
3. Ping every 5 minutes → your app never sleeps!

---

## 💡 Example Prompts

- "Make a complete tycoon game where players earn money and buy buildings"
- "Create a sword combat system with damage numbers and kill effects"  
- "Build a pet egg hatching system with rarities"
- "Make an admin commands system with kick, ban, and give money"
- "Create a race track with lap counter and winner announcement"

---

## 🔌 Studio Plugin Setup

The plugin generates and inserts scripts **directly inside Roblox Studio**.

### Step 1 — Enable HttpService
In Studio → Home → Game Settings → Security → turn ON **Allow HTTP Requests**

### Step 2 — Install the plugin file
1. In Studio → Plugins tab → **Plugins Folder** button (opens a folder)
2. Drop `plugin/RobloxAI_Plugin.lua` into that folder
3. Restart Roblox Studio — a **RobloxAI** button appears in the Plugins tab

### Step 3 — Set your server URL
Open `RobloxAI_Plugin.lua`, find line 1 of the CONFIG section:
```
local SERVER_URL = "https://YOUR-APP.railway.app"
```
Replace with your deployed Railway/Render URL. Save and restart Studio.

### Step 4 — Use it
- Click **RobloxAI** in the Plugins tab to open the panel
- Type a prompt → **⚡ Generate** → **↳ Insert Script**
- Select an object in Explorer first to place the script inside it
- Follow-up questions work — full conversation memory!

### Optional: password-protect your API
Add `PLUGIN_KEY=yourpassword` in Railway env vars and set `local PLUGIN_KEY = "yourpassword"` in the plugin.
