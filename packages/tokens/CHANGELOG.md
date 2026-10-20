# @bek/tokens

## 1.0.0-beta.0

### Major Changes

- First public release — 1.0.0-beta. Tokens from Figma Variables, 58 React components, 61 charts and diagrams, Figma ↔ code parity checks. The API may still change before 1.0.

### Minor Changes

- 79ae5de: Figma "BEK Design System" faylidan birinchi to'liq to'lqin: tokenlar (rang, o'lcham, shrift, soya, glass, z-index, motion) va Foundations → Overlays bo'limlaridagi React komponentlari (Inputs, Data display, Feedback, Navigation, Overlays), `.bek-cursor-*` yordamchi klasslari va `apps/templates` namuna ekranlari.
- 70c9f08: Figma tokenlari qayta eksport qilindi: `--bek-dataviz-*` (37), `--bek-chart-*` (17), chart motion, status hover/active va soft-hover, `gradient/brand-*`, `text/accent-hover`. Sirt zinapoyasi Figma'ga moslandi: `bg/base` Dark #0E0E10, `bg/sheet` gray/50. Button: rangli Outline hover endi `{rang}/soft-hover` tokenida.
