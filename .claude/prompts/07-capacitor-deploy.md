# Prompt 07: Capacitor Deploy — Xcode & Android Studio

> Son adım. Uygulamayı native projeye çevir.
> KOŞUL: docs/04-BUG-REPORT.md'de "Capacitor: Evet" ise çalıştır. Hayır ise atla.

---

## Prompt

```
Önce docs/04-BUG-REPORT.md'deki "Proje Konfigürasyonu" bölümünü oku.
Capacitor = Hayır ise bu adımı tamamen atla, bana "Capacitor atlandı, proje web-only olarak hazır" de.

Capacitor = Evet ise:

docs/06-DEPLOY-MOBILE.md dosyasını oku.

Şimdi uygulamayı Capacitor ile mobile deploy'a hazırla:

1. CAPACITOR KURULUM (yoksa):
   npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
   npx cap init (appId ve appName ile)

2. CAPACITOR CONFIG:
   capacitor.config.ts oluştur veya güncelle:
   - appId: com.yourcompany.appname (bana sor)
   - webDir: dist
   - Plugins: SplashScreen, StatusBar, Keyboard
   - iOS ve Android özel ayarlar

3. ESSENTIAL PLUGINS:
   npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard @capacitor/haptics @capacitor/app
   npx cap sync

4. SAFE AREA CSS:
   Tüm sayfalarda safe area insets ekle:
   - Top: env(safe-area-inset-top)
   - Bottom: env(safe-area-inset-bottom)
   - Navigation bar padding
   - Tab bar padding

5. MOBILE-SPECIFIC CODE:
   - Status bar configuration (App mount'ta)
   - Keyboard handling
   - Back button handling (Android)
   - App state change listener (background/foreground)
   - Splash screen hide (app ready olunca)

6. BUILD & SYNC:
   npm run build
   npx cap sync

7. NATIVE PROJECTS:
   npx cap add ios (yoksa)
   npx cap add android (yoksa)

8. FINAL CHECK:
   - Build hatasız
   - Sync hatasız
   - capacitor.config.ts doğru

Bittikten sonra bana şunu söyle:
"Native projeler hazır. Şimdi şu adımları manuel yapman gerekiyor:"
ve docs/06-DEPLOY-MOBILE.md'deki Manuel Yapman Gerekenler listesini özetle.
```

---

## Beklenen Çıktı
- Capacitor kurulu ve yapılandırılmış
- Essential plugins yüklü
- Safe area CSS eklenmiş
- Mobile-specific kod eklenmiş
- Build ve sync hatasız
- Manuel adımlar listesi verilmiş

---

## Sonraki Adımlar (Manuel)

Bu adımdan sonra sen devam edeceksin:
1. `npx cap open ios` → Xcode'da signing, icons, capabilities
2. `npx cap open android` → Android Studio'da signing, icons
3. TestFlight / Internal Testing'e yükle
4. Test et
5. Store'a gönder
