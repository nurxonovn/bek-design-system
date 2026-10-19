# Scatter chart

Figma: **4.18 Chart · Scatter** — ikki son o'zgaruvchi orasidagi bog'liqlik; Bubble uchinchisini qo'shadi, Trend line — regressiya va uning oralig'i. `variant`: `default` · `bubble` · `trend-line`.

```tsx
<ScatterChart
  variant="trend-line"
  seriesName="Clients"
  xLabel="Income, mln"
  yLabel="Spend, mln"
  data={clients.map((c) => ({ x: c.income, y: c.spend, label: c.name }))}
  label="Spend correlates with income"
/>
```

- **Qachon:** ikki o'lchov birga o'zgaradimi (daromad va xarajat, risk va daromadlilik); 20–1 000 element ichida klaster va chetlanishlarni topish. Vaqt qatori uchun emas — `LineChart`.
- **Kodlash:** x ← 1-o'zgaruvchi, y ← 2-o'zgaruvchi, o'lcham ← 3-o'zgaruvchi (`bubble`, yuza bo'yicha), rang ← guruh (`seriesColor(i)`; Bubble'da ≤ 2 guruh). Nuqta `chart/point/size` (8), shaffoflik 85%; Bubble 60%.
- **Trend line:** `dataviz/target` uzuq chiziq + 95% ishonch oralig'i (`dataviz/grid`). `trend` berilmasa — eng kichik kvadratlar. Korrelyatsiya `scatterCorrelation(points)` bilan; jadval sarlavhasiga `r = 0,82` qo'shiladi.
- **Qoidalar:** ikkala o'q birligi bilan (`xLabel`, `yLabel`); 0 dan faqat ma'noli bo'lsa. ~1 000 dan ortiq nuqtada zichlik ko'rinishiga o'ting. "Bog'liq" deng, "sabab" emas.
- **Interaksiya:** hover — nuqta kattalashadi, `<title>` element nomi va qiymatlarini aytadi. Brush (Web) va legend orqali guruhni yashirish — ota komponentda (`data` filtri).
- **A11y:** `role="img"` + `label` (korrelyatsiya xulosasi bilan), ko'rinmas jadval.
- **O'lchamlar:** plot `chart/height/md` (200 / 240 / 320); Y ustuni `scale/32`, o'q oralig'i `chart/axis/label-gap`. O'q yozuvi Caption/S · `dataviz/label`, legend Caption/L · `text/secondary` (ChartLegend).
