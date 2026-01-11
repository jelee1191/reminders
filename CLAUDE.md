# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal webapp for tracking periodic tasks/chores (e.g., "Replaced cat water fountain filter") with completion history and overdue notifications.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: Vercel Postgres
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Auth**: Simple password gate via middleware (env var `APP_PASSWORD`)

## Common Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

## Architecture

### Data Model

Two tables in Postgres:
- `tasks` - Task definitions with name, optional interval_days, notifications_enabled flag
- `completions` - Completion records linking to tasks with completed_at timestamp

### Key Routes

- `/` - Dashboard showing all tasks with status indicators and "Done" buttons
- `/tasks/new` - Create new task form
- `/tasks/[id]` - Task detail page with completion history

### API Routes

- `GET/POST /api/tasks` - List and create tasks
- `GET/PUT/DELETE /api/tasks/[id]` - Task CRUD
- `POST /api/completions` - Log a task completion

### Auth Flow

Password gate middleware checks for auth cookie. Single password stored in `APP_PASSWORD` env var.

## Environment Variables

Vercel Postgres env vars (auto-set when linking database):
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

App config:
- `APP_PASSWORD` - Password for accessing the app
