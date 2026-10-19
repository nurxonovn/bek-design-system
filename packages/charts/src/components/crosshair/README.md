# Crosshair

Figma: **4.18 Chart · Crosshair** — ko'rsatkich ortidan yuruvchi chiziq, eng yaqin nuqtaga yopishadi, o'qlarda qiymat teglari. SVG `<g>` bo'lagi. `variant`: `vertical` · `both`.

```tsx
const i = crosshairNearest(points.map((p) => p.x), pointerX);
<svg role="img" aria-label="Revenue by day" width={480} height={200}>
  {/* … chiziq … */}
  {i >= 0 && <ChartCrosshair x={points[i].x} y={points[i].y} xLabel="12 Oct" left={40} />}
</svg>
<ChartCrosshair variant="both" x={140} y={80} xLabel="12 Oct" yLabel="4 820" standalone right={240} />
```

- **Qachon:** Line, Area, Live va Forecast chartlarda hover o'qish; `both` — X va Y muhim bo'lgan scatter / bubble. Bar chartda emas — ustunning o'zi ajraladi.
- **Kodlash:** x ← ko'rsatkich → eng yaqin `datum.x` (`crosshairNearest`), y ← `datum.y`. Doim ma'lumotga yopishadi, nuqtalar orasidagi qiymat ko'rsatilmaydi.
- **Interaksiya:** bu komponent faqat ko'rinish. Chart sichqoncha harakati / uzoq bosib sudrashni (Mobile'da scroll ishlashi uchun faqat long-press) va fokusda ←/→ qadamni role="img" SVG'dan tashqaridagi qatlamda ushlaydi; Esc yashiradi; bosish qulflaydi. Chart/Tooltip bilan birga: X tegi — sana, Y tegi — qiymat.
- **A11y:** chiziq bezak (`aria-hidden`); qiymatlar `aria-live` orqali aytiladi (chart beradi).
- **O'lchamlar:** chiziq `dataviz/axis` · `chart/grid/stroke`; nuqta Chart/Data point Active (`chart/point/size-active` + `accent/soft` halo); teglar `fill/inverse` + Label/S · `text/inverse`, padding `scale/2` × `scale/8`, `radius/full`. Plot balandligi `chart/height/md`.
