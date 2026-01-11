import { NextResponse } from 'next/server'
import { updateCompletion, deleteCompletion } from '@/lib/db'
import type { CompletionUpdate } from '@/lib/types'

type RouteContext = { params: Promise<{ id: string }> }

// PUT /api/completions/[id] - Update a completion
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body: CompletionUpdate = await request.json()
    const completion = await updateCompletion(id, body)
    return NextResponse.json(completion)
  } catch (error) {
    console.error('Failed to update completion:', error)
    return NextResponse.json({ error: 'Failed to update completion' }, { status: 500 })
  }
}

// DELETE /api/completions/[id] - Delete a completion
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    await deleteCompletion(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete completion:', error)
    return NextResponse.json({ error: 'Failed to delete completion' }, { status: 500 })
  }
}
