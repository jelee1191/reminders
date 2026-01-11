import { sql } from '@vercel/postgres'
import type { Task, TaskInsert, TaskUpdate, Completion, CompletionInsert, CompletionUpdate } from './types'

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
  // Fetch current task to merge values
  const current = await getTaskById(id)
  if (!current) throw new Error('Task not found')

  // Merge: use new value if provided (including null), otherwise keep current
  const name = task.name !== undefined ? task.name : current.name
  const description = task.description !== undefined ? task.description : current.description
  const interval_days = task.interval_days !== undefined ? task.interval_days : current.interval_days
  const notifications_enabled = task.notifications_enabled !== undefined ? task.notifications_enabled : current.notifications_enabled
  const is_archived = task.is_archived !== undefined ? task.is_archived : current.is_archived

  const { rows } = await sql<Task>`
    UPDATE tasks SET
      name = ${name},
      description = ${description},
      interval_days = ${interval_days},
      notifications_enabled = ${notifications_enabled},
      is_archived = ${is_archived},
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

export async function updateCompletion(id: string, update: CompletionUpdate): Promise<Completion> {
  const { rows } = await sql<Completion>`
    UPDATE completions SET
      completed_at = COALESCE(${update.completed_at ?? null}, completed_at),
      notes = ${update.notes !== undefined ? update.notes : null}
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0]
}

export async function deleteCompletion(id: string): Promise<void> {
  await sql`DELETE FROM completions WHERE id = ${id}`
}
