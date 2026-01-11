import { NextResponse } from 'next/server'
import { getTaskById, getCompletionsByTaskId, updateTask, deleteTask } from '@/lib/db'
import type { TaskUpdate } from '@/lib/types'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/tasks/[id] - Get a single task with all completions
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const task = await getTaskById(id)

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const completions = await getCompletionsByTaskId(id)

    return NextResponse.json({ ...task, completions })
  } catch (error) {
    console.error('Failed to fetch task:', error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body: TaskUpdate = await request.json()
    const task = await updateTask(id, body)
    return NextResponse.json(task)
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete a task (hard delete)
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    await deleteTask(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
