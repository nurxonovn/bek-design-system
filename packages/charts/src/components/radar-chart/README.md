# Radar chart

Figma: **4.18 Chart · Radar** — 5–8 sifat o'lchovi bo'yicha profil, hammasi bitta 0–100 shkalada. `variant`: `single` · `compare`.

```tsx
<RadarChart
  axes={['Speed', 'Quality', 'Cost', 'Support', 'Security', 'UX']}
  series={[
    { name: 'BEK', values: [90, 72, 48, 80, 88, 76] },
    { name: 'Market avg.', values: [60, 70, 66, 52, 62, 58] },
  ]}
  label="BEK leads the market on speed and security"
/>
```

- **Qachon:** vendor yoki model bahosi, ko'nikma profili, mahsulot mosligi. Compare — ko'pi bilan 3 profil. Birliklari har xil yoki 8 tadan ko'p o'q bo'lsa — `BarChart`.
- **Kodlash:** burchak = o'lchov, radius = ball (0…`max`), rang = seriya (`seriesColor(i)`). Halqalar 33 · 66 · 100% (`dataviz/axis`, `chart/grid/stroke`), maydon — seriya rangi qatlam shaffofligi 18%, kontur `chart/line/stroke`.
- **Qoidalar:** hamma o'qlar bir xil shkala va yo'nalishda (ko'proq = yaxshi); bog'liq o'qlarni yonma-yon qo'ying; 3 tadan ortiq profilni ustma-ust qo'ymang.
- **Interaksiya:** o'q ustida — `<title>` shu o'qdagi barcha seriya qiymatlarini aytadi; profil ustida — qolganlari 40%. Legend Compare'da avtomatik.
- **A11y:** `role="img"` + `label`; ko'rinmas jadval: o'lchov × seriya.
- **O'lchamlar:** chizma markazdagi kvadratda (`scale/200`, doimiy) — `width` o'zgarsa ham shakl cho'zilmaydi. O'q yozuvlari Caption/S · `dataviz/label`, legend Caption/L · `text/secondary` (ChartLegend).
