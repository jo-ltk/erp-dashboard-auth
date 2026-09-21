import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail, toPublicUser } from '@/lib/users'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { name, email, role, department } = await request.json()
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    if (findUserByEmail(email)) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    const user = createUser({ name, email, password: '', role, department })
    await createSession(user)
    console.log(`[signup] account created for ${user.email} (${user.id})`)
    return NextResponse.json({ user: toPublicUser(user) }, { status: 201 })
  } catch (error) {
    console.error('[signup] error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
