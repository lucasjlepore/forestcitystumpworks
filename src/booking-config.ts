export type BookingWindow = {
  slug: 'morning' | 'afternoon' | 'evening'
  name: string
  arrivalWindow: string
  shortLabel: string
  pitch: string
  calLink: string
  publicUrl: string
}

export const CONTACT_PHONE_DISPLAY = '510 421 0381'
export const CONTACT_PHONE_LINK = 'tel:+15104210381'
export const CONTACT_EMAIL = 'leporejlucas@gmail.com'

export const BOOKING_WINDOWS: BookingWindow[] = [
  {
    slug: 'morning',
    name: 'Morning arrival window',
    arrivalWindow: '8:00 AM-12:00 PM',
    shortLabel: '8-12',
    pitch: 'Best when you want the yard back before lunch.',
    calLink: 'lucas-lepore-nv9zat/morning',
    publicUrl: 'https://cal.com/lucas-lepore-nv9zat/morning',
  },
  {
    slug: 'afternoon',
    name: 'Afternoon arrival window',
    arrivalWindow: '1:00 PM-4:00 PM',
    shortLabel: '1-4',
    pitch: 'A solid daytime option when mornings are already spoken for.',
    calLink: 'lucas-lepore-nv9zat/afternoon',
    publicUrl: 'https://cal.com/lucas-lepore-nv9zat/afternoon',
  },
  {
    slug: 'evening',
    name: 'Evening arrival window',
    arrivalWindow: '5:00 PM-9:00 PM',
    shortLabel: '5-9',
    pitch: 'Ideal if you want to be home after work to walk us through access.',
    calLink: 'lucas-lepore-nv9zat/evening',
    publicUrl: 'https://cal.com/lucas-lepore-nv9zat/evening',
  },
]

export const getBookingWindow = (slug: string | null) =>
  BOOKING_WINDOWS.find((window) => window.slug === slug)
