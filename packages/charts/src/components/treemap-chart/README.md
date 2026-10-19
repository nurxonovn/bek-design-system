# Treemap chart

Figma: **4.18 Chart · Treemap** — ierarxik ulush maydon bilan; eng katta katak chap-yuqorida (squarified, `d3-hierarchy`). `variant`: `default`.

```tsx
<TreemapChart
  data={{
    name: 'Budget',
    children: [
      { name: 'Food', value: 38 },
      {
        name: 'Transport',
        children: [
          { name: 'Taxi', value: 14 },
          { name: 'Metro', value: 8 },
        ],
      },
    ],
  }}
  limit={6}
  label="Budget: food is the largest share"
/>
```

- **Qachon:** bitta jamining ko'p qismi (6–30): portfel, byudjet qatorlari, fayl hajmlari; ikki darajali ierarxiya (kategoriya → element). Aniq solishtirish uchun emas — `BarChart`.
- **Kodlash:** maydon = qiymat, rang = guruh (`dataviz/categorical`), ichma-ichlik = ierarxiya. Katak radius `radius/control/sm`, oraliq `scale/2`.
- **Yozuv:** faqat ≥ 64 × 40 katakda, aks holda `<title>` (tooltip). Matn kategorik rangga to'g'ridan-to'g'ri qo'yilmaydi — `surface/card` chip: nom Label/M · `text/primary`, ulush Caption/M · `text/secondary`.
- **Mobile:** `limit={6}` — eng katta 6 guruh, qolgani "Other" (`dataviz/neutral`, `otherLabel`).
- **Interaksiya:** hover — katak `border/focus` bilan ajraladi, `<title>` ulushni aytadi. Drill-down (guruhga kirish, Esc — orqaga, breadcrumb) — ota komponent `data` ni almashtiradi.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval (guruh · element · qiymat · ulush).
- **O'lchamlar:** `width` (`scale/480`), `height` — `scale/240`; katta panelda `chart/height/lg` (280 / 320 / 400).
