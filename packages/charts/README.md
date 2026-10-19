# @bek/charts

BEK Design System chartlari va diagrammalari — Figma **4.18 Chart** va **4.19 Diagram** sahifalarining React (SVG) nusxasi. Ranglar va o'lchamlar faqat `@bek/tokens` dan (`--bek-dataviz-*`, `--bek-chart-*`); geometriyani d3 modullari hisoblaydi (`d3-scale`, `d3-shape`, `d3-array`), chizish va uslub — BEK.

## Ishlatish

```tsx
import '@bek/tokens/tokens.css';
import '@bek/react/styles.css';
import '@bek/charts/styles.css';
import { ChartCard, ChartContainer, LineChart, formatNumber } from '@bek/charts';
```

- **Responsiv:** chart SVG koordinatalarini `width` / `height` raqamlarida chizadi; `ChartContainer` konteyner enini o'lchab (ResizeObserver) beradi — geometriya cho'zilmaydi (Figma CMP-11).
- **Client/Server:** `ChartContainer` (render-prop) va `LineChart` (`formatValue`, `formatLabel` funksiyalari) — client komponentlar: ularni client fayl ichida ishlating; Server Component'dan faqat seriyalanadigan prop'lar bilan chaqiring.
- **Format uz-UZ:** `formatNumber(12400)` → `12 400`, `formatNumber(4820000, { compact: true })` → `4,8 mln`, `formatPercent(-3.1, { signed: true })` → `−3,1%` (haqiqiy minus).
- **Ranglar:** `seriesColor(i)` → `dataviz/categorical/0i`; matnli heatmap kataklari faqat `textCellLevel()` dagi 200 · 300 · 600 · 700 darajalarda (CMP-07).
- **A11y:** har chart `role="img"` + `label` (qisqa xulosa) va ko'rinmas ma'lumot jadvali; rang yolg'iz ma'no tashimaydi.
- **Dark:** alohida yozilmaydi — tokenlar `data-theme="dark"` da almashadi.

## Komponentlar

| Komponent                    | Figma sahifasi           | Hujjat                                           |
| ---------------------------- | ------------------------ | ------------------------------------------------ |
| `LegendItem` · `ChartLegend` | 4.18 Chart · Legend item | [README](src/components/legend-item/README.md)   |
| `ChartTooltip`               | 4.18 Chart · Tooltip     | [README](src/components/chart-tooltip/README.md) |
| `Delta`                      | 4.18 Chart · Delta       | [README](src/components/delta/README.md)         |
| `Sparkline`                  | 4.18 Chart · Sparkline   | [README](src/components/sparkline/README.md)     |
| `BarChart`                   | 4.18 Chart · Bar         | [README](src/components/bar-chart/README.md)     |
| `LineChart`                  | 4.18 Chart · Line        | [README](src/components/line-chart/README.md)    |
| `DonutChart`                 | 4.18 Chart · Donut       | [README](src/components/donut-chart/README.md)   |
| `ChartCard`                  | 4.18 Chart · Card        | [README](src/components/chart-card/README.md)    |
| `KpiCard`                    | 4.18 Chart · KPI card    | [README](src/components/kpi-card/README.md)      |
