# Donut chart

Figma: **4.18 Chart · Donut** — ulushlar halqasi, markazda jami, yonida qiymatli legend. `variant`: `default` · `progress`.

```tsx
<DonutChart
  data={[
    { label: 'Cards', value: 4820 },
    { label: 'Loans', value: 2210 },
    { label: 'Deposits', value: 1540 },
    { label: 'Other', value: 620, color: 'var(--bek-dataviz-neutral)' },
  ]}
  centerLabel="Total, mln"
  label="Cards make up more than half of revenue"
/>
<DonutChart variant="progress" progress={0.72} centerLabel="of goal" label="72% of the quarterly goal" />
```

- **Qachon:** bitta butunning 2–5 qismi. Ko'proq bo'lsa — kichiklarini "Other" (`dataviz/neutral`) ga yig'ing yoki Bar ishlating.
- **Kodlash:** burchak = ulush, rang = tartiblangan kategoriya; segmentlar kattasidan, soat 12 dan soat yo'nalishida. Markazda jami (Headline/S), izoh Caption/M.
- **Legend majburiy** (Default): nom, qiymat va ulush — rangga tayanib qolmaslik uchun.
- **Progress:** `dataviz/track` ustida bitta qiymat (`dataviz/categorical/01`), uchlari yumaloq; markazda foiz (Title/L).
- **Interaksiya:** hover — segment ajraladi, qolganlari 40%; `<title>` qiymat va ulushni aytadi. Ko'rinmas `<table>`.
- O'lcham: diametr `chart/height/sm` (140 / 160 / 200) → `size`, qalinlik `chart/donut/thickness` (20 / 24 / 28) → `thickness`.
