import { useMemo } from 'react'
import { FooterTotals } from './components/FooterTotals'
import { SettingsSheet } from './components/SettingsSheet'
import { StumpCard } from './components/StumpCard'
import { useJob } from './job-context'
import { useSettings } from './settings-context'
import { calculateQuote, formatCurrency } from './utils/calc'

function App() {
  const { job, updateJob, addStump } = useJob()
  const { settings } = useSettings()

  const totals = useMemo(() => calculateQuote(job, settings), [job, settings])

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 pb-24 pt-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-yellow-300">StumpCalc</h1>
        </div>
        <div className="flex gap-2 text-sm text-slate-200">
          <input
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
            placeholder="Client name"
            value={job.clientName}
            onChange={(e) => updateJob({ clientName: e.target.value })}
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
            placeholder="Address"
            value={job.address}
            onChange={(e) => updateJob({ address: e.target.value })}
          />
        </div>
      </header>

      <SettingsSheet />

      <section className="space-y-3">
        <div className="flex items-center justify-between text-slate-200">
          <h2 className="text-lg font-semibold">Stumps ({job.stumps.length})</h2>
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

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
        <h3 className="font-semibold text-slate-50">Summary</h3>
        <p className="text-slate-300">{job.stumps.length} stump(s) • Minimum call-out {formatCurrency(settings.minCallOutFee, settings.currency)}</p>
        <p className="text-slate-400">Volume discount applied automatically (20% off after first).</p>
        <p className="text-slate-400">Haul-away uses weight-based calc vs. W12A $/tonne with $15 minimum.</p>
        <p className="text-slate-400">Access warning triggers if gate under {settings.machineWidth}" (Dosko 620-HE).</p>
        <p className="text-slate-50 mt-2">Est. total: <span className="font-semibold text-yellow-300">{formatCurrency(totals.total, settings.currency)}</span></p>
      </section>

      <FooterTotals />
    </div>
  )
}

export default App
