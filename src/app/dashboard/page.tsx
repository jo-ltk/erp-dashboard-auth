import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { setLoggedIn, toPublicUserFromSession } from '@/lib/users'
import AccountDirectory from './AccountDirectory'
import ErpShell from './ErpShell'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }

  // User data lives in the JWT — no in-memory lookup needed
  const pubUser = toPublicUserFromSession(session)

  // Best-effort: mark logged in if still in memory (non-critical)
  setLoggedIn(session.userId)

  return (
    <ErpShell user={pubUser}>
      <div className="mx-auto w-full max-w-[1180px] px-4 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        {/* ----------------------------------------------------------------
            01 — Account Details
           ---------------------------------------------------------------- */}
        <section
          id="account-details"
          aria-labelledby="account-details-heading"
          className="scroll-mt-20"
        >
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-accent-strong">Section 01</p>
              <h1
                id="account-details-heading"
                className="display mt-3 text-[1.875rem] text-ink sm:text-[2.25rem]"
              >
                Account Details
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Details of the currently logged in user
              </p>
            </div>
            <span className="status status-live">
              <span className="dot dot-live pulse-ring relative" />
              Active Session
            </span>
          </header>

          {/* Account Details Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">User ID</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Department</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-right">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="chip chip-mono tnum">{pubUser.id}</span>
                    </td>
                    <td className="font-semibold text-ink">{pubUser.name}</td>
                    <td>{pubUser.email}</td>
                    <td>
                      <span className="chip chip-mono">{pubUser.department}</span>
                    </td>
                    <td className="font-medium text-ink">{pubUser.role}</td>
                    <td>
                      <span className="status status-live">
                        <span className="dot dot-live animate-pulse-dot" />
                        Logged In
                      </span>
                    </td>
                    <td className="tnum whitespace-nowrap text-right text-ink-soft">
                      {new Date(pubUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline bg-surface-muted px-5 py-3.5">
              <span className="text-xs text-ink-soft">
                Signed in as{' '}
                <strong className="font-semibold text-ink">
                  {pubUser.email}
                </strong>
              </span>
              <span className="status status-live">
                <span className="dot dot-live" />
                Authenticated
              </span>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            02 — Other Accounts (only registered users appear here)
           ---------------------------------------------------------------- */}
        <section
          id="other-accounts"
          aria-labelledby="other-accounts-heading"
          className="mt-12 scroll-mt-20 sm:mt-14"
        >
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-accent-strong">Section 02</p>
              <h2
                id="other-accounts-heading"
                className="display mt-3 text-[1.625rem] text-ink sm:text-[2rem]"
              >
                Other Accounts
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Details of the other registered users in the system
              </p>
            </div>
            <span className="chip chip-mono hidden sm:inline-flex">
              <span className="dot dot-primary" />
              User Directory
            </span>
          </header>
          <AccountDirectory />
        </section>
      </div>
    </ErpShell>
  )
}
