'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Eye, EyeOff, Lock, User } from 'lucide-react'
import BrandLockup from '@/components/BrandLockup'
import ErpMark from '@/components/ErpMark'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  // UI-only credential field: the auth contract below is unchanged.
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Auth call unchanged: /api/auth/login authenticates on `email`.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed.')
        setLoading(false)
        return
      }
      // Set visited flag when successfully logging in
      if (typeof window !== 'undefined') {
        localStorage.setItem('naari_has_visited', 'true')
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  function handleDemoFill() {
    setEmail('admin@enterprise.corp')
    setPassword('123')
    setError('')
  }

  function handleMicrosoftSignIn() {
    setEmail('admin@enterprise.corp')
    setPassword('123')
    setError('')
  }

  return (
    <div className="auth-canvas relative min-h-screen w-full overflow-hidden text-ink">
      {/* Ambient light behind the sheets */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="orb orb-primary -left-28 -top-32 h-[26rem] w-[26rem]" />
        <span className="orb orb-cyan right-[-9rem] top-[15rem] h-[22rem] w-[22rem]" />
      </span>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-5 p-4 sm:p-6 lg:flex-row lg:gap-6 lg:p-7">
        {/* ------------------------------------------------------------------
            Brand panel — gradient workspace identity. Collapses to a compact
            masthead on mobile and carries the product statement on desktop.
           ------------------------------------------------------------------ */}
        <aside className="brand-panel relative flex flex-col overflow-hidden rounded-3xl px-6 py-7 text-chalk sm:px-9 lg:w-[46%] lg:max-w-[620px] lg:px-12 lg:py-12">
          <span aria-hidden="true" className="dot-matrix pointer-events-none absolute inset-0 opacity-40" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-chalk/20 blur-3xl"
          />

          <div className="relative flex items-start justify-between gap-4">
            <BrandLockup tone="brand" />
            <span className="chip chip-glass hidden sm:inline-flex">Secure Access</span>
          </div>

          <div className="relative mt-8 lg:mt-auto lg:pt-12">
            <span className="eyebrow text-chalk/70">Enterprise Resource Planning</span>
            <h1 className="display mt-3 text-[2.125rem] text-chalk sm:text-[2.75rem] lg:text-[3.25rem]">
              Sign in to your
              <br className="hidden sm:block" /> workspace<span className="text-accent">.</span>
            </h1>
            <span aria-hidden="true" className="mt-5 block h-1.5 w-16 rounded-full bg-accent" />
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-chalk/80">
              One workspace for accounts, departments and roles. Authenticate to
              continue to the resource dashboard.
            </p>

            <div className="mt-8 hidden lg:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-chalk/25 bg-chalk/15 px-3.5 py-1.5 text-[11px] font-semibold text-chalk">
                <span className="dot dot-live pulse-ring relative text-mint" />
                Secure session channel
              </span>
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------------
            Credentials panel — one focused, rounded card.
           ------------------------------------------------------------------ */}
        <main className="flex flex-1 items-center justify-center px-1 py-2 sm:px-4 lg:px-8">
          <div className="animate-fade-up w-full max-w-[440px]">
            <div className="card p-6 sm:p-8">
              {/* Panel header */}
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow text-primary">Authentication</span>
                <span className="chip chip-accent">Login</span>
              </div>
              <h2 className="display mt-4 text-[1.75rem] text-ink">Welcome back</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Enter your work email and password to continue.
              </p>

              {/* Microsoft Sign In Button */}
              <button
                type="button"
                onClick={handleMicrosoftSignIn}
                className="btn btn-secondary mt-6 w-full"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 21 21" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                <span>Sign in with Microsoft</span>
              </button>

              {/* Separator */}
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-hairline" />
                <span className="eyebrow-sm text-ink-faint">or continue with email</span>
                <span className="h-px flex-1 bg-hairline" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / User Input */}
                <div>
                  <label htmlFor="email" className="field-label">
                    User / Email
                  </label>
                  <div className={`field${error ? ' is-error' : ''}`}>
                    <span className="pl-3.5 pr-2.5 text-ink-faint">
                      <User className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user / email"
                      className="field-input"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="field-label">
                    Password
                  </label>
                  <div className={`field${error ? ' is-error' : ''}`}>
                    <span className="pl-3.5 pr-2.5 text-ink-faint">
                      <Lock className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="field-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="field-action"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-3xl border border-rose/25 bg-rose-soft px-4 py-3 text-xs font-medium text-rose"
                  >
                    <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Remember me & product signature */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-1 pt-1">
                  <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-ink-soft">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded accent-primary"
                    />
                    Remember me
                  </label>

                  <span className="flex select-none items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
                    Powered by
                    <span className="flex items-center gap-1.5">
                      <span className="brand-tile h-5 w-5 p-1">
                        <ErpMark className="h-full w-full" />
                      </span>
                      <span className="text-ink-soft">
                        ERP<span className="text-ink-faint">.net</span>
                      </span>
                    </span>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  id="login-submit"
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-chalk/40 border-t-chalk" />
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </button>
              </form>
            </div>

            {/* Footer options */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1">
              <Link
                href="/signup"
                className="text-xs font-semibold text-primary transition-colors hover:text-primary-strong"
              >
                New user? Register
              </Link>
              <button
                type="button"
                onClick={handleDemoFill}
                className="cursor-pointer text-xs font-semibold text-ink-muted transition-colors hover:text-primary-strong"
              >
                Autofill demo
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



