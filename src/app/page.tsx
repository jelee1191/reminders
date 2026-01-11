'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { TaskCard } from '@/components/TaskCard'
import { NotificationsBanner } from '@/components/NotificationsBanner'
import type { TaskWithCompletion } from '@/lib/types'

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [showColors, setShowColors] = useState(true)

  // Load color preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('showColors')
    if (stored !== null) {
      setShowColors(stored === 'true')
    }
  }, [])

  // Save color preference to localStorage
  function toggleColors() {
    const newValue = !showColors
    setShowColors(newValue)
    localStorage.setItem('showColors', String(newValue))
  }

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showColors}
                onChange={toggleColors}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Colors
            </label>
            <Link
              href="/tasks/new"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Task
            </Link>
          </div>
        </div>

        <NotificationsBanner tasks={tasks} />

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tasks yet</p>
            <Link
              href="/tasks/new"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                showColors={showColors}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
