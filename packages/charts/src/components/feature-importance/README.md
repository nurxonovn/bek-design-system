# Feature importance

Figma: **4.18 Chart · Feature importance** — bitta model qarorini tushuntiradi (SHAP): qaysi kirishlar ballni oshirdi yoki pasaytirdi. `variant`: `bar` (nol atrofida ishorali hissalar) · `waterfall` (base rate → har kirish → prediction).

```tsx
<FeatureImportance
  contributions={[
    { feature: 'Income', value: 0.42 },
    { feature: 'Payment history', value: 0.31 },
    { feature: 'Debt ratio', value: -0.27 },
    { feature: 'Account age', value: 0.12 },
  ]}
  label="Income raised the score most (+0,42); debt ratio lowered it (−0,27)"
/>
<FeatureImportance variant="waterfall" base={0.35} contributions={contributions} label="From 0,35 base rate to 0,66 prediction" />
```

- **Qachon:** kredit skoring, firibgarlik belgisi, tavsiyalar — odam so'roq qilishi mumkin bo'lgan har AI qarori. Butun model bo'yicha global ahamiyat → Chart/Bar.
- **Kodlash:** qator = kirish (|hissa| bo'yicha kamayish), uzunlik = hissa, rang = yo'nalish: oshiradi `dataviz/diverging/pos-3`, pasaytiradi `neg-3` — **faqat diverging, kategorik emas**. Nol chizig'i va waterfall ulagichlari `dataviz/axis` (uzuq 2/2), base va prediction `dataviz/neutral`.
- **Qoidalar:** top 7 kirish (`maxFeatures`), qolgani "Other features" (`otherLabel`) ga yig'iladi; oddiy tildagi nomlar ("Debt ratio", `dti_v2` emas); waterfall aynan ko'rsatilgan prediction'da tugaydi (base + hissalar yig'indisi).
- **Format:** ishorali, haqiqiy minus: `+0,42`, `−0,27` (`formatValue`).
- **Interaksiya:** hover — boshqa qatorlar 40%, `<title>` hissani aytadi.
- **A11y:** `role="img"` + `label`, ko'rinmas `<table>` (Feature · Contribution, waterfall'da base va prediction ham).
- **O'lchamlar:** eni `scale/480` (konteynerga ergashadi), qator Bar 24 / Waterfall 20 (`rowHeight`), bar radiusi `scale/2`; nom Caption/M · `text/secondary`, qiymat Label/S · `text/primary`.
