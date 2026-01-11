import type { TaskWithCompletion } from './types'

export type TaskStatus = 'good' | 'warning' | 'overdue' | 'neutral'

export function getTaskStatus(task: TaskWithCompletion): TaskStatus {
  if (!task.interval_days) {
    return 'neutral'
  }

  if (!task.last_completion) {
    return 'overdue'
  }

  const completedAt = task.last_completion.completed_at instanceof Date
    ? task.last_completion.completed_at
    : new Date(task.last_completion.completed_at)

  const daysSinceCompletion = getDaysSince(completedAt)
  const warningThreshold = task.interval_days * 0.8

  if (daysSinceCompletion > task.interval_days) {
    return 'overdue'
  }

  if (daysSinceCompletion >= warningThreshold) {
    return 'warning'
  }

  return 'good'
}

export function getDaysSince(date: Date | string): number {
  const d = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffTime = now.getTime() - d.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)

  // Format: "7PM Sat 1/10/26"
  const hour = d.getHours()
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayName = days[d.getDay()]

  const month = d.getMonth() + 1
  const day = d.getDate()
  const year = d.getFullYear().toString().slice(-2)

  return `${hour12}${ampm} ${dayName} ${month}/${day}/${year}`
}

export function formatRelativeTime(date: Date | string): string {
  const days = getDaysSince(date)

  if (days === 0) {
    return 'Today'
  }

  if (days === 1) {
    return 'Yesterday'
  }

  if (days < 7) {
    return `${days} days ago`
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }

  if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }

  const years = Math.floor(days / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

export function getIntervalLabel(days: number | null): string {
  if (!days) return 'No interval'

  if (days === 7) return 'Every week'
  if (days === 14) return 'Every 2 weeks'
  if (days === 30) return 'Every month'
  if (days === 60) return 'Every 2 months'
  if (days === 90) return 'Every 3 months'
  if (days === 180) return 'Every 6 months'
  if (days === 365) return 'Every year'

  return `Every ${days} days`
}

export function toLocalDateTimeString(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  // Format for datetime-local input: "YYYY-MM-DDTHH:MM"
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
