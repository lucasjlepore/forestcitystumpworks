import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FooterTotals } from '../components/FooterTotals'
import { SettingsSheet } from '../components/SettingsSheet'
import { StumpCard } from '../components/StumpCard'
import { JobProvider, useJob } from '../job-context'
import { SettingsProvider, useSettings } from '../settings-context'
import { calculateQuote, formatCurrency } from '../utils/calc'

const QuoteTool = () => {
  const { job, updateJob, addStump } = useJob()
  const { settings } = useSettings()

  const totals = useMemo(() => calculateQuote(job, settings), [job, settings])
  const hasInvalidStumps = job.stumps.some((s) => !s.diameter || s.diameter <= 0 || !s.count || s.count <= 0)
  const invalidCount = job.stumps.filter((s) => !s.diameter || s.diameter <= 0 || !s.count || s.count <= 0).length

  useEffect(() => {
    document.title = 'Forest City Stump Works'
  }, [])

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6">
      <header className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-4 shadow-[0_18px_60px_rgba(2,6,23,0.38)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <h1 className="text-2xl font-bold text-yellow-300">Forest City Stump Works</h1>
                <p className="text-xs uppercase tracking-wide text-slate-400">Quote builder</p>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                New for the 2026 season: customers can reserve arrival windows online. Use the calculator here, or send them straight to the booking page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/book"
                className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-200 transition hover:bg-yellow-400/20"
              >
                Open booking page
              </Link>
              <a
                href="https://cal.com/lucas-lepore-nv9zat"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/40 hover:bg-slate-900"
              >
                View Cal.com profile
              </a>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Client name</span>
              <input
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
                placeholder="Client name"
                value={job.clientName}
                onChange={(e) => updateJob({ clientName: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Address</span>
              <input
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
                placeholder="Address"
                value={job.address}
                onChange={(e) => updateJob({ address: e.target.value })}
              />
            </label>
          </div>
        </div>
      </header>

      <SettingsSheet />

      <section className="space-y-3">
        <div className="flex items-center justify-between text-slate-200">
          <div>
            <h2 className="text-lg font-semibold">Stumps ({job.stumps.length})</h2>
            <p className="text-xs text-slate-400">Add details for each stump, including location and photos.</p>
          </div>
          <button
            onClick={addStump}
            className="rounded-lg border border-yellow-400 bg-yellow-400/10 px-3 py-2 text-sm font-medium text-yellow-200 hover:bg-yellow-400/20"
          >
            + Add stump
          </button>
        </div>
        <div className="grid gap-3">
          {job.stumps.map((stump) => (
            <StumpCard key={stump.id} stump={stump} />
          ))}
        </div>
      </section>

      <section id="quote-summary" className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
        <h3 className="font-semibold text-slate-50">Summary</h3>
        <p className="text-slate-300">{job.stumps.length} stump(s)</p>
        {hasInvalidStumps && (
          <p className="text-red-400">
            Enter diameter and count for all stumps to get a valid quote. {invalidCount} missing.
          </p>
        )}
        <div className="mt-2 space-y-1 text-slate-200">
          <p>Subtotal: {formatCurrency(totals.subtotal, settings.currency)}</p>
          {settings.taxEnabled && <p>HST ({(settings.taxRate * 100).toFixed(0)}%): {formatCurrency(totals.taxAmount, settings.currency)}</p>}
          <p className="text-slate-50">Total: <span className="font-semibold text-yellow-300">{formatCurrency(totals.total, settings.currency)}</span></p>
        </div>
      </section>

      <FooterTotals disabled={hasInvalidStumps} />
    </div>
  )
}

export const QuotePage = () => (
  <SettingsProvider>
    <JobProvider>
      <QuoteTool />
    </JobProvider>
  </SettingsProvider>
)
