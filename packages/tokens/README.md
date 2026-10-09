# @bek/tokens

BEK Design System tokenlari: Figma variables → CSS o'zgaruvchilari (`--bek-*`) va JSON.

## Ishlatish

```css
@import '@bek/tokens/tokens.css'; /* rang, o'lcham, shrift, soya tokenlari */
@import '@bek/tokens/typography.css'; /* ixtiyoriy: .bek-text-* matn klasslari */
```

```html
<html data-theme="dark">
  <!-- Dark rejim; atributsiz — Light -->
</html>
```

| Fayl                  | Ichida                                                                                |
| --------------------- | ------------------------------------------------------------------------------------- |
| `dist/tokens.css`     | Color (Light/Dark), Dimension va Typography (Mobile/Tablet/Web), `--bek-elevation-*`  |
| `dist/typography.css` | Figma text styles → `.bek-text-display-l`, `.bek-text-body-m` …                       |
| `dist/palette.css`    | Xom palitra (`--light-red-50` …). Komponentlarda ishlatmang — faqat semantik tokenlar |
| `dist/tokens.json`    | Hamma tokenlar, aliaslar yechilgan holda (rejim bo'yicha)                             |

- Light/Dark: `:root` va `[data-theme="dark"]`.
- Qurilmalar: Mobile (360–599) — `:root`, Tablet — `@media (min-width: 600px)`, Web — `@media (min-width: 1024px)`.
- CSS nomlari Figma'dagi **codeSyntax (Web)** dan olinadi: `fill/primary` → `--bek-fill-primary`.

## Figma'dan yangilash

`figma/` — Figma faylidagi Variables va Styles eksporti (Color, Dimension, Typography, Typography primitives, Palette, `styles.json`). Figma'da token o'zgarsa, shu JSON fayllar qayta eksport qilinadi va:

```bash
pnpm --filter @bek/tokens build
```

Build alias topilmasa, CSS nomi takrorlansa yoki noma'lum rejim kelsa xato bilan to'xtaydi.
