'use client'

import { useEffect, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TaskForm } from '@/components/TaskForm'
import { CompletionHistory } from '@/components/CompletionHistory'
import type { Task, Completion } from '@/lib/types'
import { getIntervalLabel } from '@/lib/utils'

interface TaskWithCompletions extends Task {
  completions: Completion[]
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [task, setTask] = useState<TaskWithCompletions | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchTask = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`)
      if (res.ok) {
        const data = await res.json()
        setTask(data)
      }
    } catch (error) {
      console.error('Failed to fetch task:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTask()
  }, [fetchTask])

  async function handleArchive() {
    if (!task) return
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_archived: true }),
    })
    router.push('/')
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this task? This cannot be undone.')) {
      return
    }
    setDeleting(true)
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    router.push('/')
  }

  async function handleComplete() {
    await fetch('/api/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: id }),
    })
    fetchTask()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Task not found</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Back to tasks
          </Link>
        </div>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setEditing(false)}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              &larr; Cancel editing
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Task</h1>
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
            <TaskForm task={task} mode="edit" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            &larr; Back to tasks
          </Link>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">{task.name}</h1>
              {task.description && (
                <p className="mt-2 text-gray-400">{task.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {task.interval_days && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                    {getIntervalLabel(task.interval_days)}
                  </span>
                )}
                {task.notifications_enabled ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                    Notifications on
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
                    Notifications off
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Edit
            </button>
            <button
              onClick={handleArchive}
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Archive
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            History ({task.completions.length})
          </h2>
          <CompletionHistory completions={task.completions} onUpdate={fetchTask} />
        </div>
      </div>
    </div>
  )
}
