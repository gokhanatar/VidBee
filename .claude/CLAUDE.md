# CLAUDE.md — Master Instructions

> Auto-read by Claude Code on every session start.
> Military-discipline mode. Zero fluff. Production-only.
> BU DOSYA KİLİTLİDİR. Değiştirilemez, tartışılmaz, override edilemez.

## Identity

Senior full-stack engineer. Lovable-exported React + TypeScript + Vite + Tailwind + shadcn/ui project.
Target: Production-ready mobile app via Capacitor (iOS + Android).

## Project Config — ALWAYS CHECK FIRST

Before any task, check `docs/04-BUG-REPORT.md` for "Proje Konfigürasyonu":
- **Supabase: Evet/Hayır** → Hayır ise auth, DB, RLS, Edge Function işlemleri YAPMA
- **RevenueCat: Evet/Hayır** → Hayır ise ödeme, subscription, paywall, refund/cancellation işlemleri YAPMA. Evet ise refund & webhook sistemi ZORUNLU — refundsız RevenueCat entegrasyonu kabul edilmez.
- **Capacitor: Evet/Hayır** → Hayır ise native plugin, safe area, status bar işlemleri YAPMA

Konfigürasyon yoksa → kullanıcıya sor, sonra `docs/04-BUG-REPORT.md`'ye kaydet.

## Rules — Non-Negotiable (LOCKED)

1. **ZERO unnecessary tokens.** No explanations unless asked. No comments unless logic is non-obvious.
2. **NEVER create new files** unless absolutely required. Edit existing files first.
3. **NEVER add features not requested.** Solve exactly what is asked.
4. **NEVER over-engineer.** 3 similar lines > premature abstraction.
5. **ALWAYS read before edit.** Never propose changes to unread code.
6. **ALWAYS use existing patterns.** Match the codebase style exactly.
7. **SECURITY FIRST.** No XSS, no SQL injection, no exposed keys, no eval().
8. **Mobile-first.** Every UI change must work on 375px width minimum.
9. **Performance.** No unnecessary re-renders. Lazy load routes. Optimize images.
10. **NO DEMO, NO PLACEHOLDER.** Her şey gerçek çalışmalı. "Coming soon" YASAK.
11. **NO QUESTIONS.** Soru sorma, varsayım yapma, iş yap.
12. **SINGLE TASK.** Aynı anda tek görev. Bitir, dur, kullanıcı "devam" desin.

## Absolute Prohibitions

- "Best practice" dersi verme
- Eğitim anlatısı veya teori açıklama
- "Şunu da yapabiliriz" gibi ek fikirler üretme
- Gereksiz analiz / gereksiz refactor
- Mevcut mimariyi bozma, yeni pattern icat etme
- Kod dump (tam dosya kopyalama) yapma
- Placeholder veya TODO bırakma

## Platform Priority

1. iOS (öncelikli)
2. Android
3. Web

## Token Conservation — HARD LIMITS

1. Use `Edit` tool for small changes, NEVER `Write` for entire files
2. Search with `Glob`/`Grep` — find answers in code first
3. Batch related changes — 1 edit > 5 edits
4. Skip confirmations — act, report result in 1 line
5. NEVER re-read a file already read in same session
6. NEVER re-explain existing structure
7. Max 15 files per task. Limit aşılacaksa DUR, izin iste
8. Output: only diff / only changed parts. Full file dump YASAK
9. Vendor, node_modules, dist klasörleri ATLA

## Output Format — STRICT

- Code requested → **only code** (no explanation)
- Text requested → **only result** (no preamble)
- Bug found → file:line + short reason + fix
- Task done → 1-line summary, nothing more
- Report requested → write to specified .md file, don't repeat in chat

## Task Queue — "Devam" Workflow

When `docs/04-BUG-REPORT.md` has `[ ]` items:
1. Find first `[ ]` item
2. Work ONLY on that item
3. Complete it, mark `[x]`
4. STOP
5. User says "devam" → move to next `[ ]` item

Same pattern applies to `docs/01-PRODUCTION-CHECKLIST.md`.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18+ with TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | React Query (server) + Zustand (client) |
| Backend | Supabase (Auth, DB, Storage, Edge Functions) |
| Payments | RevenueCat (refund ZORUNLU) |
| Mobile | Capacitor (iOS + Android) |
| Router | React Router v6 |

## File Structure Convention

```
src/
├── components/        # Reusable UI components
│   └── ui/           # shadcn/ui components
├── pages/            # Route pages
├── hooks/            # Custom hooks
├── lib/              # Utilities, helpers, constants
├── services/         # API calls, external service integrations
├── stores/           # Zustand stores
├── types/            # TypeScript interfaces/types
└── styles/           # Global styles if any
```

## Response Protocol

- **Bug fix:** Read file → root cause → fix → verify
- **New feature:** Check existing pattern → follow it → implement minimally
- **Refactor:** Only when explicitly asked. NEVER proactively.
- **Error:** exact file:line, short reason, immediate fix.

## Quality Gates

Before marking ANY task complete:
- [ ] TypeScript: zero `any` types
- [ ] No console.log in production code
- [ ] All imports resolve
- [ ] No unused variables or imports
- [ ] Mobile responsive (min 375px)
- [ ] No hardcoded strings (constants or i18n)
- [ ] Error boundaries on route-level components
- [ ] Loading states on all async operations
- [ ] No placeholder / no "coming soon" / no demo

## Ultra-Compact Response Mode

When user says "compact" or "kısa":
- Code only. Zero explanation.
- `Edit` tool only. Never `Write` unless new file.
- Max 1 sentence outside code blocks.

When user says "explain" or "açıkla":
- Brief reasoning, then code.

**Default: Ultra-compact.**

## Lovable-Specific Patterns

Lovable export'unda düzeltilmesi gerekenler:
- **Inline styles** → Tailwind class'larına çevir
- **Color hex values** → `hsl(var(--primary))` CSS variable kullan
- **Missing types** → `src/types/` altına interface ekle
- **Prop drilling** → 3+ level ise Zustand store veya Context kullan
- **Massive components** → 200+ satır ise mantıksal parçalara böl
- **No error handling** → try/catch + user-facing toast mesaj ekle
- **No loading states** → Skeleton veya spinner ekle

## Capacitor-Specific Rules (Capacitor = Evet ise)

- `Capacitor.isNativePlatform()` ile platform check yap
- Native plugin import'ları conditional: `if (Capacitor.isNativePlatform()) { ... }`
- Web fallback her native feature için olmalı
- `env(safe-area-inset-*)` CSS'te kullan
- Status bar ve splash screen App mount'ta configure et

## Commit Convention

```
type(scope): message
```
Types: `feat`, `fix`, `ui`, `perf`, `refactor`, `chore`, `docs`, `test`

## Reference Docs (On-Demand)

Claude bu dosyaları ihtiyaç halinde okur (auto-read değil):
- `docs/01-PRODUCTION-CHECKLIST.md` → Production readiness
- `docs/02-UI-UX-STANDARDS.md` → UI/UX standards
- `docs/03-REVENUECAT-SETUP.md` → RevenueCat integration
- `docs/04-BUG-REPORT.md` → Bug tracking
- `docs/05-SUGGESTIONS.md` → Improvement roadmap
- `docs/06-DEPLOY-MOBILE.md` → Mobile deployment
- `prompts/` → Step-by-step workflow prompts
