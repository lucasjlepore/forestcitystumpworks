import { useEffect, useId, useMemo, useRef } from 'react'
import type { BookingWindow } from '../booking-config'

type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean
  ns?: Record<string, (...args: unknown[]) => void>
  q?: unknown[]
}

declare global {
  interface Window {
    Cal?: CalApi
  }
}

const CAL_EMBED_SCRIPT = 'https://app.cal.com/embed/embed.js'
const CAL_ORIGIN = 'https://cal.com'
const CAL_INIT = 'init'

const loadCalEmbed = () => {
  if (window.Cal) return window.Cal

  const d = window.document
  const queue = (target: CalApi | ((...args: unknown[]) => void), args: unknown[]) => {
    const queuedTarget = target as CalApi
    queuedTarget.q = queuedTarget.q || []
    queuedTarget.q.push(args)
  }

  const cal = function (...args: unknown[]) {
    const api = cal as CalApi

    if (!api.loaded) {
      api.ns = api.ns || {}
      api.q = api.q || []

      const script = d.createElement('script')
      script.src = CAL_EMBED_SCRIPT
      script.async = true
      d.head.appendChild(script)
      api.loaded = true
    }

    if (args[0] === CAL_INIT) {
      const namespace = args[1]

      if (typeof namespace === 'string') {
        const namespacedApi = (api.ns?.[namespace] ||
          ((...namespaceArgs: unknown[]) => {
            queue(namespacedApi, namespaceArgs)
          })) as CalApi

        namespacedApi.q = namespacedApi.q || []
        api.ns![namespace] = namespacedApi
        queue(namespacedApi, args)
        queue(api, ['initNamespace', namespace])
        return
      }
    }

    queue(api, args)
  } as CalApi

  cal.ns = {}
  cal.q = []
  window.Cal = cal

  return cal
}

type CalInlineEmbedProps = {
  bookingWindow: BookingWindow
  onBookingSuccessful?: () => void
}

export const CalInlineEmbed = ({ bookingWindow, onBookingSuccessful }: CalInlineEmbedProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inlineId = useId().replace(/:/g, '')
  const namespace = useMemo(() => `forest-city-${bookingWindow.slug}`, [bookingWindow.slug])

  useEffect(() => {
    const cal = loadCalEmbed()
    const container = containerRef.current

    if (!container) return

    container.innerHTML = ''
    cal('init', namespace, { origin: CAL_ORIGIN })

    const namespacedCal = cal.ns?.[namespace]
    namespacedCal?.('on', {
      action: 'bookingSuccessfulV2',
      callback: () => {
        onBookingSuccessful?.()
      },
    })
    namespacedCal?.('inline', {
      elementOrSelector: `#${inlineId}`,
      calLink: bookingWindow.calLink,
      config: {
        layout: 'month_view',
      },
    })

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [bookingWindow.calLink, inlineId, namespace, onBookingSuccessful])

  return (
    <div className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/70 p-2 shadow-[0_24px_80px_rgba(2,6,23,0.6)]">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950">
        <div
          id={inlineId}
          ref={containerRef}
          className="min-h-[760px] w-full"
        />
      </div>
    </div>
  )
}
