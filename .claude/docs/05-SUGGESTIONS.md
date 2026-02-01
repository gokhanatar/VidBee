# Suggestions — App Improvement Roadmap

> Uygulamayı üst düzeye taşımak için öneriler. Öncelik sırasına göre.
> Konfigürasyona göre ilgisiz maddeleri `N/A` işaretle.
> "Devam" workflow: Claude ilk [ ] maddeden başlar, tamamlar, durur.

## Tier 0: Absolute Requirements (Yayın Engeli)

- [ ] Tüm butonlar gerçek çalışıyor (placeholder/demo YASAK)
- [ ] "Coming soon" metni hiçbir yerde yok
- [ ] Tüm formlar submit oluyor ve sonuç veriyor
- [ ] Tüm linkler doğru yere gidiyor
- [ ] npm run build hatasız
- [ ] Zero TypeScript errors, zero console.log

## Tier 1: Must Have (Yayın Öncesi)

### Performance
- [ ] Route-based code splitting (`React.lazy` + `Suspense`)
- [ ] Image optimization pipeline (sharp/squoosh + WebP)
- [ ] React Query cache strategy (staleTime, gcTime ayarla)
- [ ] Bundle analyzer ile gereksiz dependency temizliği
- [ ] Service Worker (PWA cache, offline fallback)

### Security
- [ ] Supabase RLS audit (her tablo, her operasyon)
- [ ] Input sanitization layer (DOMPurify)
- [ ] Rate limiting on Edge Functions
- [ ] CSP (Content Security Policy) headers

### UX
- [ ] Skeleton loading her async component'te
- [ ] Optimistic updates (mutation sonrası anında UI güncelle)
- [ ] Pull-to-refresh (mobile)
- [ ] Haptic feedback on actions (Capacitor Haptics)
- [ ] Smooth page transitions (Framer Motion veya CSS)

## Tier 2: Should Have (v1.1)

### Analytics & Monitoring
- [ ] PostHog veya Mixpanel — user behavior tracking
- [ ] Sentry — crash reporting & error tracking
- [ ] Custom events: signup, purchase, feature_used
- [ ] Funnel analysis: onboarding → activation → purchase

### Growth
- [ ] Onboarding flow (3-4 screen, skip option)
- [ ] Push notification strategy (welcome, re-engage, promo)
- [ ] Deep linking (branch.io veya Firebase Dynamic Links)
- [ ] App Store Optimization (ASO) — screenshots, description
- [ ] Referral system (invite friends → reward)

### UX Polish
- [ ] Dark mode toggle + system preference
- [ ] Multi-language support (i18next)
- [ ] Accessibility audit (axe-core)
- [ ] Micro-animations (button press, card enter, list stagger)
- [ ] Gesture navigation (swipe back, swipe to delete)

## Tier 3: Nice to Have (v1.2+)

### Technical
- [ ] E2E tests (Playwright veya Cypress)
- [ ] Visual regression tests (Chromatic)
- [ ] CI/CD pipeline (GitHub Actions → build → test → deploy)
- [ ] Feature flags (LaunchDarkly veya custom)
- [ ] A/B testing framework

### Business
- [ ] In-app review prompt (after positive action)
- [ ] Customer support chat (Intercom, Crisp, veya custom)
- [ ] User feedback collection (in-app survey)
- [ ] Email marketing integration (Resend, SendGrid)
- [ ] Social sharing features

### Advanced UX
- [ ] Widget support (iOS WidgetKit, Android Widgets)
- [ ] Watch app (watchOS)
- [ ] Spotlight/Siri shortcuts (iOS)
- [ ] Material You dynamic colors (Android)
- [ ] Picture-in-Picture mode

---

## Implementation Priority Matrix

```
Impact ↑
  HIGH │  Security    Performance   Analytics
       │  RLS Audit   Code Split    Sentry
       │
  MED  │  Onboarding  Dark Mode     Push
       │  Skeleton    i18n          Deep Link
       │
  LOW  │  Widgets     E2E Tests     A/B Test
       │  Watch App   Feature Flag  Social
       ├──────────────────────────────────→ Effort
         LOW          MEDIUM         HIGH
```

> Sol üst köşeden başla. High Impact + Low Effort = Quick Wins.
