# Sankey chart

Figma: **4.18 Chart · Sankey** — miqdorning bosqichlar orasidagi oqimi: daromad → xarajat → toifalar, manbalar → sahifalar (`d3-sankey`). `variant`: `default`.

```tsx
<SankeyChart
  nodes={[
    { id: 'salary', label: 'Salary' },
    { id: 'spent', label: 'Spent' },
    { id: 'rent', label: 'Rent' },
  ]}
  links={[
    { source: 'salary', target: 'spent', value: 45 },
    { source: 'spent', target: 'rent', value: 30 },
  ]}
  label="Income flow: 70% spent, 30% saved"
/>
```

- **Qachon:** pul, foydalanuvchi yoki trafik 2–3 bosqich orasida qayerga ketadi; 12 tagacha tugun. Mobile'da — stacked `BarChart` yoki ro'yxat bilan almashtiring.
- **Kodlash:** tugun balandligi = undan o'tgan jami, bog'lanish eni = oqim qiymati, rang = manba. Tugun — 12 px kategorik ustun; 3-ustundagi yagona manbali tugun manba rangini oladi (yoki `color`).
- **Qoidalar:** ko'pi bilan 3 ustun va 12 tugun, kichik oqimlarni "Other" ga yig'ing. Bog'lanish rangi = manba rangi, shaffoflik CSS `opacity` 28% (alfa rang emas). Yozuvlar tugundan tashqarida: nom Label/S · `text/primary`, ulush (birinchi ustun jamisidan, %) Caption/M · `text/secondary`.
- **Interaksiya:** hover — tanlangan oqim rangini saqlaydi, qolganlari 10%; `<title>` manba → maqsad: qiymat. Tugunni bosib filtrlash — ota komponentda.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval (manba → maqsad → qiymat).
- **O'lchamlar:** `width` (`scale/480`), `height` — `chart/height/md` (200 / 240 / 320), tugunlar orasi `nodePadding`.
