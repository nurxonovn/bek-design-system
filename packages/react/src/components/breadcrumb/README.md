# Breadcrumb

Figma: **6.3 Breadcrumb**. Sahifaning ierarxiyadagi o'rni; oxirgi qadam — joriy sahifa.

```tsx
import { Breadcrumb } from '@bek/react';

const items = [
  { label: 'Home', href: '/', icon: <HomeIcon /> },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Phones', href: '/catalog/phones' },
  { label: 'iPhone 16' },
];

<Breadcrumb items={items} />                                        // web
<Breadcrumb items={items} layout="collapsed" onOverflowClick={openMenu} /> // planshet
<Breadcrumb items={items} layout="back" />                          // mobil: ‹ Phones
```

| Prop              | Qiymatlar                                             | Default             |
| ----------------- | ----------------------------------------------------- | ------------------- |
| `items`           | `{ label, href?, icon?, onClick? }[]`                 | —                   |
| `size`            | `s` Body/S · `m` Body/M                               | `s`                 |
| `layout`          | `full` · `collapsed` ("…" yashirin qadamlar) · `back` | `full`              |
| `onOverflowClick` | `(hidden, event)` — Dropdown menu ochish uchun        | —                   |
| `overflowLabel`   | "…" tugmasi nomi                                      | `Show hidden pages` |

- Tokenlar: havola `text/secondary` (hover — `text/primary` + tagiga chiziq), joriy — `text/primary` Strong (`aria-current="page"`), ajratuvchi chevron 16 `text/tertiary`, "…" hover `fill/tertiary`. Qadamlar gap 2, element padding 0 4, radius 4.
- `<nav aria-label="Breadcrumb">` + `<ol>`; RTL'da chevronlar teskari.

## Do / Don't

- ✅ Uy ikonkasi faqat birinchi qadamda. ❌ Breadcrumb'ni asosiy navigatsiya o'rnida ishlatish.
