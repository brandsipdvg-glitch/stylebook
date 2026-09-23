# Project Context (read this first every session)

## 🔴 LIVE SITE
- **URL:** https://brandsipdvg-glitch.github.io/stylebook/ (GitHub Pages, public repo).
- Deploy method: build with `npm run build` (base './'), then `npx gh-pages -d dist -b gh-pages` → pushes the built site to the `gh-pages` branch → Pages serves it. Re-deploy after any merge.
- Repo is PUBLIC (not private). Customer demo URL = live site URL; owner app at `#/salon`, admin at `#/admin`.

## ⚠️ GIT WORKFLOW (MUST FOLLOW, EVERY SESSION)
- Repo: `https://github.com/brandsipdvg-glitch/stylebook.git` (public, branch `main`).
- Two people work on this: User (customer side `/`) and friend (salon side `/salon`, `/admin`).
- **BEFORE any pull request, catch-up, edit, or push:** FIRST run `git pull --rebase origin main` to download the other person's latest changes. The pull must happen BEFORE editing in a session (never edit stale files).
- **AFTER finishing edits / end of session:** commit + `git push origin main` so the other person can pull next. (Only when user asks to save/push.)
- If user says "pull" → `git status` to check for uncommitted local changes first, then pull. If local changes exist and user still wants to pull, ask whether to commit them first before pulling.
- If a merge conflict appears: show both versions to the user and ask which to keep (customer user is the final decider).
- Never push or edit without a pull in the same session.

## Goal
- Build one app in this folder (/Users/sukshemk/sap)
- ✅ DONE: "StyleBook" — a production-ready, mobile-first salon booking platform (Phase 1, investor-demo-ready).

## Status
- [x] Phase 1 complete — builds & runs (see README.md)
- [x] Deployed live on GitHub Pages: https://brandsipdvg-glitch.github.io/stylebook/
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
- [ ] Optional follow-ups: payment flow, notifications, PWA/offline, real phone OTP, Reviews submission UI, distance calc from geolocation

## Session log
- Session 2 (Sep 2026): Dev server started + verified at http://localhost:5173 (200), then killed on user request (`pkill -f vite`). User confirmed 3-app structure (customer `/`, owner `/salon`, admin `/admin`). No code changes; project idle awaiting next session.
- Session 3 (Sep 2026): Role clarity pass — customer app kept as is (best for customers). Salon owner dashboard now leads with **Earnings through the app** (total/today/last-7-days, completed haircuts) + bookings with price shown (`src/pages/owner/OwnerDashboard.jsx`). Admin dashboard rebuilt as full analytics: registered customers, **sign-ins today/total** (new login log in `src/lib/auth.js` + `getLoginLog()` in store), haircuts completed, customers served, gross revenue, avg order value, 7-day revenue chart, top 5 salons by revenue (`src/pages/admin/AdminDashboard.jsx`). Build passes; dev server running in background (nohup, log /tmp/vite-dev.log).
- Session 4 (Sep 2026) — customer webapp polish + live deploy + multi-coder workflow:
  - **GitHub setup**: repo at https://github.com/brandsipdvg-glitch/stylebook — initialized, all code pushed to `main`, then made PUBLIC. Added `AGENTS.md` (tells every opencode session to read CONTEXT.md + git workflow). Added GitHub Pages LIVE deploy: https://brandsipdvg-glitch.github.io/stylebook/ (deploy = `npm run build` + `npx gh-pages -d dist -b gh-pages`). Owner `/salon` and admin `/admin` live at `#/salon`, `#/admin` on that URL.
  - **Gender gate**: full-screen logo + Men/Women choice on first open, persisted in `stylebook:gender` (`GenderContext`, `GenderGate`, wrapped in `main.jsx`; CustomerLayout gates app until chosen, desktop header switcher All/Men/Women).
  - **Customer search**: home hero search now **live salon search** — as you type, matching salons (name/area/city, gender-aware) render as big salon cards below the bar; Enter/"View all" → `/salons?q=...` (Salons page reads `?q` param now). Dropped the earlier dropdown idea per user.
  - **Correct per-style pricing in booking**: venue step 2 salon buttons show that style's price at each salon (`styleAtSalon`) instead of `startingPrice`; hairstyle detail "Starting from ₹cheapest at N salons" auto-links the cheapest salon; SalonCard accepts `styleId`/`styleName`; SalonProfile portfolio/services selectable with `?style=` pre-select; pinned bottom book bar shows exact price.
  - **Booking slot bugfixes** (`store.js` `getSalonSlots` + BookingFlow): slots were filtered by salon only, not date → yesterday's slots showed. Now filters by `salonId` AND `date`, and for today drops already-past times entirely. Switched all "today" comparisons from UTC (`toISOString`) to LOCAL date to avoid an off-by-one-day in IST. Same fix applied to SalonProfile's "Available today".
  - **Mobile UX**: removed the mobile top bar (brand + dark-mode toggle + hamburger) — bottom nav is the only chrome; bumped `.input` font-size to 16px so iOS doesn't zoom on tapping the search bar; shrunk home hero banner on mobile. Pinned bottom bars (booking flow, salon profile, hairstyle detail) were overlapping the bottom nav (nav is ~100px tall with iOS safe-area); those pages now HIDE the app bottom nav and their bar sits at the bottom edge (`bottom-4`).
  - Build passes clean + live site verified 200 after every change.

## Important notes
- Run `npm install` once before dev/build.
- Design tokens live in `tailwind.config.js`; global CSS utilities in `src/index.css`.
- This file is the source of truth across chats. Update it at the end of every session.