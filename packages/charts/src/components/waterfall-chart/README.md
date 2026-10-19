# Waterfall chart

Figma: **4.18 Chart · Waterfall** — boshlang'ich qiymat musbat va manfiy hissalar orqali yakuniy qiymatga qanday aylanishi (P&L, pul oqimi, byudjet ko'prigi). `variant`: `default`.

```tsx
<WaterfallChart
  start={{ label: 'Q1', value: 60 }}
  items={[
    { label: 'Sales', value: 18 },
    { label: 'Refunds', value: -14 },
  ]}
  end={{ label: 'Q2' }}
  label="Q1 60, Sales +18, Refunds −14, Q2 64"
/>
```

- **Qachon:** P&L ko'prigi, pul oqimi, reja va fakt farqini tushuntirish — jami ikki davr orasida nega o'zgardi. Mustaqil kategoriyalar uchun emas — `BarChart`.
- **Kodlash:** y0, y1 = oldingi / keyingi joriy jami, rang = ishora: jamilar `dataviz/neutral` (0 dan), o'sish `dataviz/positive`, kamayish `dataviz/negative`; uzuq bog'lovchi `dataviz/axis` joriy darajada.
- **Qoidalar:** birinchi va oxirgi ustun — 0 dan jami, qolganlari suzadi. Yozuvlar ishorali, haqiqiy minus (−14): `text/success` · `text/danger`. Ko'pi bilan 8 qadam; kichiklarini "Other" ga yig'ing. `end.value` berilmasa — start + o'zgarishlar.
- **Interaksiya:** hover — boshqa ustunlar 40%, `<title>` o'zgarish va joriy jamini aytadi. Drill-down — ota komponentda.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval (qadam · o'zgarish · joriy jami).
- **O'lchamlar:** plot `chart/height/md` (200 / 240 / 320), qalinlik `chart/bar/thickness` (16 / 24 / 32) → `barThickness`, radius `chart/bar/radius`, tick `chart/axis/tick-count` → `ticks`. Legend — `ChartLegend` (Increase · Decrease · Total, `legendLabels`).
