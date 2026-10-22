# TopNavigation

Figma: **6.6 Top navigation**. Mobil/planshet ekran yuqorisidagi panel. Web uchun — `AppHeader` (6.2).

```tsx
import { TopNavigation } from '@bek-ui/react';

<TopNavigation title="Product" onLeadingClick={goBack} actions={<ShareButton />} />
<TopNavigation type="large-title" title="Profile" leading="none" />
<TopNavigation type="search" leading="menu" onLeadingClick={openDrawer}>
  <SearchBar placeholder="Search" />
</TopNavigation>
<TopNavigation background="transparent" title="Gallery" />   // rasm ustida
```

| Prop                              | Qiymatlar                                         | Default    |
| --------------------------------- | ------------------------------------------------- | ---------- |
| `type`                            | `standard` · `large-title` · `search`             | `standard` |
| `leading`                         | `back` · `close` · `menu` · `none`                | `back`     |
| `onLeadingClick` · `leadingLabel` | chap tugma va uning nomi                          | —          |
| `title`                           | Title/M markazda; Large title — Headline/L pastda | —          |
| `actions`                         | 2 tagacha Flat XL icon tugma yoki avatar          | —          |
| `background`                      | `solid` (`bg/sheet`) · `transparent`              | `solid`    |

- Bar 56, padding 0 8, gap 8; tugmalar 44 (touch target). Transparent — tugmalar `fill/on-media`, matn `text/on-color`. Status bar ustida joylashadi; RTL'da orqaga chevron teskari.
