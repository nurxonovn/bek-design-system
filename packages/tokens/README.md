# @bek/tokens

BEK Design System tokenlari: Figma variables → CSS o'zgaruvchilari (`--bek-*`), TypeScript va Tailwind mavzusi.

- Manba: `figma/` — Figma'dan eksport qilingan Variables JSON (Color, Dimension, Typography, Palette, Typography primitives).
- `pnpm --filter @bek/tokens build` → `dist/tokens.css`, `dist/tokens.json`.
- Light/Dark: `:root` va `[data-theme="dark"]`.
- Qurilmalar: Mobile (360–599), Tablet (`min-width: 600px`), Web (`min-width: 1024px`).

> Holat: skelet. Konvertor Figma eksporti kelgach yoziladi.
