# Streamgraph

Figma: **4.18 Chart · Streamgraph** — markaz chizig'i atrofida oqadigan stacked maydonlar; kategoriyalar aralashmasi vaqt bo'yicha qanday o'sib-so'nishini ko'rsatadi. `variant`: `default` (silhouette) · `expanded` (100%).

```tsx
<Streamgraph
  variant="default"
  series={['Mobile app', 'Web', 'Telegram bot', 'Partners', 'Offline']}
  data={[
    { date: 'Jan', series: 'Mobile app', value: 420 },
    { date: 'Jan', series: 'Web', value: 260 },
    { date: 'Feb', series: 'Mobile app', value: 470 },
  ]}
  label="Traffic by channel: Telegram bot grew fastest since May"
/>
```

- **Qachon:** vaqt bo'yicha aralashma (kanal bo'yicha trafik, mahsulot liniyasi bo'yicha daromad) — umumiy shakl va yangi kategoriyaning o'sishi aniq qiymatdan muhimroq. `expanded` — faqat ulushlar muhim bo'lsa (100%).
- **Kodlash:** x ← vaqt (point), stacked y ← qiymat: `default` — d3 `stackOffsetSilhouette`, `expanded` — `stackOffsetExpand` (0 / 50 / 100% yozuvlari bilan); rang ← seriya (`dataviz/categorical/0i`, mahsulotdagi boshqa joylar bilan bir xil). Qatlamlar orasida `surface/card` ingichka chegara.
- **Qoidalar:** 3–7 seriya, uzun dumni «Other» ga yig'ing. Eng katta yoki barqaror seriya — pastda (`expanded`) yoki markazda (`default`); tartib `series` bilan. Aniq solishtirish uchun emas — faqat pastki qatlamning asosi tekis; aniq qiymat kerak bo'lsa Line (Multi) yoki Bar (Stacked). Bitta seriya — Line (Area) ishlating.
- **Interaksiya:** qatlam ustida hover — qolganlari 0,3, `<title>` seriya jami va ulushini aytadi. Legend toggle: `hiddenSeries` + `onToggleSeries` — yashirilgan seriya olib tashlanadi, oqimlar qayta oqadi. Sana bo'yicha crosshair + tooltip kerak bo'lsa — ota komponentda Crosshair / ChartTooltip bilan.
- **A11y:** `role="img"` + `label`; ko'rinmas jadval: har sana × seriya qiymati (`expanded` da ulush bilan) va jami. Legend matn bilan — rang yolg'iz ma'no tashimaydi.
- **O'lchamlar:** chizma `scale/480` × `scale/200`, legend ostida (`chart/gap`, `chart/legend/gap`). Vaqt o'qi Caption/S · `dataviz/label`, o'q chizig'i `dataviz/axis`; legend Caption/L · `text/secondary` (ChartLegend).
