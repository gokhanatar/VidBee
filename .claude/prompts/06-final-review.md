# Prompt 06: Final Review — Production Sign-Off

> Tüm düzeltmeler ve entegrasyonlar bittikten sonra bu promptu ver. Son kontrol.

---

## Prompt

```
docs/01-PRODUCTION-CHECKLIST.md ve docs/04-BUG-REPORT.md dosyalarını oku.
Önce "Proje Konfigürasyonu" bölümünü kontrol et.
Konfigürasyona göre ilgisiz maddeleri "N/A" işaretle (Supabase/RevenueCat/Capacitor = Hayır ise).

Bu checklist'i madde madde kontrol et. Her madde için:
- Zaten tamamsa → ☑ işaretle
- Eksikse → düzelt, sonra ☑ işaretle
- Uygulanamıyorsa → not düş

Ek kontroller:

1. ENVIRONMENT:
   - .env.example dosyası güncel mi? Tüm değişkenler listeli mi?
   - .gitignore'da .env, node_modules, dist, ios/, android/ var mı?

2. PACKAGE.JSON:
   - scripts doğru mu? (dev, build, preview, cap:sync)
   - Gereksiz dependency var mı? Sil.

3. ACCESSIBILITY:
   - Tüm img'de alt text
   - Tüm interactive element'te aria-label veya visible text
   - Focus ring visible
   - Keyboard navigation çalışıyor

4. SEO/META:
   - index.html'de title, description, og:tags
   - Favicon var mı?

5. FINAL BUILD:
   npm run build → hatasız
   Dist klasörü boyutunu kontrol et. Ana chunk < 200KB gzipped?

Sonuç raporu:
- docs/01-PRODUCTION-CHECKLIST.md tamamen güncellenmiş
- docs/04-BUG-REPORT.md final durumu
- Kalan sorunlar (varsa) listesi

Bu adım sonrası uygulama PRODUCTION-READY olmalı.
```

---

## Beklenen Çıktı
- Production checklist tamamen ☑
- Build hatasız, boyut optimize
- Final rapor hazır
- Uygulama deploy edilmeye hazır
