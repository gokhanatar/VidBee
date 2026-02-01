# Prompt 05: Bug Fix Cycle

> Önceki adımlar sonrası bu promptu ver. Tüm kalan hataları temizler.
> Proje konfigürasyonuna göre ilgisiz kontrolleri otomatik atlar.
> "Devam" workflow: her hatayı tek tek düzeltir, [x] işaretler, durur, "devam" bekler.

---

## Prompt

```
Önce docs/04-BUG-REPORT.md'deki "Proje Konfigürasyonu" bölümünü oku.
Konfigürasyona göre ilgisiz sistemleri (Supabase/RevenueCat/Capacitor) atla.

Tüm projeyi baştan sona tara ve her sorunu bul. Bulunan sorunları
docs/04-BUG-REPORT.md'ye Kritik/Orta/Düşük olarak yaz.

Sonra İLK [ ] hata maddesini al, düzelt, [x] işaretle, DUR.
Ben "devam" deyince sıradaki [ ] maddeye geç.

Tarama kontrolleri:

1. BUILD CHECK:
   npm run build çalıştır. Hata varsa düzelt. Hatasız olana kadar.

2. TYPE CHECK:
   - any type → proper type
   - Missing return types
   - Implicit any parameters
   - Unused variables/imports → sil

3. DEAD CODE:
   - Hiçbir yerden import edilmeyen component/hook/util → sil
   - Commented-out code blocks → sil
   - console.log → sil (hepsini)
   - TODO/FIXME comments → ya düzelt ya sil
   - "Coming soon" / placeholder text → gerçek implementasyon veya kaldır

4. IMPORT CHECK:
   - Circular imports var mı? Çöz.
   - Missing imports → ekle
   - Unused imports → sil

5. RUNTIME CHECK:
   Her sayfayı zihinsel olarak "çalıştır":
   - Bu sayfa mount olduğunda crash olur mu?
   - useEffect dependency array doğru mu?
   - Async operasyonlar error handling ile sarılı mı?
   - State güncellemeleri unmounted component'te olur mu? (cleanup)

6. BUTTON/LINK CHECK:
   Tüm onClick, onSubmit, href bağlantılarını kontrol et:
   - onClick handler tanımlı mı yoksa undefined mı?
   - Link'ler doğru route'a gidiyor mu?
   - Submit fonksiyonları tanımlı ve çalışır mı?
   - Hiçbir buton boş olmamalı. Tümü gerçek çalışmalı.

7. RAPOR:
   Bulunan ve düzeltilen her şeyi docs/04-BUG-REPORT.md'ye yaz.
   Audit Log tablosunu güncelle.

npm run build → hatasız olmalı.
```

---

## "Devam" ile Kullanım

```
İlk kez: Yukarıdaki promptu ver.
Sonra: "devam" de → sıradaki hatayı düzeltir.
Tekrar: "devam" de → bir sonraki.
Ta ki tüm [ ] maddeler [x] olana kadar.
```
