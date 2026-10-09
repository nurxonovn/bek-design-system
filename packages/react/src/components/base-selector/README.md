# BaseSelector

Figma: **3.11 Base selector** — qisqa variantlar ro'yxatini (xamir, o'lcham, muz, qovurish) ‹ › bilan birma-bir aylantirish, rasm bilan.

```tsx
<BaseSelector
  aria-label="Xamir"
  value={dough}
  onChange={setDough}
  options={[
    { value: 'classic', label: 'Classic', image: <img src="/classic.png" alt="" /> },
    { value: 'thin', label: 'Thin' },
  ]}
/>
```

`variant`: `solid` · `overlay` (mahsulot rasmi ustida); `loading` — skeleton; `showImage` (default `true`). Bitta variant bo'lsa strelkalar chiqmaydi; chetlarda tegishli strelka o'chadi; o'zgarish `aria-live` orqali o'qiladi.
