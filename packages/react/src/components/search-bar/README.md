# SearchBar

Figma: **3.12 Search bar** — ro'yxat va katalog uchun pill qidiruv. `size`: `m` 36 (zich UI) · `l` 44 (touch).

```tsx
<SearchBar
  aria-label="Mahsulot qidirish"
  placeholder="Mahsulot qidirish"
  value={q}
  onChange={(e) => setQ(e.target.value)}
  onClear={() => setQ('')}
  onCancel={close}
  cancelLabel="Bekor qilish"
/>
```

`role="search"` o'ram, `type="search"` input. Qiymat bo'lsa — tozalash (×); `onCancel` berilsa focus paytida "Cancel" matn tugmasi chiqadi. Focus'da maydon `surface/raised` ga ko'tariladi. Natijalar yozish bilan yangilanadi — alohida "Qidirish" tugmasi shart emas.
