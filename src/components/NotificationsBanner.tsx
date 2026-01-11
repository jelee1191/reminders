import type { TaskWithCompletion } from '@/lib/types'
import { getTaskStatus } from '@/lib/utils'

interface NotificationsBannerProps {
  tasks: TaskWithCompletion[]
}

export function NotificationsBanner({ tasks }: NotificationsBannerProps) {
  const overdueTasks = tasks.filter(
    (task) => task.notifications_enabled && getTaskStatus(task) === 'overdue'
  )

  if (overdueTasks.length === 0) {
    return null
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h2 className="font-medium text-red-800 mb-2">
        {overdueTasks.length} {overdueTasks.length === 1 ? 'task' : 'tasks'} overdue
      </h2>
      <ul className="space-y-1">
        {overdueTasks.map((task) => (
          <li key={task.id} className="text-sm text-red-700">
            {task.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
