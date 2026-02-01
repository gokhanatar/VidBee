# Prompt 01: Initial Audit — Lovable Export Analizi

> Bu promptu Claude Code'a Lovable projesini import ettikten sonra ilk adım olarak ver.
> Claude önce 3 soru sorar → cevaplarına göre tüm pipeline'ı özelleştirir.

---

## Prompt

```
docs/01-PRODUCTION-CHECKLIST.md ve docs/02-UI-UX-STANDARDS.md dosyalarını oku.

Ama önce bana şu soruları sor ve cevaplarımı bekle (hiçbir işlem yapma, sadece sor):

1. Bu projede Supabase backend kullanılacak mı? (Evet/Hayır)
2. Bu projede RevenueCat ödeme sistemi kullanılacak mı? (Evet/Hayır)
3. Bu proje Capacitor ile mobil uygulamaya dönüştürülecek mi? (Evet/Hayır)

Cevaplarıma göre bu kuralları uygula — sadece bu session değil, TÜM sonraki promptlarda:
- Supabase = Hayır → Auth, DB, RLS, Edge Function, webhook adımlarını tamamen atla.
- RevenueCat = Hayır → Ödeme, subscription, paywall, refund adımlarını tamamen atla.
- Capacitor = Hayır → Safe area, native plugin, status bar, splash screen adımlarını tamamen atla.

Cevaplarımı aldıktan sonra şu analizi yap:

1. PROJE YAPISI: src/ altındaki tüm dosyaları listele. Kaç sayfa, kaç component, kaç hook, kaç servis var?

2. TEKNİK BORÇ: Lovable export sonrası düzeltilmesi gereken sorunları bul:
   - Inline styles → Tailwind'e çevrilecekler
   - Hardcoded renkler → CSS variable'a taşınacaklar
   - any type kullanımları
   - Kullanılmayan import/değişkenler
   - console.log satırları
   - Eksik error boundary'ler
   - Eksik loading state'ler
   - Eksik TypeScript type'lar

3. GÜVENLİK: API key'ler exposed mı? .env kullanılıyor mu? (Supabase = Evet ise) RLS var mı?

4. SONUÇ: Bulunan her sorunu docs/04-BUG-REPORT.md dosyasına yaz. Kritik/Orta/Düşük olarak sınıflandır.

Sadece analiz yap, henüz hiçbir şeyi değiştirme. Raporu docs/04-BUG-REPORT.md'ye yaz.
Cevaplarımı da bu dosyanın en üstüne "Proje Konfigürasyonu" başlığı altında kaydet:
- Supabase: Evet/Hayır
- RevenueCat: Evet/Hayır
- Capacitor: Evet/Hayır

Bu konfigürasyon sonraki tüm promptlarda referans olarak kullanılacak.
```

---

## Beklenen Çıktı
- Claude önce 3 soru soracak, cevapları bekleyecek
- Cevaplara göre tüm pipeline özelleşecek
- `docs/04-BUG-REPORT.md` güncellenmiş olacak (en üstte proje konfigürasyonu + hata listesi)
- Hiçbir dosya değiştirilmemiş olacak (sadece analiz)
