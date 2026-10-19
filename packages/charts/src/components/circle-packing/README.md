# Circle packing

Figma: **4.18 Chart · Circle packing** — qiymat doira maydoni bilan, doiralar ustma-ust tushmasdan joylashadi (`d3-hierarchy` pack). `variant`: `flat` · `nested`.

```tsx
<CirclePacking
  variant="nested"
  data={{
    name: 'Usage',
    children: [
      {
        name: 'Payments',
        children: [
          { name: 'P2P', value: 42 },
          { name: 'QR', value: 30 },
          { name: 'Bills', value: 18 },
        ],
      },
      { name: 'Savings', children: [{ name: 'Deposits', value: 26 }] },
    ],
  }}
  label="Payments dominate usage; P2P is the largest single feature"
/>
```

- **Qachon:** 8–40 element hajmini tez his qilish (funksiya ishlatilishi, xarajat toifalari); aniq solishtirish maqsad bo'lmagan ikki darajali ierarxiya (`nested`). Reyting kerak bo'lsa — `BarChart` yoki yonida jadval.
- **Kodlash:** doira maydoni = qiymat (radius — `sqrt`), joylashuv ma'no tashimaydi. `flat` — rang = guruh (`dataviz/categorical/01–03`, ko'pi bilan 3 guruh; ko'proq bo'lsa `nested` yoki `TreemapChart`) + legend. `nested` — ota doira `dataviz/sequential/100`, element `dataviz/sequential/300`.
- **Yozuv:** faqat sig'sa, doira chetidan chiqmaydi; aks holda `<title>` va jadvalda. `flat` — `surface/card` chip + `text/primary` (kategorik rangga to'g'ridan-to'g'ri matn yo'q); `nested` — element nomi `sequential/300` ustida `text/primary` (CMP-07), guruh nomi ota doira tepasidagi chipda (`text/secondary`). Caption/S.
- **Interaksiya:** hover — doira konturi `chart/line/stroke`, `<title>`: nom, qiymat, guruhdagi ulush. Zoom (Nested: otani bosish → plotni to'ldiradi, Esc — orqaga) — ota komponent `data` ga guruhning o'zini beradi.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval (guruh · element · qiymat · ulush).
- **O'lchamlar:** chizma markazdagi kvadratda (`min(width, height)`, `scale/200`) — geometriya cho'zilmaydi (CMP-11); eni `scale/480`. Chart va legend orasi `chart/gap`, legend `chart/legend/gap`.
