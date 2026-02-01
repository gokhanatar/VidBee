# Proje Konfigurasyonu

- **Supabase:** Hayir
- **RevenueCat:** Evet
- **Capacitor:** Evet

---

# Initial Audit Report -- VidDownloadPro -> Yeni Marka

> Tarih: 2026-02-01
> Durum: Electron desktop app -> Capacitor mobile app donusumu planlanıyor
> Mevcut Versiyon: v1.2.2 (VidDownloadPro)

---

## Proje Yapisi

| Kategori | Sayi |
|----------|------|
| Sayfalar (pages/) | 4 (Home, Settings, Subscriptions, About) |
| Componentler (non-UI) | 17 |
| UI Componentleri (shadcn/ui) | 30 |
| Toplam Component | 47 |
| Custom Hooks | 4 |
| State Stores (Jotai) | 5 |
| Lib/Utils | 3 |
| Shared Types | 2 |
| Main Process Services | 10 |
| Main Process Libraries | 17 |
| i18n Dil Dosyalari | 13 |
| Toplam TS/TSX Dosya | ~130+ |

**Mimari:** Electron + React 19 + TypeScript + Vite + Tailwind + shadcn/ui + Jotai + Drizzle/SQLite

---

## Kritik Notlar -- Capacitor Donusumu

- [ ] Proje su an **Electron** tabanli. Capacitor donusumu icin Electron main process tamamen degistirilmeli
- [ ] `electron-store`, `better-sqlite3`, `electron-log`, `electron-updater` gibi Electron-spesifik bagimliliklar Capacitor alternatifleriyle degistirilmeli
- [ ] IPC sistemi (src/main/ipc/) tamamen Capacitor plugin yapisina donusturulmeli
- [ ] yt-dlp ve ffmpeg native binary'leri mobilde calismaz -- alternatif cozum (sunucu tarafli indirme veya native plugin) gerekli

---

## Bug Listesi

### KRITIK

- [x] **[K01] Electron -> Capacitor Donusumu Gerekli** ✅
  - Capacitor altyapisi kuruldu: `capacitor.config.ts`, `vite.config.web.ts`
  - Platform abstraction: `platform.ts`, stub modules for web builds
  - `ipc.ts` guarded with `?.` for Capacitor compatibility
  - iOS ve Android projeleri olusturuldu
  - `npm run build:web` + `npx cap sync` calisir durumda
  - NOT: Tam IPC migration (download engine vb.) ayri task olarak kalir

- [x] **[K02] RevenueCat Entegrasyonu Yok** ✅
  - RevenueCat service: `src/renderer/src/services/revenuecat.ts`
  - Jotai store: `src/renderer/src/store/premium.ts`
  - Hook: `src/renderer/src/hooks/use-subscription-premium.ts`
  - Paywall sayfasi: `src/renderer/src/pages/Paywall.tsx` (restore butonu dahil)
  - PremiumGuard: `src/renderer/src/components/PremiumGuard.tsx`
  - Firebase entegrasyonu: `src/renderer/src/lib/firebase.ts` (anonymous auth)
  - Webhook handler: `functions/src/index.ts` (7 event type)
  - Firestore rules + refund_logs collection
  - BillingIssueBanner component
  - `.env.example` guncellendi

- [x] **[K03] Marka Degisikligi (VidDownloadPro -> VidDownloadPro)** ✅
  - Tum VidDownloadPro/viddownloadpro referanslari degistirildi (~20 dosya)
  - package.json, capacitor.config.ts, electron-builder.yml, dev-app-update.yml
  - shared/constants.ts (APP_PROTOCOL), database-path.ts, index.ts, tray.ts, settings.ts
  - sidebar.tsx, ErrorPage.tsx, FeedbackLinks.tsx, About.tsx, Paywall.tsx
  - args-builder.ts, download-engine.ts, watermark-utils.ts, remote-image.tsx
  - 13 locale dosyasi guncellendi
  - NOT: Logo/favicon asset dosyalari (app-icon.png) ayri olarak degistirilmeli

### ORTA

- [x] **[O01] Sayfa Bazli Error Boundary Eksik** ✅
  - Her 4 route icin ayri ErrorBoundary + PageErrorFallback eklendi (`App.tsx`)
  - 404 NotFoundPage eklendi (catch-all route)
  - i18n keyleri: `error.pageError`, `error.notFound`

- [x] **[O02] console.* Production Kodda (51 adet)** ✅
  - Tum renderer `console.error/warn/info` -> `logger` ile degistirildi (~15 dosya)

