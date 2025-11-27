import type { ChangeEvent } from 'react'
import { useJob } from '../job-context'
import { useSettings } from '../settings-context'
import type { Stump } from '../types'

const numberFromInput = (e: ChangeEvent<HTMLInputElement>) => Number(e.target.value) || 0

export const StumpCard = ({ stump }: { stump: Stump }) => {
  const { updateStump, removeStump, job } = useJob()
  const { settings } = useSettings()

  const handleChange = (partial: Partial<Stump>) => updateStump(stump.id, partial)

  const isOnlyStump = job.stumps.length === 1

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-slate-400">Stump</p>
          <p className="font-semibold text-slate-50">{stump.locationDescription || 'Untitled'}</p>
        </div>
        <button
          className="text-xs text-red-400 underline disabled:opacity-40"
          onClick={() => removeStump(stump.id)}
          disabled={isOnlyStump}
        >
          Remove
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="flex flex-col text-sm text-slate-300">
          Diameter ({settings.measureUnit})
          <input
            type="number"
            min={4}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-50 focus:border-yellow-400 focus:outline-none"
            value={stump.diameter}
            onChange={(e) => handleChange({ diameter: numberFromInput(e) })}
          />
        </label>
        <label className="flex flex-col text-sm text-slate-300">
          Root chase (ft)
          <input
            type="number"
            min={0}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-50 focus:border-yellow-400 focus:outline-none"
            value={stump.rootChasingFt}
            onChange={(e) => handleChange({ rootChasingFt: numberFromInput(e) })}
          />
        </label>
      </div>

      <label className="mt-3 block text-sm text-slate-300">
        Location note
        <input
          type="text"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-50 focus:border-yellow-400 focus:outline-none"
          value={stump.locationDescription || ''}
          onChange={(e) => handleChange({ locationDescription: e.target.value })}
          placeholder="e.g., Front yard near driveway"
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-100">
        <Toggle
          label={'Deep grind (8")'}
          checked={stump.deepGrind}
          onChange={(v) => handleChange({ deepGrind: v })}
        />
        <Toggle
          label="Haul away chips"
          checked={stump.haulAway}
          onChange={(v) => handleChange({ haulAway: v })}
        />
        <Toggle
          label={`Access issue (<${settings.machineWidth}")`}
          checked={stump.accessIssue}
          onChange={(v) => handleChange({ accessIssue: v })}
        />
      </div>
    </div>
  )
}

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex items-center justify-between rounded-lg border px-3 py-2 transition-colors ${
      checked
        ? 'border-yellow-400 bg-yellow-400/10 text-yellow-100'
        : 'border-slate-700 bg-slate-800 text-slate-200'
    }`}
  >
    <span>{label}</span>
    <span
      className={`h-5 w-10 rounded-full border ${checked ? 'border-yellow-300 bg-yellow-400/50' : 'border-slate-500 bg-slate-700'}`}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </span>
  </button>
)
