'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [department, setDepartment] = useState('Operations')
  const [role, setRole] = useState('Analyst')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#11162b] text-slate-800">
      {/* ------------------------------------------------------------------
          Left Side: Image Showcase Panel
         ------------------------------------------------------------------ */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-screen overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/signup-bg.png"
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
            Join <br />
            Naari! <span className="inline-block animate-bounce">✨</span>
          </h1>
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/90 drop-shadow max-w-md">
            Create your workspace record in seconds. Join your team, organize accounts, and get productive immediately!
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
      <div className="w-full lg:w-[500px] xl:w-[560px] bg-white flex flex-col justify-center px-8 py-10 sm:px-14 lg:px-16 shadow-2xl relative z-10">
        <div className="w-full max-w-[390px] mx-auto">
          {/* Top Brand Title */}
          <div className="mb-8">
            <span className="text-2xl font-bold tracking-tight text-slate-900">Naari</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Get Started!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-slate-900 underline underline-offset-2 hover:text-black transition-colors"
              >
                Log in here
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600 animate-fade-in"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Minimal Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name field */}
            <div>
              <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors pb-1">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors pb-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work Email"
                  className="w-full bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors pb-1 flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
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

            {/* Department & Role Fields */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label htmlFor="department" className="block text-xs font-semibold text-slate-600 mb-1">
                  Department
                </label>
                <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors pb-1">
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-transparent py-1 text-sm text-slate-900 focus:outline-none cursor-pointer"
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
                <label htmlFor="role" className="block text-xs font-semibold text-slate-600 mb-1">
                  Role
                </label>
                <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors pb-1">
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-transparent py-1 text-sm text-slate-900 focus:outline-none cursor-pointer"
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

            {/* Register / Create Account Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                id="signup-submit"
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-blue-700 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-3 text-center border-t border-slate-100 text-xs text-slate-500">
            By signing up, you agree to our Terms and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  )
}
