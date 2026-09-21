'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#11162b] text-slate-800">
      {/* ------------------------------------------------------------------
          Left Side: Image Showcase Panel
         ------------------------------------------------------------------ */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-screen overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login-bg.png"
          alt="Naari Workspace"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Subtle gradient vignette to blend smoothly toward the right white section */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 lg:bg-gradient-to-r lg:from-black/30 lg:via-transparent lg:to-black/30 pointer-events-none" />

        {/* Brand Logo / Spark Mark on Top Left */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-white font-bold select-none">✻</span>
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow">Naari</span>
          </div>
        </div>

        {/* Left Hero Statement */}
        <div className="relative z-10 max-w-lg my-auto pt-10 pb-6 lg:py-0 text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md leading-[1.15]">
            Hello <br />
            Naari! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/90 drop-shadow max-w-md">
            Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!
          </p>
        </div>

        {/* Footer note on image */}
        <div className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} Naari. All rights reserved.
        </div>
      </div>

      {/* ------------------------------------------------------------------
          Right Side: Clean Minimalist White Form Panel (SalesSkip style)
         ------------------------------------------------------------------ */}
      <div className="w-full lg:w-[480px] xl:w-[540px] bg-white flex flex-col justify-center px-8 py-12 sm:px-14 lg:px-16 shadow-2xl relative z-10">
        <div className="w-full max-w-[380px] mx-auto">
          {/* Top Brand Title */}
          <div className="mb-10">
            <span className="text-2xl font-bold tracking-tight text-slate-900">Naari</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome Back!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Don’t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-slate-900 underline underline-offset-2 hover:text-black transition-colors"
              >
                Create a new account now
              </Link>
              , it’s FREE! Takes less than a minute.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600 animate-fade-in"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Minimal Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username / Email field (Clean underline minimalist style) */}
            <div>
              <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors pb-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors pb-1 flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Now Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                id="login-submit"
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Login Now'
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Autofill Helper */}
          <div className="mt-8 pt-4 text-center border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span>Need quick access?</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="font-semibold text-slate-800 underline underline-offset-2 hover:text-black cursor-pointer"
            >
              Autofill demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
