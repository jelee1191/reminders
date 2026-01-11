import type { Completion } from '@/lib/types'
import { formatDate, formatRelativeTime } from '@/lib/utils'

interface CompletionHistoryProps {
  completions: Completion[]
}

export function CompletionHistory({ completions }: CompletionHistoryProps) {
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
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {formatDate(completion.completed_at)}
            </span>
            <span className="text-sm text-gray-500">
              {formatRelativeTime(completion.completed_at)}
            </span>
          </div>
          {completion.notes && (
            <p className="mt-1 text-sm text-gray-600">{completion.notes}</p>
          )}
        </div>
      ))}
    </div>
  )
}
