# Bug Report & Health Check

> Her dağıtım öncesi bu dosyayı güncelle. Tamamlananları işaretle.

## Otomatik Audit Komutu

Claude'a bu komutu ver:
```
Projedeki tüm sayfaları ve componentleri tara. Kırık importlar, kullanılmayan değişkenler,
çalışmayan butonlar, eksik error handling ve TypeScript hatalarını bul. Sonuçları
docs/04-BUG-REPORT.md dosyasına yaz.
```

---

## Kritik Hatalar 🔴

| # | Dosya | Satır | Hata | Durum |
|---|-------|-------|------|-------|
| 1 | — | — | — | ☐ |

## Orta Seviye Hatalar 🟡

| # | Dosya | Satır | Hata | Durum |
|---|-------|-------|------|-------|
| 1 | — | — | — | ☐ |

## Düşük Seviye / Kozmetik 🟢

| # | Dosya | Satır | Hata | Durum |
|---|-------|-------|------|-------|
| 1 | — | — | — | ☐ |

---

## Frontend Health Check

- [ ] Tüm sayfalar yükleniyor (404 yok)
- [ ] Tüm butonlar çalışıyor (onClick handler bağlı)
- [ ] Tüm formlar submit oluyor
- [ ] Tüm linkler doğru yere gidiyor
- [ ] Görseller yükleniyor (broken image yok)
- [ ] Loading state'ler gösteriliyor
- [ ] Error state'ler gösteriliyor
- [ ] Empty state'ler gösteriliyor
- [ ] Toast/notification çalışıyor
- [ ] Modal/dialog açılıp kapanıyor
- [ ] Navigation çalışıyor (back button dahil)
- [ ] Scroll doğru çalışıyor
- [ ] Keyboard mobilde input'u kapatmıyor

## Backend Health Check

- [ ] Supabase bağlantısı çalışıyor
- [ ] Auth flow çalışıyor (signup, login, logout, reset)
- [ ] Database CRUD operasyonları çalışıyor
- [ ] RLS politikaları doğru (yetkisiz erişim engelleniyor)
- [ ] Edge Functions çalışıyor
- [ ] Storage upload/download çalışıyor
- [ ] Real-time subscriptions çalışıyor (kullanılıyorsa)

## TypeScript Health

- [ ] `npm run build` hatasız
- [ ] Zero `any` types
- [ ] Zero unused imports
- [ ] Zero unused variables
- [ ] Zero type errors

## Mobile Health (Capacitor)

- [ ] `npx cap sync` hatasız
- [ ] iOS simulator'da çalışıyor
- [ ] Android emulator'da çalışıyor
- [ ] Safe area insets doğru
- [ ] Status bar styling doğru
- [ ] Splash screen gösteriliyor
- [ ] Deep link çalışıyor
- [ ] Push notification çalışıyor
- [ ] Camera/gallery çalışıyor (kullanılıyorsa)
- [ ] Keyboard davranışı doğru

---

## Audit Log

| Tarih | Yapan | Bulunan Hata | Düzeltilen | Kalan |
|-------|-------|-------------|------------|-------|
| — | — | — | — | — |

> Her audit sonrası bu tabloyu güncelle.
