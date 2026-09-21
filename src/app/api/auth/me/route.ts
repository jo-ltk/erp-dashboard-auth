import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { findUserById, toPublicUser, toPublicUserFromSession } from '@/lib/users'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
    // Prefer the in-memory record (it carries `lastLoginAt`); fall back to the
    // signed session claims when this process no longer holds the user.
    const user = findUserById(session.userId)
    return NextResponse.json(
      { user: user ? toPublicUser(user) : toPublicUserFromSession(session) },
      { status: 200 },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
