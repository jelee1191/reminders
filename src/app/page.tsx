'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { TaskCard } from '@/components/TaskCard'
import { NotificationsBanner } from '@/components/NotificationsBanner'
import type { TaskWithCompletion } from '@/lib/types'

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'recurring' | 'nonrecurring'>('recurring')

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function handleComplete(taskId: string) {
    await fetch('/api/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId }),
    })
    fetchTasks()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Reminders</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/tasks/new"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Task
            </Link>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('recurring')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'recurring'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            Recurring
          </button>
          <button
            onClick={() => setFilter('nonrecurring')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'nonrecurring'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            Nonrecurring
          </button>
        </div>

        <NotificationsBanner tasks={tasks} />

        {tasks.filter((t) => filter === 'recurring' ? t.interval_days != null : t.interval_days == null).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              {tasks.length === 0 ? 'No tasks yet' : `No ${filter} tasks`}
            </p>
            <Link
              href="/tasks/new"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {tasks.length === 0 ? 'Create your first task' : 'Add a task'}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks
              .filter((task) =>
                filter === 'recurring'
                  ? task.interval_days != null
                  : task.interval_days == null
              )
              .sort((a, b) => {
                const aTime = a.last_completion ? new Date(a.last_completion.completed_at).getTime() : 0
                const bTime = b.last_completion ? new Date(b.last_completion.completed_at).getTime() : 0
                return bTime - aTime
              })
              .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
