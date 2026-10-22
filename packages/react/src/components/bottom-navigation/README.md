# BottomNavigation

Figma: **6.7 Bottom navigation** (+ Bottom nav item). Mobil pastki navigatsiya: 3–5 manzil.

```tsx
import { BottomNavigation, BottomNavItem } from '@bek-ui/react';

<BottomNavigation>
  <BottomNavItem href="/" icon={<HomeIcon />} selectedIcon={<HomeSolidIcon />} selected>Home</BottomNavItem>
  <BottomNavItem href="/search" icon={<SearchIcon />} badge="dot">Search</BottomNavItem>
  <BottomNavItem href="/cart" icon={<CartIcon />} badge={3}>Cart</BottomNavItem>
</BottomNavigation>
<BottomNavigation variant="floating">…</BottomNavigation>
```

| Prop                     | Qiymatlar                                   | Default |
| ------------------------ | ------------------------------------------- | ------- |
| `variant`                | `bar` (chetdan-chetga) · `floating` (pill)  | `bar`   |
| `BottomNavItem.icon`     | 24 px Stroke ikonka; `selectedIcon` — Solid | —       |
| `BottomNavItem.badge`    | `'dot'` · son (99 dan katta — "99+")        | —       |
| `BottomNavItem.selected` | `aria-current="page"`, `text/accent`        | `false` |
| `hideLabel`              | nomni vizual yashirish                      | `false` |

- Bar: 64 + safe area, `surface/raised`, `Elevation/1`, padding 0 8. Floating: radius full, 16 px chetdan, `Elevation/3`. Element 56 balandlik, min 48 kenglik, nom Caption/S; Pressed `fill/soft`; badge `status/danger/default`.
