export interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  department: string
  createdAt: string
  lastLoginAt?: string
}

const users: User[] = [
  {
    id: 'USR-0001',
    name: 'Admin User',
    email: 'admin@enterprise.corp',
    password: '123',
    role: 'System Administrator',
    department: 'Information Technology',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
]

const loggedInUserIds = new Set<string>()

export function setLoggedIn(userId: string): void {
  loggedInUserIds.add(userId)
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.lastLoginAt = new Date().toISOString()
  }
}

export function setLoggedOut(userId?: string): void {
  if (userId) {
    loggedInUserIds.delete(userId)
  }
}

export function getLoggedInUsers(): PublicUser[] {
  return users
    .filter((u) => loggedInUserIds.has(u.id))
    .map(toPublicUser)
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

export function updateLastLogin(userId: string): void {
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.lastLoginAt = new Date().toISOString()
  }
}

/**
 * Allocate the lowest free `USR-####` id so runtime accounts keep the
 * `USR-0002`, `USR-0003`, ... sequence even after an account is removed.
 */
function nextUserId(): string {
  const taken = new Set(users.map((u) => u.id))
  let n = 2
  while (taken.has(`USR-${String(n).padStart(4, '0')}`)) n += 1
  return `USR-${String(n).padStart(4, '0')}`
}

export function createUser(data: {
  name: string
  email: string
  password: string
  role?: string
  department?: string
}): User {
  const id = nextUserId()
  const now = new Date().toISOString()
  const user: User = {
    id,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role ?? 'Standard User',
    department: data.department ?? 'General',
    createdAt: now,
    lastLoginAt: now,
  }
  users.push(user)
  setLoggedIn(user.id)
  return user
}

export function verifyCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email)
  if (!user || user.password !== password) return null
  return user
}

export type PublicUser = Omit<User, 'password'>

export function toPublicUser(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...pub } = user
  return pub
}

/**
 * Build a public user from the signed session claims.
 *
 * The in-memory store only lives in the app's module graph (and is reset on
 * every server restart), so a session that is still cryptographically valid can
 * point at a user this process no longer holds. In that case the JWT claims are
 * the source of truth.
 */
export function toPublicUserFromSession(session: {
  userId: string
  name: string
  email: string
  role: string
  department: string
  createdAt: string
}): PublicUser {
  return {
    id: session.userId,
    name: session.name,
    email: session.email,
    role: session.role,
    department: session.department,
    createdAt: session.createdAt,
  }
}

/** Signed session claims needed to build the account directory. */
export type SessionUser = Parameters<typeof toPublicUserFromSession>[0]

/** A directory row: public account details plus session context for the UI. */
export interface DirectoryUser extends PublicUser {
  /** True for the account that owns the current session, or one that logged in since startup. */
  isLoggedIn: boolean
  /** True for the account that owns the current session. */
  isCurrentUser: boolean
}

/**
 * Build the account directory shown on the dashboard: every known account
 * (the caller included) enriched with its live session status.
 *
 * The signed-in account is appended from the session claims when this process no
 * longer holds it in memory, so the caller always sees their own row.
 */
export function getAccountDirectory(session: SessionUser): DirectoryUser[] {
  const publicUsers = users.map(toPublicUser)

  if (!publicUsers.some((u) => u.id === session.userId)) {
    publicUsers.push(toPublicUserFromSession(session))
  }

  return publicUsers
    .map((user) => ({
      ...user,
      isLoggedIn: loggedInUserIds.has(user.id) || user.id === session.userId,
      isCurrentUser: user.id === session.userId,
    }))
    .sort((a, b) => {
      if (a.isCurrentUser !== b.isCurrentUser) return a.isCurrentUser ? -1 : 1
      if (a.isLoggedIn !== b.isLoggedIn) return a.isLoggedIn ? -1 : 1
      return a.id.localeCompare(b.id)
    })
}

