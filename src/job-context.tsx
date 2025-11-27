import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Job, Stump } from './types'

const STORAGE_KEY = 'stumpcalc_job_v1'

const newJob = (): Job => ({
  id: uuidv4(),
  clientName: '',
  address: '',
  status: 'DRAFT',
  createdAt: new Date().toISOString(),
  stumps: [
    {
      id: uuidv4(),
      diameter: 18,
      rootChasingFt: 0,
      haulAway: false,
      deepGrind: false,
      accessIssue: false,
      locationDescription: 'Front yard',
    },
  ],
  accessFee: 0,
  discountPercent: 0,
})

type JobContextValue = {
  job: Job
  resetJob: () => void
  updateJob: (partial: Partial<Job>) => void
  updateStump: (id: string, partial: Partial<Stump>) => void
  addStump: () => void
  removeStump: (id: string) => void
}

const JobContext = createContext<JobContextValue | undefined>(undefined)

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [job, setJob] = useState<Job>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return { ...newJob(), ...JSON.parse(saved) }
      } catch (err) {
        console.warn('Failed to parse saved job', err)
      }
    }
    return newJob()
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(job))
  }, [job])

  const value = useMemo(() => ({
    job,
    resetJob: () => setJob(newJob()),
    updateJob: (partial: Partial<Job>) => setJob((prev) => ({ ...prev, ...partial })),
    updateStump: (id: string, partial: Partial<Stump>) =>
      setJob((prev) => ({
        ...prev,
        stumps: prev.stumps.map((s) => (s.id === id ? { ...s, ...partial } : s)),
      })),
    addStump: () =>
      setJob((prev) => ({
        ...prev,
        stumps: [
          ...prev.stumps,
          {
            id: uuidv4(),
            diameter: 18,
            rootChasingFt: 0,
            haulAway: false,
            deepGrind: false,
            accessIssue: false,
            locationDescription: `Stump ${prev.stumps.length + 1}`,
          },
        ],
      })),
    removeStump: (id: string) =>
      setJob((prev) => ({ ...prev, stumps: prev.stumps.filter((s) => s.id !== id) })),
  }), [job])

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>
}

export const useJob = () => {
  const ctx = useContext(JobContext)
  if (!ctx) throw new Error('useJob must be used within JobProvider')
  return ctx
}
