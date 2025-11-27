import { useMemo } from 'react'
import { useJob } from '../job-context'
import { useSettings } from '../settings-context'
import { calculateQuote, formatCurrency } from '../utils/calc'

export const FooterTotals = () => {
  const { job } = useJob()
  const { settings } = useSettings()

  const { subtotal, taxAmount, total, haulWeightTonnes } = useMemo(
    () => calculateQuote(job, settings),
    [job, settings]
  )

  const copyQuote = async () => {
    const lines: string[] = []
    lines.push(`${settings.companyName} — Stump Quote`)
    if (job.clientName) lines.push(`Client: ${job.clientName}`)
    if (job.address) lines.push(`Address: ${job.address}`)
    lines.push(`Stumps: ${job.stumps.length}`)
    job.stumps.forEach((s, idx) => {
      lines.push(
        `#${idx + 1} ${s.diameter}"${s.locationDescription ? ` • ${s.locationDescription}` : ''}${
          s.haulAway ? ' • haul-away' : ''
        }${s.deepGrind ? ' • deep' : ''}${s.rootChasingFt ? ` • roots ${s.rootChasingFt}ft` : ''}`
      )
    })
    lines.push(`Subtotal: ${formatCurrency(subtotal, settings.currency)}`)
    if (settings.taxEnabled) lines.push(`HST: ${formatCurrency(taxAmount, settings.currency)}`)
    lines.push(`Total: ${formatCurrency(total, settings.currency)}`)
    if (haulWeightTonnes > 0) lines.push(`Est. chips: ${(haulWeightTonnes * 1000).toFixed(1)} kg`)

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
    } catch (err) {
      console.warn('copy failed', err)
    }
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
      <div className="flex items-center justify-between text-slate-200">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Total (HST {settings.taxEnabled ? 'on' : 'off'})</p>
          <p className="text-2xl font-semibold text-yellow-300">{formatCurrency(total, settings.currency)}</p>
          <p className="text-xs text-slate-400">
            Subtotal {formatCurrency(subtotal, settings.currency)} • HST {formatCurrency(taxAmount, settings.currency)}
            {haulWeightTonnes > 0 ? ` • Est. chips ${(haulWeightTonnes * 1000).toFixed(0)} kg` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-yellow-400"
            onClick={copyQuote}
          >
            Copy quote
          </button>
        </div>
      </div>
    </div>
  )
}
