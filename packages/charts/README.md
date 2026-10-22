# @bek-ui/charts

BEK Design System chartlari va diagrammalari — Figma **4.18 Chart** va **4.19 Diagram** sahifalarining React (SVG) nusxasi. Ranglar va o'lchamlar faqat `@bek-ui/tokens` dan (`--bek-dataviz-*`, `--bek-chart-*`); geometriyani d3 modullari hisoblaydi (`d3-scale`, `d3-shape`, `d3-array`), chizish va uslub — BEK.

## Ishlatish

```tsx
import '@bek-ui/tokens/tokens.css';
import '@bek-ui/react/styles.css';
import '@bek-ui/charts/styles.css';
import { ChartCard, ChartContainer, LineChart, formatNumber } from '@bek-ui/charts';
```

- **Responsiv:** chart SVG koordinatalarini `width` / `height` raqamlarida chizadi; `ChartContainer` konteyner enini o'lchab (ResizeObserver) beradi — geometriya cho'zilmaydi (Figma CMP-11).
- **Client/Server:** `ChartContainer` (render-prop) va `LineChart` (`formatValue`, `formatLabel` funksiyalari) — client komponentlar: ularni client fayl ichida ishlating; Server Component'dan faqat seriyalanadigan prop'lar bilan chaqiring.
- **Format uz-UZ:** `formatNumber(12400)` → `12 400`, `formatNumber(4820000, { compact: true })` → `4,8 mln`, `formatPercent(-3.1, { signed: true })` → `−3,1%` (haqiqiy minus).
- **Ranglar:** `seriesColor(i)` → `dataviz/categorical/0i`; matnli heatmap kataklari faqat `textCellLevel()` dagi 200 · 300 · 600 · 700 darajalarda (CMP-07).
- **A11y:** har chart `role="img"` + `label` (qisqa xulosa) va ko'rinmas ma'lumot jadvali; rang yolg'iz ma'no tashimaydi.
- **Dark:** alohida yozilmaydi — tokenlar `data-theme="dark"` da almashadi.

## Komponentlar

