import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_LINK } from '../booking-config'

export const BookThankYouPage = () => {
  useEffect(() => {
    document.title = 'Booking Request Received | Forest City Stump Works'
  }, [])

  return (
    <div className="relative isolate min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(250,204,21,0.14),_transparent_24%),linear-gradient(180deg,_rgba(15,23,42,0.8),_rgba(2,6,23,1))]" />
      <div className="relative mx-auto max-w-3xl">
        <div className="rounded-[2.25rem] border border-slate-800 bg-slate-950/75 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur sm:p-10">
          <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
            Booking update
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">Your booking request has been received.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            You should receive a confirmation from our scheduling system shortly. If anything about the site changes before we arrive, call,
            text, or email and we’ll update the job details.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
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

          <div className="mt-8 rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">What happens next</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-200">
              <li className="rounded-2xl border border-slate-800 bg-slate-950/75 px-4 py-3">Check your inbox for the booking email and arrival window details.</li>
              <li className="rounded-2xl border border-slate-800 bg-slate-950/75 px-4 py-3">Reply to that email if you need to add notes about access, cleanup, or urgency.</li>
              <li className="rounded-2xl border border-slate-800 bg-slate-950/75 px-4 py-3">Reach out directly if you want to adjust the job before your scheduled day.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/book"
              className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2.5 text-sm font-medium text-yellow-200 transition hover:bg-yellow-400/20"
            >
              Book another window
            </Link>
            <Link
              to="/"
              className="rounded-full border border-slate-800 bg-slate-900/80 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-400/40 hover:bg-slate-900"
            >
              Open quote tool
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
