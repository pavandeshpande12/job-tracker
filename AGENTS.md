# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — start Next.js dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint (flat config with next/core-web-vitals + typescript)
- No test framework is configured

## Required Environment

A `.env.local` file with `MONGODB_URI` must exist. The app will throw at startup without it.

## Architecture

Next.js 16 App Router project (React 19) — a job application tracker with email/password auth and a single-page dashboard.

### Auth Flow

Custom auth (not NextAuth sessions despite the dependency being installed). Login/signup use API routes that hash passwords with bcryptjs. The logged-in user is stored in `localStorage` under key `jat_user` (as `{name, email}` JSON). The root page (`/`) checks localStorage and redirects to `/dashboard` or `/login`. There are no protected API routes — job endpoints trust the `email` query param / request body.

### Data Layer

- **MongoDB via Mongoose** — connection is cached on `global.mongoose` in `lib/db.ts` to survive Next.js hot reloads.
- **Two models**: `User` (name, email, hashed password) and `Job` (userEmail, company, role, status, appliedDate, rejectedDate, notes, interviewExperience, feedback). Jobs are linked to users by `userEmail` string, not a foreign key reference.
- **Job statuses** are an enum: `Applied`, `Online Test`, `Interview`, `Offer`, `Rejected`.

### API Routes

All under `app/api/`:
- `POST /api/auth/signup` — create user
- `POST /api/login` — verify credentials, return user info
- `GET /api/jobs?email=` — list jobs for user
- `POST /api/jobs` — create job
- `PUT /api/jobs` — update job by `id` in body
- `DELETE /api/jobs` — delete job by `id` in body
- `GET /api/jobs/stats?email=` — aggregated status counts

### Frontend

All pages are client components (`"use client"`). The dashboard (`app/dashboard/page.tsx`) is the main view containing stats cards, charts (Recharts bar + pie), an add-job form, and a job list table with inline editing. Styling is predominantly inline `style={}` objects, not Tailwind classes (despite Tailwind being configured). UI components from shadcn/ui exist in `components/ui/` but only `Button` is used.

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`).
