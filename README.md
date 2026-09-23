# StyleBook — Salon Booking Platform

**Choose Your Style. Book Your Slot. Skip The Wait.**

A production-ready, mobile-first salon booking platform built with React + Vite + Tailwind + Firebase. It ships with rich demo data and three role-based apps in one codebase:

| App | Route | Role |
|---|---|---|
| Customer App | `/` | Browse hairstyles → discover salons → pick slot → book |
| Salon Owner Dashboard | `/salon` | Accept bookings, manage slots/services/portfolio |
| Admin Panel | `/admin` | Manage salons, users, bookings & platform stats |

## ✨ Features

- **Customer**: 20 hairstyle gallery (Men/Women), salon discovery with filters (rating, service, gender, sort), salon profiles, 6-step booking flow, bookings dashboard, favourites, phone + email auth, forgot password.
- **Owner**: live stats, booking accept/complete/cancel, service management, slot + working hours + holiday management, portfolio uploads (before/after), salon profile editing.
- **Admin**: KPIs, salon feature/verify/delete, user role management, all-bookings overview, hairstyle catalogue.
- **UX**: loading skeletons, toasts, empty/error states, bottom mobile nav, desktop header, dark mode, bottom sheets, success screens.

## 🚀 Quick start

```bash
npm install
npm run dev
```

The app runs in **Demo Mode** by default with seeded data (10 salons, 20 hairstyles, 50 users, 100 bookings, 50 reviews, 20 slots/salon/day) stored in `localStorage`. Everything works without any backend.

Use the **“Instant demo access”** buttons on the login screens:
- **Customer** → seeded bookings & favourites
- **Salon Owner** → `Modern Men's Salon` dashboard
- **Admin** → full platform view

## 🔥 Enable Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password, Phone), **Cloud Firestore**, **Storage**.
3. Copy `.env.example` → `.env` and fill in your web-app config keys.
4. Seed the database:
   ```bash
   npm i -D firebase-admin
   # download service account key to ./serviceAccountKey.json
   VITE_FIREBASE_PROJECT_ID=<project-id> npm run seed
   ```
5. Restart `npm run dev`. The app now uses Firestore + Firebase Auth (new logins auto-appear in the Admins → Users list as `customer`). Admin/owner roles can be granted there.

### Firestore structure

```
users      { id, name, email, phone, role, avatar, createdAt }
salons     { id, name, logo, cover, rating, description, address, services[], portfolio[], slots, openingHours, holidays, featured, verified, ... }
hairstyles { id, name, gender, price, duration, popular, tags, image, description }
bookings   { id, salonId, salonName, userId, userName, phone, hairstyleId, hairstyleName, price, date, time, slotId, status }
reviews    { id, salonId, userId, userName, userAvatar, rating, text, date }
favorites  { id, userId, salonId, hairstyleId, type }
slots      { id, salonId, date, time, available, booked }
```

## 🌍 Deploy to GitHub Pages

1. Set the repo URL in `package.json` (`"homepage"`).
2. Build & publish:
   ```bash
   npm run deploy
   ```
   (Builds with Vite and pushes `dist/` to the `main` branch. HashRouter is used so deep links never 404 on static hosting.)

## 🧰 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run seed` | Seed Firestore with demo data |
| `npm run deploy` | Build + deploy to GitHub Pages |

## 📁 Structure

```
src/
  firebase/    config + db/auth/storage init
  lib/         demo data, data layer (Firestore ⇄ localStorage), auth layer
  context/     Auth, Toast, Theme providers
  components/  shared UI (cards, sheets, skeletons, layouts shells)
  layouts/     Customer / Owner / Admin layouts + nav
  pages/
    customer/  landing, gallery, salons, booking flow, dashboard, auth
    owner/     dashboard, bookings, services, slots, portfolio, profile
    admin/     dashboard, salons, users, bookings, hairstyles
  hooks/       useOwnerSalon
scripts/       Firestore seed script
```