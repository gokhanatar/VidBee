# Production Checklist — VidDownloadPro

> Son guncelleme: 2026-02-01
> Konfigurasyon: Supabase=Hayir | RevenueCat=Evet | Capacitor=Evet

---

## 1. Security

- [x] CSP header configured (index.html)
- [x] `webSecurity: true` (main/index.ts)
- [x] `unsafe-eval` removed from CSP
- [x] `sandbox: true` for renderer
- [x] `contextIsolation: true`, `nodeIntegration: false`
- [x] IPC channel whitelist (preload/index.ts — 15 channels)
- [x] `shell.openExternal` URL protocol validation (https/http only)
- [x] `execSync` runtime whitelist (ytdlp-manager.ts)
- [x] `.env` excluded from git, `.env.example` provided
- [x] No exposed API keys in source code

## 2. Error Handling

- [x] Route-level ErrorBoundary on all 4 pages + Paywall
- [x] 404 NotFoundPage (catch-all route)
- [x] Loading states on async operations (Settings, Paywall)
- [x] try/catch on all purchase/restore atoms (premium.ts)
- [x] Logger (electron-log) replaces all console.* in production

## 3. Capacitor / Mobile

- [x] `capacitor.config.ts` configured (appId: com.viddownloadpro.app)
- [x] `vite.config.web.ts` with alias stubs for Electron modules
- [x] `platform.ts` — isElectron(), isCapacitor(), getPlatform()
- [x] `ipc.ts` — `window.api?.` and `window.electron?.` guards
- [x] iOS and Android projects created
- [x] `build:web` + `cap:sync` scripts working
- [ ] N/A — Native plugin safe-area (not needed yet — no native-only UI)

## 4. RevenueCat / Payments

- [x] `revenuecat.ts` — 7 functions, all behind `Capacitor.isNativePlatform()`
- [x] `premium.ts` — Jotai atoms with try/catch + logger
- [x] `use-subscription-premium.ts` — hook with purchase/restore/billingIssue
- [x] `Paywall.tsx` — offerings, restore button, ToS/Privacy links
- [x] `PremiumGuard.tsx` — guard component for future gating
- [x] `BillingIssueBanner.tsx` — alert for billing issues

## 5. Firebase

- [x] `firebase.ts` — client init with anonymous auth
- [x] `functions/src/index.ts` — webhook handler (7 event types)
- [x] `firestore.rules` — user can read own subscription only
- [x] `.env.example` has all VITE_FIREBASE_* + VITE_REVENUECAT_* vars
- [x] CSP allows Firebase domains

## 6. i18n

- [x] 13 locales (en, ar, de, es, fr, id, it, ja, ko, pt, ru, zh, zh-TW)
- [x] All hardcoded strings moved to locale files
- [x] Premium keys added to all 13 locales
- [x] Brand name updated in all locale files

## 7. Code Quality

- [x] Zero `any` types in production code
- [x] No `console.log` in production code
- [x] No unused imports or dead code
- [x] No TODO/FIXME/placeholder comments
- [x] Dark mode compatible (muted classes, CSS variables)
- [x] Inline styles minimized (only data-driven percentages remain)

## 8. Brand

- [x] App name: VidDownloadPro (all references updated ~20 files)
- [x] App ID: com.viddownloadpro / com.viddownloadpro.app
- [x] Protocol: viddownloadpro://
- [x] DB filename: viddownloadpro.db
- [ ] Logo/favicon: app-icon.png needs custom design replacement

## 9. Accessibility

- [x] All `<img>` have alt attributes
- [x] Icon-only buttons have aria-label (title-bar, sidebar)
- [x] Focus rings configured (focus-visible:ring in Button component)
- [x] Keyboard navigation supported

## 10. Meta / SEO

- [x] `<title>` set to VidDownloadPro
- [x] `<meta name="description">` added
- [x] `<meta name="viewport">` added
- [x] Favicon linked

## 11. Build

- [x] `npm run build` — hatasiz (Electron)
- [x] `npm run build:web` — hatasiz (Capacitor)
- [x] Functions typecheck passes
- [ ] Main chunk 380KB gzipped (target < 200KB) — code splitting onerisi acik

---

## Kalan Isler

| # | Madde | Oncelik |
|---|-------|---------|
| 1 | Logo/favicon custom design | Yuksek |
| 2 | Code splitting (chunk size optimization) | Dusuk |
| 3 | Rybbit analytics site ID guncelleme | Orta |
| 4 | DownloadItem icon buttons aria-label ekleme | Dusuk |
