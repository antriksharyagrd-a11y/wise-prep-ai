# HireWise

AI-powered interview preparation platform built on Lovable (TanStack Start + Lovable Cloud + Lovable AI Gateway).

## What it does

- **Auth** — Email/password + Google, via Lovable Cloud managed auth.
- **Daily coding question** — Rotates from a curated bank, Monaco editor, multi-language, "Explain with AI".
- **AI mock interview** — Role-specific chat with an LLM interviewer, live confidence meter, voice input, scored report card.
- **Resume analysis** — PDF/DOCX upload, in-browser text extraction, AI-generated ATS score + section feedback.
- **Progress** — Recharts line/radar charts, GitHub-style streak calendar.
- **Public profile** — `/u/<username>` shareable page with readiness score.
- **Cron** — `pg_cron` pings `/api/public/hooks/daily-reminder` daily to rotate the question.

## Stack

- **Framework**: TanStack Start (React 19 + Vite) on Cloudflare Workers
- **DB / Auth / Storage / Functions**: Lovable Cloud (Postgres + RLS)
- **AI**: Lovable AI Gateway (`openai/gpt-5.5`) via the Vercel AI SDK
- **UI**: Tailwind v4, Framer Motion, Recharts, Monaco Editor
- **File parsing**: `unpdf` (PDF), `mammoth` (DOCX) — both Worker-compatible

## Environment

All secrets are managed by Lovable Cloud — no `.env` editing required:
- `LOVABLE_API_KEY` (AI Gateway) — auto-provisioned
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — auto-provisioned

## Data model

```
profiles       — public user profile (username, display_name, bio, target_role)
user_roles     — separate role table (never on profiles) with has_role() security-definer
questions      — curated coding question bank
daily_questions — day → question rotation
question_attempts — per-user solve history
mock_interviews — chat transcripts + scored reports + confidence average
resumes        — uploaded resume metadata + AI feedback JSON + ATS score
streaks        — current & longest streak, last_active_date
```

RLS is on for every table. `profiles`, `questions`, `daily_questions`, `streaks` allow public reads for shareable profiles.

## Development

```
bun install
bun run dev
```

## Deploy

Publish from Lovable — the app deploys to Cloudflare Workers with the Cloud backend attached.