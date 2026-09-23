# Project Context (read this first every session)

## Goal
- Build one app in this folder (/Users/sukshemk/sap)
- ✅ DONE: "StyleBook" — a production-ready, mobile-first salon booking platform (Phase 1, investor-demo-ready).

## Status
- [x] Phase 1 complete — builds & runs (see README.md)
- [ ] Optional Phase 2 ideas further down

## What we did so far
- Built a single React + Vite + Tailwind + React Router app with 3 role-based surfaces:
  - **Customer app** (`/`): landing (hero, search, popular styles, featured salons, how-it-works, reviews, CTA), hairstyle gallery (20 styles, Men/Women, search + filters), hairstyle detail, salon discovery (filters: rating/service/gender/sort), salon profiles (portfolio/services/reviews/slots), 6-step booking flow (Style → Salon → Date → Slot → Details → Confirmation), bookings dashboard, favourites, profile settings.
  - **Salon owner dashboard** (`/salon`): stats, booking accept/complete/cancel, service CRUD, slot + working-hours + holiday management, portfolio upload (before/after), salon profile edit.
  - **Admin panel** (`/admin`): KPIs, salon feature/verify/delete/add, user role management, all-bookings management, hairstyle catalogue.
- Auth: email/password, phone (OTP, demo-simulated), forgot-password, + "Instant demo access" buttons (Customer/Owner/Admin).
- Data layer (`src/lib/store.js`) uses **Firestore when a Firebase project is configured**, otherwise an identical **localStorage demo store** — so it works instantly with seeded data:
  - 10 demo salons, 20 hairstyles, 50 users, 100 bookings, 50 reviews, 20 slots/salon/day (deterministic generator in `src/lib/demoData.js`).
- UX implemented: loading skeletons, toasts, empty/error states, bottom mobile nav + desktop header, dark mode toggle, bottom sheets, success screen, responsive tables.
- GitHub Pages ready: HashRouter (deep links never 404), relative base in vite config, `npm run deploy`.
- Firestore seed script: `scripts/seed.mjs` (needs `firebase-admin` + service-account key).

## Decisions made
- JS (not TypeScript) for speed; React 18 + Vite 5 + Tailwind 3 + react-icons (Feather/FontAwesome).
- **Demo mode by default** — zero-config; works with `npm install && npm run dev`.
- Mobile-first with `md:`/`lg:` desktop upgrades.
- Demo identities: customer demo user bound to seeded `user-1` (so seeded bookings/favourites appear); owner demo = `salon-1` (Modern Men's Salon); admin demo role `admin`.
- Brand color: rose (`#e11d48`, `brand` palette in tailwind.config).

## Current state / verified
- `npm run build` passes clean.
- Dev server boots, all key modules transform (200).
- Seed data sanity-checked in Node (phones 10-digits, local-time slot ids align with booking slotIds → "booked" flags work).

## Next steps (this file is source of truth — update after every session)
- [ ] Run the app and give it a design QA pass in a browser (`npm run dev`)
- [ ] Optional: connect a real Firebase project (README has steps) + `firebase-admin`
- [ ] Optional: deploy to GitHub Pages (`npm run deploy`) after setting `homepage` in package.json
- [ ] Optional follow-ups: payment flow, notifications, PWA/offline, real phone OTP, Reviews submission UI, distance calc from geolocation

## Session log
- Session 2 (Sep 2026): Dev server started + verified at http://localhost:5173 (200), then killed on user request (`pkill -f vite`). User confirmed 3-app structure (customer `/`, owner `/salon`, admin `/admin`). No code changes; project idle awaiting next session.
- Session 3 (Sep 2026): Role clarity pass — customer app kept as is (best for customers). Salon owner dashboard now leads with **Earnings through the app** (total/today/last-7-days, completed haircuts) + bookings with price shown (`src/pages/owner/OwnerDashboard.jsx`). Admin dashboard rebuilt as full analytics: registered customers, **sign-ins today/total** (new login log in `src/lib/auth.js` + `getLoginLog()` in store), haircuts completed, customers served, gross revenue, avg order value, 7-day revenue chart, top 5 salons by revenue (`src/pages/admin/AdminDashboard.jsx`). Build passes; dev server running in background (nohup, log /tmp/vite-dev.log).

## Important notes
- Run `npm install` once before dev/build.
- Design tokens live in `tailwind.config.js`; global CSS utilities in `src/index.css`.
- This file is the source of truth across chats. Update it at the end of every session.