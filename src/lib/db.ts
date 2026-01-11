import { sql } from '@vercel/postgres'
import type { Task, TaskInsert, TaskUpdate, Completion, CompletionInsert } from './types'

// Tasks
export async function getTasks(): Promise<Task[]> {
  const { rows } = await sql<Task>`
    SELECT * FROM tasks
    WHERE is_archived = false
    ORDER BY created_at DESC
  `
  return rows
}

export async function getTaskById(id: string): Promise<Task | null> {
  const { rows } = await sql<Task>`
    SELECT * FROM tasks WHERE id = ${id}
  `
  return rows[0] || null
}

export async function createTask(task: TaskInsert): Promise<Task> {
  const { rows } = await sql<Task>`
    INSERT INTO tasks (name, description, interval_days, notifications_enabled)
    VALUES (${task.name}, ${task.description || null}, ${task.interval_days || null}, ${task.notifications_enabled ?? true})
    RETURNING *
  `
  return rows[0]
}

export async function updateTask(id: string, task: TaskUpdate): Promise<Task> {
  const { rows } = await sql<Task>`
    UPDATE tasks SET
      name = COALESCE(${task.name ?? null}, name),
      description = COALESCE(${task.description ?? null}, description),
      interval_days = COALESCE(${task.interval_days ?? null}, interval_days),
      notifications_enabled = COALESCE(${task.notifications_enabled ?? null}, notifications_enabled),
      is_archived = COALESCE(${task.is_archived ?? null}, is_archived),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteTask(id: string): Promise<void> {
  await sql`DELETE FROM tasks WHERE id = ${id}`
}

// Completions
export async function getCompletionsByTaskId(taskId: string): Promise<Completion[]> {
  const { rows } = await sql<Completion>`
    SELECT * FROM completions
    WHERE task_id = ${taskId}
    ORDER BY completed_at DESC
  `
  return rows
}

export async function getLatestCompletion(taskId: string): Promise<Completion | null> {
  const { rows } = await sql<Completion>`
    SELECT * FROM completions
    WHERE task_id = ${taskId}
    ORDER BY completed_at DESC
    LIMIT 1
  `
  return rows[0] || null
}

export async function createCompletion(completion: CompletionInsert): Promise<Completion> {
  const { rows } = await sql<Completion>`
    INSERT INTO completions (task_id, completed_at, notes)
    VALUES (${completion.task_id}, ${completion.completed_at || new Date().toISOString()}, ${completion.notes || null})
    RETURNING *
  `
  return rows[0]
}
