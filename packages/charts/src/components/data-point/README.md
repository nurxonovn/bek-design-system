# Data point

Figma: **4.18 Chart · Data point** — chiziq yoki scatter'dagi bitta qiymat (SVG `<g>` bo'lagi). `variant`: `default` · `active` · `anomaly`.

```tsx
<svg role="img" aria-label="Revenue, 7 days" width={480} height={200}>
  {/* … chiziq … */}
  <ChartPoint x={412} y={64} variant="active" color={seriesColor(0)} title="12 Oct, Revenue 4 820 mln" />
  <ChartPoint x={220} y={30} variant="anomaly" title="18 Oct: +52% vs expected" />
</svg>

<ChartPoint standalone variant="active" label="Active point" />
```

- **Qachon:** Chart/Line va Chart/Live'da hover / fokus javobi; chiziq oxirgi qiymati (ko'zni bog'lash); model belgilagan chetga chiqish (`anomaly`).
- **Kodlash:** joy ← (x, y), rang ← seriya (`color`, standart `dataviz/categorical/01`), holat ← interaksiya / model belgisi. Figma `State` → `variant` prop'i (Figma doc Props jadvali bo'yicha).
- **Qoidalar:** hamma nuqtani faqat seriyada ≤ 24 nuqta bo'lsa ko'rsating; `anomaly` faqat model topgan qiymat uchun va doim sababi bilan (`title`, tooltip yoki AI insight) — eng katta qiymatni bezash uchun emas.
- **Interaksiya:** nuqta fokuslanmaydi (role="img" ichida); hover / ←→ qadamini chart beradi (role="img" SVG'dan tashqaridagi qatlam), bosish maydoni ≥ 24 × 24.
- **A11y:** `title` — "12 Oct, Revenue 4 820 mln"; mustaqil ko'rinishda `role="img"` + `label`.
- **O'lchamlar:** nuqta `chart/point/size` (8), Active/Anomaly `chart/point/size-active` (12) + halo 20 (`scale/4`); halqa `surface/card` · `stroke/strong`; halo Active `accent/soft`, Anomaly `status/warning/soft` + nuqta `dataviz/anomaly`.
