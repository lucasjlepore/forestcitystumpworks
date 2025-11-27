import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AppSettings } from './types'

const STORAGE_KEY = 'stumpcalc_settings_v1'

const defaultSettings: AppSettings = {
  baseRatePerInch: 9,
  minCallOutFee: 150,
  taxRate: 0.13,
  taxEnabled: true,
  measureUnit: 'inches',
  currency: 'CAD',
  companyName: 'Dosko 620-HE Ops',
  machineWidth: 32, // inches, fits 32"+ gates
  rootRate: 8,
  deepGrindFee: 40,
  haulHandlingFee: 20,
  haulMinFee: 15,
  landfillRatePerTonne: 75,
  chipDensityLbsPerCubicFt: 12,
  narrowAccessFee: 25,
}

type SettingsContextValue = {
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) }
      } catch (err) {
        console.warn('Failed to parse saved settings', err)
      }
    }
    return defaultSettings
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const value = useMemo(
    () => ({
      settings,
      updateSettings: (partial: Partial<AppSettings>) =>
        setSettings((prev) => ({ ...prev, ...partial })),
    }),
    [settings]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
