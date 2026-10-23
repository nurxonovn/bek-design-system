# Matrix rain

Figma: **2.6 Backgrounds · Matrix rain** — tushayotgan belgilar ustunlari va kursorga ergashuvchi nur. `tone`: `neutral` · `brand` · `classic`; `intensity`: `subtle` · `default` · `intense`; `charset`: `mixed` · `latin` · `cyrillic` · `digits` yoki istalgan satr.

```tsx
import '@bek-ui/tokens/tokens.css';
import '@bek-ui/backgrounds/styles.css';
import { MatrixRain } from '@bek-ui/backgrounds';

<section style={{ position: 'relative', minHeight: 480 }}>
  <MatrixRain intensity="subtle" />
  <h1 style={{ position: 'relative' }}>BEK bilan dizaynni o'rganing</h1>
</section>

<MatrixRain tone="classic" intensity="intense" charset="01" speed={2.5} />
```

## Ton va tokenlar

| Rol             | Neutral                | Brand                       | Classic                    |
| --------------- | ---------------------- | --------------------------- | -------------------------- |
| Fon (Base)      | `bg/base`              | `bg/base`                   | `effect/matrix/bg`         |
| Bosh (Head)     | `text/primary`         | `accent/default`            | `effect/matrix/head`       |
| Iz (Trail)      | `text/secondary`       | `gradient/brand-end`        | `effect/matrix/trail`      |
| Shovqin (Noise) | `text/disabled`        | `gradient/brand-start`      | `effect/matrix/fade`       |
| Kursor zonasi   | `accent/default`       | `accent/active`             | `effect/matrix/head`       |
| Nur (`pointer`) | `accent/default` · .12 | `gradient/brand-start` · .2 | `effect/matrix/head` · .18 |

Belgilar — `Code/S` (mono 12/16, `--bek-type-code-sm-*`). Neutral va Brand mavzu bilan almashadi; Classic Light va Dark'da bir xil (qora + yashil). Ranglar CSS o'zgaruvchilarida (`--bek-matrix-rain-head` …) — canvas ularni `getComputedStyle` bilan o'qiydi, shuning uchun `data-theme="dark"` darhol qo'llanadi.

## Prop'lar

| Prop                                                   | Figma        | Qiymat                                                 | Standart                    |
| ------------------------------------------------------ | ------------ | ------------------------------------------------------ | --------------------------- |
| `tone`                                                 | Tone         | `neutral` · `brand` · `classic`                        | `neutral`                   |
| `intensity`                                            | Intensity    | `subtle` · `default` · `intense`                       | `default`                   |
| `charset`                                              | Charset      | preset yoki istalgan satr                              | `mixed`                     |
| `pointer`                                              | Show pointer | boolean — kursor nuri                                  | `true`                      |
| `size` · `lineSpacing`                                 | kod          | px                                                     | `Code/S` tokeni (12 · 16)   |
| `density`                                              | kod          | 0.25–2 ×                                               | 1                           |
| `speed` · `frameInterval`                              | kod          | × · ms                                                 | 1.75 · 134                  |
| `trail`                                                | kod          | 0–100 %                                                | 94                          |
| `opacity`                                              | kod          | 0–100 %                                                | `intensity` (40 · 70 · 100) |
| `color` · `highlightColor`                             | kod          | token nomi (`accent/default`), `--bek-…` yoki CSS rang | ton bo'yicha                |
| `pointerHighlight` · `radius` · `highlightPersistence` | kod          | bool · px · %                                          | `true` · 122 · 64           |
| `fps`                                                  | BGR-04       | kadr/s                                                 | 30                          |

`intensity` — tayyor boshlang'ich nuqta: Subtle (shaffoflik .4 · zichlik .22) matn ortida, Default (.7 · .38) hero, Intense (1 · .55) faqat muqova, 404, yuklanish. `density` shu zichlikni ko'paytiradi.

## Qoidalar (BGR-01 … BGR-06)

- **Bezak (BGR-01):** `<canvas aria-hidden="true">`, `pointer-events: none`; kursor `window` da kuzatiladi. Ota element `position: relative` bo'lsin — fon uni to'liq qoplaydi (ResizeObserver).
- **Kontrast (BGR-02):** ustidagi matn eng yomon kadrda ham kontrastdan o'tsin; kerak bo'lsa `bg/base` gradient pardasi qo'shing. Matnni tinch hududda (chap / past) saqlang, kursor zonasini undan uzoqroq.
- **Harakatni kamaytirish (BGR-03):** `prefers-reduced-motion: reduce` → bitta statik kadr, kursor effektlarisiz; sozlama o'zgarishi tinglanadi.
- **Batareya (BGR-04):** 30 fps, ekrandan tashqarida va yashirin tabda pauza, `devicePixelRatio` ≤ 2.
- **Bitta fon (BGR-05):** ekranda bitta animatsiyali fon.
- **Joy (BGR-06):** forma, jadval va zich kontent ostida emas — hero, auth, onboarding, bo'sh holat, 404, yuklanish, muqova.
- Classic — kuchli brend lahzasi (muqova, 404, yuklanish); kundalik hero uchun Neutral / Brand.
- Figma'da Charset — variant, kodda — erkin satr: `charset="BEK0123"`.
- SSR xavfsiz: render paytida `window` ishlatilmaydi; `'use client'` komponent.
