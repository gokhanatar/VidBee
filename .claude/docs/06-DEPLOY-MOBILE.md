# Mobile Deployment Guide — Xcode & Android Studio

> Capacitor ile Lovable projesini native uygulamaya çevirme rehberi.

## Ön Hazırlık

### Gerekli Hesaplar
- [ ] Apple Developer Account ($99/yıl) — https://developer.apple.com
- [ ] Google Play Developer Account ($25 tek seferlik) — https://play.google.com/console
- [ ] RevenueCat Account — https://app.revenuecat.com

### Gerekli Araçlar
- [ ] Xcode 15+ (Mac gerekli)
- [ ] Android Studio Hedgehog+
- [ ] Node.js 18+
- [ ] CocoaPods (`sudo gem install cocoapods`)
- [ ] JDK 17

---

## Adım 1: Capacitor Kurulumu

```bash
# Capacitor paketlerini yükle
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Capacitor config oluştur (zaten varsa atla)
npx cap init "AppName" "com.yourcompany.appname" --web-dir dist

# Uygulamayı build et
npm run build

# Native projeleri ekle
npx cap add ios
npx cap add android

# Sync et
npx cap sync
```

### capacitor.config.ts
```typescript
import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.appname',
  appName: 'Your App Name',
  webDir: 'dist',
  server: {
    // Development için (production'da kaldır)
    // url: 'http://192.168.1.x:5173',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark', // veya 'light'
      backgroundColor: '#ffffff',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'Your App Name',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // production'da false
  },
};

export default config;
```

## Adım 2: Sık Kullanılan Capacitor Eklentileri

```bash
# Temel eklentiler
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/keyboard
npm install @capacitor/haptics
npm install @capacitor/push-notifications
npm install @capacitor/camera
npm install @capacitor/share
npm install @capacitor/app
npm install @capacitor/browser

# RevenueCat
npm install @revenuecat/purchases-capacitor

# Sync et
npx cap sync
```

## Adım 3: iOS — Xcode

### Claude'un Otomatik Yapacakları
- [x] Capacitor projesini oluşturma
- [x] `capacitor.config.ts` yapılandırması
- [x] Plugin entegrasyonları
- [x] Safe area CSS ayarları
- [x] Status bar styling kodu
- [x] RevenueCat service dosyası
- [x] Build komutu: `npm run build && npx cap sync ios`

### Manuel Yapman Gerekenler (Xcode)
1. **Xcode'da aç:**
   ```bash
   npx cap open ios
   ```

2. **Signing & Capabilities:**
   - Xcode → Target → Signing & Capabilities
   - Team: Apple Developer hesabın
   - Bundle Identifier: `com.yourcompany.appname`
   - Automatically manage signing: ON

3. **Push Notifications:**
   - + Capability → Push Notifications
   - + Capability → Background Modes → Remote notifications

4. **In-App Purchase:**
   - + Capability → In-App Purchase

5. **App Icons:**
   - `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - 1024x1024 PNG icon gerekli
   - Tool: https://appicon.co

6. **Splash Screen:**
   - `ios/App/App/Assets.xcassets/Splash.imageset/`
   - veya LaunchScreen.storyboard düzenle

7. **Info.plist Permissions (gerekirse):**
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Fotoğraf çekmek için kamera erişimi gerekli</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>Fotoğraf seçmek için galeri erişimi gerekli</string>
   ```

8. **TestFlight Build:**
   - Product → Archive
   - Distribute App → App Store Connect
   - TestFlight'ta test et

9. **App Store Submit:**
   - App Store Connect → New App
   - Screenshots (6.7", 6.5", 5.5" iPhone + iPad)
   - Description, keywords, categories
   - Privacy Policy URL (zorunlu)
   - Submit for Review

## Adım 4: Android — Android Studio

### Claude'un Otomatik Yapacakları
- [x] Capacitor Android projesi oluşturma
- [x] `capacitor.config.ts` Android ayarları
- [x] Plugin entegrasyonları
- [x] Build komutu: `npm run build && npx cap sync android`

### Manuel Yapman Gerekenler (Android Studio)
1. **Android Studio'da aç:**
   ```bash
   npx cap open android
   ```

2. **App Icon:**
   - Right-click `res/` → New → Image Asset
   - 512x512 PNG gerekli
   - Adaptive icon (foreground + background)

3. **Signing Key oluştur:**
   ```bash
   keytool -genkey -v -keystore release.keystore \
     -alias your-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
   ⚠️ Bu keystore'u ASLA kaybetme. Backup al.

4. **build.gradle (app level):**
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file('release.keystore')
               storePassword 'your-password'
               keyAlias 'your-alias'
               keyPassword 'your-password'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
           }
       }
   }
   ```

5. **Permissions (AndroidManifest.xml):**
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.CAMERA" />
   <!-- Gerekirse ekle -->
   ```

6. **Build APK/AAB:**
   - Build → Generate Signed Bundle/APK
   - Android App Bundle (AAB) seç (Play Store zorunlu)

7. **Play Store Submit:**
   - Play Console → Create App
   - Internal Testing track'te test et
   - Production'a release
   - Screenshots, description, privacy policy
   - Content rating questionnaire
   - Data safety form

---

## Build Komut Sırası

```bash
# 1. Web build
npm run build

# 2. Capacitor sync
npx cap sync

# 3. iOS aç
npx cap open ios

# 4. Android aç
npx cap open android
```

Her kod değişikliğinde:
```bash
npm run build && npx cap sync
```

Live reload (development):
```bash
# capacitor.config.ts'de server.url aktif et
npx cap run ios --livereload --external
npx cap run android --livereload --external
```

---

## Checklist — Deploy Öncesi Son Kontrol

- [ ] `npm run build` hatasız
- [ ] `npx cap sync` hatasız
- [ ] iOS simulator'da test edildi
- [ ] Android emulator'da test edildi
- [ ] RevenueCat sandbox purchase test edildi
- [ ] Push notification test edildi
- [ ] Deep link test edildi
- [ ] Crash-free çalışıyor
- [ ] App icon doğru görünüyor
- [ ] Splash screen doğru görünüyor
- [ ] Privacy policy URL hazır
- [ ] Terms of service URL hazır
- [ ] App Store / Play Store listing dolduruldu
- [ ] Screenshots hazır
