# Tabs

Figma: **6.1 Tabs** (Tab item + Tabs). Bir sahifadagi bo'limlar orasida almashish — WAI-ARIA tabs.

```tsx
import { Tab, TabList, TabPanel, Tabs } from '@bek-ui/react';

<Tabs defaultValue="overview" type="underline" size="m">
  <TabList aria-label="Product" width="hug">
    <Tab value="overview">Overview</Tab>
    <Tab value="reviews" badge={12}>
      Reviews
    </Tab>
    <Tab value="faq" disabled>
      FAQ
    </Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="reviews">…</TabPanel>
</Tabs>;
```

| Komponent  | Prop                                       | Qiymatlar                                        | Default     |
| ---------- | ------------------------------------------ | ------------------------------------------------ | ----------- |
| `Tabs`     | `value` · `defaultValue` · `onValueChange` | tanlangan tab                                    | —           |
| `Tabs`     | `type`                                     | `underline` · `pill` · `segmented`               | `underline` |
| `Tabs`     | `size`                                     | `s` 32 · `m` 40 · `l` 48 px                      | `m`         |
| `TabList`  | `width`                                    | `hug` · `fill`                                   | `hug`       |
| `Tab`      | `value` · `icon` · `badge` · `disabled`    | ikonka s 16 · m 20 · l 24; badge Subtle Accent S | —           |
| `TabPanel` | `value` · `keepMounted`                    | tanlanmagan panelni DOM'da saqlash               | `false`     |

- **Underline** — sahifa bo'limlari: qator gap 24, pastda `border/default`; Active — `text/accent` + 2 px `accent/default` indikator; Hover — `fill/soft` + `fill/control` indikator.
- **Pill** — filtrlar qatori: gap 8; Active — `accent/default` + `text/on-color`; Hover — `fill/soft-hover`.
- **Segmented** — ixcham almashtirgich: konteyner `fill/soft-hover`, padding 2, radius 8; Active — `surface/raised` + `Elevation/1`.
- Matn Label/M (L — Label/L); Disabled — `text/disabled`. Padding s 12 · m/l 16; gap s/m 8 · l 12.
- Klaviatura: ← → (RTL'da teskari), Home, End — fokus bilan birga tanlanadi (roving tabindex). Panel `aria-labelledby` bilan bog'langan.

## Do / Don't

- ✅ 2–5 ta qisqa nom. ❌ Sahifalar orasida navigatsiya uchun Tabs (buning uchun Navigation).
- ✅ Ko'p tab bo'lsa — gorizontal scroll. ❌ Ikki qatorga o'tkazish.
