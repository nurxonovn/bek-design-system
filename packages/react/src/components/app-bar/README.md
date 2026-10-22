# AppBar

Figma: **6.5 App bar**. Ekran yuqorisidagi sticky panel: orqaga, sarlavha yoki qidiruv, amallar.
`variant`: `title` · `search` · `brand`; `size`: `s` · `m`.

```tsx
import '@bek-ui/tokens/materials.css'; // scrolled holat uchun Glass/Regular
import { AppBar } from '@bek-ui/react';

<AppBar title="Orders" onBack={goBack} scrolled={scrollY > 0}
  actions={<Button variant="flat" size="l" iconOnly startIcon={<HeartIcon />}>Favourites</Button>} />
<AppBar variant="search" onBack={goBack}><SearchBar placeholder="Search" /></AppBar>
<AppBar variant="brand" leading={<BekLogo size="s" />} actions={…}><SearchBar placeholder="Search" /></AppBar>
// Figma "Show count" — bildirishnoma tugmasi ustidagi hisoblagich: actions ichida Badge
<AppBar title="Inbox" actions={<span style={{ position: 'relative' }}><Button variant="flat" size="l" iconOnly startIcon={<BellIcon />}>Notifications</Button><Badge color="danger" size="s">3</Badge></span>} />
```

| Prop       | Qiymatlar                                                                            | Default |
| ---------- | ------------------------------------------------------------------------------------ | ------- |
| `variant`  | `title` (orqaga + sarlavha) · `search` (orqaga + qidiruv) · `brand` (logo + qidiruv) | `title` |
| `size`     | `s` 56 (mobil) · `m` 64 (planshet, web)                                              | `s`     |
| `scrolled` | kontent ostidan o'tganda — Glass/Regular (`glass/tint`) + `Elevation/1`              | `false` |
| `onBack`   | orqaga tugmasi (`backLabel`)                                                         | —       |
| `leading`  | logo va h.k.                                                                         | —       |
| `title`    | Title/M (M — Title/L), `<h1>`                                                        | —       |
| `children` | sarlavha o'rnida (qidiruv maydoni — SearchBar, 36 px, `fill/secondary`)              | —       |
| `actions`  | 1–3 ta icon-only tugma                                                               | —       |

- Tokenlar: `fill/primary`, gap 12, yon padding `layout/page-margin`, `z/sticky`. Scrolled=Off — chegarasiz (ajralish faqat scrollda: `glass/tint` + `glass/tint-shade`, blur 16, `Elevation/1`; `materials.css` ulansa to'liq Glass/Regular).
- `search`/`brand` da `title` berilsa `<h1>` ekran o'quvchi uchun yashirin qoladi. Hisoblagich (`Show count`) — amal tugmasi ustidagi `Badge` (`status/danger`).
