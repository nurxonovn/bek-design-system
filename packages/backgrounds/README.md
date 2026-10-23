# @bek-ui/backgrounds

BEK Design System animatsiyali fonlari — Figma **2.6 Backgrounds** sahifasining React (`<canvas>`) nusxasi: Matrix rain, Dot field, Grain gradient, Aurora. Ranglar faqat `@bek-ui/tokens` dan (`--bek-bg-base`, `--bek-text-*`, `--bek-accent-*`, `--bek-gradient-brand-*`, `--bek-effect-matrix-*`); canvas ularni ish vaqtida `getComputedStyle` bilan o'qiydi — Light/Dark (`data-theme="dark"`) avtomatik. Runtime bog'liqlik — faqat `react`.

## Ishlatish

```tsx
import '@bek-ui/tokens/tokens.css';
import '@bek-ui/backgrounds/styles.css';
import { Aurora, DotField, GrainGradient, MatrixRain } from '@bek-ui/backgrounds';

<section style={{ position: 'relative', minHeight: 480 }}>
  <MatrixRain tone="brand" intensity="subtle" />
  <h1 style={{ position: 'relative' }}>BEK bilan dizaynni o'rganing</h1>
</section>;
```

- **Konteyner:** fon `position: absolute; inset: 0` — ota element `position: relative` (yoki boshqa positioned) bo'lsin; kontent fon ortidan keladi. O'lcham ResizeObserver bilan, `devicePixelRatio` ≤ 2.
- **Bezak (BGR-01):** `aria-hidden="true"`, `pointer-events: none`; kursor `window` da kuzatiladi, bosishlar ostidagi elementlarga o'tadi.
- **Harakat (BGR-03, BGR-04):** standart 30 fps (`fps` prop'i); ekrandan tashqarida (IntersectionObserver) va yashirin tabda to'xtaydi; `prefers-reduced-motion: reduce` → bitta statik kadr, kursor effektlarisiz (sozlama o'zgarishi tinglanadi).
- **Client/Server:** komponentlar `'use client'`; SSR'da faqat bo'sh `<canvas>` chiqadi, chizish effektda boshlanadi. Unmount'da hamma kuzatuvchi va tinglovchilar tozalanadi.
- **Ranglar:** har komponent ranglari CSS o'zgaruvchilarida (`--bek-matrix-rain-head`, `--bek-dot-field-hot`, `--bek-grain-gradient-blob-1`, `--bek-aurora-band-1-start` …) — CSS bilan ham almashtirish mumkin.
- **Qoidalar:** ekranda bitta animatsiyali fon (BGR-05); forma, jadval va zich kontent ostida emas — hero, auth, onboarding, bo'sh holat, 404, yuklanish, muqova (BGR-06); ustidagi matn eng yomon kadrda ham kontrastdan o'tsin (BGR-02).

O'z fonini yozish uchun umumiy sikl ham eksport qilinadi: `useBackgroundCanvas({ render, fps, trackPointer, redrawKey })`.

## Komponentlar

| Komponent       | Figma sahifasi                   | Hujjat                                            |
| --------------- | -------------------------------- | ------------------------------------------------- |
| `MatrixRain`    | 2.6 Backgrounds · Matrix rain    | [README](src/components/matrix-rain/README.md)    |
| `DotField`      | 2.6 Backgrounds · Dot field      | [README](src/components/dot-field/README.md)      |
| `GrainGradient` | 2.6 Backgrounds · Grain gradient | [README](src/components/grain-gradient/README.md) |
| `Aurora`        | 2.6 Backgrounds · Aurora         | [README](src/components/aurora/README.md)         |

## Figma ↔ kod

Har komponent papkasida `figma.json` (Figma spec); tekshiruv: `pnpm --filter @bek-ui/backgrounds check:figma --strict`.
