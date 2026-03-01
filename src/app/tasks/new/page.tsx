import Link from 'next/link'
import { TaskForm } from '@/components/TaskForm'

export default function NewTaskPage() {
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
        <h1 className="text-2xl font-bold text-gray-100 mb-6">New Task</h1>
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <TaskForm mode="create" />
        </div>
      </div>
    </div>
  )
}
