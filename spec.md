# Periodic Task Tracker - Project Specification

## Overview

A personal webapp for tracking periodic tasks and chores with completion history and visual reminders for overdue items. Examples: "Replaced the cat water fountain filter", "Had a housekeeper come".

## Goals

- Track recurring tasks with one-click logging
- View history of when each task was completed
- See visual indicators when tasks are overdue
- Access from anywhere (cloud-hosted)
- Simple, fast, mobile-friendly UI

## Core Requirements

| Requirement | Description |
|-------------|-------------|
| Access | Cloud-hosted webapp accessible from any device |
| Auth | Simple password protection (single shared password) |
| Task Management | Full CRUD - create, edit, archive, delete tasks |
| Logging | One-click "mark as done" button with timestamp |
| History | View all past completions for each task |
| Reminders | In-app notifications section + color-coded status indicators |
| Per-task settings | Toggle notifications on/off per task |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) with TypeScript |
| Database | Vercel Postgres |
| Hosting | Vercel |
| Styling | Tailwind CSS |
| Auth | Middleware + environment variable password |

---

## Data Model

### tasks
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Task name (e.g., "Replace cat water fountain filter") |
| description | text? | Optional notes |
| interval_days | integer? | Expected frequency in days (e.g., 60 for "every 2 months") |
| notifications_enabled | boolean | Whether to show in notifications banner (default: true) |
| is_archived | boolean | Soft delete (default: false) |
| created_at | timestamp | |
| updated_at | timestamp | |

### completions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| task_id | uuid | Foreign key → tasks |
| completed_at | timestamp | When the task was done |
| notes | text? | Optional note for this completion |

---

## User Interface

### Dashboard (Home Page)
- **Notifications banner** at top showing overdue tasks (tasks past their interval with notifications enabled)
- **Task list** showing all active tasks with:
  - Task name
  - Last completed date (or "Never")
  - Days since last completion
  - Visual status indicator (green/yellow/red based on interval)
  - "Done" button
- **Add task** button

### Task Detail Page
- Task name and description
- Edit button → opens edit form
- Full completion history (scrollable list with dates and optional notes)
- Archive / Delete options

### New/Edit Task Form
- Name (required)
- Description (optional)
- Expected interval: preset options + custom days input
  - "No interval", "Every week", "Every 2 weeks", "Every month", "Every 2 months", "Every 3 months", "Custom..."
- Notifications enabled toggle

### Password Gate
- Simple password entry screen on first visit
- Auth state stored in cookie
- Password defined in `APP_PASSWORD` environment variable

---

## Status Indicator Logic

For tasks with an interval defined:
- **Green**: Completed within expected interval
- **Yellow**: Within 20% of interval being exceeded
- **Red**: Overdue (days since completion > interval)

For tasks without an interval:
- **Neutral/Gray**: No status indicator needed

---

## Acceptance Criteria

1. Can create a new task with name and optional interval
2. Can mark a task as done with one click
3. Can view completion history for any task
4. Overdue tasks appear in notifications banner
5. Tasks display correct color-coded status
6. Can edit task settings (name, interval, notifications toggle)
7. Can archive/delete tasks
8. Password gate blocks unauthenticated access
9. Works on mobile browsers
10. Deployed and accessible from anywhere
