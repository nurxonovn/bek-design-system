# Axis

Figma: **4.18 Chart · Axis** — qiymat (Y) va kategoriya / vaqt (X) o'qi yozuvlari, SVG `<g>` bo'lagi. `variant`: `y` · `x`.

```tsx
const y = scaleLinear().domain([0, 100]).range([180, 4]).nice(4);
<svg role="img" aria-label="Orders by month" width={480} height={200}>
  <ChartAxis scale={y} x={40} ticks={4} />
  <ChartAxis variant="x" y={188} labels={months.map((m, i) => ({ x: band(i), label: m }))} />
</svg>;
```

- **Qachon:** har dekart chartda (Bar, Line, Area, Live, Forecast, Waterfall). Sparkline va KPI mikro-chartlarda yashiring.
- **Kodlash:** Y bo'linmalari ← `nice(domain, tick-count)` — yumaloq qadamlar (0 · 25 · 50 · 75 · 100), uz-UZ qisqa format (`4,8 mln`, birlik subtitle'da bir marta). X ← kategoriya / vaqt oralig'i.
- **Qoidalar:** Y o'ngdan tekislangan, plotdan `chart/axis/label-gap` (8) chapda; X markazlangan, birinchi va oxirgi yozuv doim ko'rinadi. Sig'masa yozuvlar aylantirilmaydi — qisqartiring (Jan, Feb) yoki `thinAxisLabels` har ikkinchisini tashlaydi (`minGap`).
- **Interaksiya:** yo'q.
- **A11y:** bo'linmalar bezak (`aria-hidden`) — ma'lumot jadvali (`DataTable`) bor; o'q nomlari chart `label` ida.
- **O'lchamlar:** `chart/axis/tick-count` 4 / 5 / 6 → `ticks`, `chart/height/md` 200 / 240 / 320. Matn Caption/S · `dataviz/label` (`.bek-chart__tick`). `standalone` — o'z SVG'ida (Y 40 × 200, X 480 × 16).
