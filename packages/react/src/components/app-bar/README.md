# AppBar

Figma: **6.5 App bar**. Ekran yuqorisidagi sticky panel: orqaga, sarlavha yoki qidiruv, amallar.
`variant`: `title` · `search` · `brand`; `size`: `s` · `m`.

```tsx
import { AppBar, Avatar, Badge, Button } from '@bek-ui/react';

<AppBar title="Orders" onBack={goBack} scrolled={scrollY > 0}
  actions={<Button variant="flat" size="xl" iconOnly startIcon={<HeartIcon />}>Favourites</Button>} />
// Search · Brand — qidiruv maydoni Figma'dagi kabi SearchField (3.12) instance'i
<AppBar variant="search" onBack={goBack} search={{ 'aria-label': 'Search', value: q, onChange }} />
<AppBar variant="brand" size="m" leading={<BekLogo size="s" />} search={{ 'aria-label': 'Search' }} actions={…} />
// Figma "Show count" — bildirishnoma tugmasi ustidagi hisoblagich; "Show action 3" — Avatar
<AppBar title="Inbox" actions={<>
  <span style={{ position: 'relative' }}><Button variant="flat" size="xl" iconOnly startIcon={<BellIcon />}>Notifications</Button><Badge color="danger" size="s">3</Badge></span>
  <Avatar size="s" name="Nurbek" />
</>} />
```

| Prop       | Figma                       | Qiymatlar                                                                            | Default |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------ | ------- |
| `variant`  | Variant                     | `title` (orqaga + sarlavha) · `search` (orqaga + qidiruv) · `brand` (logo + qidiruv) | `title` |
| `size`     | Size                        | `s` 56 (mobil) · `m` 64 (planshet, web)                                              | `s`     |
| `scrolled` | Scrolled                    | kontent ostidan o'tganda — `surface/card` + `border/hairline` + `Elevation/1`        | `false` |
| `onBack`   | Show back                   | orqaga tugmasi (Button Flat XL 44, `backLabel`)                                      | —       |
| `leading`  | Logo                        | logo va h.k.                                                                         | —       |
| `title`    | Title                       | Title/M (M — Title/L), `<h1>`                                                        | —       |
| `search`   | Search field                | `SearchField` prop'lari; Filled, o'lcham bar bilan: S → `s` 36 · M → `m` 44          | —       |
| `children` | —                           | sarlavha o'rnida o'z mazmuningiz (`search` dan ustun)                                | —       |
| `actions`  | Show action 1–3, Show count | 1–3 ta amal: icon-only Button Flat XL, Badge hisoblagich, Avatar                     | —       |

- Tokenlar: Scrolled=Off — `bg/base`, chegarasiz va soyasiz (bar ekran bilan bitta qatlam); Scrolled=On —
  `surface/card` + pastki 1 px `border/hairline` + `Elevation/1` (ajralish faqat scrollda). Gap 12, amallar orasi 8
  (`scale/8`), yon padding `layout/page-margin` (16 · 24 · 32), `z/sticky`. Tegish maydoni ≥ 44.
- Sarlavhani qisqa tuting, barda ko'pi bilan uchta amal; uzun sarlavha amallarni siqib chiqarmasin — qisqartiring
  yoki tafsilotni sahifaga o'tkazing.
- `search`/`brand` da `title` berilsa `<h1>` ekran o'quvchi uchun yashirin qoladi. Hisoblagich (`Show count`) —
  amal tugmasi ustidagi `Badge` (`status/danger`). `search` ga `aria-label` bering.
