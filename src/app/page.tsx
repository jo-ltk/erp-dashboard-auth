'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootHomePage() {
  const router = useRouter()

  useEffect(() => {
    // Direct users to /signup first as the initial entrypoint
    router.replace('/signup')
  }, [router])

  return (
    <div className="auth-canvas flex min-h-screen flex-col items-center justify-center gap-6">
      {/* Seamless minimal loader while client routes */}
      <div className="relative h-11 w-11">
        <span className="absolute inset-0 rounded-3xl border-2 border-primary-soft" />
        <span className="absolute inset-0 animate-spin rounded-3xl border-2 border-transparent border-t-primary" />
      </div>
      <div className="flex items-center gap-2.5 text-ink-muted">
        <span className="dot dot-accent pulse-ring animate-pulse-dot relative text-accent" />
        <span className="eyebrow-sm">Routing to secure sign-in</span>
      </div>
    </div>
  )
}


