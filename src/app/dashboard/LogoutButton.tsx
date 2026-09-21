'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  /** `dark` = outline on a light surface, `light` = solid indigo, `onDark` = glass on the indigo bar. */
  variant?: 'light' | 'dark' | 'onDark'
  className?: string
}

export default function LogoutButton({ variant = 'dark', className = '' }: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-3xl border px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed'
  const variantStyles =
    variant === 'dark'
      ? 'border-hairline-strong bg-surface text-ink-soft hover:border-accent-ring hover:bg-accent-tint hover:text-primary-strong'
      : variant === 'onDark'
        ? 'btn-glass'
        : 'border-primary-strong bg-primary text-chalk hover:bg-primary-strong'

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <LogOut className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}

