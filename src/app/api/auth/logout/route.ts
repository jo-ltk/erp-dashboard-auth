import { NextResponse } from 'next/server'
import { deleteSession, getSession } from '@/lib/session'
import { setLoggedOut } from '@/lib/users'

export async function POST() {
  try {
    const session = await getSession()
    if (session?.userId) {
      setLoggedOut(session.userId)
    }
    await deleteSession()
    console.log(`[logout] session cleared for ${session?.userId ?? 'anonymous'}`)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
