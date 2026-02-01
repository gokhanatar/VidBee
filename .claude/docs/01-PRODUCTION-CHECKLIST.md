# Production Checklist

> Her maddeyi tamamladıkça `[ ]` → `[x]` yap.
> Konfigürasyona göre ilgisiz bölümleri `N/A` işaretle.

## 1. Security

- [ ] Tüm API anahtarları `.env` dosyasında (VITE_* prefix)
- [ ] `.env` dosyası `.gitignore`'da
- [ ] XSS koruması: kullanıcı input'u sanitize edilmiş
- [ ] Hassas veriler client-side'da loglanmıyor

### (Supabase = Evet ise)
- [ ] Supabase RLS (Row Level Security) tüm tablolarda aktif
- [ ] Auth token'lar sadece httpOnly cookie veya secure storage'da
- [ ] CORS doğru yapılandırılmış
- [ ] Rate limiting aktif (Supabase Edge Functions)

## 2. Performance

- [ ] Lazy loading tüm route'larda (`React.lazy` + `Suspense`)
- [ ] Görseller optimize (WebP, lazy load, srcset)
- [ ] Bundle size < 200KB gzipped (ana chunk)
- [ ] Lighthouse skoru > 90 (Performance, Accessibility, Best Practices)
- [ ] Gereksiz re-render yok (`React.memo`, `useMemo`, `useCallback`)
- [ ] API response'lar cache'lenmiş (React Query staleTime)
- [ ] Font preload yapılmış
- [ ] Critical CSS inline

## 3. Error Handling

- [ ] Global error boundary (`ErrorBoundary` component)
- [ ] Route-level error boundaries
- [ ] API error handling (try/catch + user-friendly mesajlar)
- [ ] 404 page mevcut
- [ ] Network error handling (offline state)
- [ ] Form validation hataları kullanıcıya gösterilir

### (Supabase = Evet ise)
- [ ] Supabase auth hataları handle edilmiş

## 4. Mobile Ready

- [ ] Viewport meta tag doğru: `width=device-width, initial-scale=1, viewport-fit=cover`
- [ ] Touch targets minimum 44x44px
- [ ] No hover-only interactions (touch-friendly)

### (Capacitor = Evet ise)
- [ ] Safe area insets: `env(safe-area-inset-top)` etc.
- [ ] Splash screen yapılandırılmış
- [ ] App icon tüm boyutlarda hazır
- [ ] Status bar styling
- [ ] Deep linking yapılandırılmış
- [ ] Push notification altyapısı

## 5. Code Quality

- [ ] TypeScript strict mode aktif
- [ ] Zero `any` types
- [ ] Zero unused imports/variables
- [ ] Zero console.log (prod build'de)
- [ ] Consistent naming convention (camelCase vars, PascalCase components)
- [ ] No magic numbers (constants file kullan)
- [ ] Proper TypeScript interfaces for all data models

## 6. UX Essentials

- [ ] Loading skeletons tüm async content'te
- [ ] Toast/notification sistemi çalışıyor
- [ ] Form submit'te loading state
- [ ] Smooth page transitions
- [ ] Empty state'ler tasarlanmış

### (Capacitor = Evet ise)
- [ ] Pull-to-refresh (mobile)
- [ ] Haptic feedback (Capacitor native)

## 7. Payments (RevenueCat = Evet ise — refund ZORUNLU)

> Refundsız RevenueCat entegrasyonu eksik kabul edilir. Tüm maddeler tamamlanmalı.

### Temel Kurulum
- [ ] RevenueCat service dosyası (`src/services/revenuecat.ts`)
- [ ] useSubscription hook çalışıyor
- [ ] App.tsx'de `initRevenueCat()` + `identifyUser()` bağlı
- [ ] Paywall sayfası hazır (paketler, fiyatlar, purchase butonu)
- [ ] Restore Purchases butonu var (Apple zorunlu kılıyor)
- [ ] Premium guard component var (isPremium → paywall redirect)
- [ ] `.env` dosyasında API key'ler var (iOS + Android)

### Refund & Cancellation (ZORUNLU)
- [ ] Webhook handler kurulu (`supabase/functions/revenuecat-webhook/`)
- [ ] INITIAL_PURCHASE event → erişim açılıyor
- [ ] RENEWAL event → erişim uzatılıyor
- [ ] CANCELLATION event → erişim kapatılıyor + refund_logs'a yazılıyor
- [ ] EXPIRATION event → erişim kapatılıyor
- [ ] BILLING_ISSUE event → billing_issue flag açılıyor
- [ ] PRODUCT_CHANGE event → plan güncelleniyor
- [ ] UNCANCELLATION event → erişim tekrar açılıyor
- [ ] `refund_logs` tablosu oluşturulmuş + RLS aktif
- [ ] `subscriptions` tablosunda `billing_issue` kolonu var
- [ ] BillingIssueBanner component eklendi (ödeme sorunu uyarısı)
- [ ] RevenueCat Dashboard'da webhook URL + events ayarlandı

### Test
- [ ] Sandbox purchase test yapıldı
- [ ] Sandbox refund/cancellation test yapıldı
- [ ] BillingIssueBanner tetiklendi ve göründü

## 8. SEO & Meta

- [ ] Title ve description her sayfada
- [ ] Open Graph tags
- [ ] Favicon ve app icons
- [ ] robots.txt (web deploy ise)
- [ ] sitemap.xml (web deploy ise)

## 9. Pre-Deploy

- [ ] `npm run build` hatasız çalışıyor
- [ ] Environment variables production'a set edilmiş

### (Capacitor = Evet ise)
- [ ] `npx cap sync` başarılı
- [ ] App Store / Play Store listing hazır

### Genel
- [ ] Analytics entegrasyonu aktif
- [ ] Crash reporting aktif (Sentry veya benzeri)
