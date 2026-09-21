import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, createUser, toPublicUser, setLoggedIn } from '@/lib/users'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // Find or auto-create the user (no password required for testing)
    let user = findUserByEmail(email)
    if (!user) {
      const name = email.split('@')[0].replace(/[^a-zA-Z0-9 ]/g, ' ').trim() || email
      user = createUser({ name, email, password: '' })
    }

    setLoggedIn(user.id)
    await createSession(user)
    console.log(`[login] session created for ${user.email} (${user.id})`)
    return NextResponse.json({ user: toPublicUser(user) }, { status: 200 })
  } catch (error) {
    console.error('[login] error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
