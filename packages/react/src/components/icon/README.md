# Icon

Figma: **9.1 Slots & Helpers → \_Icon**. Ikonka uchun o'lchamli slot; ikonkalarning o'zi — alohida **BEK Icons** kutubxonasidan (Style=Stroke, Type=Standard).

```tsx
<Icon size={20}><SearchIcon /></Icon>              // bezak — ekran o'quvchidan yashirin
<Icon size={24} label="Qidirish"><SearchIcon /></Icon>  // yolg'iz ma'no tashiydi
```

| Prop    | Qiymatlar                                                      | Default |
| ------- | -------------------------------------------------------------- | ------- |
| `size`  | `12` · `16` · `20` · `24` · `32` (icon/xs · sm · md · lg · xl) | `16`    |
| `label` | `string` — bo'lsa `role="img"`, bo'lmasa `aria-hidden`         | —       |

Rang `currentColor` — ota elementning matn rangidan olinadi.
