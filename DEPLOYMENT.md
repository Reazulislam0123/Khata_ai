# Vercel Free Hosting Deployment Guide

This guide explains how to deploy **KhataAI (খাতা AI)** to Vercel's free hosting tier in under 3 minutes.

---

## 🚀 1-Click Deployment via Vercel Dashboard

### Step 1: Push Code to GitHub
1. Initialize git in your project directory (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: complete KhataAI platform"
   ```

2. Create a new repository on [GitHub](https://github.com/new).
3. Link and push your code:
   ```bash
   git remote add origin git@github.com:asikr048/AI-exam-evaluation.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Import Project into Vercel
1. Log in to [Vercel](https://vercel.com) (free account).
2. Click **"Add New..."** → **"Project"**.
3. Select your `AI-exam-evaluation` repository and click **"Import"**.
4. Framework Preset will be automatically detected as **Next.js**.

---

### Step 3: Free Automatic Database Setup (Zero Config!)

KhataAI includes a dual-layer smart database engine:

#### Option A: 1-Click Free Vercel Postgres / Neon (Recommended for production data persistence)
1. In your Vercel project dashboard, go to the **Storage** tab.
2. Click **"Create Database"** → select **Postgres (Neon)** (100% free tier: 500 MB storage).
3. Connect it to your project. Vercel automatically injects `DATABASE_URL` and `POSTGRES_PRISMA_URL`.
4. **That's it!** On the next automatic deployment, `scripts/db-setup.mjs` runs `prisma db push` and auto-creates all 6+ database tables and indexes with zero manual terminal commands.

#### Option B: Zero-Config In-Memory Fallback
If you deploy without connecting any database, KhataAI automatically runs in zero-config mode using its built-in in-memory repository with pre-seeded HSC Physics, IELTS Writing, and sample student submissions. You never have to worry about build errors or missing tables.

---

### Step 4: Environment Variables (Optional)
Under the **"Environment Variables"** section in Vercel:

| Key | Value Description |
|:---|:---|
| `NEXT_PUBLIC_APP_URL` | Your production Vercel URL (e.g., `https://ai-exam-evaluation.vercel.app`) |
| `GOOGLE_GENAI_API_KEY` | *(Optional)* Google AI Studio API Key for live Gemini 3.8 Flash evaluation |
| `OPENAI_API_KEY` | *(Optional)* OpenAI API Key for live GPT-6 / o3 evaluation |
| `ANTHROPIC_API_KEY` | *(Optional)* Anthropic API Key for live Claude Opus 5.5 evaluation |
| `DATABASE_URL` | *(Auto-injected by Vercel Postgres)* Neon PostgreSQL connection string |

> [!NOTE]
> Even if you leave all API keys empty, KhataAI operates out-of-the-box using its built-in intelligent evaluation and OCR simulation engine. Anyone visiting the site can test all features immediately!

---

### Step 4: Click Deploy!
1. Click **"Deploy"**.
2. Vercel will build the Next.js application in ~45 seconds.
3. Your platform will be live at `https://<your-project>.vercel.app` with zero monthly hosting costs!
