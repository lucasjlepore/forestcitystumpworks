import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useJob } from '../job-context'
import { useSettings } from '../settings-context'
import { calculateQuote, formatCurrency } from '../utils/calc'

export const ShareBar = ({ disabled }: { disabled: boolean }) => {
  const { job } = useJob()
  const { settings } = useSettings()
  const totals = calculateQuote(job, settings)

  const shareText = () => {
    const lines: string[] = []
    lines.push(`${settings.companyName} — Stump Quote`)
    if (job.clientName) lines.push(`Client: ${job.clientName}`)
    if (job.address) lines.push(`Address: ${job.address}`)
    lines.push(`Stumps: ${job.stumps.length}`)
    job.stumps.forEach((s, idx) => {
      const photos = s.photos?.length ? ` • ${s.photos.length} photo(s)` : ''
      lines.push(`#${idx + 1} ${s.diameter}"${s.locationDescription ? ` • ${s.locationDescription}` : ''}${photos}`)
    })
    lines.push(`Subtotal: ${formatCurrency(totals.subtotal, settings.currency)}`)
    if (settings.taxEnabled) lines.push(`HST: ${formatCurrency(totals.taxAmount, settings.currency)}`)
    lines.push(`Total: ${formatCurrency(totals.total, settings.currency)}`)
    return lines.join('\n')
  }

  const handleShare = async () => {
    const text = shareText()
    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'Stump quote' })
        return
      } catch (e) {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.warn('share/clipboard failed', err)
    }
  }

  const handlePdf = async () => {
    const el = document.getElementById('quote-summary')
    if (!el) return
    const canvas = await html2canvas(el as HTMLElement, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = (canvas.height * pageWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
    pdf.save('stump-quote.pdf')
  }

  return (
    <div className="flex gap-2">
      <button
        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-yellow-400 disabled:opacity-50"
        onClick={handleShare}
        disabled={disabled}
      >
        Share / Copy
      </button>
      <button
        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-yellow-400 disabled:opacity-50"
        onClick={handlePdf}
        disabled={disabled}
      >
        Export PDF
      </button>
    </div>
  )
}
