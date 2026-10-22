# Badge

Figma: **4.2 Badge → Badge**. Qisqa holat yoki son: pill shaklida, 1–2 so'z.

```tsx
import { Badge } from '@bek-ui/react';

<Badge>Label</Badge>                                   // filled · neutral · m
<Badge variant="subtle" color="success" dot>Active</Badge>
<Badge variant="outline" color="danger" size="s">Overdue</Badge>
<Badge color="accent" icon={<StarIcon />}>New</Badge>
```

| Prop       | Qiymatlar                                                        | Default   |
| ---------- | ---------------------------------------------------------------- | --------- |
| `variant`  | `filled` · `subtle` · `outline`                                  | `filled`  |
| `color`    | `neutral` · `accent` · `success` · `warning` · `danger` · `info` | `neutral` |
| `size`     | `s` 20 · `m` 24 · `l` 28 px                                      | `m`       |
| `dot`      | `boolean` — 6 px nuqta                                           | `false`   |
| `icon`     | `ReactNode` — s/m 12 px, l 16 px                                 | —         |
| `children` | matn                                                             | —         |

- **Filled** — kuchli signal (yangi, son). **Subtle** — ro'yxat va jadvaldagi holatlar. **Outline** — sokin meta yorliq.
- Tokenlar: fon `status/{tone}/default` (Filled) yoki `status/{tone}/soft`; matn `text/on-color` yoki `text/{tone}`; Outline chegarasi `border/{tone}`, 1 px; radius `radius/full`; shrift Label/S (L — Label/M).
- **Qurilmalar:** Mobile — ro'yxat sarlavhasi yonida `m`; Tablet — ro'yxat va kartalarda `m`, zich jadvalda `s`; Web — jadval katakchasi va menyu hisoblagichida `s`.

## Do / Don't

- ✅ Qisqa matn: "Active", "Pending". ❌ Uzun gap ("Payment pending, please check your card").
- ✅ Rang ma'noga mos: success — muvaffaqiyat, danger — xato. ❌ Rangni bezak uchun tanlash.
- Holat faqat rang bilan ko'rsatilmaydi — matn doim bor.
