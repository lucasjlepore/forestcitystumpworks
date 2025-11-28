import type { ChangeEvent } from 'react'
import { useJob } from '../job-context'
import { useSettings } from '../settings-context'
import type { Photo, Stump } from '../types'
import { PhotoGrid } from './PhotoGrid'

const numberFromInput = (e: ChangeEvent<HTMLInputElement>) => Number(e.target.value) || 0

export const StumpCard = ({ stump }: { stump: Stump }) => {
  const { updateStump, removeStump, job } = useJob()
  const { settings } = useSettings()

  const handleChange = (partial: Partial<Stump>) => updateStump(stump.id, partial)
  const isOnlyStump = job.stumps.length === 1

  const handleAddPhotos = (newPhotos: Photo[]) => {
    handleChange({ photos: [...(stump.photos || []), ...newPhotos] })
  }

  const handleRemovePhoto = (id: string) => {
    handleChange({ photos: (stump.photos || []).filter((p) => p.id !== id) })
  }

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
            min={0}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-50 focus:border-yellow-400 focus:outline-none"
            value={stump.diameter || ''}
            onChange={(e) => handleChange({ diameter: numberFromInput(e) })}
            placeholder="Enter diameter"
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

      <div className="mt-3 text-sm text-slate-300">
        <p className="mb-1 text-slate-200">Photos (optional, max 3)</p>
        <PhotoGrid photos={stump.photos || []} onAdd={handleAddPhotos} onRemove={handleRemovePhoto} />
      </div>
    </div>
  )
}
