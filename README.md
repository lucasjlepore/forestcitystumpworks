# StumpCalc

Offline-ready (PWA-ready) stump grinding quote calculator tuned for Dosko 620-HE and London, Ontario pricing.

## Features
- Tailwind React SPA with localStorage persistence (no backend).
- Pricing defaults: $9/inch base, $150 min call-out, HST 13%, $8/ft roots, $40 deep grind, $25 narrow access, weight-based haul-away tied to W12A landfill rate ($75/tonne, $15 minimum).
- Volume discount: 20% off each stump after the first.
- Sticky footer totals + clipboard export.
- Settings panel to adjust all rates quickly.
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
