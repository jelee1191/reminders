import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { password } = await request.json()
  const correctPassword = process.env.APP_PASSWORD

  if (!correctPassword) {
    return NextResponse.json(
      { error: 'APP_PASSWORD not configured' },
      { status: 500 }
    )
  }

  if (password === correctPassword) {
    const cookieStore = await cookies()
    cookieStore.set('auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