- [x] **[O03] Hardcoded UI Stringleri -- i18n Eksik** ✅
  - `Settings.tsx`: 7 hata mesaji -> `t('settings.settingLoadError')` / `t('settings.saveError')`
  - `DownloadChart.tsx`: `'en-US'` -> `i18n.language`, tooltip i18n'e tasinidi
  - `ErrorPage.tsx`: Teknik debug raporu -- Ingilizce kalması kabul edildi (GitHub issue icerigi)
  - `FeedbackLinks.tsx`: GitHub/Twitter sabitleri -- Ingilizce kalması kabul edildi
  - 12 locale dosyasina tum yeni keyler eklendi

- [x] **[O04] Guvenlik: webSecurity: false** ✅
  - `webSecurity: true` olarak degistirildi (`src/main/index.ts`)

- [x] **[O05] Guvenlik: CSP 'unsafe-eval' Iceriyor** ✅
  - `'unsafe-eval'` CSP'den kaldirildi (`src/renderer/index.html`)

- [x] **[O06] Guvenlik: Local API Wildcard CORS** -- By Design
  - Loopback-only + one-time token guvenlik modeli yeterli
  - Browser extension uyumlulugu icin wildcard CORS gerekli

- [x] **[O07] Guvenlik: execSync Template Literal** ✅
  - `ALLOWED_JS_RUNTIMES` whitelist eklendi (`ytdlp-manager.ts`)
  - Gecersiz runtime reddedilir

- [x] **[O08] .gitignore .env* Pattern Eksik** ✅
  - `.env`, `.env.*`, `!.env.example` eklendi

### DUSUK

- [x] **[D01] Inline Styles (5 adet)** ✅
  - `PlaylistDownloadGroup.tsx:151` -- Tailwind `grid-rows-[1fr/0fr]` ile degistirildi
  - `DownloadChart.tsx:71-88` -- Dynamic percentage heights, inline zorunlu (kabul edilebilir)
  - `progress.tsx:19` -- shadcn/ui standard (kabul edilebilir)

- [x] **[D02] `any` Type Kullanimi (1 adet)** ✅
  - `ElectronStoreInstance<AppSettings>` interface eklendi, `any` kaldirildi

- [x] **[D03] Dead Code: use-ipc-example.ts** ✅
  - Dosya silindi

- [x] **[D04] Settings.tsx Loading State Eksik** ✅
  - `loadSettings()` + `fetchPlatform()` birlestirildi, `isLoading` state eklendi
  - Yukleme sirasinda Loader2 spinner gosteriliyor

- [x] **[D08] Dark Theme Uyumsuzlugu** ✅
  - `hover:bg-neutral-100` -> `hover:bg-muted` olarak degistirildi

- [x] **[D05] Guvenlik: shell.openExternal URL Dogrulamasi Yok** ✅
  - Her iki noktaya `https:`/`http:` protokol whitelist eklendi
  - Diger protokoller (file:, javascript: vb.) engellendi

- [x] **[D06] Guvenlik: Preload IPC Channel Whitelist Yok** ✅
  - `ALLOWED_CHANNELS` whitelist eklendi (15 kanal)
  - Whitelist disindaki kanallar sessizce engellenir

- [x] **[D07] Guvenlik: sandbox: false** ✅
  - `sandbox: true` olarak degistirildi, preload electron-vite ile bundle edildigi icin uyumlu

- ~~[D08] Dark Theme Uyumsuzlugu~~ (yukarida isaretlendi)

### SCAN BULGULARI (Prompt 05)

- [x] **[S01] KRITIK: ipc.ts:28 window.electron?.ipcRenderer eksik** ✅
  - `window.electron.ipcRenderer` -> `window.electron?.ipcRenderer` (Capacitor crash onlendi)

- [x] **[S02] ORTA: premium.ts purchaseAtom/restoreAtom try/catch eksik** ✅
  - Her iki atom'a try/catch + logger.error eklendi

---

## Ozet

| Seviye | Sayi |
|--------|------|
| Kritik | 3 |
| Orta | 8 |
| Dusuk | 8 |
| **Toplam** | **19** |

**En Kritik Karar:** Bu proje Electron tabanli bir desktop uygulama. Capacitor mobile app'e donusum buyuk bir mimari degisiklik gerektirecek. Electron main process (download engine, yt-dlp, ffmpeg, sqlite, file system) tamamen yeniden tasarlanmali.
