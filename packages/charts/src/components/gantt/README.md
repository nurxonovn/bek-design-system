# Gantt

Figma: **4.18 Chart · Gantt** — loyiha jadvali: har vazifa bitta qator, bar = boshlanish → tugash, rang = jamoa; romb — milestone, punktir chiziq — bugun. `variant`: `default` (reja) · `progress` (bajarilgani va reja).

```tsx
<Gantt
  label="Reliz rejasi: 6 vazifa, 4 dekabr holatiga"
  today="2026-12-04"
  tasks={[
    { id: 'research', name: 'Research', team: 'Design', start: '2026-10-01', end: '2026-10-22', progress: 1 },
    { id: 'ui', name: 'UI kit', team: 'Design', start: '2026-10-28', end: '2026-11-25', progress: 0.7, dependsOn: ['research'] },
    { id: 'api', name: 'Backend API', team: 'Engineering', start: '2026-11-01', end: '2026-12-31', progress: 0.55 },
  ]}
  milestones={[{ name: 'Launch', date: '2027-01-27' }]}
/>
<Gantt variant="progress" tasks={tasks} today={today} label="…" labels={{ today: 'Bugun', months: UZ_MONTHS }} />
```

- **Qachon:** yo'l xaritalari, kurs ishga tushirishlari, reliz rejalari — haftalar yoki oylar bo'yicha 3–20 vazifa; jamoalar orasidagi ustma-ust tushish va kritik yo'l. Hodisalar ketma-ketligi uchun — `Timeline` (4.19 Timeline item); davomiylik va ustma-ustlik muhim bo'lsa — Gantt.
- **Qoidalar:** boshlanish sanasi bo'yicha saralang yoki faza/jamoa bo'yicha guruhlang (tartib — `tasks` tartibi); bitta jamoa — bitta rang (`teams` yoki vazifalardagi tartib, legend bilan); Progress'da % bar tashqarisida (rang ustida matn yo'q); `today` ni doim bering — usiz jadvalni o'qib bo'lmaydi.
- **Tarkib:** vazifa nomi Caption/M · `text/secondary` (ustun `scale/104`); bar `dataviz/categorical/0N`, radius `chart/bar/radius`; Progress — reja 0.28 shaffoflikda, bajarilgani to'liq; milestone — `dataviz/target` romb (`milestones[].task` — qaysi qatorda, standart oxirgi); bugun — punktir `dataviz/target` + `surface/card` chip; oylar Caption/S · `dataviz/label`, grid `dataviz/grid`. Muddati o'tgan (tugash < bugun va progress < 100%) — `dataviz/negative` kontur.
- **Bog'liqliklar:** `dependsOn` (`id` yoki `name`) — oldingi vazifa oxiridan keyingisi boshigacha `dataviz/label` zinapoya chizig'i; tooltip va `aria-label` da "Depends on" sifatida ham.
- **Interaktivlik:** hover / fokus — tooltip (sanalar, jamoa, progress, bog'liqliklar); `onTaskClick` — bosish, Enter yoki Space (vazifa paneli). Klaviatura: barlar `listbox` variantlari — Tab bilan kiriladi, ↑ / ↓ / Home / End tanlovni suradi, Escape tooltipni yopadi.
- **A11y:** har bar `aria-label` (nom · jamoa · sanalar · % · muddati o'tgan · bog'liqliklar); ko'rinmas jadval (vazifa, jamoa, boshlanish, tugash, %), bugun va milestone'lar matn sifatida. Sanalar `formatDate` (standart `4 Dec`) va `labels.months` bilan lokal formatda.
- **RTL:** joylashuv foizlarda va logical xossalarda — `dir="rtl"` da vaqt o'qi o'ngdan chapga, bog'liqlik chiziqlari ko'zgu bo'ladi.
- **O'lchamlar:** eni konteynerga ergashadi (Figma `scale/480`); qator 16 + 10 px, 6 vazifada plot `scale/200`; legend oralig'i `chart/legend/gap`, chart oralig'i `chart/gap`. Sanalar `'YYYY-MM-DD'`, `Date` yoki millisekund — kalendar kuni sifatida (vaqt mintaqasi siljitmaydi).
