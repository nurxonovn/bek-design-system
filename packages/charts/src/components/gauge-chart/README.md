# Gauge chart

Figma: **4.18 Chart · Gauge** — chegaralangan shkaladagi bitta qiymat, oraliqning o'zi muhim bo'lganda (kredit reytingi, risk darajasi). `variant`: `default` · `zones`.

```tsx
<GaugeChart value={620} min={300} max={850} caption="Credit score" label="Credit score 620 of 850" />

<GaugeChart
  variant="zones"
  value={620}
  min={300}
  max={850}
  zones={[
    { to: 520, label: 'Poor' },
    { to: 685, label: 'Fair' },
    { to: 850, label: 'Good' },
  ]}
  caption="Credit score"
  label="Credit score 620 — fair"
/>
```

- **Qachon:** kredit reytingi, risk darajasi, chegaralari ma'lum "sog'lik" ko'rsatkichi. Zones — xabarning o'zi zona (poor / fair / good) bo'lganda. Dashboard'da KPI va maqsad — `BulletChart`.
- **Kodlash:** burchak ← (value − min) / (max − min), zona ← chegaralar. Default: `dataviz/track` ustida `dataviz/categorical/01` yoy; Zones: `dataviz/negative` · `status/warning/default` · `dataviz/positive` zonalar + `text/primary` strelka (`stroke/strong`). Zona rangi `tone` bilan o'zgaradi.
- **Qoidalar:** qiymat va ikkala chegara doim yoziladi; zona nomi tooltip (`<title>`) va `aria-valuetext` da — faqat rang emas. Bitta kartochkada bitta gauge — gauge'lar to'ri qilinmaydi.
- **Interaksiya:** zona ustida — nomi va chegaralari. Yangilanishda yoy eski qiymatdan suriladi (`motion/duration/chart-enter`, `prefers-reduced-motion` da o'chadi).
- **A11y:** `role="meter"` + `aria-valuemin` / `aria-valuemax` / `aria-valuenow`, `aria-valuetext` zona nomi bilan; ichida `role="img"` chizma va ko'rinmas jadval.
- **O'lchamlar:** yoy diametri `scale/200` (`size`, doimiy) — markazda, cho'zilmaydi. Qiymat Headline/M · `text/primary`, izoh Caption/M · `text/tertiary`, chegaralar Caption/S · `dataviz/label`.
