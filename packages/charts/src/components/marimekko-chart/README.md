# Marimekko chart

Figma: **4.18 Chart · Marimekko** — ikki yo'nalishli ulush: ustun eni = segmentning jamidagi ulushi, ustun balandligi kategoriyalarga bo'linadi — bozor hajmi va tarkibi bitta ko'rinishda. `variant`: `default` · `labeled`.

```tsx
<MarimekkoChart
  variant="labeled"
  data={[
    { column: 'Toshkent', category: 'Cards', value: 42 },
    { column: 'Toshkent', category: 'Loans', value: 28 },
    { column: 'Samarqand', category: 'Cards', value: 36 },
    { column: 'Samarqand', category: 'Loans', value: 30 },
  ]}
  label="Toshkent is half of the portfolio; cards lead in every region"
/>
```

- **Qachon:** hajmi juda farqli segmentlar bo'yicha tarkib (hudud × mahsulot); 100% stacked bar bitta ustun boshqasidan to'rt barobar katta ekanini yashirib qo'yadigan joyda. `labeled` — taqdimot va hisobotlar uchun.
- **Kodlash:** ustun eni = ustun jami / umumiy jami, katak balandligi = kategoriyaning ustun ichidagi ulushi, rang = kategoriya (`dataviz/categorical/01–05`). Ustunlar enidan kattasidan (chapda), kategoriyalar har ustunda bir xil tartibda, eng kattasi pastda (`categories` bilan o'zgartirish mumkin). 2–6 ustun × 2–5 kategoriya; qolganini "Other" ga yig'ing.
- **Yozuv:** matn kategorik rangga to'g'ridan-to'g'ri qo'yilmaydi — `labeled` da % chip: `surface/card` + `text/primary` (Caption/S). Chip 40 × 22 dan kichik katakda chiqmaydi, qiymat `<title>` va jadvalda qoladi. Ustun ostida nom (Caption/S · `dataviz/label`) va `labeled` da ustun ulushi (`text/tertiary`).
- **Interaksiya:** hover — katak qoladi, qolganlari 40%; `<title>`: ustun, kategoriya, qiymat, ustundagi % va jamidagi %. Bitta ustun bo'lsa — `BarChart` (Stacked 100%) ishlating.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval (ustun · kategoriya · qiymat · ustundagi ulush · jamidagi ulush); legend (`ChartLegend`, Square marker) — rang yolg'iz ma'no tashimaydi.
- **O'lchamlar:** `width` (`scale/480`), `height` (`scale/200`) — plot + ustun yozuvlari; katak oralig'i 2 px, radius `chart/bar/radius`, legend oralig'i `chart/legend/gap`, chart va legend orasi `chart/gap`. Shkala yozuvlari 0 / 50 / 100% (Caption/S).
