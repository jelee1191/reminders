'use client'

import { useState } from 'react'
import type { Completion } from '@/lib/types'
import { formatDateTime, toLocalDateTimeString } from '@/lib/utils'

interface CompletionHistoryProps {
  completions: Completion[]
  onUpdate: () => void
}

export function CompletionHistory({ completions, onUpdate }: CompletionHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [loading, setLoading] = useState(false)

  function startEdit(completion: Completion) {
    setEditingId(completion.id)
    setEditDate(toLocalDateTimeString(completion.completed_at))
    setEditNotes(completion.notes || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDate('')
    setEditNotes('')
  }

  async function saveEdit(id: string) {
    setLoading(true)
    try {
      await fetch(`/api/completions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed_at: new Date(editDate).toISOString(),
          notes: editNotes || null,
        }),
      })
      setEditingId(null)
      onUpdate()
    } catch (error) {
      console.error('Failed to update:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteCompletion(id: string) {
    if (!confirm('Delete this log entry?')) return
    setLoading(true)
    try {
      await fetch(`/api/completions/${id}`, { method: 'DELETE' })
      onUpdate()
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setLoading(false)
    }
  }

  if (completions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No completions yet
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {completions.map((completion) => (
        <div key={completion.id} className="py-3">
          {editingId === completion.id ? (
            <div className="space-y-3">
              <input
                type="datetime-local"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
              <input
                type="text"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(completion.id)}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {formatDateTime(completion.completed_at)}
                </span>
                {completion.notes && (
                  <p className="mt-1 text-sm text-gray-600">{completion.notes}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(completion)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCompletion(completion.id)}
                  disabled={loading}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
