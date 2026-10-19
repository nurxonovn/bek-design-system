# Bar chart

Figma: **4.18 Chart · Bar** — kategoriyalar bo'yicha qiymatlarni solishtirish; ustun doim 0 dan. `variant`: `vertical` · `grouped` · `stacked` · `horizontal`.

```tsx
<ChartContainer>
  {(width) => (
    <BarChart
      width={width}
      variant="grouped"
      series={[{ name: '2026' }, { name: '2025' }]}
      data={[
        { label: 'Jan', values: [42, 35] },
        { label: 'Feb', values: [51, 40] },
      ]}
      label="Orders 2026 vs 2025: higher every month"
    />
  )}
</ChartContainer>
```

- **Qachon:** 2–12 kategoriya. Grouped ≤ 3 seriya, Stacked ≤ 4 segment (qismlar yig'indisi), Horizontal — uzun nomlar va reyting (Mobile'da 6+ kategoriya bo'lsa ham).
- **Kodlash:** x = kategoriya, y = qiymat (0 dan), rang = seriya (`dataviz/categorical/0i`), radius (`chart/bar/radius`) faqat qiymat uchida.
- **Interaksiya:** hover — qolgan ustunlar 40%, `<title>` qiymatni aytadi; drill-down uchun ota komponent bosishni ushlaydi.
- **A11y:** `role="img"` + `label` xulosa, ko'rinmas `<table>` ma'lumot nusxasi; rang yolg'iz ma'no tashimaydi (legend + jadval).
- **O'lchamlar:** plot `chart/height/md` (200 / 240 / 320), qalinlik `chart/bar/thickness` (16 / 24 / 32) → `barThickness`, tick `chart/axis/tick-count` (4 / 5 / 6) → `ticks`. Responsiv en — `ChartContainer`.
- Matn: o'q Caption/S · `dataviz/label`; Horizontal kategoriya Caption/L · `text/secondary`, qiymat Label/S · `text/primary`.