| Komponent                    | Figma sahifasi                  | Hujjat                                                |
| ---------------------------- | ------------------------------- | ----------------------------------------------------- |
| `LegendItem` · `ChartLegend` | 4.18 Chart · Legend item        | [README](src/components/legend-item/README.md)        |
| `ChartTooltip`               | 4.18 Chart · Tooltip            | [README](src/components/chart-tooltip/README.md)      |
| `Delta`                      | 4.18 Chart · Delta              | [README](src/components/delta/README.md)              |
| `Sparkline`                  | 4.18 Chart · Sparkline          | [README](src/components/sparkline/README.md)          |
| `BarChart`                   | 4.18 Chart · Bar                | [README](src/components/bar-chart/README.md)          |
| `LineChart`                  | 4.18 Chart · Line               | [README](src/components/line-chart/README.md)         |
| `DonutChart`                 | 4.18 Chart · Donut              | [README](src/components/donut-chart/README.md)        |
| `ChartCard`                  | 4.18 Chart · Card               | [README](src/components/chart-card/README.md)         |
| `KpiCard`                    | 4.18 Chart · KPI card           | [README](src/components/kpi-card/README.md)           |
| `LollipopChart`              | 4.18 Chart · Lollipop           | [README](src/components/lollipop-chart/README.md)     |
| `DumbbellChart`              | 4.18 Chart · Dumbbell           | [README](src/components/dumbbell-chart/README.md)     |
| `BulletChart`                | 4.18 Chart · Bullet             | [README](src/components/bullet-chart/README.md)       |
| `RadialBarChart`             | 4.18 Chart · Radial bar         | [README](src/components/radial-bar-chart/README.md)   |
| `BumpChart`                  | 4.18 Chart · Bump               | [README](src/components/bump-chart/README.md)         |
| `SlopeChart`                 | 4.18 Chart · Slope              | [README](src/components/slope-chart/README.md)        |
| `ChartInsight`               | 4.18 Chart · AI insight         | [README](src/components/ai-insight/README.md)         |
| `ChartPoint`                 | 4.18 Chart · Data point         | [README](src/components/data-point/README.md)         |
| `ChartAxis`                  | 4.18 Chart · Axis               | [README](src/components/chart-axis/README.md)         |
| `ChartGridLine`              | 4.18 Chart · Grid line          | [README](src/components/grid-line/README.md)          |
| `ChartAnnotation`            | 4.18 Chart · Annotation         | [README](src/components/annotation/README.md)         |
| `ChartCrosshair`             | 4.18 Chart · Crosshair          | [README](src/components/crosshair/README.md)          |
| `ChartPredictionZone`        | 4.18 Chart · Prediction zone    | [README](src/components/prediction-zone/README.md)    |
| `ChartBrush`                 | 4.18 Chart · Range brush        | [README](src/components/range-brush/README.md)        |
| `LiveChart`                  | 4.18 Chart · Live               | [README](src/components/live-chart/README.md)         |
| `CalendarHeatmap`            | 4.18 Chart · Calendar heatmap   | [README](src/components/calendar-heatmap/README.md)   |
| `TreemapChart`               | 4.18 Chart · Treemap            | [README](src/components/treemap-chart/README.md)      |
| `WaffleChart`                | 4.18 Chart · Waffle             | [README](src/components/waffle-chart/README.md)       |
| `FunnelChart`                | 4.18 Chart · Funnel             | [README](src/components/funnel-chart/README.md)       |
| `WaterfallChart`             | 4.18 Chart · Waterfall          | [README](src/components/waterfall-chart/README.md)    |
| `SankeyChart`                | 4.18 Chart · Sankey             | [README](src/components/sankey-chart/README.md)       |
| `RadarChart`                 | 4.18 Chart · Radar              | [README](src/components/radar-chart/README.md)        |
| `ScatterChart`               | 4.18 Chart · Scatter            | [README](src/components/scatter-chart/README.md)      |
| `BeeswarmChart`              | 4.18 Chart · Beeswarm           | [README](src/components/beeswarm-chart/README.md)     |
| `NetworkGraph`               | 4.18 Chart · Network graph      | [README](src/components/network-graph/README.md)      |
| `CandlestickChart`           | 4.18 Chart · Candlestick        | [README](src/components/candlestick-chart/README.md)  |
| `CohortHeatmap`              | 4.18 Chart · Cohort heatmap     | [README](src/components/cohort-heatmap/README.md)     |
| `GaugeChart`                 | 4.18 Chart · Gauge              | [README](src/components/gauge-chart/README.md)        |
| `ForecastChart`              | 4.18 Chart · Forecast           | [README](src/components/forecast-chart/README.md)     |
| `AnomalyChart`               | 4.18 Chart · Anomaly            | [README](src/components/anomaly-chart/README.md)      |
| `ConfidenceMeter`            | 4.18 Chart · Confidence meter   | [README](src/components/confidence-meter/README.md)   |
| `UsageMeter`                 | 4.18 Chart · Usage meter        | [README](src/components/usage-meter/README.md)        |
| `GeneratedChart`             | 4.18 Chart · Generated chart    | [README](src/components/generated-chart/README.md)    |
| `FeatureImportance`          | 4.18 Chart · Feature importance | [README](src/components/feature-importance/README.md) |
| `ClusterMap`                 | 4.18 Chart · Cluster map        | [README](src/components/cluster-map/README.md)        |
| `ModelComparison`            | 4.18 Chart · Model comparison   | [README](src/components/model-comparison/README.md)   |
| `DiagramNode`                | 4.19 Diagram · Node             | [README](src/components/diagram-node/README.md)       |
| `DiagramConnector`           | 4.19 Diagram · Connector        | [README](src/components/diagram-connector/README.md)  |
| `AgentNode`                  | 4.19 Diagram · Agent node       | [README](src/components/agent-node/README.md)         |
| `OrgCard`                    | 4.19 Diagram · Org card         | [README](src/components/org-card/README.md)           |
| `Timeline` · `TimelineItem`  | 4.19 Diagram · Timeline item    | [README](src/components/timeline-item/README.md)      |
| `MarimekkoChart`             | 4.18 Chart · Marimekko          | [README](src/components/marimekko-chart/README.md)    |
| `CirclePacking`              | 4.18 Chart · Circle packing     | [README](src/components/circle-packing/README.md)     |
| `ChordDiagram`               | 4.18 Chart · Chord              | [README](src/components/chord-diagram/README.md)      |
| `ConfusionMatrix`            | 4.18 Chart · Confusion matrix   | [README](src/components/confusion-matrix/README.md)   |
| `BoxPlot`                    | 4.18 Chart · Box plot           | [README](src/components/box-plot/README.md)           |
| `RidgelineChart`             | 4.18 Chart · Ridgeline          | [README](src/components/ridgeline-chart/README.md)    |
| `Streamgraph`                | 4.18 Chart · Streamgraph        | [README](src/components/streamgraph/README.md)        |
| `HorizonChart`               | 4.18 Chart · Horizon            | [README](src/components/horizon-chart/README.md)      |
| `MindMap`                    | 4.19 Diagram · Mind map         | [README](src/components/mind-map/README.md)           |
| `JourneyMap`                 | 4.19 Diagram · User journey map | [README](src/components/journey-map/README.md)        |
| `Swimlane`                   | 4.19 Diagram · Swimlane         | [README](src/components/swimlane/README.md)           |
