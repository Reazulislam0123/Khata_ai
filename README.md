# KhataAI (খাতা AI) — Intelligent Exam Evaluation Platform

**Commercial AI Exam Evaluation SaaS for Bangladesh & Global Curricula**  
*Hosted 100% Free on Vercel Serverless Architecture*

---

## 🌟 Overview

**KhataAI (খাতা AI)** is a multi-tenant, multimodal AI exam evaluation startup platform designed for:
- **Schools, Colleges & Universities** across Bangladesh and globally.
- **Top Coaching Centers** (e.g. Udvash, UCC, Retina, Mentors', Unmesh).
- **Independent Tutors & Teachers**.
- **Students** preparing for National Boards (PSC, JSC, SSC, HSC), University Admissions (DU, BUET, Medical), BCS, and International Standardized Tests (IELTS Academic/General, SAT, GRE).

---

## 🚀 Key Features

### 1. Dual Examination Capabilities
- **Handwritten Paper Evaluation**: Teachers or students capture handwritten answer sheets via device camera or multi-page image upload.
- **Live Online Exam Arena**: Timed tests with countdown clock, interactive MCQs, rich written text editing, and inline camera snapshot submission.

### 2. Deep Curriculum-Specific Evaluation
- **Bangladeshi Creative Questions (CQ / সৃজনশীল প্রশ্ন)**: Evaluates all 4 distinct cognitive parts:
  - **ক (জ্ঞানমূলক - 1 mark)**: Exact recall & definition.
  - **খ (অনুধাবনমূলক - 2 marks)**: Two-paragraph concept identification and scientific explanation.
  - **গ (প্রয়োগমূলক - 3 marks)**: Formula derivation, numerical calculation, and stimulus application.
  - **ঘ (উচ্চতর দক্ষতামূলক - 4 marks)**: 4-step critical synthesis (Thesis, Theoretical premise, Mathematical/comparative analysis, and Conclusion).
- **IELTS Academic / General Training**:
  - Task 1 (150 words) and Task 2 (250 words) scored against all 4 official 9.0 band descriptors: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
- **University Admission & BCS**:
  - Configurable negative marking (-0.25 for DU/Medical/BUET, -0.50 for BCS).
  - Component-wise separate passing rules.

### 3. Fair & Transparent Student Script Viewer
- Students see their exact graded paper with side-by-side model answers.
- Point-by-point breakdown explaining **why marks were awarded or deducted**.
- Actionable AI-generated study tips for the next exam.

### 4. Handwriting Legibility Guard & Human-in-the-Loop
- If handwriting is blurry, overlapped, or illegible, the AI does **not** penalize the student.
- It generates an alert banner (`⚠️ Legibility Alert: Manual Review Required`) and directs the teacher to review and assign marks manually.
- Teachers can adjust marks up or down and add personal remarks.

### 5. Multi-AI Model Gateway (BYOK Support)
Super Admins and institutions can select from the world's most capable 2026 AI models:
- **Google Gemini**: `gemini-3.8-flash` *(Default & Recommended for handwriting OCR)*, `gemini-3.8-flash-cyber`, `gemini-3.7`, `gemini-3.5-flash-lite`, `gemini-3.1-pro-preview`.
- **OpenAI Fleet**: `gpt-6-astra` *(2026 Flagship)*, `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol`, `o3-pro`, `o3`, `o4-mini`, `gpt-4o`.
- **Anthropic Claude**: `claude-opus-5.5` *(2026 Flagship with adaptive thinking)*, `claude-fable-5.1`, `claude-sonnet-5`, `claude-haiku-4.5`, `claude-3-7-sonnet`.
- **xAI Grok**: `grok-4.7` *(Sept 2026 Flagship)*, `grok-4.6`, `grok-4.3` *(1M context)*, `grok-2-vision`.
- **DeepSeek**: `deepseek-v4.1-flash` *(552B MoE with native multimodal vision)*, `deepseek-v4-pro`, `deepseek-r1`, `deepseek-v3`.
- **Custom / OpenRouter**: Connect any private OpenAI-compatible model endpoint.

### 6. Localized Bangladeshi Monetization
- Dual currency support: Bangladeshi Taka (৳ BDT) and USD ($).
- Interactive **bKash & Nagad checkout flow simulation** with instant plan activation.

---

## 🛠️ Tech Stack & Zero-Cost Architecture

- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom typography & Bengali font support
- **Icons**: Lucide React
- **AI SDK**: `@google/genai` (Google Gen AI SDK)
- **Deployment**: Vercel Serverless (Free Hobby Tier friendly)
- **Database**: In-memory repository with seed data for instant demo; production-ready Prisma schema for Neon / Supabase PostgreSQL.

---

## 💻 Local Development

1. Clone or navigate to the repository:
   ```bash
   cd "AI Exam Evaluation"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🌐 Deploy to Vercel (Free Hosting)

See [DEPLOYMENT.md](file:///d:/Asik/Company/My%20Company/AI%20Exam%20Evaluation/DEPLOYMENT.md) for full 1-click deployment instructions.
