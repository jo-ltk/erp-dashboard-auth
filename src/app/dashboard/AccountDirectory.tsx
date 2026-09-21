'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Eye, RefreshCw, Search, Users, X } from 'lucide-react'
import type { DirectoryUser } from '@/lib/users'

type Scope = 'all' | 'others'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(iso?: string): string {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

function formatDateTime(iso?: string): string {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date)
}

/** Presentation-only initials for the row avatar. */
function initialsOf(name: string): string {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('') || 'U'
  )
}

function StatusBadge({ user }: { user: DirectoryUser }) {
  if (user.isLoggedIn) {
    return (
      <span className="status status-live">
        <span className="dot dot-live animate-pulse-dot" />
        {user.isCurrentUser ? 'Current Session' : 'Logged In'}
      </span>
    )
  }
  if (user.lastLoginAt) {
    return (
      <span className="status status-idle">
        <span className="dot dot-idle" />
        Offline
      </span>
    )
  }
  return (
    <span className="status status-new">
      <span className="dot dot-new" />
      Never Signed In
    </span>
  )
}

function DetailField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="detail-tile">
      <dt className="eyebrow-sm text-ink-faint">{label}</dt>
      <dd
        className={`mt-1.5 text-ink-soft ${
          mono ? 'tnum font-mono text-xs font-semibold' : 'text-sm font-medium'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

/** Reads the existing account directory endpoint. No request contract changes. */
async function fetchDirectory(): Promise<{
  users: DirectoryUser[]
  currentUserId: string
}> {
  const res = await fetch('/api/users', { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || 'Could not load the account directory.')
  }
  return {
    users: Array.isArray(data?.users) ? (data.users as DirectoryUser[]) : [],
    currentUserId:
      typeof data?.currentUserId === 'string' ? data.currentUserId : '',
  }
}

export default function AccountDirectory() {
  const [users, setUsers] = useState<DirectoryUser[]>([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [scope, setScope] = useState<Scope>('others')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const directory = await fetchDirectory()
        if (cancelled) return
        setUsers(directory.users)
        setCurrentUserId(directory.currentUserId)
        setError('')
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Could not load the account directory.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const directory = await fetchDirectory()
      setUsers(directory.users)
      setCurrentUserId(directory.currentUserId)
      setError('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load the account directory.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const visibleUsers = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return users
      .filter((user) => (scope === 'others' ? !user.isCurrentUser : true))
      .filter((user) => {
        if (!needle) return true
        return [
          user.name,
          user.email,
          user.id,
          user.department,
          user.role,
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      })
  }, [users, scope, query])

  const scopeOptions: { value: Scope; label: string }[] = [
    { value: 'others', label: 'Others' },
    { value: 'all', label: 'Everyone' },
  ]

  return (
    <div className="card overflow-hidden">
      {/* Toolbar: search, scope and refresh — all read-only controls. */}
      <div className="flex flex-col gap-3 border-b border-hairline bg-surface-muted px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="field w-full lg:max-w-[360px]">
          <span className="pl-4 pr-2.5 text-ink-faint">
            <Search className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, ID, department or role"
            aria-label="Search accounts"
            className="field-input"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="field-action"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-3xl border border-hairline bg-surface p-1.5">
            {scopeOptions.map((option) => {
              const isActive = scope === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setScope(option.value)}
                  aria-pressed={isActive}
                  className={`chip cursor-pointer transition-colors ${
                    isActive
                      ? 'chip-primary'
                      : 'border-transparent bg-transparent hover:bg-primary-tint'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>

          <span className="chip chip-mono tnum hidden sm:inline-flex">
            <span className="dot dot-primary" />
            {visibleUsers.length}{' '}
            {visibleUsers.length === 1 ? 'account' : 'accounts'}
          </span>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-accent"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
              strokeWidth={2}
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Directory rows */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Account</th>
              <th scope="col">User ID</th>
              <th scope="col">Department</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-right">
                Created Date
              </th>
              <th scope="col" className="text-right">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td colSpan={7}>
                    <span className="animate-pulse-dot block h-4 w-full rounded-full bg-surface-sunken" />
                  </td>
                </tr>
              ))}

            {!loading &&
              visibleUsers.map((user) => {
                const isSelected = selectedId === user.id
                return (
                  <Fragment key={user.id}>
                    <tr
                      className={
                        user.isCurrentUser
                          ? 'is-current'
                          : undefined
                      }
                    >
                      <td>
                        <span className="flex items-center gap-2.5">
                          <span className="avatar h-9 w-9 text-[11px]">
                            {initialsOf(user.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block max-w-[16rem] truncate font-semibold text-ink">
                              {user.name}
                              {user.isCurrentUser && (
                                <span className="chip chip-accent ml-2 align-middle">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="block max-w-[16rem] truncate text-[11px] text-ink-muted">
                              {user.email}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="chip chip-mono tnum">{user.id}</span>
                      </td>
                      <td>
                        <span className="chip chip-mono">
                          {user.department}
                        </span>
                      </td>
                      <td className="font-medium text-ink">{user.role}</td>
                      <td>
                        <StatusBadge user={user} />
                      </td>
                      <td className="tnum whitespace-nowrap text-right text-ink-soft">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedId(isSelected ? null : user.id)
                          }
                          aria-expanded={isSelected}
                          aria-label={
                            isSelected
                              ? `Hide details for ${user.name}`
                              : `Show details for ${user.name}`
                          }
                          className="btn-icon ml-auto h-9 w-9"
                        >
                          {isSelected ? (
                            <X className="h-4 w-4" strokeWidth={1.9} />
                          ) : (
                            <Eye className="h-4 w-4" strokeWidth={1.9} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {isSelected && (
                      <tr>
                        <td colSpan={7} className="detail-panel">
                          <dl className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-5">
                            <DetailField label="Email Address" value={user.email} />
                            <DetailField label="Department" value={user.department} />
                            <DetailField label="Role" value={user.role} />
                            <DetailField
                              label="User ID"
                              value={user.id}
                              mono
                            />
                            <DetailField
                              label="Created Date"
                              value={formatDate(user.createdAt)}
                              mono
                            />
                            <DetailField
                              label="Last Login"
                              value={formatDateTime(user.lastLoginAt)}
                              mono
                            />
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}

            {!loading && visibleUsers.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center gap-2.5 px-5 py-10 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-primary-soft text-primary">
                      <Users className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      {query.trim()
                        ? 'No accounts match your search'
                        : 'No other accounts yet'}
                    </span>
                    <span className="max-w-[34ch] text-xs text-ink-muted">
                      {query.trim()
                        ? 'Try a different name, email, ID, department or role.'
                        : 'Accounts registered from the sign up screen appear here.'}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Read-out / error strip */}
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 border-t border-hairline bg-rose-soft px-4 py-3.5 text-xs font-medium text-rose sm:px-5"
        >
          <AlertCircle className="mt-px h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline bg-surface-muted px-4 py-3.5 sm:px-5">
          <span className="text-xs text-ink-soft">
            Source{' '}
            <strong className="font-semibold text-ink">/api/users</strong>
          </span>
          <span className="status status-live">
            <span className="dot dot-live" />
            {currentUserId ? `Session ${currentUserId}` : 'Authenticated'}
          </span>
        </div>
      )}
    </div>
  )
}
