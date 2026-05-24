# JobAI — AI-Powered Career Platform

A full-stack career assistant built with **Next.js 16** and **TypeScript**. JobAI helps job seekers optimize resumes, discover roles, generate cover letters, find courses, and practice interviews with a **live AI voice interviewer** powered by Vapi.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Pages & Routes](#pages--routes)
- [AI & External Services](#ai--external-services)
- [UI & UX](#ui--ux)
- [Screenshots](#screenshots)
- [Production Build](#production-build)
- [License](#license)

---

## Overview

JobAI combines **generative AI** (OpenRouter), **real job listings** (JSearch via RapidAPI), **live web search** (SerpAPI), and **voice AI** (Vapi + Daily.co) into one platform. Recruiters or candidates can schedule AI interviews with auto-generated questions; candidates join via a shareable link and speak with an AI interviewer in the browser.

---

## Features

### Resume Checker (`/resume-checker`)

- Upload a **PDF resume** and optionally paste a job description
- Get an **ATS-style score** (0–100), strengths, improvements, and missing skills
- Structured JSON analysis via free LLMs on OpenRouter

### Cover Letter Generator (`/cover-letter`)

- Upload resume + job description
- AI writes a **tailored 300–400 word** professional cover letter
- Uses resume text extracted from PDF (`pdf2json`)

### Job Suggestions (`/job-suggestions`)

- Search by role preferences, **country**, and experience level
- Pulls **real, recent job postings** from JSearch (RapidAPI), filtered to the last week
- Shows title, company, location, salary, type, apply link, and match snippet

### Course Recommendations (`/courses`)

- Input career goals or upload a resume
- AI extracts skills/keywords; **SerpAPI** finds relevant online courses
- Results include platform, link, snippet, and difficulty

### Interview Scheduler (`/interview-scheduler`)

- Enter job title, description, interview type (**technical**, **behavioral**, **mock**)
- AI generates **15 tailored interview questions**
- Saves session to server storage and returns a **shareable link** (`/interview/[id]`)
- Copy link or share via WhatsApp, Facebook, or Gmail

### Live AI Interview (`/interview/[id]`)

- Candidate enters name and email, then starts the session
- **Vapi** conducts a real-time voice interview in the browser
- Custom questions injected into the assistant context
- Split UI: candidate camera preview + AI interviewer visualizer
- Mic/video controls, connection status, and graceful session cleanup

### Career Chatbot (global widget)

- Floating assistant for career questions
- Powered by `/api/chat` and OpenRouter free models

### Marketing & Info Pages

- **Landing** (`/`) — hero, services, features, FAQ with GSAP scroll animations
- **Pricing** (`/pricing`) — subscription tiers
- **Contact** (`/contact`) — contact form and information

---

## How It Works

### Interview flow (end-to-end)

```text
Recruiter / user
    │
    ▼
Interview Scheduler  →  POST /api/generate-questions  (OpenRouter)
    │
    ▼
POST /api/interview/[id]  →  saves questions to data/interviews/{id}.json
    │
    ▼
Share link: /interview/{id}
    │
    ▼
Candidate: InterviewEntry  →  GET /api/interview/[id]
    │
    ▼
InterviewSession  →  Vapi web call (voice + tailored system prompt)
```

### AI request flow

- Task-specific models and fallbacks live in `lib/openrouter.ts`
- On **429 rate limits**, the client retries with backoff and tries alternate free models
- Resume and cover letter routes parse PDFs server-side before prompting the LLM

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, API Routes) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4 |
| **Components** | Radix UI, custom design system (`Button`, `Card`, `Input`, etc.) |
| **Animation** | Framer Motion, GSAP + ScrollTrigger |
| **Icons** | Lucide React |
| **Toasts** | react-hot-toast |
| **AI (text)** | OpenRouter (free `:free` models, per-task routing) |
| **AI (voice)** | [Vapi](https://vapi.ai) Web SDK + Daily.co |
| **PDF parsing** | pdf2json |
| **Jobs API** | JSearch (RapidAPI) |
| **Search API** | SerpAPI (Google organic results) |
| **Analytics** | Vercel Analytics |
| **Deploy** | Docker, Node.js 18+ |

---

## Project Structure

```text
ai-job-assistant/
├── app/
│   ├── api/
│   │   ├── analyze-resume/          # ATS-style resume analysis
│   │   ├── chat/                    # Career chatbot
│   │   ├── generate-cover-letter/   # PDF + JD → cover letter
│   │   ├── generate-questions/      # Interview question generation
│   │   ├── interview/[id]/          # Persist / load interview sessions
│   │   ├── job-suggestions/         # JSearch job listings
│   │   └── recommend-courses/       # SerpAPI course search
│   ├── contact/
│   ├── courses/
│   ├── cover-letter/
│   ├── interview/[id]/              # Candidate interview entry
│   ├── interview-scheduler/
│   ├── job-suggestions/
│   ├── pricing/
│   ├── resume-checker/
│   ├── globals.css
│   ├── layout.tsx                   # Navbar, Footer, Toaster, fonts
│   └── page.tsx                     # Landing page
├── components/
│   ├── InterviewEntry.tsx           # Pre-interview form
│   ├── InterviewSession.tsx         # Live Vapi session UI
│   ├── InterviewScheduler.tsx       # Schedule + link generation
│   ├── CoverLetterGenerator.tsx
│   ├── ResumeCheckerPage.tsx
│   ├── JobSuggestionsPage.tsx
│   ├── Courses.tsx
│   ├── ChatbotWidget.tsx
│   ├── HeroSection.tsx, FeaturesSection.tsx, FAQSection.tsx, …
│   └── ui/                          # shadcn-style primitives
├── lib/
│   ├── openrouter.ts                # Model lists + fallback completion
│   ├── vapi-interview.ts            # Vapi session + assistant overrides
│   ├── interview-store.ts           # File-based interview JSON store
│   ├── animations.ts
│   └── utils.ts
├── data/interviews/                 # Generated interview JSON (gitignored)
├── public/
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze-resume` | PDF resume → ATS score, strengths, gaps |
| `POST` | `/api/generate-cover-letter` | PDF + job description → cover letter |
| `POST` | `/api/generate-questions` | Job context → 15 interview questions |
| `GET` | `/api/interview/[id]` | Load saved interview questions |
| `POST` | `/api/interview/[id]` | Save interview session by ID |
| `POST` | `/api/job-suggestions` | Preferences → live job listings |
| `POST` | `/api/recommend-courses` | Resume/goals → course search results |
| `POST` | `/api/chat` | Career assistant chat message |

---

## Environment Variables

Copy `.env.example` to `.env.local` (or `.env`) and fill in:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

# OpenRouter — resume, cover letter, questions, chat (free models in lib/openrouter.ts)
OPENROUTER_API_KEY=your_openrouter_api_key

# SerpAPI — course recommendations (Google search)
SERPAPI_API_KEY=your_serp_api_key

# RapidAPI — JSearch job listings
RAPIDAPI_KEY=your_rapid_api_key

# Vapi — live voice interviews (https://dashboard.vapi.ai)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id

# Optional Vapi model override (provider + model required if set)
# NEXT_PUBLIC_VAPI_MODEL_PROVIDER=openai
# NEXT_PUBLIC_VAPI_MODEL=gpt-4o-mini
```

| Variable | Required for |
|----------|----------------|
| `OPENROUTER_API_KEY` | Resume, cover letter, questions, chat |
| `SERPAPI_API_KEY` | Course recommendations |
| `RAPIDAPI_KEY` | Job suggestions |
| `NEXT_PUBLIC_VAPI_*` | Live AI interviews |

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- npm (or yarn/pnpm)
- API keys listed above (at minimum OpenRouter for AI features)

### Local development (recommended)

```bash
git clone https://github.com/bibek-totol/AI-Job-Assistant.git
cd AI-Job-Assistant

npm install
cp .env.example .env.local
# Edit .env.local with your API keys

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
cp .env.example .env
# Add your keys to .env, then uncomment env_file in docker-compose.yml if needed

docker-compose up --build
```

Stop containers:

```bash
docker-compose down
```

### Lint

```bash
npm run lint
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, services grid, features, FAQ |
| `/resume-checker` | Resume Checker | PDF upload + ATS analysis |
| `/cover-letter` | Cover Letter | AI cover letter from resume + JD |
| `/job-suggestions` | Job Search | Live jobs via JSearch |
| `/interview-scheduler` | Interview Scheduler | Generate questions + shareable link |
| `/interview/[id]` | Interview Session | Candidate form + live Vapi interview |
| `/courses` | Courses | Skill-based course recommendations |
| `/pricing` | Pricing | Subscription plans |
| `/contact` | Contact | Contact information |

---

## AI & External Services

### OpenRouter (text AI)

Models are configured per task in `lib/openrouter.ts` — **free tier only** (`:free`), with automatic fallback when a provider returns 429 or errors.

| Task | Primary models (examples) |
|------|---------------------------|
| Interview questions | Llama 3.3 70B, Mistral 7B, GPT-OSS 20B, … |
| Cover letter | Llama 3.3 70B, Qwen3 Next 80B, … |
| Resume analysis | DeepSeek V4 Flash, Llama 3.3 70B, … |
| Course keywords | Llama 3.2/3.3, Nemotron Nano |
| Chat | Llama 3.3 70B, Mistral 7B |

### Vapi (voice interviews)

- Web calls via `@vapi-ai/web`
- Assistant overrides: tailored questions, extended silence timeout, idle prompts
- Session lifecycle managed in `lib/vapi-interview.ts` (single instance, Daily cleanup)

### Third-party data

- **JSearch** — real job posts (`date_posted: week`)
- **SerpAPI** — live course links from Google search

---

## UI & UX

- **Dark premium theme** with cyan/indigo accents and glass-style cards
- **Responsive** layout with mobile navigation
- **GSAP** scroll animations on landing sections
- **Framer Motion** on scheduler and forms
- **Skeleton loaders** during async operations
- **react-hot-toast** for success/error feedback
- **Cursor glow** and network background on key pages
- **Split-screen** live interview (you + AI interviewer)

---

## Screenshots

![Screenshot_93](https://github.com/user-attachments/assets/ff72c969-4e9b-45c8-b895-fc6a87d807a0)
![Screenshot_94](https://github.com/user-attachments/assets/ec3b5fd1-5a3a-4cba-9231-2c6cd035ada8)
![Screenshot_82](https://github.com/user-attachments/assets/95efd252-bfab-446a-b164-fd4d89b7fdd7)
![Screenshot_83](https://github.com/user-attachments/assets/93379779-9fe0-40c4-bad5-c99d5c18cf2e)
![Screenshot_84](https://github.com/user-attachments/assets/b632a66f-5f55-4a33-b900-93da25e9b73b)
![Screenshot_85](https://github.com/user-attachments/assets/3bb429fc-6aca-4238-9344-bb007a6c9a5a)
![Screenshot_86](https://github.com/user-attachments/assets/8619760c-2d4a-4838-9085-8dba189de5c2)
![Screenshot_87](https://github.com/user-attachments/assets/03764055-5ffa-4f84-8f59-925f755e45bb)
![Screenshot_88](https://github.com/user-attachments/assets/c452773b-1338-4926-910b-10f13ca60646)
![Screenshot_89](https://github.com/user-attachments/assets/1b08fca3-1f3d-45b4-b384-55a892539e28)
![Screenshot_90](https://github.com/user-attachments/assets/7c5426f6-b031-4991-907d-925908e16d05)
![Screenshot_91](https://github.com/user-attachments/assets/b23e5ee0-0d1f-44ed-ad44-0e79169b4ed0)
![Screenshot_92](https://github.com/user-attachments/assets/9c394675-946d-4654-a055-72814933a901)

---

## Production Build

```bash
npm run build
npm start
```

Ensure all environment variables are set in your hosting provider (e.g. Vercel). For interviews, the app writes to `data/interviews/` — use persistent storage or replace `lib/interview-store.ts` with a database for production at scale.

---

## Roadmap

- [ ] Database-backed interview sessions (replace file store)
- [ ] Interview recordings and transcripts
- [ ] User accounts and saved resumes
- [ ] Payment integration for pricing plans
- [ ] Email notifications for scheduled interviews

---

## License

See [LICENSE](LICENSE) in this repository.

---

## Author

Built as **AI Job Assistant** / **JobAI** — an end-to-end career platform combining modern frontend UX with practical AI and real-world job data APIs.
