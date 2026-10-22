# Survey chart

Figma: **4.18 Chart · Survey** — so'rovnoma va Likert javoblari: neytral markazli diverging stacked bar (disagree chapga, agree o'ngga) — savollar bir qarashda solishtiriladi; Net — har savol uchun agree − disagree. `variant`: `likert` · `net`.

```tsx
<SurveyChart
  scale={5}
  questions={[
    { label: 'Lessons are clear', counts: [4, 8, 14, 44, 30] },
    { label: 'Price for value', counts: [12, 18, 40, 20, 10] },
  ]}
  sort="net"
  label="2 savol; eng past — Price for value (Net 0)"
/>
```

- **Qachon:** kurs fikr-mulohazasi, NPS uslubidagi va HR so'rovlari (3 / 5 / 7 balli); ko'p savolni birdaniga solishtirish — qaysi biri eng zaif? `net` — savollarning ixcham reytingi.
- **Qoidalar:** 2–12 savol; bitta chartda shkalalarni (5 va 7) aralashtirmang; 5 balli shkalada 5 rang (`dataviz/diverging` neg-3 · neg-1 · 0 · pos-1 · pos-3); savollarni net bo'yicha saralang (`sort="net"` yoki `"agree"`); har savolga pie chart emas. Rang ustida matn yo'q (CMP-07) — net balli ustundan tashqarida.
- **Kodlash:** y = savol, x = ulush (%) neytral atrofida; rang = javob; Net: ustun uzunligi = agree − disagree (neytral hisobga kirmaydi), musbat `pos-3`, manfiy `neg-3`. Markaz chizig'i — `dataviz/axis`. `surveyStats(counts)` — ulushlar, agree / disagree / neutral va net.
- **Holatlar:** segment ustida — `<title>` (javob, soni, %), qolganlari 40%; legend bosilganda javob ajratiladi (qolganlari 25%); biror savolda javob 30 dan kam — "Low sample (n < 30)" izohi (`lowSampleLabel`).
- **A11y:** `role="img"` + `label`; ko'rinmas jadval — har javob soni va ulushi, n va Net; net balli matn sifatida; rang tartib bilan juft (chapdan o'ngga).
- **O'lchamlar:** eni `scale/480`; savol ustuni Caption/M · `text/secondary`, segment 20, qator 34; net — Caption/S · `text/primary`; o'q yozuvlari ("← Disagree · Agree →", `axisLabels`) Caption/S · `dataviz/label`; legend `chart/legend/gap`.
