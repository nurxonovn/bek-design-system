# Aurora

Figma: **2.6 Backgrounds · Aurora** — kanvas tepasida oqadigan yumshoq yorug' tasmalar; pastki yarmi sarlavha va tugmalar uchun tinch qoladi. Auth va landing hero'lar uchun. `tone`: `neutral` · `brand`; `intensity`: `subtle` · `default` · `intense`.

```tsx
import { Aurora } from '@bek-ui/backgrounds';

<main style={{ position: 'relative', minHeight: '100dvh' }}>
  <Aurora tone="brand" intensity="subtle" />
  <LoginForm style={{ position: 'relative' }} />
</main>

<Aurora bands={5} position="center" speed={0.5} />
```

## Ton va tokenlar

Tasmalar — chiziqli gradientli burilgan ellipslar (blur 64); gradient stoplari Figma'da ham tokenga bog'langan.

| Tasma | Neutral                                              | Brand                                         |
| ----- | ---------------------------------------------------- | --------------------------------------------- |
| 1     | `accent/soft` → `fill/soft-pressed`                  | `gradient/brand-start` → `gradient/brand-end` |
| 2     | `fill/strong` → `accent/soft`                        | `gradient/brand-end` → `accent/default`       |
| 3     | `accent/default` → `accent/soft`                     | `brand/logo-solid` → `gradient/brand-start`   |
| 4–5   | kod kengaytmasi (`bands` > 3) — shu ton tokenlaridan | ←                                             |

Fon — `bg/base`. Tasmalar mavzu bilan almashadi; Brand qorong'i mavzuda kuchliroq porlaydi.

## Prop'lar

| Prop        | Figma     | Qiymat                           | Standart         |
| ----------- | --------- | -------------------------------- | ---------------- |
| `tone`      | Tone      | `neutral` · `brand`              | `neutral`        |
| `intensity` | Intensity | `subtle` · `default` · `intense` | `default`        |
| `speed`     | kod       | ×                                | 1 (sikl 15–30 s) |
| `bands`     | kod       | 1–5                              | 3                |
| `position`  | kod       | `top` · `center`                 | `top`            |
| `fps`       | BGR-04    | kadr/s                           | 30               |

Intensity — tasmalar qatlami shaffofligi: Subtle .35, Default .6, Intense .9 (faqat muqova).

## Qoidalar

- BGR-01 … BGR-06 (Matrix rain README): bezak, kontrast, `prefers-reduced-motion` → statik kadr, 30 fps + pauza, ekranda bitta fon.
- Sarlavha va CTA — pastki yarmida; tasmalar yuqori 60 % da (`position="top"`).
- Mobil ekranda Subtle — kichik ekranda tasmalar kuchliroq ko'rinadi.
- Sarlavhani eng yorqin tasma ustiga qo'ymang (BGR-02).
