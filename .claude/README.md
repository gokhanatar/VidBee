# LovabletoDeploy

**Lovable → VS Code + Claude → Capacitor → App Store & Play Store**

Production-ready deployment pipeline for Lovable-exported projects.

## Workflow

```
[1] Lovable'da uygulama oluştur
         ↓
[2] VS Code'a aktar (git clone)
         ↓
[3] Claude Code ile production-ready hale getir
         ↓
[4] Capacitor ile native proje oluştur
         ↓
[5] Xcode / Android Studio'da build & deploy
```

## Quick Start

1. Clone your Lovable project into this workspace
2. Copy all files from this repo's root into your project root
3. Open terminal, run: `claude` (starts Claude Code)
4. Claude reads `CLAUDE.md` automatically
5. Follow the prompts in `prompts/` folder — in order (01 → 07)

## Repo Structure

```
├── CLAUDE.md                    # Claude Code master instructions (auto-read)
├── docs/
│   ├── 01-PRODUCTION-CHECKLIST.md   # Production readiness checklist
│   ├── 02-UI-UX-STANDARDS.md       # UI/UX quality standards
│   ├── 03-REVENUECAT-SETUP.md      # RevenueCat integration guide
│   ├── 04-BUG-REPORT.md            # Bug tracking & health check
│   ├── 05-SUGGESTIONS.md           # App improvement roadmap
│   └── 06-DEPLOY-MOBILE.md         # Xcode & Android Studio deployment
├── prompts/
│   ├── 01-initial-audit.md          # First: audit Lovable export
│   ├── 02-production-hardening.md   # Second: make production-ready
│   ├── 03-ui-ux-polish.md          # Third: UI/UX perfection
│   ├── 04-revenuecat-setup.md      # Fourth: payments integration
│   ├── 05-bug-fix-cycle.md         # Fifth: find & fix all bugs
│   ├── 06-final-review.md          # Sixth: final quality check
│   └── 07-capacitor-deploy.md      # Seventh: mobile deployment
└── templates/
    ├── health-check.md              # App health check template
    └── release-notes.md             # Release notes template
```

## Token Usage

All files are designed for **ultra-low token consumption**.
Claude reads only what it needs, when it needs it.
`CLAUDE.md` = always loaded. Everything else = on-demand.
