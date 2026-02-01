# UI/UX Standards

> Modern, kullanıcı dostu, mobile-first tasarım standartları.

## Design System

### Colors
```
Primary:     hsl(var(--primary))       → Ana marka rengi
Secondary:   hsl(var(--secondary))     → İkincil renk
Accent:      hsl(var(--accent))        → Vurgu rengi
Background:  hsl(var(--background))    → Arka plan
Foreground:  hsl(var(--foreground))    → Metin
Muted:       hsl(var(--muted))         → Soluk/disabled
Destructive: hsl(var(--destructive))   → Hata/silme
```
Tailwind ile shadcn/ui CSS variables kullan. Hardcoded renk YASAK.

### Typography
```
Heading 1:   text-3xl font-bold    (30px)
Heading 2:   text-2xl font-semibold (24px)
Heading 3:   text-xl font-semibold  (20px)
Body:        text-base              (16px) → Minimum mobil boyut
Small:       text-sm                (14px)
Caption:     text-xs                (12px) → Sadece yardımcı metin
```
16px altı input/textarea YASAK (iOS zoom issue).

### Spacing
```
Section gap:    space-y-8 veya py-8
Card padding:   p-4 veya p-6
Element gap:    gap-2 veya gap-4
Page padding:   px-4 (mobile) px-6 (desktop)
```

### Border Radius
```
Buttons:     rounded-lg (8px)
Cards:       rounded-xl (12px)
Modals:      rounded-2xl (16px)
Avatars:     rounded-full
Inputs:      rounded-md (6px)
```

## Component Standards

### Buttons
- Primary: `<Button>` — ana aksiyon, sayfada 1 tane
- Secondary: `<Button variant="secondary">` — ikincil aksiyon
- Destructive: `<Button variant="destructive">` — silme/iptal
- Ghost: `<Button variant="ghost">` — minimal aksiyon
- Minimum size: `h-10 px-4` (mobilde `h-12` önerilir)
- Loading state: spinner + disabled
- Her buttonda `aria-label` veya visible text

### Cards
```tsx
<Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
  <CardContent>
  <CardFooter>
</Card>
```

### Forms
- Her input'ta label (floating veya üst)
- Validation mesajları input altında, kırmızı, `text-sm`
- Submit butonunda loading spinner
- Success → toast notification
- Error → inline mesaj + toast

### Navigation
- Bottom tab bar (mobil): max 5 item
- Her tab'da icon + label
- Active state belirgin (renk + bold)
- Safe area padding bottom

### Lists
- Skeleton loading (3-5 satır)
- Empty state: icon + mesaj + CTA button
- Pull-to-refresh (mobile)
- Infinite scroll veya pagination

### Modals/Sheets
- Mobile: bottom sheet (Drawer)
- Desktop: centered dialog
- Backdrop close aktif
- Escape key close aktif
- Focus trap aktif

## Animation Standards

```
Transitions:  duration-200 ease-in-out    → default
Page enter:   animate-in fade-in           → sayfa geçişi
Card hover:   hover:shadow-md transition   → kart hover
Button press: active:scale-95             → buton basma
Toast:        slide-in from top/bottom     → bildirim
```
60fps. Animasyon > 300ms YASAK. Kullanıcıyı bekleten animasyon YASAK.

## Dark Mode

- `class` strategy: `<html class="dark">`
- Tüm renkler CSS variable üzerinden
- Gölgeler dark mode'da subtle
- Görseller dark mode'da opaklık ayarı
- Toggle: ayarlar sayfasında + system preference

## Responsive Breakpoints

```
Mobile:     < 640px   (sm)   → Varsayılan tasarım
Tablet:     640-1024px (md)  → Grid 2 kolon
Desktop:    > 1024px   (lg)  → Grid 3-4 kolon, sidebar
```
Mobile-first: base stilleri mobile, `md:` ve `lg:` ile büyüt.

## Accessibility (a11y)

- [ ] Tüm interactive elementlerde focus ring visible
- [ ] Color contrast ratio ≥ 4.5:1 (text) / 3:1 (large text)
- [ ] Tüm img'de alt text
- [ ] Form elementlerinde label bağlantısı (htmlFor)
- [ ] Keyboard navigasyon çalışıyor (Tab, Enter, Escape)
- [ ] Screen reader uyumlu (aria-label, role, aria-live)
- [ ] Reduced motion: `prefers-reduced-motion` media query

## Lovable Export Bilinen Sorunlar

Lovable export sonrası genellikle düzeltilmesi gerekenler:
1. Inline styles → Tailwind class'larına çevir
2. Hardcoded renkler → CSS variable'lara taşı
3. Missing loading states → Skeleton ekle
4. Missing error boundaries → Route seviyesinde ekle
5. Non-semantic HTML → section, article, nav, main kullan
6. Missing aria labels → Interactive elementlere ekle
7. Desktop-only hover effects → Touch-friendly yap
8. Missing safe area insets → Capacitor için ekle
