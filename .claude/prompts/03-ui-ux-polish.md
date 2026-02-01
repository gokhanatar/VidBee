# Prompt 03: UI/UX Polish

> Production hardening tamamlandıktan sonra bu promptu ver.

---

## Prompt

```
docs/02-UI-UX-STANDARDS.md dosyasını oku. Bu standartlara göre tüm UI'ı kontrol et ve düzelt.

Kontrol listesi:

1. RESPONSIVE: Tüm sayfaları 375px genişlikte kontrol et. Taşma, kırılma, üst üste binme var mı?

2. LOADING STATES: Her async operasyonda loading skeleton veya spinner var mı? Yoksa ekle.

3. EMPTY STATES: Liste/grid boş olduğunda güzel bir empty state gösteriliyor mu?

4. ERROR STATES: API hatalarında kullanıcıya ne gösteriyoruz? Try again butonu var mı?

5. DARK MODE: Dark mode desteği var mı? Yoksa CSS variables ile ekle.

6. TYPOGRAPHY: 16px altı input var mı? (iOS zoom issue). Font hierarchy tutarlı mı?

7. SPACING: Padding/margin tutarlı mı? Tailwind spacing scale kullanılıyor mu?

8. BUTTONS: Tüm butonlarda hover, active, focus, disabled state var mı?

9. FORMS: Tüm formlarda validation, error messages, success feedback var mı?

10. NAVIGATION: Bottom tab bar (mobil) düzgün mü? Active state belirgin mi?

11. TRANSITIONS: Sayfa geçişlerinde animasyon var mı? 200-300ms, smooth.

12. SAFE AREA: iOS notch ve Android navigation bar için safe area padding var mı?

Her düzeltmeyi yaptıktan sonra bir sonrakine geç. Build'i kontrol et.
```

---

## Beklenen Çıktı
- Tüm sayfalar mobile-responsive
- Loading, empty, error state'ler eklenmiş
- Tutarlı spacing ve typography
- Build hatasız
