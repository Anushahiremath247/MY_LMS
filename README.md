# Lazy Learning

Lazy Learning is a modern AI-powered Learning Management System with a polished Next.js frontend and an Express + Prisma backend. The app includes structured YouTube-based courses, premium authentication flows, progress tracking, AI tutor endpoints, and a seeded resource library with 200+ learning links.

## Stack

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, Zustand, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT auth, refresh tokens
- Styling: Tailwind CSS with a light premium UI system

## Structure

- `frontend`: App Router UI for landing, auth, dashboard, courses, learning, profile, and resources
- `backend`: REST API, Prisma schema, seed script, auth, subject, progress, resource, and AI modules

## Run

1. Copy `.env.example` to `.env` and set your values.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and migrate:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend -- --name init
```

4. Seed data:

```bash
npm run prisma:seed --workspace backend
```

5. Start the apps:

```bash
npm run dev:backend
npm run dev:frontend
```

## Deploy

### Render Blueprint

This repo now includes `render.yaml` for a full-stack Render deployment:

- `lazy-learning-frontend`: Next.js frontend
- `lazy-learning-api`: Express + Prisma backend
- `lazy-learning-db`: PostgreSQL database

During the first Render Blueprint setup, provide values for:

- `NEXT_PUBLIC_API_URL`
  Set this to your backend public URL plus `/api`
- `CLIENT_URL`
  Set this to your frontend public URL
- `SERVER_URL`
  Set this to your backend public URL
- `COOKIE_DOMAIN`
  Optional for your production domain strategy
- `HUGGINGFACE_API_KEY`
  Optional unless you want live AI responses

The backend deploy uses `prisma db push` automatically before start. The seed script is now non-destructive, so you can run it manually after the database is live:

```bash
npm run prisma:seed --workspace backend
```

### Vercel Frontend

If you prefer Vercel for the frontend, import the GitHub repo and set the project root directory to `frontend`, then add `NEXT_PUBLIC_API_URL` in the Vercel dashboard.

## Core Pages

- `/`: public landing page
- `/login`, `/register`, `/forgot-password`: premium auth pages
- `/dashboard`: enrolled course overview
- `/courses`: browse all subjects
- `/courses/[slug]`: subject detail
- `/learn/[subjectId]`: learning workspace with video player and AI tutor panel
- `/resources`: 200+ curated YouTube learning resources
- `/profile`: student progress snapshot

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/subjects`
- `GET /api/subjects/:id`
- `GET /api/subjects/:id/tree`
- `POST /api/enroll`
- `POST /api/progress`
- `GET /api/progress/:subjectId`
- `GET /api/resources`
- `POST /api/ai/chat`
- `POST /api/ai/summarize`
- `POST /api/ai/quiz`

## Assumption

The prompt mixed PostgreSQL and MySQL requirements. This build standardizes on PostgreSQL because the requested Prisma deliverables and token-backed production setup align best with that path. The backend modules are organized so switching providers later is straightforward.

## Final Checklist

- Modern light-theme LMS UI with reusable components
- Pinterest-inspired premium auth layout
- JWT + refresh-token backend
- Prisma models for users, subjects, sections, videos, enrollments, progress, refresh tokens, and resources
- Seed script with required exact YouTube links and 200+ generated curated resources
- AI tutor/summarize/quiz endpoints ready for Hugging Face integration
