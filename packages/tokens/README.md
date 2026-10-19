# @bek/tokens

BEK Design System tokenlari: Figma variables → CSS o'zgaruvchilari (`--bek-*`) va JSON.

## Ishlatish

```css
@import '@bek/tokens/tokens.css'; /* rang, o'lcham, shrift, soya tokenlari */
@import '@bek/tokens/typography.css'; /* ixtiyoriy: .bek-text-* matn klasslari */
@import '@bek/tokens/materials.css'; /* ixtiyoriy: .bek-glass-regular · -small · -clear */
```

```html
<html data-theme="dark">
  <!-- Dark rejim; atributsiz — Light -->
</html>
```

| Fayl                  | Ichida                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `dist/tokens.css`     | Color (Light/Dark), Dimension va Typography (Mobile/Tablet/Web), `--bek-elevation-*`           |
| `dist/materials.css`  | Glass materiallari (1.9 Materials) → `.bek-glass-*`, backdrop-filter bo'lmasa — `surface/card` |
| `dist/typography.css` | Figma text styles → `.bek-text-display-l`, `.bek-text-body-m` …                                |
| `dist/palette.css`    | Xom palitra (`--light-red-50` …). Komponentlarda ishlatmang — faqat semantik tokenlar          |
| `dist/tokens.json`    | Hamma tokenlar, aliaslar yechilgan holda (rejim bo'yicha)                                      |

- Chart va diagramma tokenlari (Figma 4.18 / 4.19): ranglar `--bek-dataviz-*` (categorical 01–08, sequential 100–700, diverging neg-4…pos-4, positive / negative / neutral / target / anomaly, `ai/*`, `uncertainty/*`, axis / grid / label / track), o'lchamlar `--bek-chart-*` (height, padding, gap, bar, line, grid, point, legend, donut) va `--bek-motion-duration-chart-enter` / `-live-pulse`. Matnli heatmap kataklarida faqat sequential 200 · 300 · 600 · 700 ishlating (Figma CMP-07).
- Light/Dark: `:root` va `[data-theme="dark"]`.
- Qurilmalar: Mobile (360–599) — `:root`, Tablet — `@media (min-width: 600px)`, Web — `@media (min-width: 1024px)`.
- CSS nomlari Figma'dagi **codeSyntax (Web)** dan olinadi: `fill/primary` → `--bek-fill-primary`.
- Faqat kodda yashaydigan tokenlar (`src/constants.json`, Figma 1.5 va 1.10 hujjatidan): breakpoint va konteyner (`--bek-layout-container-max` …), z-index shkalasi (`--bek-z-dropdown` … `--bek-z-tooltip`), motion presetlari (`--bek-motion-overlay-modal-enter` …). `prefers-reduced-motion` da slide/scale 100 ms fade'ga almashadi.

## Figma'dan yangilash

`figma/` — Figma faylidagi Variables va Styles eksporti (Color, Dimension, Typography, Typography primitives, Palette, `styles.json`). Figma'da token o'zgarsa, shu JSON fayllar qayta eksport qilinadi va:

```bash
pnpm --filter @bek/tokens build
```

Build alias topilmasa, CSS nomi takrorlansa yoki noma'lum rejim kelsa xato bilan to'xtaydi.
