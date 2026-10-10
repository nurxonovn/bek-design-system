# Skeleton

Figma: **5.7 Loading → Skeleton**. Ma'lumot yuklanguncha haqiqiy maketni takrorlovchi joy egallovchi.

```tsx
import { Skeleton } from '@bek/react';

<section aria-busy="true">
  <Skeleton shape="list-row" />
  <Skeleton shape="list-row" />
</section>
<Skeleton shape="text" lines={2} />
<Skeleton shape="circle" style={{ width: 56 }} />
```

| Prop    | Qiymatlar                                                  | Default |
| ------- | ---------------------------------------------------------- | ------- |
| `shape` | `text` · `title` · `circle` · `rect` · `list-row` · `card` | `text`  |
| `lines` | `text` uchun qatorlar soni (oxirgisi 2/3)                  | `3`     |

- O'lchamlar: Text 12 px qatorlar (gap 8) · Title 24 × 180 · Circle 40 · Rect 140 balandlik · List row 48 · Card — konteyner kengligini to'ldiradi, media nisbati 168:140 (Figma'da 168 kenglik). Kenglik/balandlikni `style` bilan o'zgartirish mumkin.
- Tokenlar: suyaklar `fill/soft-pressed`; shimmer — shaffoflik 1 → 0.5 → 1, 1.2 s ease-in-out (`prefers-reduced-motion` da o'chadi).
- A11y: Skeleton `aria-hidden`; yuklanayotgan blokka `aria-busy="true"` bering.

## Do / Don't

- ✅ Haqiqiy maketga mos shakl. ❌ Skeleton va spinner'ni bitta blokda aralashtirish.
