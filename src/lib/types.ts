export interface Task {
  id: string
  name: string
  description: string | null
  interval_days: number | null
  notifications_enabled: boolean
  is_archived: boolean
  created_at: Date
  updated_at: Date
}

export interface TaskInsert {
  name: string
  description?: string | null
  interval_days?: number | null
  notifications_enabled?: boolean
}

export interface TaskUpdate {
  name?: string
  description?: string | null
  interval_days?: number | null
  notifications_enabled?: boolean
  is_archived?: boolean
}

export interface Completion {
  id: string
  task_id: string
  completed_at: Date
  notes: string | null
}

export interface CompletionInsert {
  task_id: string
  completed_at?: string
  notes?: string | null
}

export interface TaskWithCompletion extends Task {
  last_completion: Completion | null
}
