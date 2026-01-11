'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Task } from '@/lib/types'

interface TaskFormProps {
  task?: Task
  mode: 'create' | 'edit'
}

const INTERVAL_OPTIONS = [
  { label: 'No interval', value: '' },
  { label: 'Every week', value: '7' },
  { label: 'Every 2 weeks', value: '14' },
  { label: 'Every month', value: '30' },
  { label: 'Every 2 months', value: '60' },
  { label: 'Every 3 months', value: '90' },
  { label: 'Every 6 months', value: '180' },
  { label: 'Every year', value: '365' },
  { label: 'Custom...', value: 'custom' },
]

export function TaskForm({ task, mode }: TaskFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(task?.name || '')
  const [description, setDescription] = useState(task?.description || '')
  const [intervalSelect, setIntervalSelect] = useState(() => {
    if (!task?.interval_days) return ''
    const preset = INTERVAL_OPTIONS.find(o => o.value === String(task.interval_days))
    return preset ? preset.value : 'custom'
  })
  const [customDays, setCustomDays] = useState(
    task?.interval_days && !INTERVAL_OPTIONS.find(o => o.value === String(task.interval_days))
      ? String(task.interval_days)
      : ''
  )
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    task?.notifications_enabled ?? true
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const intervalDays = intervalSelect === 'custom'
      ? (customDays ? parseInt(customDays, 10) : null)
      : (intervalSelect ? parseInt(intervalSelect, 10) : null)

    const payload = {
      name,
      description: description || null,
      interval_days: intervalDays,
      notifications_enabled: notificationsEnabled,
    }

    try {
      const url = mode === 'create' ? '/api/tasks' : `/api/tasks/${task?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('Failed to save task')
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Task Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          placeholder="e.g., Replace cat water fountain filter"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 resize-none"
          placeholder="Any additional notes..."
        />
      </div>

      <div>
        <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
          Expected Interval
        </label>
        <select
          id="interval"
          value={intervalSelect}
          onChange={(e) => setIntervalSelect(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
        >
          {INTERVAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {intervalSelect === 'custom' && (
          <div className="mt-2">
            <input
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              placeholder="Number of days"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="notifications"
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="notifications" className="text-sm text-gray-700">
          Show in notifications when overdue
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
