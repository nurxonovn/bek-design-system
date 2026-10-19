# Calendar heatmap

Figma: **4.18 Chart · Calendar heatmap** — kunlik faollik yil yoki oy bo'yicha, rang — miqdor. `variant`: `year` · `month`.

```tsx
<CalendarHeatmap
  variant="year"
  data={[{ date: '2026-10-12', value: 24 }]}
  bins={[0, 5, 15, 30]}
  unit="payments"
  label="Payments per day in 2026: busiest in spring"
/>
```

- **Qachon:** kunlik faollik, tranzaksiyalar, kirishlar; haftalik va mavsumiy naqshlarni ko'rish. Aniq qiymat muhim bo'lsa — kunlik `BarChart`.
- **Kodlash:** katak = sana, rang = `bins` bo'yicha daraja. Year: `dataviz/sequential` 200 · 300 · 500 · 700, nol — `dataviz/track`. Month (kataklarda sana matni bor) — faqat 200 · 300 · 600 · 700 (`textCellLevel`, CMP-07): 200/300 da `text/primary`, 600/700 da `text/inverse`.
- **Qoidalar:** hafta dushanbadan boshlanadi (uz-UZ); Less → More shkalasi doim ko'rinadi. Mobile: Year to'ri gorizontal aylanadi, hafta kunlari joyida qoladi.
- **Interaksiya:** hover — katak `border/focus` bilan ajraladi, `<title>` sana va qiymatni aytadi ("12 Oct, 24 payments"). Kunni tanlash (dashboard filtri) — ota komponentda.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval (sana → qiymat).
- **O'lchamlar:** Year plot `scale/104` (katak `scale/10`, oraliq `scale/2`; tor ekranda katak kichrayadi, 8 px dan keyin aylanadi), Month to'ri `scale/200` — shakl buzilmaydi. Matn Caption/S · `dataviz/label`. `monthLabels`, `weekdayLabels` — mahalliy nomlar uchun.
