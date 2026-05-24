# JobAI — Next Feature Requirements

> **What this document is:** A plain-English roadmap of every feature you should build next to turn JobAI from a great demo into a production-ready, investor-ready career platform. Each feature explains *what it is*, *why it matters*, and *exactly how to build it* — backend and frontend both.

---

## Quick Summary

Your current app already does the hard parts — AI resume analysis, cover letters, job search, course recommendations, and live voice interviews. What's missing is the **infrastructure that makes it a real product**: user accounts, a database, payments, emails, and the data that lets you improve over time.

Think of it in three layers:

```
Layer 1 — Foundation     → Auth, Database, Payments  (must-have)
Layer 2 — Product depth  → Dashboard, Analytics, Notifications  (high value)
Layer 3 — Growth         → Referrals, AI improvements, Mobile  (competitive edge)
```

---

## Table of Contents

1. [User Authentication & Accounts](#1-user-authentication--accounts)
2. [Database — Replace File Storage](#2-database--replace-file-storage)
3. [User Dashboard](#3-user-dashboard)
4. [Subscription & Payments](#4-subscription--payments)
5. [Email System](#5-email-system)
6. [Resume Builder (Visual Editor)](#6-resume-builder-visual-editor)
7. [Application Tracker (Kanban Board)](#7-application-tracker-kanban-board)
8. [Salary Estimator](#8-salary-estimator)
9. [Interview Recording & Transcript](#9-interview-recording--transcript)
10. [AI Improvement Feedback Loop](#10-ai-improvement-feedback-loop)
11. [Admin Panel](#11-admin-panel)
12. [Notifications & Alerts](#12-notifications--alerts)
13. [LinkedIn & GitHub Integration](#13-linkedin--github-integration)
14. [Mobile App (PWA)](#14-mobile-app-pwa)
15. [Referral & Affiliate System](#15-referral--affiliate-system)
16. [SEO & Public Profile Pages](#16-seo--public-profile-pages)
17. [Security & Performance](#17-security--performance)
18. [Build Order (Recommended)](#18-build-order-recommended)

---

## 1. User Authentication & Accounts

### What is it?
Right now, anyone can use JobAI anonymously. This feature adds sign up, login, and user profiles — so people's resumes, interviews, and job searches are saved to *their* account.

### Why does it matter?
- Without accounts, you can't charge users money (no subscriptions)
- Users lose all their data every session — frustrating
- You can't send them emails, track usage, or build a business

### What to build

**Frontend:**
- Sign Up page (`/signup`) — email + password + name
- Login page (`/login`)
- Google / GitHub OAuth buttons ("Sign in with Google")
- Forgot password flow
- Profile page (`/profile`) — edit name, email, profile photo, job preferences

**Backend:**
- Use **NextAuth.js v5** (also called Auth.js) — it's the standard for Next.js
- Store users in PostgreSQL (see Section 2)
- JWT session tokens stored in secure HTTP-only cookies
- Password hashing with bcrypt
- Email verification on signup (see Section 5)
- Rate limiting on auth endpoints (prevent brute-force attacks)

**Database tables needed:**
```
users
  id, email, name, password_hash, avatar_url, 
  plan (free/pro/enterprise), created_at, verified_at

sessions
  id, user_id, token, expires_at
```

**Tech to use:** NextAuth.js, bcrypt, PostgreSQL (via Prisma ORM)

---

## 2. Database — Replace File Storage

### What is it?
Currently, interview sessions are saved as `.json` files on the server. This breaks in production (files get wiped on Vercel deployments, can't scale, no queries). You need a real database.

### Why does it matter?
- File storage = data loss on every deployment
- Can't search, filter, or report on data stored in files
- Investors/clients will ask "where is the data stored?" — files is the wrong answer

### What to build

**Database: PostgreSQL** (hosted on Supabase — free tier is excellent)

**ORM: Prisma** — lets you write TypeScript to query the database instead of raw SQL

**Main tables to create:**

```
resumes
  id, user_id, file_url, ats_score, strengths[], 
  improvements[], missing_skills[], created_at

cover_letters
  id, user_id, job_title, company, content, created_at

interviews
  id, session_id, user_id, job_title, interview_type,
  questions[], status (scheduled/completed), created_at

job_searches
  id, user_id, query, country, experience, results_count, created_at

saved_jobs
  id, user_id, job_title, company, link, notes, status
  (interested/applied/interviewing/offer/rejected)

courses
  id, user_id, title, platform, link, saved_at

subscriptions
  id, user_id, plan, stripe_customer_id, 
  stripe_subscription_id, status, expires_at
```

**How to set it up:**
1. Create a free Supabase project → get connection string
2. `npm install prisma @prisma/client`
3. Define schema in `prisma/schema.prisma`
4. Run `npx prisma migrate dev` to create tables
5. Replace all `fs.readFile`/`fs.writeFile` calls in `lib/interview-store.ts` with `prisma.interview.findUnique()` etc.

---

## 3. User Dashboard

### What is it?
A private home screen for logged-in users showing everything they've done — their resumes, cover letters, past interviews, saved jobs, and usage stats.

### Why does it matter?
- Users come back to your app when they have a reason to return
- Dashboard shows value — "look how much I've done here"
- Makes the product feel complete and professional

### What to build

**Route:** `/dashboard`

**Sections:**

```
┌─────────────────────────────────────┐
│  Welcome back, John 👋              │
│  Plan: Free · 3 credits remaining   │
├──────────┬──────────┬───────────────┤
│ Resumes  │ Interviews│ Saved Jobs   │
│    4     │     2     │    12        │
├──────────┴──────────┴───────────────┤
│  Recent Activity (timeline)         │
│  • Resume analyzed — 2 hours ago    │
│  • Interview completed — yesterday  │
├─────────────────────────────────────┤
│  Your ATS Score History (chart)     │
│  [Line chart showing improvement]   │
├─────────────────────────────────────┤
│  Saved Jobs Kanban (mini view)      │
│  Interested → Applied → Interview   │
└─────────────────────────────────────┘
```

**Backend API routes:**
- `GET /api/dashboard` — returns user's counts, recent activity, scores
- `GET /api/resumes` — list user's past resume analyses
- `GET /api/interviews` — list user's past interview sessions
- `GET /api/saved-jobs` — Kanban board data

**Frontend:**
- Protected route (redirect to `/login` if not authenticated)
- Recharts line chart for ATS score over time
- Quick-access buttons to each tool

---

## 4. Subscription & Payments

### What is it?
A pricing system where free users get limited credits (e.g. 3 resume checks/month) and Pro users get unlimited access. Payments handled by Stripe.

### Why does it matter?
- This is how the business makes money
- Stripe is the industry standard — trusted by millions of businesses
- Without this, JobAI is a free tool with no revenue model

### What to build

**Plans:**

| Plan | Price | Resume Checks | Cover Letters | Interviews | Job Searches |
|------|-------|---------------|---------------|------------|--------------|
| Free | $0 | 3 / month | 2 / month | 1 / month | 10 / month |
| Pro | $19/month | Unlimited | Unlimited | Unlimited | Unlimited |
| Enterprise | $49/month | Unlimited | Priority AI | Unlimited | Unlimited + API |

**Frontend pages:**
- `/pricing` — update your existing page with real Stripe checkout links
- `/billing` — manage subscription, view invoices, cancel
- Success/cancel redirect pages after Stripe checkout

**Backend:**
- `POST /api/checkout` — create Stripe checkout session, redirect user to Stripe
- `POST /api/webhook/stripe` — Stripe calls this when payment succeeds/fails/renews
  - On success: update `subscriptions` table, set user plan to "pro"
  - On cancellation: downgrade user back to "free"
- `GET /api/billing` — return user's current plan + invoice history

**Credit system (for free tier):**
- Add a `credits` table: `user_id, feature, used, reset_at`
- Every time a free user calls `/api/analyze-resume`, check if they have credits remaining
- If over limit → return `402 Payment Required` with upgrade prompt
- Credits reset on the 1st of each month

**Tech:** `stripe` npm package, Stripe webhooks with signature verification

---

## 5. Email System

### What is it?
Automated emails sent to users — welcome email when they sign up, interview link when they schedule, weekly tips, etc.

### Why does it matter?
- Email is the highest-ROI marketing channel — brings users back
- Interview links shared via email feel professional vs. copy-pasting a URL
- Transactional emails (verify email, reset password) are a security requirement

### What emails to send

| Email | Trigger | Content |
|-------|---------|---------|
| Welcome | Sign up | "Welcome to JobAI — here's how to get started" |
| Email Verification | Sign up | Magic link to verify address |
| Password Reset | Forgot password | Reset link (expires in 1 hour) |
| Interview Link | Scheduler generates link | Interview URL + instructions for candidate |
| Resume Analysis Ready | Analysis complete | Your ATS score + link to view results |
| Weekly Digest | Every Monday | Your activity summary + new job matches |
| Upgrade Nudge | Free user hits limit | "You've used all 3 resume checks — upgrade for unlimited" |

**Tech to use:** **Resend** (modern email API, very easy, generous free tier) + **React Email** for HTML email templates that look great

**Setup:**
1. `npm install resend react-email`
2. Create email templates in `/emails/` folder using React components
3. Create `lib/email.ts` with `sendEmail(to, subject, template)` helper
4. Call it from API routes when needed

---

## 6. Resume Builder (Visual Editor)

### What is it?
Instead of just checking a resume, users can *build* one inside JobAI using a visual drag-and-drop editor. They fill in their details and download a beautiful ATS-ready PDF.

### Why does it matter?
- This is the #1 feature users want in career platforms
- It's a massive engagement driver — users spend 30–60 minutes building a resume
- ATS-ready output is a strong selling point

### What to build

**Route:** `/resume-builder`

**Features:**
- Section blocks: Contact, Summary, Experience, Education, Skills, Projects, Certifications
- Drag to reorder sections
- 5 clean professional templates (dark, minimal, modern, classic, tech)
- Live preview on the right side as you type
- "AI Improve This Section" button — user clicks, AI rewrites the paragraph
- Export to PDF (download button)
- Save progress to database

**Backend:**
- `POST /api/resume-builder/save` — save current editor state as JSON
- `POST /api/resume-builder/generate-pdf` — convert editor state to PDF (use Puppeteer or `@react-pdf/renderer`)
- `POST /api/resume-builder/improve-section` — AI rewrites a specific section

**Tech:** `@dnd-kit/core` for drag-and-drop, `@react-pdf/renderer` or `puppeteer` for PDF export

---

## 7. Application Tracker (Kanban Board)

### What is it?
A personal CRM board where users track every job they apply for. Columns go from "Interested" → "Applied" → "Phone Screen" → "Interview" → "Offer" → "Rejected".

### Why does it matter?
- Job seekers apply to 50–200 jobs — they desperately need organization
- This feature keeps users in your app daily (checking status, adding notes)
- No other free tool does this well

### What to build

**Route:** `/tracker`

**Board layout:**
```
Interested | Applied | Phone Screen | Interview | Offer | Rejected
    +           +           +              +         +        +
[Job Card]  [Job Card]  [Job Card]     [Job Card]         [Job Card]
[Job Card]
```

**Each job card shows:**
- Company logo (auto-fetched via Clearbit Logo API — free)
- Job title + company name
- Date added
- Next action reminder (e.g. "Follow up by Friday")
- Salary expectation
- Notes field

**Features:**
- Drag card between columns to update status
- Add a job manually OR import from Job Search results with one click
- Set reminders for follow-ups
- Statistics: "You've applied to 24 jobs. 3 are in interview stage."

**Backend:**
- `GET /api/tracker` — fetch all user's tracked jobs
- `POST /api/tracker` — add new job
- `PATCH /api/tracker/[id]` — update status or notes
- `DELETE /api/tracker/[id]` — remove job

**Tech:** `@dnd-kit/core` for drag-and-drop columns

---

## 8. Salary Estimator

### What is it?
User inputs their role, experience, location, and skills — the AI estimates a realistic salary range for them and shows how they compare to market averages.

### Why does it matter?
- One of the most searched career topics online
- Helps job seekers negotiate confidently
- Great SEO traffic driver ("software engineer salary Bangladesh 2025")

### What to build

**Route:** `/salary-estimator`

**Input form:**
- Job title (text input with autocomplete)
- Country + city
- Years of experience
- Skills (tags input)
- Current salary (optional — "Are you underpaid?")

**Output:**
- Salary range: Min / Median / Max (e.g. $60K — $85K — $110K)
- Percentile indicator: "You're in the top 35% for your role"
- Skills that boost salary (e.g. "Adding React Native could add $8K")
- Comparison chart: your estimate vs. market median

**Backend:**
- `POST /api/salary-estimate` — sends user data to AI with a prompt that returns structured salary JSON
- Use OpenRouter to generate estimates based on role + location context
- Cache results per role+location combo in database to save API calls

---

## 9. Interview Recording & Transcript

### What is it?
After a live Vapi interview, save the full audio transcript, generate an AI feedback report, and let the user replay their answers.

### Why does it matter?
- Users can't improve without knowing what they said
- Transcript + feedback is the killer feature that separates you from simple quiz apps
- Users will share their feedback reports — free marketing

### What to build

**After an interview ends:**

1. **Capture transcript** — Vapi sends message events during the call. Collect all `transcript` type messages and save them to database
2. **Generate feedback** — POST the transcript to OpenRouter → AI scores the answers (clarity, confidence, relevance) and gives written feedback per question
3. **Display results page** — `/interview/[id]/results`

**Results page shows:**
```
Interview: Senior Frontend Developer
Date: 25 May 2026 · Duration: 18 minutes

Overall Score: 76/100

Question 1: "Tell me about yourself"
Your answer: [transcript text]
AI Feedback: Good structure. Consider adding specific metrics 
             to your achievements (e.g. "reduced load time by 40%").
Score: 8/10

Question 2: "What is your experience with React?"
...
```

**Backend:**
- Save transcript messages to `interview_messages` table during the call
- `POST /api/interview/[id]/analyze` — sends transcript to AI for scoring
- `GET /api/interview/[id]/results` — returns feedback report

**Vapi integration:** Listen to `message` events of type `transcript` in `InterviewSession.tsx` and POST them to your API in real-time

---

## 10. AI Improvement Feedback Loop

### What is it?
A system that learns from user feedback to improve AI output quality — thumbs up/down on results, plus automatic quality monitoring.

### Why does it matter?
- AI output quality directly affects whether users subscribe
- Without feedback data, you can't improve prompts
- Logging lets you catch bad AI responses before users complain

### What to build

**Thumbs up/down on every AI result:**
- Resume analysis result → 👍 / 👎
- Cover letter → 👍 / 👎
- Job suggestions → "Was this relevant?" per card
- Interview questions → "Was this question appropriate?"

**Backend logging:**
- `POST /api/feedback` — save `{feature, result_id, rating, user_comment}`
- Log every AI API call: `{model, prompt_tokens, completion_tokens, latency_ms, success}`
- Store in `ai_feedback` and `ai_logs` tables

**Admin dashboard shows:**
- Average rating per feature
- Most common complaint themes
- Slowest AI calls (by latency)
- Most expensive features (by token usage)

This data tells you exactly which prompts to improve.

---

## 11. Admin Panel

### What is it?
A private dashboard only you (the owner) can access, showing everything happening in the app — new users, revenue, API costs, errors, and popular features.

### Why does it matter?
- You can't run a business blind
- Clients and investors will ask for metrics
- Helps you spot problems before users report them

### What to build

**Route:** `/admin` (protected by `role: "admin"` on the user record)

**Sections:**

```
Overview
  Total users: 1,247  |  Pro subscribers: 89  |  MRR: $1,691
  New today: 14       |  Churn this month: 3   |  API cost today: $2.40

Users Table
  Search/filter users, view plan, join date, usage, ban/unban

Feature Usage (last 30 days)
  Resume checks: 3,204  |  Cover letters: 891  |  Interviews: 234

AI Costs
  OpenRouter: $45.20  |  Vapi: $12.80  |  SerpAPI: $8.00

Error Log
  List of failed API calls with timestamps and error messages

Recent Interviews
  View list of completed interviews (anonymized if needed)
```

**Backend:**
- Admin-only middleware that checks `user.role === "admin"` on every `/admin` API route
- `GET /api/admin/stats` — aggregated usage from database
- `GET /api/admin/users` — paginated user list with filters

**Tech:** Simple Next.js protected routes — no need for a separate admin framework

---

## 12. Notifications & Alerts

### What is it?
Real-time in-app notifications plus email/push alerts for important events — new job matches, interview reminders, resume analysis complete.

### Why does it matter?
- Keeps users engaged even when they're not on the site
- Interview reminders reduce no-shows
- Job match alerts bring users back daily

### What to build

**In-app notification bell (top right of Navbar):**
- Red dot when there are unread notifications
- Click to see list: "Your resume analysis is ready", "3 new jobs match your profile"
- Mark as read

**Push notifications (browser):**
- Ask permission after sign-up
- "New jobs matching 'React Developer' in Bangladesh" (daily digest)
- "Your interview is in 1 hour" (reminder)

**Email notifications (see Section 5):**
- Weekly job digest
- Resume improvement tips

**Backend:**
- `notifications` table: `id, user_id, type, message, read, created_at`
- `POST /api/notifications` — create notification
- `GET /api/notifications` — fetch user's notifications
- `PATCH /api/notifications/[id]/read` — mark as read
- Background job (cron) that runs daily and creates job match notifications

**Tech:** Vercel Cron Jobs for scheduled tasks, Web Push API for browser push

---

## 13. LinkedIn & GitHub Integration

### What is it?
Users connect their LinkedIn or GitHub and JobAI automatically imports their profile data — work history, skills, projects — so they don't have to type everything manually.

### Why does it matter?
- Biggest friction in career tools is "I don't want to re-enter all my info"
- GitHub integration is a major trust signal for tech roles
- LinkedIn data makes resume generation instant

### What to build

**LinkedIn:**
- "Import from LinkedIn" button on Resume Builder and Profile pages
- Uses LinkedIn OAuth → fetches profile via LinkedIn API
- Maps: headline → summary, positions → experience, skills → skills section

**GitHub:**
- "Connect GitHub" button
- Fetches user's public repos via GitHub API (no key needed)
- Extracts: languages used, top projects, contribution activity
- Shows on profile: "Top languages: TypeScript, Python, Go"
- Automatically populates "Projects" section in Resume Builder

**Backend:**
- OAuth flow handled by NextAuth.js (supports both providers)
- `GET /api/integrations/linkedin` — fetch and parse LinkedIn profile
- `GET /api/integrations/github` — fetch repos and compute language stats
- Store connected account tokens in `connected_accounts` table

---

## 14. Mobile App (PWA)

### What is it?
Turn JobAI into a Progressive Web App — users can "install" it on their phone from the browser, get push notifications, and use it offline.

### Why does it matter?
- 70%+ of job seekers browse on mobile
- PWA gets you a "mobile app" without building React Native
- "Add to Home Screen" feels like a real app to users

### What to build

**PWA manifest** (`public/manifest.json`):
```json
{
  "name": "JobAI",
  "short_name": "JobAI",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#080808",
  "theme_color": "#6C63FF",
  "icons": [{ "src": "/icon-512.png", "sizes": "512x512" }]
}
```

**Service worker** (use `next-pwa` package):
- Cache static assets and API responses
- Offline fallback page: "You're offline — here are your saved jobs"

**Mobile-specific improvements:**
- Test and fix all pages on 375px (iPhone SE) viewport
- Bottom navigation bar on mobile (replaces top nav)
- Touch-friendly larger tap targets (44px minimum)
- Swipe gestures on Kanban board (swipe job card between columns)

**Tech:** `next-pwa` npm package — adds service worker in 10 minutes

---

## 15. Referral & Affiliate System

### What is it?
Users get a personal referral link. When someone signs up through their link and upgrades to Pro, the referrer gets a free month or cash commission.

### Why does it matter?
- Referral programs are the most cost-effective growth channel
- Job seekers talk to each other — "I used this tool, here's my link"
- Turns your users into your sales team

### What to build

**User referral link:** `jobai.com/?ref=johndoe123`

**Referral program:**
- Track clicks: store `ref` cookie when someone visits via referral link
- On signup: link new user to referrer via `referred_by` field
- On upgrade: give referrer 1 month free (or 20% commission if you want affiliates)

**Dashboard section `/dashboard/referrals`:**
- "Your referral link: [copy button]"
- "Share on WhatsApp / Twitter / LinkedIn" buttons
- Stats: "5 people signed up · 2 upgraded · You earned 2 free months"

**Backend:**
- `referrals` table: `id, referrer_id, referred_user_id, converted, reward_given`
- `POST /api/referrals/track` — called on signup when ref cookie present
- `POST /api/referrals/reward` — called from Stripe webhook when referred user upgrades

---

## 16. SEO & Public Profile Pages

### What is it?
Public-facing pages that Google indexes — so people searching "AI resume checker" or "software engineer salary Bangladesh" find JobAI.

### Why does it matter?
- Organic search traffic is free and compounds over time
- Public pages let you rank for thousands of job-related keywords
- A public profile page gives users a shareable "career card"

### What to build

**Public pages:**

| Page | URL Pattern | SEO Target Keyword |
|------|------------|-------------------|
| Landing | `/` | "AI career platform" |
| Resume Checker | `/resume-checker` | "free ATS resume checker" |
| Salary page | `/salary/[role]/[country]` | "React developer salary Bangladesh" |
| Blog | `/blog/[slug]` | Long-tail career keywords |
| Public Profile | `/u/[username]` | Personal branding |

**Blog:** Write 10–20 articles on career topics (AI can help draft them). Each article should target a specific search phrase like "how to pass ATS screening 2025".

**Public Profile (`/u/john`):**
- User sets their profile to public
- Shows: name, current role, skills, top resume score, GitHub languages
- Share button: users put this URL on their LinkedIn

**Technical SEO checklist:**
- Add `metadata` with `title` and `description` to every page (Next.js App Router `generateMetadata`)
- Add `sitemap.xml` and `robots.txt`
- Use `next/image` for all images (automatic optimization)
- Core Web Vitals: aim for green scores on PageSpeed Insights

---

## 17. Security & Performance

### What is it?
A set of improvements that make the app safer for users and faster to load — required before going to production at scale.

### Why does it matter?
- A security breach destroys user trust permanently
- Slow pages = users leave = lower Google rankings
- Enterprise clients will run a security audit before signing up

### Security improvements

**Input validation:**
- Use **Zod** to validate every API request body before processing
- Example: resume upload API should reject files over 10MB and non-PDF types at the API layer, not just frontend

**Rate limiting:**
- Use **Upstash Redis** + `@upstash/ratelimit` to limit API calls per IP and per user
- Free users: 3 resume checks / hour, 60 API calls / minute
- Prevents abuse and controls AI API costs

**HTTPS everywhere:** Already handled by Vercel — just ensure all redirects from `http://` are enforced

**Content Security Policy headers:**
- Add to `next.config.js` → prevents XSS attacks

**PDF security:**
- Scan uploaded PDFs for malware (use `VirusTotal API` — free tier available)
- Never execute uploaded files — only parse text from them

**Secrets management:**
- Rotate API keys every 90 days
- Never log full API requests that contain user data
- Use `NEXT_PUBLIC_` prefix only for keys that are safe to expose to the browser

### Performance improvements

**Caching:**
- Cache salary estimates for popular role+location combos (1 week TTL)
- Cache job search results for identical queries (1 hour TTL)
- Use Next.js `unstable_cache` or Redis (Upstash free tier)

**Image optimization:**
- Replace all `<img>` tags with `next/image`
- Use WebP format for all marketing images

**Database queries:**
- Add database indexes on `user_id` columns (Prisma handles this with `@@index`)
- Use `select` to fetch only needed fields — don't fetch entire user object when you only need their plan

**Bundle size:**
- Run `npx @next/bundle-analyzer` to find large dependencies
- Lazy-load heavy components (GSAP, Vapi SDK) with `dynamic(() => import(...), { ssr: false })`

---

## 18. Build Order (Recommended)

Here's the sequence that makes the most sense — each phase builds on the previous one:

### Phase 1 — Foundation (Build first, ~3 weeks)
These unlock everything else. Without auth and a database, nothing else can be built properly.

```
Week 1: Database (Prisma + Supabase) + replace file storage
Week 2: User Authentication (NextAuth.js) + protected routes
Week 3: Subscription + Payments (Stripe) + credit system
```

### Phase 2 — Core Product (High user value, ~4 weeks)
```
Week 4: User Dashboard + activity history
Week 5: Email system (Resend) + transactional emails
Week 6: Application Tracker (Kanban board)
Week 7: Interview Recording + Transcript + AI Feedback
```

### Phase 3 — Product Depth (~4 weeks)
```
Week 8: Resume Builder (visual editor + PDF export)
Week 9: Salary Estimator
Week 10: Notifications (in-app + push)
Week 11: Admin Panel
```

### Phase 4 — Growth (~3 weeks)
```
Week 12: LinkedIn + GitHub OAuth import
Week 13: PWA (mobile install + offline)
Week 14: Referral system + SEO pages
```

### Phase 5 — Scale (Ongoing)
```
Security hardening (rate limiting, CSP headers, input validation)
Performance optimization (caching, bundle splitting)
AI feedback loop (logging + prompt improvement)
Blog content for SEO
```

---

## Tech Stack Summary (additions to current stack)

| What | Tool | Why |
|------|------|-----|
| Auth | NextAuth.js v5 | Industry standard for Next.js, supports OAuth + credentials |
| Database | PostgreSQL on Supabase | Reliable, free tier, works with Prisma |
| ORM | Prisma | Type-safe DB queries, auto-generated types |
| Payments | Stripe | World standard, excellent Next.js SDK |
| Email | Resend + React Email | Modern API, beautiful HTML email templates |
| Cache / Rate limit | Upstash Redis | Serverless Redis, very generous free tier |
| PDF export | @react-pdf/renderer | React-based PDF generation |
| Drag & drop | @dnd-kit/core | Modern, accessible, works in Next.js |
| Validation | Zod | Type-safe input validation |
| Push notifications | Web Push API | Built into all modern browsers |

---

## Cost Estimate (monthly at 1,000 users)

| Service | Free tier | Paid (estimate) |
|---------|-----------|-----------------|
| Supabase (database) | 500MB / 50K rows free | $25/month |
| Vercel (hosting) | 100GB bandwidth free | $20/month |
| Upstash Redis | 10K commands/day free | $10/month |
| Resend (email) | 3,000 emails/month free | $20/month |
| Stripe | 2.9% + 30¢ per transaction | % of revenue |
| OpenRouter | Pay per token | ~$30–60/month |
| **Total** | | **~$100–150/month** |

At $19/month Pro plan: you only need **8 paying users** to cover infrastructure costs.

---

*This document was prepared specifically for the JobAI project. Start with Phase 1 — auth, database, and payments — everything else depends on those three foundations.*
