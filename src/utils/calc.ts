import type { AppSettings, Job, QuoteTotals, Stump } from '../types'

const TONNES_PER_POUND = 0.000453592

const grindDepth = (stump: Stump) => (stump.deepGrind ? 8 : 6) // inches

export const estimateChipWeightTonnes = (stump: Stump, settings: AppSettings): number => {
  const radius = stump.diameter / 2
  const height = grindDepth(stump)
  // volume of a cylinder in cubic inches
  const volumeCubicInches = Math.PI * radius * radius * height
  // convert to cubic feet
  const volumeCubicFeet = volumeCubicInches / 1728
  const weightLbs = volumeCubicFeet * settings.chipDensityLbsPerCubicFt
  return weightLbs * TONNES_PER_POUND
}

const haulCostForStump = (stump: Stump, settings: AppSettings): number => {
  if (!stump.haulAway) return 0
  const weightTonnes = estimateChipWeightTonnes(stump, settings)
  const disposalCost = weightTonnes * settings.landfillRatePerTonne
  const handling = settings.haulHandlingFee
  return Math.max(settings.haulMinFee, disposalCost + handling)
}

const accessFeeForStump = (stump: Stump, settings: AppSettings): number =>
  stump.accessIssue ? settings.narrowAccessFee : 0

export const calculateQuote = (
  job: Job,
  settings: AppSettings
): QuoteTotals & { stumpBreakdown: Record<string, number>; haulWeightTonnes: number } => {
  let subtotal = 0
  let haulWeightTonnes = 0
  const stumpBreakdown: Record<string, number> = {}

  job.stumps.forEach((stump, index) => {
    const discountFactor = index === 0 ? 1 : 0.8 // 20% off after first
    let stumpPrice = stump.diameter * settings.baseRatePerInch * discountFactor

    if (stump.rootChasingFt > 0) stumpPrice += stump.rootChasingFt * settings.rootRate
    if (stump.deepGrind) stumpPrice += settings.deepGrindFee

    const accessFee = accessFeeForStump(stump, settings)
    stumpPrice += accessFee

    const haulCost = haulCostForStump(stump, settings)
    if (haulCost) {
      stumpPrice += haulCost
      haulWeightTonnes += estimateChipWeightTonnes(stump, settings)
    }

    stumpBreakdown[stump.id] = stumpPrice
    subtotal += stumpPrice
  })

  subtotal += job.accessFee

  if (subtotal < settings.minCallOutFee) subtotal = settings.minCallOutFee

  const taxAmount = settings.taxEnabled ? subtotal * settings.taxRate : 0
  const total = subtotal + taxAmount

  return { subtotal, taxAmount, total, stumpBreakdown, haulWeightTonnes }
}

export const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(value)
