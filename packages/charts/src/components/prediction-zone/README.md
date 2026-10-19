# Prediction zone

Figma: **4.18 Chart · Prediction zone** — X o'qining model chiqishi bo'lgan qismi (kuzatilgan ma'lumot emas), SVG `<g>` bo'lagi. Bitta variant (`Default`).

```tsx
<svg role="img" aria-label="Forecast from July, 80% range 64–93" width={480} height={200}>
  <ChartPredictionZone from={x(lastObserved)} note="bek-forecast-v2 · 4 months" />
  {/* … kuzatilgan chiziq, uzuq prognoz chizig'i, dataviz/uncertainty/* diapazoni … */}
</svg>
```

- **Qachon:** har prognoz, proyeksiya yoki AI to'ldirgan bo'shliq — uzuq prognoz chizig'i va ishonch diapazoni (Chart/Forecast, `dataviz/uncertainty/*`) bilan birga. Odam yozgan maqsad / reja uchun emas — Target grid line.
- **Kodlash:** x ← [`from` — oxirgi kuzatilgan nuqta, `to` — o'q oxiri].
- **Qoidalar:** aynan oxirgi kuzatilgan nuqtadan boshlanadi; yozuv pastki-o'ngda — chiziqni yopmaydi; Mobile'da ham yashirilmaydi; prognoz uslubi haqiqiy ma'lumot bilan bir xil bo'lmasin; horizont chart sarlavhasida ("next 4 months").
- **Interaksiya:** hover — `<title>` model ma'lumoti (`note`: model, horizont, o'qitish oralig'i).
- **A11y:** chart xulosasi: "Forecast from July, 80% range 64–93"; sparkles belgisi bezak.
- **O'lchamlar:** zona `dataviz/grid`, chap cheti uzuq 4/4 `dataviz/ai/accent`; yozuv sparkles 16 (`dataviz/ai/accent`) + `scale/4` + Label/S · `text/secondary`, burchakdan `scale/8`. Standart eni `scale/160`, balandligi `chart/height/md`.
