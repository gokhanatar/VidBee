# Prompt 04: RevenueCat Integration (Refund ZORUNLU)

> UI/UX polish tamamlandıktan sonra bu promptu ver.
> KOŞUL: docs/04-BUG-REPORT.md'de "RevenueCat: Evet" ise çalıştır. Hayır ise atla.
> ÖNEMLİ: Refund & cancellation sistemi opsiyonel DEĞİL, ZORUNLUDUR. Refundsız RevenueCat eksik kabul edilir.

---

## Prompt — Tam Kurulum (Refund ZORUNLU)

```
Önce docs/04-BUG-REPORT.md'deki "Proje Konfigürasyonu" bölümünü oku.
RevenueCat = Hayır ise bu adımı tamamen atla, bana "RevenueCat atlandı" de.

RevenueCat = Evet ise:

docs/03-REVENUECAT-SETUP.md dosyasını oku (Section 1-8 TAMAMI — refund zorunlu).

Bu rehbere göre TAM RevenueCat entegrasyonunu yap (refund dahil, refundsız bırakma):

1. PAKET KURULUMU:
   npm install @revenuecat/purchases-capacitor
   npx cap sync

2. SERVİS DOSYASI:
   src/services/revenuecat.ts oluştur (dokümandaki kodu kullan).
   Fonksiyonlar: initRevenueCat, getOfferings, purchasePackage, restorePurchases, checkSubscription, identifyUser, logoutRevenueCat

3. HOOK:
   src/hooks/useSubscription.ts oluştur (dokümandaki kodu kullan).
   Return: isPremium, offerings, loading, purchase, restore

4. APP ENTEGRASYONU:
   App.tsx (veya ana layout) içinde initRevenueCat() çağır.
   Auth state değiştiğinde identifyUser / logoutRevenueCat çağır.

5. PAYWALL SAYFASI:
   Eğer yoksa basit bir paywall sayfası oluştur:
   - Offering paketlerini göster (monthly, yearly)
   - Fiyatları göster
   - Purchase butonu
   - Restore Purchases butonu (Apple zorunlu kılıyor)
   - Loading ve error state'ler
   - Terms of Service ve Privacy Policy linkleri

6. PREMIUM GUARD:
   Premium içerik için basit bir guard/wrapper component oluştur.
   isPremium false ise paywall'a yönlendir.

7. REFUND & CANCELLATION SİSTEMİ:
   docs/03-REVENUECAT-SETUP.md Section 7'yi uygula:
   - supabase/functions/revenuecat-webhook/index.ts oluştur
   - Handle: INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, BILLING_ISSUE, PRODUCT_CHANGE, UNCANCELLATION
   - Cancellation/refund → is_active = false + refund_logs tablosuna kaydet
   - refund_logs tablosu SQL'i hazırla
   - subscriptions tablosuna billing_issue kolonu ekle
   - BillingIssueBanner component oluştur → ana layout'a ekle

8. ENV VARIABLES (.env.example'a ekle):
   VITE_REVENUECAT_IOS_KEY=appl_xxxxx
   VITE_REVENUECAT_ANDROID_KEY=goog_xxxxx
   REVENUECAT_WEBHOOK_KEY=your_webhook_secret

Build'i kontrol et: npm run build
```

---

## Beklenen Çıktı
- RevenueCat service + hook oluşturulmuş
- App.tsx entegrasyonu eklenmiş
- Paywall sayfası hazır (restore butonu dahil)
- Premium guard component hazır
- Webhook handler + refund sistemi hazır
- BillingIssueBanner component hazır
- `.env.example` güncellenmiş
- Build hatasız

---

## Sadece Refund Eklemek İçin Prompt

> Zaten RevenueCat kurulu ama refund sistemi eksik olan projeler için:

```
docs/03-REVENUECAT-SETUP.md dosyasını oku, Section 7 (Refund & Cancellation Handling).

Projeye refund ve cancellation sistemi ekle:

1. WEBHOOK HANDLER:
   supabase/functions/revenuecat-webhook/index.ts oluştur.
   Handle edilecek event'ler:
   - INITIAL_PURCHASE → is_active = true
   - RENEWAL → is_active = true, expires_at güncelle
   - CANCELLATION → is_active = false + refund_logs'a kaydet
   - EXPIRATION → is_active = false
   - BILLING_ISSUE → billing_issue = true
   - PRODUCT_CHANGE → entitlement güncelle
   - UNCANCELLATION → is_active = true

2. DATABASE:
   SQL migration hazırla:
   - refund_logs tablosu (user_id, reason, original_transaction_id, refund_at)
   - subscriptions tablosuna billing_issue boolean kolonu
   - RLS politikaları

3. BILLING ISSUE BANNER:
   src/components/BillingIssueBanner.tsx oluştur.
   Supabase'den billing_issue kontrolü yap. true ise kırmızı alert göster.
   Ana layout'a ekle.

4. REVENUECAT DASHBOARD (bana talimat ver, ben manuel yapacağım):
   - Webhook URL nereye girilecek
   - Hangi event'ler seçilecek
   - Authorization header ne olacak

Build'i kontrol et: npm run build
```
