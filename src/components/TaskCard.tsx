'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { TaskWithCompletion } from '@/lib/types'
import { getTaskStatus, formatRelativeTime, getIntervalLabel } from '@/lib/utils'

interface TaskCardProps {
  task: TaskWithCompletion
  onComplete: (taskId: string) => Promise<void>
  showColors?: boolean
}

export function TaskCard({ task, onComplete, showColors = true }: TaskCardProps) {
  const [loading, setLoading] = useState(false)
  const status = getTaskStatus(task)

  const statusColors = {
    good: 'bg-green-100 border-green-300',
    warning: 'bg-yellow-100 border-yellow-300',
    overdue: 'bg-red-100 border-red-300',
    neutral: 'bg-gray-100 border-gray-300',
  }

  const statusDot = {
    good: 'bg-green-500',
    warning: 'bg-yellow-500',
    overdue: 'bg-red-500',
    neutral: 'bg-gray-400',
  }

  const noColorStyle = 'bg-white border-gray-200'

  async function handleComplete() {
    setLoading(true)
    try {
      await onComplete(task.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${showColors ? statusColors[status] : noColorStyle}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {showColors && (
              <span className={`w-2.5 h-2.5 rounded-full ${statusDot[status]}`} />
            )}
            <Link
              href={`/tasks/${task.id}`}
              className="font-medium text-gray-900 hover:text-blue-600 truncate"
            >
              {task.name}
            </Link>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {task.last_completion ? (
              <>Last done: {formatRelativeTime(task.last_completion.completed_at)}</>
            ) : (
              <span className="text-gray-500">Never completed</span>
            )}
          </div>
          {task.interval_days && (
            <div className="mt-0.5 text-xs text-gray-500">
              {getIntervalLabel(task.interval_days)}
            </div>
          )}
        </div>
        <button
          onClick={handleComplete}
          disabled={loading}
          className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '...' : 'Done'}
        </button>
      </div>
    </div>
  )
}
