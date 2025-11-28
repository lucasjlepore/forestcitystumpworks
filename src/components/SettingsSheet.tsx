import { useSettings } from '../settings-context'
import type { AppSettings } from '../types'

const numberField = (key: keyof Pick<AppSettings, 'baseRatePerInch'>) => key

export const SettingsSheet = () => {
  const { settings, updateSettings } = useSettings()

  const handleNumber = (key: ReturnType<typeof numberField>) => (value: string) => {
    const num = Number(value)
    if (Number.isFinite(num)) updateSettings({ [key]: num } as Partial<AppSettings>)
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400">Defaults</p>
          <h2 className="text-lg font-semibold text-slate-50">Pricing presets</h2>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Base rate ($/inch)" value={settings.baseRatePerInch} onChange={handleNumber(numberField('baseRatePerInch'))} />
      </div>

      <div className="mt-3 flex items-center gap-3 text-slate-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 accent-yellow-400"
            checked={settings.taxEnabled}
            onChange={(e) => updateSettings({ taxEnabled: e.target.checked })}
          />
          Charge HST (13%)
        </label>
      </div>
    </div>
  )
}

const Field = ({ label, value, onChange, step }: { label: string; value: number; step?: string; onChange: (v: string) => void }) => (
  <label className="flex flex-col text-slate-200">
    <span className="text-xs text-slate-400">{label}</span>
    <input
      type="number"
      step={step || '0.5'}
      className="mt-1 rounded-lg border border-slate-800 bg-slate-800 px-3 py-2 text-slate-50 focus:border-yellow-400 focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
)
