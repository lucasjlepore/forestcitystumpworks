# Forest City Stump Works

Offline-ready (PWA-ready) stump grinding quote calculator tuned for London, Ontario pricing.

## Features
- Tailwind React SPA with localStorage persistence (no backend).
- Pricing defaults: $5/inch base with HST 13%; volume discount 20% off after first stump.
- Volume discount: 20% off each stump after the first.
- Sticky footer totals + share/copy and PDF export (shows subtotal, HST, total).
- Settings panel to adjust rates quickly (base rate + tax toggle).
- PWA enabled (generateSW) with maskable icon (`public/icon.svg` + PNGs); Workbox runs in development mode to avoid terser issue—safe for prod, just unminified SW.

## Develop
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

> PWA plugin is configured but disabled for production until icon assets are added. Flip `disable: mode === 'production'` to `false` in `vite.config.ts` once icons are present.
