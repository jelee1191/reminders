import Link from 'next/link'
import { TaskForm } from '@/components/TaskForm'

export default function NewTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Back to tasks
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New Task</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <TaskForm mode="create" />
        </div>
      </div>
    </div>
  )
}
