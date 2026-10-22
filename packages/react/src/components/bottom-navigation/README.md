# BottomNavigation

Figma: **6.7 Bottom navigation** (+ Bottom nav group, Bottom nav item). Mobil va planshet uchun yagona pastki
navigatsiya: boshida **Dual** kapsula (ikki nomli manzil), oxirida **Solo** dumaloq kapsula (bitta icon-only manzil).
Fon shaffof — kontent ustida turadi.

```tsx
import { BottomNavGroup, BottomNavItem, BottomNavigation } from '@bek-ui/react';

<BottomNavigation>
  <BottomNavGroup variant="dual">
    <BottomNavItem href="/" icon={<HomeSolidIcon />} selected>Home</BottomNavItem>
    <BottomNavItem href="/courses" icon={<BookSolidIcon />}>Courses</BottomNavItem>
  </BottomNavGroup>
  <BottomNavGroup variant="solo">
    <BottomNavItem href="/stats" variant="icon-only" icon={<ChartSolidIcon />}>Statistics</BottomNavItem>
  </BottomNavGroup>
</BottomNavigation>
<BottomNavigation device="tablet">…</BottomNavigation>
```

| Prop                      | Figma          | Qiymatlar                                                             | Default  |
| ------------------------- | -------------- | --------------------------------------------------------------------- | -------- |
| `BottomNavigation.device` | Variant        | `mobile` (yon inset 24) · `tablet` (yon inset 64)                     | `mobile` |
| `BottomNavGroup.variant`  | Variant        | `dual` (ikki nomli manzil, 240×64) · `solo` (bitta icon-only, 64×64)  | —        |
| `BottomNavItem.variant`   | Variant        | `label` (ikonka 24 + nom, 116×56) · `icon-only` (56×56, nom yashirin) | `label`  |
| `BottomNavItem.icon`      | Icon           | 24 px BEK Icons **Solid**; `selectedIcon` — tanlangandagi ikonka      | —        |
| `BottomNavItem.selected`  | State=Selected | `aria-current="page"`, `accent/soft` fon + `text/accent`              | `false`  |
| `BottomNavItem.children`  | Label          | bir so'zli nom (icon-only da ham ekran o'quvchi uchun majburiy)       | —        |
| `BottomNavItem.href`      | —              | berilsa `<a>`, aks holda `<button>`                                   | —        |

- Tokenlar: kapsula `surface/raised` + `Elevation/3 Floating`, `radius/full`, padding 4 (`scale/4`); element
  56 balandlik, padding 6 (`scale/6`), gap 4, nom Label/S (12/16 · medium); Default `text/secondary`, Selected
  `accent/soft` + `text/accent`. Qator: yuqori 16, past 24 (home indicator; `safe-area-inset-bottom` dan kam emas),
  yon 24 (Mobile) / 64 (Tablet). Dark — tokenlardan (soya Dark'da o'chadi).
- Kapsulalar orasidagi bo'sh joy shaffof va bosishni kontentga o'tkazadi (`pointer-events`).
- Fokus — `.bek-focus-ring` (Figma State=Focus). RTL — tartib avtomatik ko'zgulanadi, Dual boshlang'ich tomonda.

## Qoidalar (Figma doc)

- Dual'da ikki nomli manzil + Solo'da bitta icon-only manzil. Solid ikonkalar, bir so'zli nomlar, har ekranda bir xil tartib.
- Dual'ga uchinchi element yoki Solo'ga nom qo'shmang; tanlangan element uchun Stroke ikonka ishlatmang.
- Root ekranlarda ko'rinadi; ichki (pushed) ekranlarda va checkout'da yashiring. Web'da ishlatilmaydi — 6.2 Navigation.

## Eski API

- `variant="bar" | "floating"` — **eskirgan** (Figma'da endi yo'q), e'tiborsiz qoldiriladi.
- `BottomNavigation` ichiga to'g'ridan-to'g'ri `BottomNavItem` lar berilsa, ular bitta kapsulaga o'raladi.
- `hideLabel` — eskirgan, `variant="icon-only"` bilan bir xil. `badge` (`'dot'` · son, 99+ dan keyin "99+") —
  Figma'dan olib tashlangan, moslik uchun saqlangan; yangi dizaynda ishlatmang.
