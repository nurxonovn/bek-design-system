# @bek-ui/charts

## 1.0.0-beta.1

### Minor Changes

- 081871b: Figma 4.18 Chart'dan 5 ta yangi komponent:
  - `RegionMap` (Chart/Map) — O'zbekistonning 14 hududi: Choropleth, Bubble, Hex; hudud id'lari ISO 3166-2:UZ (`UZ_REGIONS`), har hudud fokuslanadi (Tab — reyting tartibida, strelkalar — qo'shniga), reytingli jadval. Xarita ma'lumoti — svg-maps (V. Cazanave), CC BY 4.0, soddalashtirilgan nusxa paket ichida (`LICENSE-ASSETS.md`).
  - `RaceChart` (Chart/Race) — bar chart race va Line: Play/Pause, progress slider, `prefers-reduced-motion` da tween yo'q.
  - `DrawTheLine` (Chart/Draw the line) — o'quvchi chiziq davomini chizadi, so'ng haqiqiy chiziq ochiladi; sichqoncha va klaviatura, Skip.
  - `SurveyChart` (Chart/Survey) — Likert diverging stacked bar va Net; `surveyStats()`.
  - `Pictogram` (Chart/Pictogram) — isotype: Default va Compare, oxirgi ikonka kasrga qirqiladi; `pictogramFraction()`.

- 081871b: Figma 4.18 Chart va 4.19 Diagram — yangi komponentlar va yangilanishlar.
  - Yangi `Gantt` (4.18 Chart · Gantt): vazifa barlari, jamoa ranglari, milestone, bugun chizig'i, `dependsOn` bog'liqliklari; `variant`: `default` · `progress` (reja 0.28 + bajarilgan qism, % bar tashqarisida, muddati o'tgan — `dataviz/negative` kontur). Barlar `listbox` variantlari (↑ / ↓ / Home / End), tooltip, `onTaskClick`, ko'rinmas jadval; joylashuv foizlarda — RTL'da o'zi teskari.
  - Yangi `NumberTicker` va `Countdown` (4.18 Chart · Number ticker): faqat o'zgargan raqam aylanadi (`prefers-reduced-motion` da aylanmaydi), yakuniy qiymat doim ko'rinmas matnda, `live` (`polite` · `assertive` · `off`) va `announceInterval` (standart daqiqada bir marta); Countdown — `bg/sheet` birliklar, matnli ekvivalent, tab yashirin bo'lsa to'xtaydi, `countdownParts`.
  - Yangi `DataExplorer` (4.18 Chart · Data explorer): saralanadigan `<table>` (`aria-sort`) ichida `Sparkline`, ulush chizig'i va `Delta`; `variant`: `default` · `compact`.
  - `MindMap`: `MindMapNode.collapsed` — Tree'da barglar o'rniga "+n"; hover shox qolganlarini 0.3 ga so'ndiradi; Figma doc yangilandi (ildiz namunasi "BEK launch").
  - `ChartCard`: `actions` sloti (eksport menyusi), holat o'zgarishi `role="status"` bilan e'lon qilinadi (`loadingLabel`); sarlavha qatori oralig'i `scale/16` (Figma doc).
  - `GeneratedChart`: karta nomi "AI-generated chart: <title>" (`aiLabel`); sarlavha qatori oralig'i `scale/6` (Figma doc).

### Patch Changes

- 53b29d7: `MindMap`, `Swimlane` va `JourneyMap`: keng kanvas gorizontal skroll qiladigan ildiz endi klaviaturadan fokuslanadi (`tabIndex=0` + fokus halqasi, WCAG 2.1.1). Tashqaridan berilgan `tabIndex` ustun.
- Updated dependencies [f5769cb]
- Updated dependencies [5e075c2]
- Updated dependencies [e1098b4]
- Updated dependencies [94d8d00]
- Updated dependencies [1aab026]
- Updated dependencies [68b5d48]
- Updated dependencies [68b5d48]
- Updated dependencies [ccde9dd]
- Updated dependencies [15bdeec]
- Updated dependencies [977180f]
- Updated dependencies [6b36ba0]
- Updated dependencies [b6ff019]
  - @bek-ui/react@1.0.0-beta.1
  - @bek-ui/tokens@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- First public release — 1.0.0-beta. Tokens from Figma Variables, 58 React components, 61 charts and diagrams, Figma ↔ code parity checks. The API may still change before 1.0.

### Minor Changes

- 54e3ea1: Yangi paket `@bek-ui/charts` (Figma 4.18 Chart): `LegendItem` / `ChartLegend`, `ChartTooltip`, `Delta`, `Sparkline`, `BarChart` (vertical · grouped · stacked · horizontal), `LineChart` (multi, area, hover + klaviatura), `DonutChart` (default · progress), `ChartCard` (default · loading · empty · error), `KpiCard` (default · compact · progress); `ChartContainer`, uz-UZ `formatNumber` / `formatPercent`, `seriesColor`.
- ddcc791: 2-to'lqin: 36 komponent — chart qismlari (ChartInsight, ChartPoint, ChartAxis, ChartGridLine, ChartAnnotation, ChartCrosshair, ChartPredictionZone, ChartBrush), Comparison (Lollipop, Dumbbell, Bullet, RadialBar, Bump, Slope), Trend/Composition/Flow (Live, CalendarHeatmap, Treemap, Waffle, Funnel, Waterfall, Sankey), AI (Forecast, Anomaly, ConfidenceMeter, UsageMeter, GeneratedChart, FeatureImportance, ClusterMap, ModelComparison), Relation/Finance (Radar, Scatter, Beeswarm, NetworkGraph, Candlestick, CohortHeatmap, Gauge).
- 6dc7f48: 3-to'lqin: P3 chartlar (BoxPlot, RidgelineChart, Streamgraph, HorizonChart, MarimekkoChart, CirclePacking, ChordDiagram, ConfusionMatrix) va 4.19 Diagram (DiagramNode, DiagramConnector, AgentNode, OrgCard, Timeline / TimelineItem, MindMap, JourneyMap, Swimlane) — Figma 4.18 / 4.19 bilan strict mos.

### Patch Changes

- Updated dependencies [79ae5de]
- Updated dependencies [3b7447d]
- Updated dependencies [6a3ff9e]
- Updated dependencies
- Updated dependencies [920e6c8]
- Updated dependencies [70c9f08]
  - @bek-ui/tokens@1.0.0-beta.0
  - @bek-ui/react@1.0.0-beta.0
