# CheckoutBar · CartPill

Figma: **6.8 Checkout bar**. Buyurtmani oldinga suradigan sticky pastki panel.

```tsx
import { CartPill, CheckoutBar, InfoWrap } from '@bek/react';

<CheckoutBar info={<InfoWrap>Free delivery from 200 000 soʻm</InfoWrap>}
  action={{ label: 'Go to cart · 147 000 soʻm', onClick: openCart }} />
<CheckoutBar type="checkout" total="159 000 soʻm" action={{ label: 'Pay', loading: paying }}
  legal="By tapping Pay you agree to the terms" />
<CartPill icon={<BagIcon />} label="Cart · 3 items" total="147 000 soʻm" onClick={openCart} />
```

| Prop (`CheckoutBar`)   | Qiymatlar                                           | Default |
| ---------------------- | --------------------------------------------------- | ------- |
| `type`                 | `cart` · `checkout`                                 | `cart`  |
| `info`                 | yuqoridagi izoh (InfoWrap)                          | —       |
| `total` · `totalLabel` | jami (Title/L) va uning nomi (Caption/L)            | `Total` |
| `action`               | `{ label, onClick, loading, disabled }` — Action XL | —       |
| `legal`                | Caption/M `text/tertiary`                           | —       |

- `surface/raised`, `Elevation/1`, padding 12 16 + home indicator (`safe-area-inset-bottom`), gap 12, `z/sticky`.
- `CartPill` (Floating): 60 px accent pill, `Elevation/3`, ikonka doirasi 44 `fill/on-color-hover`, matn Label/L `text/on-color`. Savatda mahsulot bo'lgandagina ko'rsating.
