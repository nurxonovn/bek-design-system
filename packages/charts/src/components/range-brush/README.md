# Range brush

Figma: **4.18 Chart · Range brush** — uzun vaqt qatori ostidagi umumiy ko'rinish: oynani sudrab suring, tutqichni sudrab asosiy chartni kattalashtiring. Bitta variant (`Default`). Client komponent.

```tsx
const [range, setRange] = useState({ startIndex: 180, endIndex: 240 });
<LineChart … labels={days.slice(range.startIndex, range.endIndex + 1)} />
<ChartBrush
  data={revenue}
  startIndex={range.startIndex}
  endIndex={range.endIndex}
  onChange={setRange}
  minSpan={7}
  formatIndex={(i) => days[i]}
  label="Visible period"
/>
```

- **Qachon:** bir ekrandan uzun qatorlar (bir yillik kunlik ma'lumot, live loglar); davrni butun tarix bilan solishtirish. Mobile'da 6 oydan kam ma'lumotda emas — davr uchun SegmentedControl yetarli.
- **Kodlash:** umumiy chiziq ← hamma ma'lumot, oyna ← [`startIndex`, `endIndex`]. Boshqariladigan (`startIndex` + `endIndex` + `onChange`) yoki `defaultStartIndex` / `defaultEndIndex` bilan.
- **Interaksiya:** oynani sudrash — surish; tutqichni sudrash — o'lcham; ikki marta bosish — boshlang'ich holat. Fokusdagi tutqich: ←/→ — oynani suradi, Shift+←/→ — o'lchamini o'zgartiradi, Home/End — chetga. Moliyaviy ma'lumotda oynani butun davrga moslang (`minSpan`).
- **A11y:** `role="group"` + `label`; ikki `role="slider"` tutqich, `aria-valuetext` "From 1 Jul" / "To 31 Aug" (`formatIndex`), `bek-focus-ring`. Umumiy chiziq SVG'si `aria-hidden`.
- **O'lchamlar:** balandlik `scale/56`, en `scale/480` (responsiv — `ChartContainer`), asosiy chart X o'qidan 16 pastda. Trek `dataviz/grid` · `radius/surface/sm`; chiziq `dataviz/label` · `chart/grid/stroke`; oyna `accent/soft` + `border/accent`; tutqich `accent/default` 6 × 24, Elevation/1, bosish maydoni `target/min` (44).
