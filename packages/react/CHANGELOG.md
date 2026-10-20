# @bek/react

## 1.0.0-beta.0

### Major Changes

- First public release — 1.0.0-beta. Tokens from Figma Variables, 58 React components, 61 charts and diagrams, Figma ↔ code parity checks. The API may still change before 1.0.

### Minor Changes

- 79ae5de: Figma "BEK Design System" faylidan birinchi to'liq to'lqin: tokenlar (rang, o'lcham, shrift, soya, glass, z-index, motion) va Foundations → Overlays bo'limlaridagi React komponentlari (Inputs, Data display, Feedback, Navigation, Overlays), `.bek-cursor-*` yordamchi klasslari va `apps/templates` namuna ekranlari.
- 3b7447d: Figma ↔ kod bir xilligi: har komponentda `figma.json` spetsifikatsiyasi va `check:figma` tekshiruvi (CI va Claude Code hook); yangi komponentlar — `Link` (3.18), `Fieldset` (3.19), `DescriptionList` (4.16).
- 6a3ff9e: Yangi Figma bo'limlari: `Mascot` · `MascotMessage` (2.3, panda sprite-sheet `page-mascot` MIT), `Pattern` (2.5), `StatusBar` · `HomeIndicator` (10.2), `Keyboard` (10.3); `AppShell` ga `drawer` sloti (6.2 Tablet/Mobile). Sayt katalogiga jonli namunalar.

### Patch Changes

- 920e6c8: Next.js App Router (React Server Components) support: interactive components (hooks or internal event handlers — Button, TextField, Select, Tabs, overlays, Link, Mascot and 30 more) now start with `'use client'`, so they can be rendered from Server Components. Skeleton `card` now fills its container (grid cell) instead of a fixed 168 px; media keeps the Figma 168:140 ratio.
- 70c9f08: Figma tokenlari qayta eksport qilindi: `--bek-dataviz-*` (37), `--bek-chart-*` (17), chart motion, status hover/active va soft-hover, `gradient/brand-*`, `text/accent-hover`. Sirt zinapoyasi Figma'ga moslandi: `bg/base` Dark #0E0E10, `bg/sheet` gray/50. Button: rangli Outline hover endi `{rang}/soft-hover` tokenida.
- Updated dependencies [79ae5de]
- Updated dependencies
- Updated dependencies [70c9f08]
  - @bek/tokens@1.0.0-beta.0
