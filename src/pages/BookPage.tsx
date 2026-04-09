import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BOOKING_WINDOWS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_LINK, getBookingWindow } from '../booking-config'
import { CalInlineEmbed } from '../components/CalInlineEmbed'

export const BookPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedWindow = getBookingWindow(searchParams.get('window')) ?? BOOKING_WINDOWS[0]

  useEffect(() => {
    document.title = 'Book Stump Removal | Forest City Stump Works'
  }, [])

  const chooseWindow = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('window', slug)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.14),_transparent_28%),radial-gradient(circle_at_20%_80%,_rgba(16,185,129,0.16),_transparent_24%),linear-gradient(180deg,_rgba(15,23,42,0.8),_rgba(2,6,23,1))]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-950/70 px-5 py-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                Friday-Monday booking
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Forest City Stump Works</p>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">Book stump removal.</h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Choose a morning, afternoon, or evening window and send the job details we need.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:min-w-[22rem]">
              <Link
                to="/"
                className="inline-flex w-fit items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-200 transition hover:bg-yellow-400/20"
              >
                Open quote tool
              </Link>
              <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={CONTACT_PHONE_LINK}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-sm text-slate-200 transition hover:border-yellow-400/60 hover:bg-slate-900"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Call or text</p>
                <p className="mt-1 text-lg font-semibold text-slate-50">{CONTACT_PHONE_DISPLAY}</p>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-sm text-slate-200 transition hover:border-yellow-400/60 hover:bg-slate-900"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Email</p>
                <p className="mt-1 break-all text-lg font-semibold text-slate-50">{CONTACT_EMAIL}</p>
              </a>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Choose a window</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-50">Pick the work window that fits your day.</h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {BOOKING_WINDOWS.map((window) => {
              const isSelected = window.slug === selectedWindow.slug

              return (
                <button
                  key={window.slug}
                  type="button"
                  onClick={() => chooseWindow(window.slug)}
                  className={`rounded-[1.75rem] border p-5 text-left transition ${
                    isSelected
                      ? 'border-yellow-400/60 bg-yellow-400/10 shadow-[0_18px_50px_rgba(250,204,21,0.12)]'
                      : 'border-slate-800 bg-slate-900/80 hover:border-emerald-400/40 hover:bg-slate-900'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{window.name}</p>
                      <p className="mt-2 text-2xl font-black tracking-tight text-slate-50">{window.shortLabel}</p>
                    </div>
                    {isSelected && (
                      <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-200">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-lg font-semibold text-slate-50">{window.arrivalWindow}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{window.pitch}</p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur lg:sticky lg:top-6 lg:h-fit">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Selected window</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-50">{selectedWindow.name}</h2>
            <p className="mt-2 text-xl font-semibold text-yellow-300">{selectedWindow.arrivalWindow}</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">{selectedWindow.pitch}</p>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">You’ll be asked for</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Address, stump count, diameter estimates, access notes, cleanup request, and urgency.</p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Questions</p>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                <a href={CONTACT_PHONE_LINK} className="block transition hover:text-yellow-200">{CONTACT_PHONE_DISPLAY}</a>
                <a href={`mailto:${CONTACT_EMAIL}`} className="block break-all transition hover:text-yellow-200">{CONTACT_EMAIL}</a>
              </div>
            </div>
          </aside>

          <div>
            <CalInlineEmbed
              bookingWindow={selectedWindow}
              onBookingSuccessful={() => navigate('/book/thank-you', { replace: true })}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
