# Beeswarm chart

Figma: **4.18 Chart · Beeswarm** — har qiymat alohida nuqta, guruh bo'yicha qatorlarda, ustma-ust tushmasdan yoyilgan. `variant`: `default` (yagona).

```tsx
<BeeswarmChart
  data={[
    { group: 'Retail', value: 58, label: 'Client 1042' },
    { group: 'SME', value: 41 },
    { group: 'Corporate', value: 77 },
  ]}
  domain={[0, 100]}
  label="Corporate clients score highest; SME spreads widest"
/>
```

- **Qachon:** har element muhim bo'lgan taqsimot (maoshlar, javob vaqti), guruhda 20–300 nuqta. Ko'proq bo'lsa — histogram yoki box plot.
- **Kodlash:** x ← qiymat, qator ← guruh, rang ← guruh (`seriesColor(i)`). Nuqta radiusi 3,5 (`radius`), o'q `dataviz/axis` + bo'linmalar.
- **Qoidalar:** har guruhga bitta qator, hammasi bir shkalada; nuqtalar hech qachon ustma-ust tushmaydi — vertikal yoyiladi (`beeswarmLayout()`, deterministik). Mediana muhim bo'lsa Target grid chizig'i bilan belgilang.
- **Interaksiya:** hover — nuqta ajraladi, qolganlari 40%, `<title>` element nomi va qiymatini aytadi. Bosish (elementni ochish) — ota komponentda.
- **A11y:** `role="img"` + `label`; ko'rinmas jadval har guruh uchun: soni, mediana, min, max.
- **O'lchamlar:** chizma balandligi `scale/200` (doimiy); qator balandligi guruhlar soniga qarab. Guruh nomi Caption/M · `text/secondary`, o'q yozuvi Caption/S · `dataviz/label`.
