# Quick Start — Lovable → Deploy Pipeline

## Adım 0: Hazırlık

```bash
# Lovable projesini klonla
git clone <lovable-proje-url> my-app
cd my-app

# Bu repodan dosyaları kopyala
# CLAUDE.md, docs/, prompts/, templates/ → proje kök dizinine
```

## Adım 1: Claude Code Başlat

```bash
claude
```
Claude otomatik olarak `CLAUDE.md` dosyasını okur.

## Adım 2: Sırayla Bu Promptları Ver

### Prompt 1 — Initial Audit
```
prompts/01-initial-audit.md dosyasını oku ve içindeki promptu uygula.
```

### Prompt 2 — Production Hardening
```
prompts/02-production-hardening.md dosyasını oku ve içindeki promptu uygula.
```

### Prompt 3 — UI/UX Polish
```
prompts/03-ui-ux-polish.md dosyasını oku ve içindeki promptu uygula.
```

### Prompt 4 — RevenueCat Integration
```
prompts/04-revenuecat-setup.md dosyasını oku ve içindeki promptu uygula.
```

### Prompt 5 — Bug Fix Cycle
```
prompts/05-bug-fix-cycle.md dosyasını oku ve içindeki promptu uygula.
```

### Prompt 6 — Final Review
```
prompts/06-final-review.md dosyasını oku ve içindeki promptu uygula.
```

### Prompt 7 — Capacitor Deploy
```
prompts/07-capacitor-deploy.md dosyasını oku ve içindeki promptu uygula.
```

## Adım 3: Manuel İşlemler (Xcode & Android Studio)

Prompt 7 tamamlandıktan sonra:

```bash
# iOS
npx cap open ios
# → Xcode'da: Signing, Icons, Capabilities ayarla
# → Product → Archive → App Store Connect

# Android
npx cap open android
# → Android Studio'da: Signing Key, Icons ayarla
# → Build → Generate Signed Bundle
# → Play Console'a yükle
```

Detaylı manuel adımlar: `docs/06-DEPLOY-MOBILE.md`

## İpuçları

- Her prompt arasında `npm run build` çalışıyor mu kontrol et
- Bug report'u takip et: `docs/04-BUG-REPORT.md`
- İyileştirme fikirleri: `docs/05-SUGGESTIONS.md`
- Release öncesi: `templates/health-check.md` doldur
