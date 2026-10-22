# Tooltip · TooltipCallout

Figma: **5.2 Tooltip**.

## Tooltip

Hover yoki fokusda chiqadigan qisqa izoh. Icon-only tugmalarda majburiy.

```tsx
import { Tooltip, Button } from '@bek-ui/react';

<Tooltip content="Share" placement="bottom">
  <Button iconOnly startIcon={<ShareIcon />}>
    Share
  </Button>
</Tooltip>;
```

| Prop          | Qiymatlar                           | Default |
| ------------- | ----------------------------------- | ------- |
| `content`     | Label/M                             | —       |
| `description` | ikkinchi qator, Caption/M           | —       |
| `variant`     | `dark` · `light`                    | `dark`  |
| `placement`   | `top` · `bottom` · `left` · `right` | `top`   |
| `arrow`       | strelka (10 px, 45°)                | `true`  |
| `children`    | bitta fokuslanadigan element        | —       |

- Tokenlar: Dark — `fill/inverse`, `text/inverse`, izoh `text/disabled`; Light — `surface/raised`, `text/primary`, `text/secondary`. Padding 12, gap 4, radius `surface/sm`, `Elevation/2`, `z/tooltip`.
- A11y: `role="tooltip"`, trigger'ga `aria-describedby`; pointer, fokus va Escape bilan boshqariladi. Ichida interaktiv element bo'lmaydi.
- Joylashuv trigger atrofida CSS bilan (`position: absolute`); ekran chetidagi holatlar uchun `placement` ni tanlang.

## TooltipCallout

Yangi yoki yashirin funksiyani tushuntiruvchi "fikr pufagi" ko'rinishidagi ishora.

```tsx
<TooltipCallout tip="bottom-left" action={{ label: 'Got it', onClick: dismiss }}>
  Swipe left to delete an item
</TooltipCallout>
```

| Prop       | Qiymatlar                                                                                  | Default         |
| ---------- | ------------------------------------------------------------------------------------------ | --------------- |
| `size`     | `m` (280, Body/S) · `s` (240, Caption/M)                                                   | `m`             |
| `tip`      | `top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-center` · `bottom-right` | `bottom-center` |
| `children` | bir-ikki qatorli matn                                                                      | —               |
| `action`   | `{ label, onClick }` — "Got it", `text/accent`                                             | —               |

- Doim Dark (`surface/raised`), `Elevation/3`, padding 8 × 12, radius `surface/md`. Ekranda bittadan; amal yoki tashqariga bosish bilan yopiladi.

## Do / Don't

- ✅ Tooltip — 1–5 so'z. ❌ Muhim ma'lumotni faqat tooltip'da berish (touch'da hover yo'q).
