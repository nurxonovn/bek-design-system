# TextField

Figma: **3.2 Text field**. Matn kiritish maydoni: label maydon ichida (bo'sh holatda katta, qiymat yoki focus bo'lganda yuqoriga ko'tariladi), yordamchi matn pastda.

```tsx
import { TextField } from '@bek-ui/react';

<TextField label="Email" type="email" />
<TextField label="Telefon" placeholder="+998 __ ___ __ __" supportingText="SMS kod yuboriladi" />
<TextField label="Karta" error supportingText="Karta raqami noto'g'ri" />
<TextField variant="outlined" size="l" leadingIcon={<SearchIcon />} loading />
<TextField label="Summa" prefix="UZS" suffix=".00" inputMode="decimal" />
<TextField variant="underlined" size="2xl" label="Telefon" prefix="+998" type="tel" />
```

| Prop             | Qiymatlar                                                           | Default  |
| ---------------- | ------------------------------------------------------------------- | -------- |
| `label`          | `string`                                                            | —        |
| `supportingText` | `ReactNode` — yordam yoki xato matni                                | —        |
| `error`          | `boolean` — `aria-invalid`, qizil chegara                           | `false`  |
| `variant`        | `filled` · `outlined` · `underlined`                                | `filled` |
| `size`           | `s` 36 · `m` 44 · `l` 56 · `xl` 64 · `2xl` 72 px (`field/height/*`) | `m`      |
| `prefix`         | `ReactNode` — valyuta, `+998` (Show prefix)                         | —        |
| `suffix`         | `ReactNode` — birlik, `.00` (Show suffix)                           | —        |
| `leadingIcon`    | `ReactNode` — slot 32 (s, m) · 40 (l, xl, 2xl)                      | —        |
| `trailingIcon`   | `ReactNode` — tozalash, ko'rsatish, kalendar                        | —        |
| `loading`        | o'ngda spinner                                                      | `false`  |
| `skeleton`       | faqat maydon shakli                                                 | `false`  |

Qolgan `<input>` atributlari (`value`, `onChange`, `type`, `name`, `disabled` …) input'ga o'tadi; `ref` — input'ga; `className` — tashqi o'ramga.

- **Filled** — default, `fill/soft` fon. **Outlined** — focus va xatoda `bg/sheet` fon. **Underlined** — fonsiz, pastki chiziq `border/default` 1 px (hover — `fill/soft`, focus — `border/accent` 2 px, xato — `border/danger` 2 px, disabled — `border/hairline`). Underlined L–2XL — login / onboarding uslubi; `2xl` (72, qiymat Headline/S) faqat Underlined bilan.
- `variant="plain"` — eski nom (deprecated): Figma'da Plain o'rniga Underlined keldi, endi `underlined` sifatida chiziladi.
- Balandlik `field/height/*` — yonidagi Button shu balandlikda bo'ladi: S ↔ Button L, M ↔ XL, L ↔ 2XL, XL ↔ 3XL (Figma 1.12 Forms · height pairing).
- Prefix / Suffix — qiymat uslubida, `text/tertiary`; label doim yuqorida (suzuvchi) turadi. Ekran o'quvchi uchun `aria-describedby` ga qo'shiladi.
- Focus — `border/focus` 2 px halqa, 2 px oraliq. Xato — `border/danger` 1 px + qizil yordamchi matn; xato faqat rang bilan emas, matn bilan ham aytiladi.
- Mobile va Tablet'da qiymat 16 px (iOS zoom qilmasligi uchun) — `s` o'lchamda `Label/Input` tokeni shuni ta'minlaydi.
- Maydon qobig'i (`.bek-field*`) Select va Textarea bilan umumiy: `src/styles/field.css`.
