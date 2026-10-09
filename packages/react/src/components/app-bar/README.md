# AppBar

Figma: **6.5 App bar**. Ekran yuqorisidagi sticky panel: orqaga, sarlavha yoki qidiruv, amallar.

```tsx
import '@bek/tokens/materials.css'; // scrolled holat uchun Glass/Regular
import { AppBar } from '@bek/react';

<AppBar title="Orders" onBack={goBack} scrolled={scrollY > 0}
  actions={<Button variant="flat" size="l" iconOnly startIcon={<HeartIcon />}>Favourites</Button>} />
<AppBar leading={<BekLogo size="s" />} actions={…}><TextField size="s" placeholder="Search" /></AppBar>
```

| Prop       | Qiymatlar                                | Default |
| ---------- | ---------------------------------------- | ------- |
| `size`     | `s` 56 (mobil) · `m` 64 (planshet, web)  | `s`     |
| `scrolled` | kontent ostidan o'tganda — Glass/Regular | `false` |
| `onBack`   | orqaga tugmasi (`backLabel`)             | —       |
| `leading`  | logo va h.k.                             | —       |
| `title`    | Title/M (M — Title/L), `<h1>`            | —       |
| `children` | sarlavha o'rnida (qidiruv maydoni)       | —       |
| `actions`  | 1–3 ta icon-only tugma                   | —       |

- Tokenlar: `fill/primary`, gap 12, yon padding `layout/page-margin`, `z/sticky`. Scrolled=Off — chegarasiz (ajralish faqat scrollda, Glass bilan).
