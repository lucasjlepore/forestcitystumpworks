export type AppSettings = {
  baseRatePerInch: number
  minCallOutFee: number
  taxRate: number
  taxEnabled: boolean
  measureUnit: 'inches'
  currency: 'CAD'
  companyName: string
  machineWidth: number // inches
  rootRate: number // $ per foot
  deepGrindFee: number
  haulHandlingFee: number // labor/handling add-on per haul job
  haulMinFee: number
  landfillRatePerTonne: number
  chipDensityLbsPerCubicFt: number
  narrowAccessFee: number
}

export type Stump = {
  id: string
  diameter: number
  locationDescription?: string
  rootChasingFt: number
  haulAway: boolean
  deepGrind: boolean
  accessIssue: boolean
}

export type Job = {
  id: string
  clientName: string
  address: string
  status: 'DRAFT' | 'SENT' | 'COMPLETED' | 'ARCHIVED'
  createdAt: string
  stumps: Stump[]
  accessFee: number
  discountPercent: number
}

export type QuoteTotals = {
  subtotal: number
  taxAmount: number
  total: number
}
