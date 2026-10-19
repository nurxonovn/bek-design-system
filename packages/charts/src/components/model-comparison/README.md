# Model comparison

Figma: **4.18 Chart · Model comparison** — 2–4 AI model (vendor, prompt) muhim metrikalar bo'yicha bitta 0–100 shkalada. Har metrika — qator, har model — nuqta, eng yaxshi qiymat yozilgan. `variant`: faqat `default`.

```tsx
<ModelComparison
  models={['BEK-small', 'BEK-base', 'Vendor X']}
  metrics={[
    { label: 'Accuracy', scores: [82, 91, 88], raw: ['82%', '91%', '88%'] },
    { label: 'Speed', scores: [95, 72, 60], raw: ['120 ms', '310 ms', '420 ms'] },
    { label: 'Cost efficiency', scores: [90, 70, 40] },
  ]}
  caption="Score 0–100 · higher is better · speed and cost inverted"
  label="BEK-base leads on accuracy; BEK-small is fastest and cheapest"
/>
```

- **Qachon:** model yoki vendor tanlash, reliz yaxshilanishini ko'rsatish. Bitta metrika vaqt bo'yicha → Chart/Line.
- **Kodlash:** x = normallashgan ball (0–100, yuqori = yaxshi), qator = metrika, rang = model (`dataviz/categorical/01…04`), track `dataviz/track` (`stroke/strong`), nuqta halqasi `surface/card`.
- **Qoidalar:** har metrikani yuqori = yaxshi qilib normallang; kechikish va narxni teskari qiling va izohda (`caption`) ayting. Har qatorda eng yaxshi qiymat yoziladi (Label/S · `text/primary`). Ko'pi bilan 4 model, 3–8 metrika.
- **Interaksiya:** qator ustida — qolganlari 40%, `<title>` asl qiymatlarni (ms, UZS, %) aytadi.
- **A11y:** `role="img"` + `label`, ko'rinmas `<table>` metrika × model asl qiymatlar bilan.
- **O'lchamlar:** eni `scale/480` (konteynerga ergashadi), qator balandligi `rowHeight` (38); metrika Caption/M · `text/secondary`, izoh Caption/S · `dataviz/label`.
