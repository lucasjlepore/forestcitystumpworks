import { useMemo } from 'react'
import { useJob } from '../job-context'
import { useSettings } from '../settings-context'
import { calculateQuote, formatCurrency } from '../utils/calc'
import { ShareBar } from './ShareBar'

export const FooterTotals = ({ disabled }: { disabled: boolean }) => {
  const { job } = useJob()
  const { settings } = useSettings()

  const { subtotal, taxAmount, total } = useMemo(() => calculateQuote(job, settings), [job, settings])

  return (
    <div className="sticky bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
      <div className="flex items-center justify-between text-slate-200">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Total (HST {settings.taxEnabled ? 'on' : 'off'})</p>
          <p className="text-2xl font-semibold text-yellow-300">{formatCurrency(total, settings.currency)}</p>
          <p className="text-xs text-slate-400">
            Subtotal {formatCurrency(subtotal, settings.currency)} • HST {formatCurrency(taxAmount, settings.currency)}
          </p>
        </div>
        <ShareBar disabled={disabled} />
      </div>
    </div>
  )
}
