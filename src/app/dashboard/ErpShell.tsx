'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, UserRound, Users, X } from 'lucide-react'
import type { PublicUser } from '@/lib/users'
import BrandLockup from '@/components/BrandLockup'
import LogoutButton from './LogoutButton'

/**
 * UI shell only. The sidebar links are in-page anchors to the existing
 * dashboard sections, so no routes or navigation behaviour change.
 */
const SECTIONS = [
  { id: 'account-details', label: 'Account Details', index: '01', icon: UserRound },
  { id: 'other-accounts', label: 'User Directory', index: '02', icon: Users },
] as const

export default function ErpShell({
  user,
  children,
}: {
  user: PublicUser
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  const initials = useMemo(() => {
    const letters = user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
    return letters.join('') || 'U'
  }, [user.name])

  // Scroll spy: the active section drives the sidebar marker.
  useEffect(() => {
    const elements = SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]
        if (topMost) setActiveSection(topMost.target.id)
      },
      { rootMargin: '-84px 0px -55% 0px', threshold: [0, 0.25, 1] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  // Escape closes the drawer, and page scroll is locked while it is open.
  useEffect(() => {
    if (!drawerOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setDrawerOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [drawerOpen])

  function renderSidebar(onNavigate?: () => void) {
    return (
      <div className="flex min-h-full flex-col">
        {/* Index of dashboard sections */}
        <nav aria-label="Dashboard sections" className="flex-1 px-3 py-5">
          <span className="eyebrow-sm block px-2.5 pb-2.5 text-ink-faint">
            Navigation
          </span>
          <ul className="space-y-1.5">
            {SECTIONS.map((section) => {
              const Icon = section.icon
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={onNavigate}
                    aria-current={
                      activeSection === section.id ? 'true' : undefined
                    }
                    className={`nav-link${activeSection === section.id ? ' is-active' : ''}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                    <span className="truncate">{section.label}</span>
                    <span className="tnum ml-auto text-[11px] font-semibold text-ink-faint">
                      {section.index}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Signed-in record */}
        <div className="px-4 pb-4 pt-3">
          <div className="rounded-3xl border border-hairline bg-surface-muted p-3.5">
            <span className="eyebrow-sm text-accent-strong">Signed in</span>
            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="avatar h-9 w-9 text-xs">{initials}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">
                  {user.name}
                </span>
                <span className="block truncate text-[11px] text-ink-muted">
                  {user.role}
                </span>
              </span>
            </div>
            <div className="mt-3.5">
              <LogoutButton variant="light" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="app-canvas flex min-h-screen flex-col text-ink">
        {/* ------------------------------------------------------------------
            Top navigation — frosted bar, same context and session actions.
           ------------------------------------------------------------------ */}
        <header className="brand-bar sticky top-0 z-30 border-b border-primary-strong text-chalk">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-7">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              aria-controls="erp-sidebar"
              className="btn-icon-onDark lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <BrandLockup size="sm" tone="brand" />

            <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-chalk/25 sm:block" />
            <span className="eyebrow hidden text-chalk/75 sm:inline-flex">
              Dashboard
            </span>

            {/* Session & identity */}
            <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
              <span className="status status-glass hidden md:inline-flex">
                <span className="dot dot-accent pulse-ring relative text-accent" />
                Active Session
              </span>
              <span className="hidden items-center gap-2.5 rounded-full border border-chalk/25 bg-chalk/12 py-1 pl-1 pr-3.5 md:inline-flex">
                <span className="avatar h-8 w-8 text-[11px]">{initials}</span>
                <span className="leading-tight">
                  <span className="block max-w-[11rem] truncate text-xs font-semibold text-chalk">
                    {user.name}
                  </span>
                  <span className="block max-w-[11rem] truncate text-[11px] text-chalk/70">
                    {user.role}
                  </span>
                </span>
              </span>
              <LogoutButton variant="onDark" className="lg:hidden" />
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* ----------------------------------------------------------------
              Sidebar — module index, pinned on desktop.
             ---------------------------------------------------------------- */}
          <aside className="hidden w-[268px] shrink-0 border-r border-hairline bg-surface lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
            {renderSidebar()}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-hairline px-4 py-4 sm:px-7">
              <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-ink-muted">Naari Dashboard</span>
                <span className="text-ink-faint">Enterprise Workspace</span>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            id="erp-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="animate-fade-up absolute inset-y-0 left-0 flex w-[280px] max-w-[84vw] flex-col overflow-y-auto rounded-r-3xl border-r border-hairline bg-surface shadow-lift"
          >
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="btn-icon absolute right-3 top-4 z-10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </button>
            {renderSidebar(() => setDrawerOpen(false))}
          </div>
        </div>
      )}
    </>
  )
}


