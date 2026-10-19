# Box plot

Figma: **4.18 Chart · Box plot** — har guruh uchun besh sonli xulosa (min, Q1, mediana, Q3, max) va chetlanishlar; guruhlar qator bo'lib chiziladi. `variant`: `box` · `violin` · `box-points` (Figma «Box + points»).

```tsx
<BoxPlot
  variant="box"
  sort
  data={[
    { group: 'Toshkent', values: [120, 160, 190, 210, 250, 340, 385] },
    { group: 'Samarqand', values: [80, 110, 135, 150, 180, 330], labels: ['#101', '#102'] },
    { group: 'Buxoro', values: [60, 95, 120, 140, 230] },
  ]}
  label="Order value by city: Toshkent has the highest median"
/>
```

- **Qachon:** 3–12 guruhda o'rtachani emas, tarqalishni solishtirish (shahar bo'yicha buyurtma summasi, jamoa bo'yicha javob vaqti); KPI uchun o'rtacha yoki mediana tanlashdan oldin og'ish va chetlanishlarni ko'rish. `violin` — shakl muhim bo'lsa (ikki cho'qqi); `box-points` — guruhda n < 50 bo'lsa, o'quvchi namunani ko'radi.
- **Kodlash:** qator ← guruh, x ← qiymat (umumiy shkala). Quti Q1–Q3 (`dataviz/categorical/01`, qatlam shaffofligi 0,28 + kontur, `chart/bar/radius`), mediana `chart/line/stroke`, mo'ylov va qopqoq grid qalinligida, chetlanish — `surface/card` ustida ichi bo'sh nuqta. Hamma guruh bitta rangda; rang faqat bitta guruhni ajratish uchun.
- **Qoidalar:** mo'ylov = 1,5 × IQR (Tukey) — `boxStats()`; qutidagi chiziq — mediana (o'rtacha emas; KPI o'rtacha bo'lsa Data point bilan alohida belgilang). Tartib ma'noli bo'lmasa `sort` — mediana bo'yicha. Bitta qiymat — faqat bitta chiziq va «n = 1», quti chizilmaydi; bo'sh guruh — «n = 0».
- **Interaksiya:** guruh ustida hover — qolganlari 0,4 gacha xiralashadi, `<title>` n, min, Q1, mediana, Q3, max ni aytadi; chetlanish ustida — xom qiymat va yozuv nomi (`labels[i]`). Yuklanish holati — Chart/Card Loading (Skeleton).
- **A11y:** `role="img"` + `label`; ko'rinmas jadval har guruh uchun n, min, Q1, mediana, Q3, max.
- **O'lchamlar:** chizma `scale/480` × `scale/200`, guruh nomlari ustuni `scale/80`. Guruh nomi Caption/M · `text/secondary`, o'q yozuvi Caption/S · `dataviz/label`, grid `dataviz/grid`, o'q `dataviz/axis`. Responsiv en — `ChartContainer`.
- **Yordamchilar:** `boxStats(values)`, `kernelDensity(values, xs, bandwidth)`, `silvermanBandwidth(values)` — Violin va Ridgeline bir xil hisobni ishlatadi.
