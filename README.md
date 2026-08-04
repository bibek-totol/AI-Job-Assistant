# JobAI — AI-Powered Career Platform

A full-stack career assistant built with **Next.js 16**, **TypeScript**, **LangChain**, and **LangGraph**. JobAI helps job seekers optimize resumes, discover roles, generate cover letters, find courses, and practice interviews with a **live AI voice interviewer** powered by Vapi.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-Integration-green?style=flat-square)](https://www.langchain.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent-orange?style=flat-square)](https://langchain-ai.github.io/langgraph/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Studio-blue?style=flat-square)](https://aistudio.google.com/)

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

JobAI combines **generative AI powered by Google AI Studio Gemini API**, **LangChain & LangGraph agents equipped with Online Browsing tools**, **PDF Text Chunking & Gemini Vector Embeddings**, **real job listings** (JSearch via RapidAPI), and **voice AI** (Vapi + Daily.co) into one unified platform.

---

## Features

### Resume Checker (`/resume-checker`)

- Upload a **PDF resume** and optional job description
- PDF text is extracted, split into chunks, and embedded into a vector store via **Gemini Embeddings** (`text-embedding-004`)
- Vector similarity retrieval feeds key resume sections to **LangGraph Agent** for ATS scoring, strengths, and gap analysis

### Cover Letter Generator (`/cover-letter`)

- Upload resume + job description
- Vector retrieval retrieves relevant skills & experience chunks from the uploaded PDF
- **LangGraph Agent** with online browsing generates a tailored 300–400 word cover letter

### Job Suggestions (`/job-suggestions`)

- Search by role preferences, **country**, and experience level
- Pulls **real, recent job postings** from JSearch (RapidAPI)

### Course Recommendations (`/courses`)

- Upload resume or enter career goals
- PDF vector embeddings extract candidate skill gaps, and **LangGraph agent with Online Browsing** finds top live courses

### Interview Scheduler (`/interview-scheduler`)

- Enter job title, description, and interview type
- **LangGraph agent** generates **15 tailored interview questions**
- Generates a **shareable link** (`/interview/[id]`)

### Live AI Interview (`/interview/[id]`)

- Candidate joins and **Vapi** conducts a real-time voice interview in the browser with custom injected question prompts

### Career Chatbot (global widget)

- Floating assistant for career questions powered by **Gemini LangGraph Agent** with live **Online Web Browsing** capability

---

## Environment Variables

```env
# Google AI Studio API Key for Gemini models (LangChain & LangGraph)
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio

SERPAPI_API_KEY=your_serp_api_key
RAPIDAPI_KEY=your_rapid_api_key

NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
```

---

## License

See [LICENSE](LICENSE) in this repository.
