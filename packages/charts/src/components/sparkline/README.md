# Sparkline

Figma: **4.18 Chart · Sparkline** — o'q va yozuvsiz mikro-chart (KPI karta, jadval qatori). Figma variantlari Up · Down · Neutral — `trend` (qiymatdan avtomatik), Bars — `variant="bars"`.

```tsx
<Sparkline data={[12, 14, 13, 17, 19, 22]} label="Trend up over 6 days" />
<Sparkline data={weekly} variant="bars" label="Orders, last 8 weeks" />
```

- x = vaqt, y = oyna ichidagi min–max; rang = yo'nalish: up `dataviz/positive`, down `dataviz/negative`, neutral `dataviz/neutral`. Oxirgi qiymatda nuqta.
- Bars: `dataviz/track` ustunlar, oxirgisi `dataviz/categorical/01`.
- Jadvalda hamma qatorlarga bir xil `domain` bering — aks holda kichik o'zgarish katta ko'rinadi.
- Interaksiya yo'q; `label` majburiy (`role="img"`), qiymatlar yonidagi matnda bo'lsin.
- O'lcham: `scale/128` × `chart/sparkline/height` (32 / 40 / 48), chiziq `chart/line/stroke`.
