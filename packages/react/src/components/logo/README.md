# BekLogo

Figma: **2.2 Logo & Brand → Logo**. Belgi (to'rt gulbarg) + "BEK" wordmark + mahsulot nomi.

```tsx
import { BekLogo } from '@bek/react';

<BekLogo product="Academy" />                       // horizontal · s · gradient
<BekLogo product="Digital Legacy" size="m" />
<BekLogo variant="mark" size="l" />                 // favicon, app icon
<BekLogo color="mono" />                            // masterbrand BEK

<a href="/" aria-label="BEK Academy — home">
  <BekLogo product="Academy" aria-hidden />
</a>
```

| Prop      | Qiymatlar                                  | Default      | Figma                  |
| --------- | ------------------------------------------ | ------------ | ---------------------- |
| `product` | `string` · `null`                          | `null` (BEK) | Product · Show product |
| `variant` | `horizontal` · `vertical` · `mark`         | `horizontal` | Variant                |
| `size`    | `s` 24 · `m` 40 · `l` 64 (belgi, px)       | `s`          | Size                   |
| `color`   | `gradient` · `solid` · `mono` · `reversed` | `gradient`   | Color                  |

Ranglar faqat tokenlardan: `--bek-brand-logo-start` / `-end` (gradient), `--bek-brand-logo-solid`, `--bek-text-primary` (mono), `--bek-text-on-color` (reversed). Brend rangini o'zgartirish — CSS'da bitta qator.

## Qoidalar

- **Mahsulot nomi:** Title Case, 1–3 so'z, ≤ 18 belgi; "BEK" nomga qo'shilmaydi (`Academy`, `BEK Academy` emas); tarjima qilinmaydi.
- **Bo'sh joy:** har tomonda kamida belgi kengligining 0.44 qismi.
- **Minimal o'lcham:** belgi — ekranda 24 px (favicon 16 px); horizontal lockup — 120 px kenglik; vertical — 96 px.
- **Qurilmalar:** Mobile va Tablet header'da `horizontal · s`; Web'da ilovada `s`, landing va footer'da `m`.
- **Mumkin emas:** cho'zish, rangini o'zgartirish, burish, soya qo'shish, oraliqni o'zgartirish, notekis fon ustiga qo'yish.

## Accessibility

Komponent `role="img"` va `aria-label="BEK <mahsulot>"` bilan chiqadi. Havola ichida bo'lsa, nomni havolaga bering va logoga `aria-hidden` qo'ying.
