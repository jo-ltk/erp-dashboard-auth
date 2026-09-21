'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import BrandLockup from '@/components/BrandLockup'
import ErpMark from '@/components/ErpMark'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  // UI-only credential fields: the auth contract below is unchanged.
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [department, setDepartment] = useState('Operations')
  const [role, setRole] = useState('Analyst')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Presentational only — never gates the request below.
  const passwordsDiffer =
    confirmPassword.length > 0 && password !== confirmPassword

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Auth call unchanged: /api/auth/signup takes name, email, department, role.
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, department, role }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed.')
        setLoading(false)
        return
      }

      // Mark as visited so subsequent visits go to login
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

  return (
    <div className="auth-canvas relative min-h-screen w-full overflow-hidden text-ink">
      {/* Ambient light behind the sheets */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="orb orb-violet -left-28 -top-32 h-[26rem] w-[26rem]" />
        <span className="orb orb-cyan right-[-9rem] top-[15rem] h-[22rem] w-[22rem]" />
      </span>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-5 p-4 sm:p-6 lg:flex-row lg:gap-6 lg:p-7">
        {/* ------------------------------------------------------------------
            Brand panel — mirrors the login sheet.
           ------------------------------------------------------------------ */}
        <aside className="brand-panel relative flex flex-col overflow-hidden rounded-3xl px-6 py-7 text-chalk sm:px-9 lg:w-[44%] lg:max-w-[560px] lg:px-12 lg:py-12">
          <span aria-hidden="true" className="dot-matrix pointer-events-none absolute inset-0 opacity-40" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-chalk/20 blur-3xl"
          />

          <div className="relative flex items-start justify-between gap-4">
            <BrandLockup tone="brand" />
            <span className="chip chip-glass hidden sm:inline-flex">New Account</span>
          </div>

          <div className="relative mt-8 lg:mt-auto lg:pt-12">
            <span className="eyebrow text-chalk/70">Enterprise Resource Planning</span>
            <h1 className="display mt-3 text-[2.125rem] text-chalk sm:text-[2.75rem] lg:text-[3.25rem]">
              Create your
              <br className="hidden sm:block" /> workspace record<span className="text-accent">.</span>
            </h1>
            <span aria-hidden="true" className="mt-5 block h-1.5 w-16 rounded-full bg-accent" />
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-chalk/80">
              Create your record with a department and role. Your account is
              signed in and listed in the directory immediately.
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
            Registration panel.
           ------------------------------------------------------------------ */}
        <main className="flex flex-1 items-center justify-center px-1 py-2 sm:px-4 lg:px-8">
          <div className="animate-fade-up w-full max-w-[470px]">
            <div className="card p-6 sm:p-8">
              {/* Panel header */}
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow text-primary">Registration</span>
                <span className="chip chip-accent">Sign up</span>
              </div>
              <h2 className="display mt-4 text-[1.75rem] text-ink">Create record</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Fill in your details to open a new ERP account.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="field-label">
                    Full name
                  </label>
                  <div className={`field${error ? ' is-error' : ''}`}>
                    <span className="pl-3.5 pr-2.5 text-ink-faint">
                      <User className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="full name"
                      className="field-input"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="field-label">
                    Work email
                  </label>
                  <div className={`field${error ? ' is-error' : ''}`}>
                    <span className="pl-3.5 pr-2.5 text-ink-faint">
                      <Mail className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="work email"
                      className="field-input"
                    />
                  </div>
                </div>

                {/* Password */}
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="field-label">
                    Confirm password
                  </label>
                  <div
                    className={`field${passwordsDiffer || error ? ' is-error' : ''}`}
                  >
                    <span className="pl-3.5 pr-2.5 text-ink-faint">
                      <Lock className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="field-input"
                    />
                  </div>
                  {/* Presentational feedback only — submission is never blocked. */}
                  <p
                    aria-live="polite"
                    className={`mt-1.5 text-[11px] font-medium ${
                      passwordsDiffer ? 'text-rose' : 'text-transparent'
                    }`}
                  >
                    {passwordsDiffer ? 'Passwords do not match' : 'No mismatch'}
                  </p>
                </div>

                {/* Department & Role */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="department" className="field-label">
                      Department
                    </label>
                    <div className="select-slot">
                      <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="select-input"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Finance">Finance</option>
                        <option value="Information Technology">IT</option>
                        <option value="Human Resources">HR</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="field-label">
                      Role
                    </label>
                    <div className="select-slot">
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="select-input"
                      >
                        <option value="Analyst">Analyst</option>
                        <option value="Manager">Manager</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Director">Director</option>
                        <option value="Standard User">Standard User</option>
                      </select>
                    </div>
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

                {/* Product signature */}
                <div className="flex items-center justify-end pt-1">
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
                  id="signup-submit"
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-chalk/40 border-t-chalk" />
                      Creating account...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>
            </div>

            {/* Footer link */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1">
              <Link
                href="/login"
                className="text-xs font-semibold text-primary transition-colors hover:text-primary-strong"
              >
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}



