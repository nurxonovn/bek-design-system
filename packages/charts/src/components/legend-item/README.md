# Legend item

Figma: **4.18 Chart · Legend item** — seriya markeri va nomi; `ChartLegend` ularni qatorga teradi. `variant`: `dot` · `square` · `line` · `dashed`.

```tsx
<ChartLegend
  items={[
    { label: 'Daromad', variant: 'line' },
    { label: 'Xarajat', variant: 'line', color: seriesColor(1) },
    { label: 'Reja', variant: 'dashed' },
  ]}
  onToggle={(i) => toggleSeries(i)}
/>
```

- Marker rangi = seriya rangi (`seriesColor(i)` → `dataviz/categorical/0i`), `dashed` — `dataviz/target` (prognoz, reja).
- `onToggle` berilsa har yozuv `aria-pressed` toggle tugma: bosish seriyani o'chirib-yoqadi, hover qolganlarini 30% ga xiralashtiradi. Yashirin seriya — label `text/disabled`, marker 30%.
- Ko'pi bilan 6 seriya; qolganini "Other" ga birlashtiring.
- Matn: Caption/L · `text/secondary`; marker `chart/legend/marker` (8 px), chiziq `chart/line/stroke`.
