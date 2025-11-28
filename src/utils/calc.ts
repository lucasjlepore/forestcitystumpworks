import type { AppSettings, Job, QuoteTotals } from '../types'

export const calculateQuote = (job: Job, settings: AppSettings): QuoteTotals => {
  let subtotal = 0

  job.stumps.forEach((stump) => {
    const stumpPrice = stump.diameter * settings.baseRatePerInch
    subtotal += stumpPrice
  })

  const taxAmount = settings.taxEnabled ? subtotal * settings.taxRate : 0
  const total = subtotal + taxAmount

  return { subtotal, taxAmount, total }
}

export const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(value)
