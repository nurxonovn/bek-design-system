# Bullet chart

Figma: **4.18 Chart · Bullet** — bitta KPI maqsadga nisbatan, sifat oraliqlari bilan; dashboard'larda gauge o'rniga. `variant`: `default`.

```tsx
<BulletChart name="Revenue" value={72} target={80} ranges={[50, 75, 100]} label="Revenue 72% of target 80" />

<BulletChart
  data={[
    { name: 'Revenue', value: 72, target: 80, ranges: [50, 75, 100] },
    { name: 'NPS', value: 84, target: 75, ranges: [40, 60, 100] },
  ]}
  max={100}
  label="KPIs vs targets"
/>
```

- **Qachon:** maqsadga erishish (daromad, NPS, SLA); bir nechta KPI bir xil shkalada ustma-ust (`max`). Trend uchun emas — tarix kerak bo'lsa Sparkline bilan.
- **Kodlash:** x = qiymat, oraliqlar (ko'pi bilan 3: yomon · o'rta · yaxshi) `dataviz/sequential/300 · 200 · 100`, qiymat ustuni seriya rangi (`dataviz/categorical/01`), maqsad belgisi `dataviz/target` — ustundan baland, doim ko'rinadi.
- **Holat:** qiymat maqsaddan o'tsa qator `bek-bullet-chart__row--reached` (Figma "Reached"); "Goal reached" yozuvi uchun yoniga Delta yoki Badge qo'ying.
- **Interaksiya:** hover — qator ajraladi, `<title>` qiymat, maqsad va maqsadning % ini aytadi.
- **A11y:** `role="img"` + `label`; jadval: KPI · qiymat · maqsad · % ("Revenue 72% of target").
- **O'lchamlar:** nom ustuni `scale/80`, trek `scale/24`, qatorlar orasi `scale/16`, oraliq `scale/12`. Matn: nom Caption/L · `text/secondary`, qiymat Label/S · `text/primary`.
