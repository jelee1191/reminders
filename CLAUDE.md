# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal webapp for tracking periodic tasks/chores with completion history and overdue notifications. Deployed on Vercel with Neon Postgres database.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Neon Postgres (via @vercel/postgres)
- Tailwind CSS
- Deployed on Vercel

## Database

Two tables in Neon Postgres (`db/schema.sql`):
- `tasks` - name, description, interval_days, notifications_enabled, is_archived
- `completions` - task_id, completed_at, notes

Database functions in `src/lib/db.ts`.

## Routes

**Pages:**
- `/` - Dashboard with task list, color toggle, notifications banner
- `/login` - Password gate
- `/tasks/new` - Create task form
- `/tasks/[id]` - Task detail with completion history

**API:**
- `GET/POST /api/tasks` - List and create tasks
- `GET/PUT/DELETE /api/tasks/[id]` - Task CRUD
- `POST /api/completions` - Log completion
- `PUT/DELETE /api/completions/[id]` - Edit/delete completion
- `POST /api/auth/login` - Password authentication

## Auth

Simple password gate via middleware (`src/middleware.ts`). Password stored in `APP_PASSWORD` env var. Auth cookie lasts 30 days.

## Key Files

- `src/lib/db.ts` - All database queries
- `src/lib/types.ts` - TypeScript types
- `src/lib/utils.ts` - Date formatting, status calculation
- `src/components/` - TaskCard, TaskForm, CompletionHistory, NotificationsBanner
