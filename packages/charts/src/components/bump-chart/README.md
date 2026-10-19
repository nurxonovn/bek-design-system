# Bump chart

Figma: **4.18 Chart · Bump** — reyting vaqt bo'yicha qanday o'zgargani: har element bitta chiziq, #1 tepada. `variant`: `default`.

```tsx
<ChartContainer>
  {(width) => (
    <BumpChart
      width={width}
      periods={['Q1', 'Q2', 'Q3', 'Q4']}
      series={[
        { label: 'Tashkent', ranks: [1, 1, 2, 1] },
        { label: 'Samarkand', ranks: [2, 3, 1, 2] },
        { label: 'Bukhara', ranks: [3, 2, 3, 3] },
      ]}
      highlight="Tashkent"
      label="Tashkent: #1 in all quarters except Q3 (#2)"
    />
  )}
</ChartContainer>
```

- **Qachon:** liga jadvallari, filial reytinglari, mahsulot o'rinlari; 3–6 element, 4–12 davr. Qiymatlarning o'zi uchun — Line.
- **Kodlash:** x = davr, y = o'rin (teskari, #1 tepada), rang = element (`dataviz/categorical/0i`); chiziq `chart/line/stroke`, silliq (`curveBumpX`), nuqta `chart/point/size`. Teng o'rinlar bir balandlikda; `null` — o'rin yo'q (bo'shliq).
- **Interaksiya:** chiziq ustida hover — rangi saqlanadi, qolganlari 30%; `highlight` — muhokama qilinayotgan elementni doimiy ajratadi.
- **A11y:** `role="img"` + `label` ("Tashkent: Q3 dan tashqari hamma davrda #1"); jadval har davrdagi o'rinni beradi.
- **O'lchamlar:** o'rin o'qi `scale/32`, `chart/axis/label-gap`, plot `chart/height/md` (200 / 240 / 320 → `height`), legend `chart/legend/gap`. Matn: o'q Caption/S · `dataviz/label`, legend Caption/L · `text/secondary` (ChartLegend).
