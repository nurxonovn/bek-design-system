# TextField

Figma: **3.2 Text field**. Matn kiritish maydoni: label maydon ichida (bo'sh holatda katta, qiymat yoki focus bo'lganda yuqoriga ko'tariladi), yordamchi matn pastda.

```tsx
import { TextField } from '@bek-ui/react';

<TextField label="Email" type="email" />
<TextField label="Telefon" placeholder="+998 __ ___ __ __" supportingText="SMS kod yuboriladi" />
<TextField label="Karta" error supportingText="Karta raqami noto'g'ri" />
<TextField variant="outlined" size="l" leadingIcon={<SearchIcon />} loading />
```

| Prop             | Qiymatlar                                    | Default  |
| ---------------- | -------------------------------------------- | -------- |
| `label`          | `string`                                     | —        |
| `supportingText` | `ReactNode` — yordam yoki xato matni         | —        |
| `error`          | `boolean` — `aria-invalid`, qizil chegara    | `false`  |
| `variant`        | `filled` · `outlined` · `plain`              | `filled` |
| `size`           | `s` 36 · `m` 44 · `l` 56 · `xl` 64 px        | `m`      |
| `leadingIcon`    | `ReactNode` — slot 32 (s, m) · 40 (l, xl)    | —        |
| `trailingIcon`   | `ReactNode` — tozalash, ko'rsatish, kalendar | —        |
| `loading`        | o'ngda spinner                               | `false`  |
| `skeleton`       | faqat maydon shakli                          | `false`  |

Qolgan `<input>` atributlari (`value`, `onChange`, `type`, `name`, `disabled` …) input'ga o'tadi; `ref` — input'ga; `className` — tashqi o'ramga.

- **Filled** — default, kulrang fon. **Outlined** — focus'da `fill/primary` fon. **Plain** — fonsiz, hover'da yumshoq fon.
- Focus — `border/focus` 2 px halqa, 2 px oraliq. Xato — `border/danger` 1 px + qizil yordamchi matn; xato faqat rang bilan emas, matn bilan ham aytiladi.
- Mobile va Tablet'da qiymat 16 px (iOS zoom qilmasligi uchun) — `s` o'lchamda `Label/Input` tokeni shuni ta'minlaydi.
- Maydon qobig'i (`.bek-field*`) Select va Textarea bilan umumiy: `src/styles/field.css`.
