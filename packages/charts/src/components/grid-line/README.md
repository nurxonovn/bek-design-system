# Grid line

Figma: **4.18 Chart · Grid line** — gorizontal yo'naltiruvchi chiziq, SVG `<g>` bo'lagi. `variant`: `solid` · `baseline` · `target`.

```tsx
<svg role="img" aria-label="Sales vs plan 85" width={480} height={200}>
  {y.ticks(4).map((t) => (
    <ChartGridLine key={t} y={y(t)} x1={40} variant={t === 0 ? 'baseline' : 'solid'} />
  ))}
  <ChartGridLine variant="target" y={y(85)} x1={40} valueLabel="Plan 85" />
  {/* … belgilar … */}
</svg>
```

- **Qachon:** `solid` — har Y bo'linmasi uchun bitta, belgilar ortida; `baseline` — ustun va maydonlarning 0 chizig'i; `target` — maqsad yoki reja qiymati.
- **Kodlash:** y ← bo'linma yoki maqsad qiymati. Bar va line chartlarda faqat gorizontal grid — vertikal grid yo'q.
- **Qoidalar:** grid ma'lumot bilan raqobatlashmaydi (hairline kontrast, qoraytirmang). Target chizig'i doim nomlanadi — `valueLabel`, legend yoki Annotation.
- **Interaksiya:** yo'q.
- **A11y:** bezak (`aria-hidden`); maqsad qiymati matnda (chart `label` yoki `valueLabel`).
- **O'lchamlar:** qalinlik `chart/grid/stroke` (1); ranglar `dataviz/grid` · `dataviz/axis` · `dataviz/target` (uzuq 4/4); eni plot bo'yicha (standart `scale/480`). Belgilardan oldin chizing.
