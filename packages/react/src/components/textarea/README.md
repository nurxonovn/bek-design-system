# Textarea

Figma: **3.7 Textarea** — ko'p qatorli matn, yordamchi qatorning o'ng tomonida belgi hisoblagichi.

```tsx
<Textarea label="Izoh" maxLength={500} showCount supportingText="Ixtiyoriy" />
```

| Prop        | Qiymatlar                                 | Default  |
| ----------- | ----------------------------------------- | -------- |
| `size`      | `s` 80 · `m` 104 · `l` 128 px (min)       | `m`      |
| `showCount` | `"5/500"` hisoblagich (`maxLength` bilan) | `false`  |
| `variant`   | `filled` · `outlined` · `plain`           | `filled` |

`label`, `placeholder`, `supportingText`, `error`, `skeleton` — TextField kabi. Balandlikni foydalanuvchi pastga cho'zishi mumkin (`resize: vertical`).
