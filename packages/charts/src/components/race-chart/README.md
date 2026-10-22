# Race chart

Figma: **4.18 Chart · Race** — vaqt bo'yicha reyting animatsiyasi (bar chart race): har kadr — bitta davr, ustunlar qayta saralanadi yoki chiziqlar joriy davrgacha o'sadi; davr burchakda katta, pastda Play + progress. `variant`: `bar` · `line`.

```tsx
<RaceChart
  frames={[
    {
      period: 2019,
      values: [
        { name: 'UX/UI', value: 12 },
        { name: 'Frontend', value: 15 },
      ],
    },
    {
      period: 2020,
      values: [
        { name: 'UX/UI', value: 18 },
        { name: 'Frontend', value: 17 },
      ],
    },
  ]}
  formatValue={(v) => `${v}k`}
  label="Kurslar mashhurligi 2019–2026: UX/UI yetakchi"
/>
```

- **Qachon:** reyting yillar davomida qanday o'zgargani — kurslar, hududlar, mahsulotlar; harakat hikoyani ko'taradigan postlar va taqdimotlar. `line` — kesishishlar muhim bo'lgan jamlanma o'sish. Faqat oxirgi reyting kerak bo'lsa — `BarChart`.
- **Qoidalar:** 5–12 obyekt (`top`: Bar 12 gacha, Line 5); har obyekt rangi butun poyga davomida o'zgarmaydi (birinchi uchragan tartibda `seriesColor`, yoki `colors`). Pauzada boshlanadi — `autoplay` standart `false`, dashboard'da o'zi o'ynamaydi. Hisobot uchun oxirgi kadrni statik `BarChart` sifatida bering.
- **Holatlar:** Paused — kadr va Play; Playing — ustunlar `transform`/`width` bilan siljiydi (`motion/duration/chart-enter`), Play → Pause; Scrubbing — progress'ni sudrab istalgan davrga; End — oxirgi kadr qoladi, tugma Replay; `prefers-reduced-motion` — tween yo'q, kadrlar qadam bilan (statik reytinglar).
- **Boshqarish:** `frame` / `defaultFrame` / `onFrameChange` (boshqariladigan yoki ichki holat), `interval` — kadr davomiyligi (ms).
- **A11y:** Play — haqiqiy tugma (`Button` · Icon only, `aria-pressed`); progress — `role="slider"` (←/→ — bir kadr, Home/End — chetga, `aria-valuetext` — davr); `role="status"` har kadrda yetakchini aytadi ("2024: UX/UI 48k"); ko'rinmas jadval — barcha kadrlar.
- **Kodlash:** ustun uzunligi / chiziq y = qiymat, saralash = o'rin, rang = obyekt (`dataviz/categorical`). Nom — Caption/M · `text/secondary`, qiymat — Caption/S · `text/primary` ustundan tashqarida, davr — Headline/L · `text/tertiary`; progress — `accent/default` `dataviz/track` ustida (`scale/4`), boshi/oxiri — Caption/S · `dataviz/label`. Line: "hozir" chizig'i `dataviz/axis` uzuq, oxirida nuqta va "Nom qiymat".
- **O'lchamlar:** plot `scale/480` × `scale/200`, ustun 18, qator 25, radius `chart/bar/radius`; boshqaruv qatori oralig'i `scale/12`, Play `control/height/md`.
