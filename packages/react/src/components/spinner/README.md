# Spinner

Figma: **9.1 Slots & Helpers → \_Spinner**. Yuklanish belgisi; Button va Input ichida ham ishlatiladi.

```tsx
<Spinner />                         // 16 px, role="status", "Loading"
<Spinner size={24} label="Yuklanmoqda" />
<button disabled>Saqlash <Spinner label={null} /></button>  // tugma o'zi holatni aytadi
```

| Prop    | Qiymatlar          | Default     |
| ------- | ------------------ | ----------- |
| `size`  | `16` · `20` · `24` | `16`        |
| `label` | `string` · `null`  | `"Loading"` |

Rang `currentColor`. Aylanish 8 qadamda (0.8 s); `prefers-reduced-motion` da sekinlashadi.
