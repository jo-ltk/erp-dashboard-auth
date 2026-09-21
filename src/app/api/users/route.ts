import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getAccountDirectory } from '@/lib/users'

/**
 * GET /api/users — account directory for the dashboard, containing exactly the
 * accounts that are saved in the store (plus the signed-in account when this
 * process no longer holds it). Passwords are never included.
 */
export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
    return NextResponse.json(
      {
        currentUserId: session.userId,
        users: getAccountDirectory(session),
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
