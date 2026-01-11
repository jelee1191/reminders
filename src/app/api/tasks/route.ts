import { NextResponse } from 'next/server'
import { getTasks, getLatestCompletion, createTask } from '@/lib/db'
import type { TaskInsert } from '@/lib/types'

// GET /api/tasks - Get all active tasks with their latest completion
export async function GET() {
  try {
    const tasks = await getTasks()

    // Get the latest completion for each task
    const tasksWithCompletions = await Promise.all(
      tasks.map(async (task) => {
        const lastCompletion = await getLatestCompletion(task.id)
        return {
          ...task,
          last_completion: lastCompletion,
        }
      })
    )

    return NextResponse.json(tasksWithCompletions)
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const body: TaskInsert = await request.json()
    const task = await createTask(body)
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
