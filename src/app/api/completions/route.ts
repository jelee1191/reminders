import { NextResponse } from 'next/server'
import { createCompletion } from '@/lib/db'
import type { CompletionInsert } from '@/lib/types'

// POST /api/completions - Log a task completion
export async function POST(request: Request) {
  try {
    const body: CompletionInsert = await request.json()
    const completion = await createCompletion(body)
    return NextResponse.json(completion, { status: 201 })
  } catch (error) {
    console.error('Failed to create completion:', error)
    return NextResponse.json({ error: 'Failed to create completion' }, { status: 500 })
  }
}
