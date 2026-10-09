# Select

Figma: **3.3 Select** — ro'yxatdan tanlash. Native `<select>` (klaviatura, mobil picker, autofill tayyor) TextField qobig'ida.

```tsx
<Select
  label="Mamlakat"
  placeholder="Tanlang"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
>
  <option value="uz">Oʻzbekiston</option>
  <option value="kz">Qozogʻiston</option>
</Select>
```

Proplar TextField bilan bir xil: `label`, `placeholder`, `supportingText`, `error`, `variant` (`filled` · `outlined` · `plain`), `size` (`s` · `m` · `l` · `xl`, default `m`), `leadingIcon`, `skeleton`. Qolgan `<select>` atributlari o'tadi; `ref` — select'ga.

Figma'dagi "Open" holati (o'q 180° buriladi) native ro'yxatda brauzer tomonidan chiziladi. Qidiruvli yoki maxsus ko'rinishli ro'yxat kerak bo'lsa — Dropdown menu (7.4) bilan alohida komponent bo'ladi.
