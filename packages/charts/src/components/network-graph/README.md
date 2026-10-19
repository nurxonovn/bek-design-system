# Network graph

Figma: **4.18 Chart · Network graph** — entitetlar (mahsulotlar, hisoblar, xizmatlar, o'tkazmalar) orasidagi bog'lanishlar. `variant`: `default` · `focus`.

```tsx
<NetworkGraph
  variant="focus"
  focus="loans"
  nodes={[
    { id: 'bank', label: 'BEK Bank', group: 'Core' },
    { id: 'cards', label: 'Cards', group: 'Payments' },
    { id: 'loans', label: 'Loans', group: 'Lending' },
    { id: 'mortgage', label: 'Mortgage', group: 'Lending' },
  ]}
  links={[
    { source: 'bank', target: 'cards' },
    { source: 'bank', target: 'loans' },
    { source: 'loans', target: 'mortgage' },
  ]}
  label="Loans connect the bank with mortgage and auto lending"
/>
```

- **Qachon:** nima nima bilan bog'langanini ko'rsatish (mahsulot ekotizimi, hisoblar orasidagi pul oqimi); ~40 tugungacha. Ierarxiya — `Treemap` yoki Diagram/Org card.
- **Kodlash:** tugun o'lchami ← degree yoki `size` (hajm), rang ← guruh (`seriesColor(i)`), bog'lanish ← aloqa (`dataviz/axis`, `chart/line/stroke`). Tugunda `surface/card` halqa (`stroke/strong`).
- **Joylashuv:** har tugunda `x`/`y` bo'lsa — shu koordinatalar; aks holda d3-force sinxron `iterations` qadam (standart 300) — natija deterministik, SSR va klientda bir xil. Koordinatalar bir xil masshtab bilan plot markaziga joylanadi — geometriya cho'zilmaydi.
- **Focus:** `variant="focus"` + `focus` — tugun va qo'shnilari ajratiladi, bog'lanishlar tugun rangida, qolgani qatlam shaffofligi 25%. Bosish bilan fokus, sudrash, zoom/pan — ota komponent `focus` ni boshqaradi.
- **Qoidalar:** yozuv faqat katta (`labelMinRadius`) yoki fokusdagi tugunlarda; 40 dan ortiq tugunni filtrlang yoki klasterlang. Mobile'da faqat tanlangan tugunning 1-daraja qo'shnilari.
- **A11y:** `role="img"` + `label`; ko'rinmas jadval — har tugun uchun qo'shnilar ro'yxati (adjacency list).
- **O'lchamlar:** plot `scale/200` (doimiy) balandlikda; legend `chart/legend/gap`. Yozuv Caption/M · `text/secondary`, legend Caption/L (ChartLegend).
