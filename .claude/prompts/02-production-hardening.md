# Prompt 02: Production Hardening

> Audit tamamlandıktan sonra bu promptu ver. Kritik sorunları düzeltir.
> Proje konfigürasyonuna göre ilgisiz adımları otomatik atlar.

---

## Prompt

```
docs/04-BUG-REPORT.md dosyasını oku. Önce "Proje Konfigürasyonu" bölümünü kontrol et.

Şimdi tüm Kritik (🔴) ve Orta (🟡) hataları düzelt.

Her düzeltme için:
1. Dosyayı oku
2. Minimal değişiklikle düzelt
3. docs/04-BUG-REPORT.md'de ilgili satırın durumunu ☐ → ☑ yap

Düzeltme öncelik sırası:
1. Güvenlik açıkları (exposed keys, Supabase = Evet ise missing RLS)
2. Runtime hataları (crash, undefined errors)
3. TypeScript hataları (any types, missing types)
4. Kullanılmayan kod (unused imports, dead code)
5. console.log temizliği

Ayrıca şunları ekle (yoksa):
- Global ErrorBoundary component
- 404 sayfası
- Loading skeleton component (reusable)
- Toast/notification setup (sonner veya react-hot-toast)

ÖNEMLİ — Proje Konfigürasyonuna göre:
- Supabase = Hayır → RLS, Edge Function, Supabase auth hatalarını atla
- RevenueCat = Hayır → Ödeme ile ilgili hataları atla
- Capacitor = Hayır → Native/mobile-specific hataları atla

Her değişikliği bitirdikçe docs/04-BUG-REPORT.md'yi güncelle.
Build'i çalıştır: npm run build — hatasız olmalı.
```

---

## Beklenen Çıktı
- Tüm kritik ve orta seviye hatalar düzeltilmiş
- `npm run build` hatasız çalışıyor
- Bug report güncellenmiş (☑ işaretli)
