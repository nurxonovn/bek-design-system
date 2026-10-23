# Region map

Figma: **4.18 Chart · Map** — O'zbekistonning 14 hududi (12 viloyat, Qoraqalpog'iston Respublikasi, Toshkent shahri) bo'yicha statistika. `variant`: `choropleth` (ulush/stavka — rang) · `bubble` (son — doira yuzi) · `hex` (teng plitkalar).

```tsx
<RegionMap
  metric="Mobile banking users, % of adults"
  formatValue={(v) => `${v}%`}
  data={[
    { region: 'UZ-TK', value: 82 },
    { region: 'karakalpakstan', value: 33 },
    // … qolgan 12 hudud
  ]}
  label="Highest: Toshkent sh. 82%, lowest: Qoraqalpog‘iston 33%"
/>

<RegionMap variant="bubble" metric="population, mln" data={population} label="…" />
<RegionMap variant="hex" data={coverage} label="…" />
```

- **Hudud kodi:** ISO 3166-2:UZ — `UZ-AN` Andijon, `UZ-BU` Buxoro, `UZ-FA` Farg‘ona, `UZ-JI` Jizzax, `UZ-NG` Namangan, `UZ-NW` Navoiy, `UZ-QA` Qashqadaryo, `UZ-QR` Qoraqalpog‘iston, `UZ-SA` Samarqand, `UZ-SI` Sirdaryo, `UZ-SU` Surxondaryo, `UZ-TO` Toshkent viloyati, `UZ-TK` Toshkent sh., `UZ-XO` Xorazm. Figma ma'lumot shaklidagi slug'lar (`tashkent-city`, `karakalpakstan`, …) ham qabul qilinadi; ro'yxat — `UZ_REGIONS`.
- **Qachon:** geografiya muhim bo'lgan hududiy qiymatlar — filiallar qamrovi, foydalanuvchilar, narxlar, viloyatlar bo'yicha natijalar. Son (aholi, foydalanuvchi) — `bubble`: miqdorni rang emas, yuz ko'taradi. Kichik hududlar (Toshkent sh.) ham ko'rinishi va solishtirilishi kerak bo'lsa — `hex`.
- **Qoidalar:** Choropleth faqat stavka va ulushlar uchun — xom sonlar Bubble'da (aks holda xarita hudud kattaligini ko'rsatadi). Sinflangan shkala: Choropleth 6 qadam (`dataviz/sequential` 200–700), Hex 4 qadam (200 · 300 · 600 · 700 — kod matni CMP-07 bo'yicha `text/primary` / `text/inverse`); diapazon legendda. Rangli hudud ustiga qiymat yozilmaydi — 1–3 asosiy hudud `chips` bilan (standart: Choropleth — eng yuqori va eng past, Bubble — eng katta ikkitasi). Katta yuz ≠ katta qiymat: doim reytingli jadval yoki tooltip bilan.
- **Holatlar:** hover / fokus — `chart/line/stroke` kontur va tooltip (hudud, qiymat, 14 tadan o'rni); bosish yoki Enter — tanlash, qolganlari 0,4 (`selected` / `onSelectChange`); ma'lumot yo'q (`value: null`) — `dataviz/track` + diagonal shtrix, "No data"; `loading` — xarita konturi `dataviz/track` da.
- **Kodlash:** Choropleth — `dataviz/sequential`, chegaralar `surface/card`; Bubble — yer `dataviz/track`, doira `dataviz/categorical/01` 0,72, yuz ∝ qiymat (`scaleSqrt`); Orol dengizi — `dataviz/grid`. Value chip — `surface/card` · `text/primary`, Caption/S.
- **A11y:** har hudud fokuslanadi (`role="button"`, `aria-label`: "Toshkent sh.: 82%, rank 1 of 14", `aria-pressed`). Tab — reyting tartibida, strelkalar — shu yo'nalishdagi qo'shni hududga, Escape — tanlovni bekor qilish. Ko'rinmas jadval — hudud, o'rin, qiymat (reyting tartibida). Rang yolg'iz ma'no tashimaydi (chip, tooltip, jadval).
- **O'lchamlar:** plot `scale/480` × `scale/200`; xarita ramkasi (`scale/304` × 198) markazda, bir xil masshtab — cho'zilmaydi (CMP-11). Legend oralig'i `scale/4`, marker `chart/legend/marker`.
- **Xarita manbasi:** svg-maps (V. Cazanave, https://github.com/VictorCazanave/svg-maps), CC BY 4.0 — Figma'dagi soddalashtirilgan nusxa, kodga ko'chirilgan (`geo.ts`); o'zgarishlar va litsenziya — [`packages/charts/LICENSE-ASSETS.md`](../../../LICENSE-ASSETS.md). Xarita ko'rsatilgan sahifada manbani qayd eting.
