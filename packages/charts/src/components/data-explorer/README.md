# Data explorer

Figma: **4.18 Chart · Data explorer** — saralanadigan jadval ichida kichik chartlar: har qatorda `Sparkline` (trend), ulush chizig'i va `Delta`. `variant`: `default` (barcha ustunlar) · `compact` (trend va ulushsiz — mobil).

```tsx
<DataExplorer
  label="Kurslar: o'quvchilar soni, 12 oylik trend va o'zgarish"
  rows={[
    { name: 'UX/UI', series: [31, 33, 36, 40, 44, 48.2], value: 48200, share: 0.92, delta: 12.4 },
    { name: 'SMM', series: [22, 21, 20, 19, 18.5, 18.1], value: 18100, share: 0.35, delta: -6.2 },
  ]}
  defaultSortBy="value"
  columns={['trend', 'share']}
  labels={{ name: 'Kurs', trend: 'Trend, 12 oy', value: "O'quvchilar", share: 'Ulush' }}
/>
<DataExplorer variant="compact" rows={rows} label="…" />
```

- **Qachon:** o'quvchiga aniq qiymat ham, tezkor vizual ko'rinish ham kerak bo'lganda; 5–50 elementni (kurslar, filiallar, mahsulotlar) trend va o'zgarish bilan tartiblash; ko'p kichik chartlar devori o'rniga bitta jadval. Aniq raqamlar muhim bo'lsa — kichik chartli jadval katta chartdan yaxshi.
- **Qoidalar:** raqamlar o'ngga tekislangan, tabular; ulush chiziqlari uchun bitta urg'u rangi (`dataviz/categorical/01` · `dataviz/track`); sparkline'lar bir xil mantiqda — har biri o'z oralig'ida (nisbiy trend); 50 qatordan ko'pida sahifalash yoki virtualizatsiya.
- **Saralash:** sarlavha tugmasi (bosish / Enter) — faol ustunda ↓ / ↑ va `aria-sort`; boshqariladigan (`sortBy`, `sortDirection`, `onSortChange`) yoki ichki (`defaultSortBy`, standart `value` kamayish bo'yicha). `onRowClick` — nom tugmaga aylanadi (batafsil sahifa). Qator yo'q bo'lsa — `empty` (filtrlarni tiklash taklifi).
- **A11y:** haqiqiy `<table>`: ko'rinmas `caption` (`label`), `th scope="col"` / `scope="row"`, `aria-sort`; sparkline `aria-label` ("UX/UI: up"); ulush ko'rinmas matnda (`92%`); `Delta` ishorasi matnda (`+12,4%`, `−6,2%`).
- **Tarkib:** sarlavha Caption/S · `dataviz/label`; nom Label/M · `text/primary`; qiymat Body/S; qator chizig'i `border/hairline`; hover — `bg/sheet`. Ustunlar: trend `scale/80` (Sparkline 80 × 20), qiymat `scale/64`, ulush va Δ `scale/72`; katak oralig'i va qator paddingi `scale/12`, sarlavha `scale/8`.
- **Ma'lumot:** `delta` — foizda (`12.4` → `+12,4%`, paketdagi `Delta` / `ChartCard` bilan bir xil); `share` — 0…1.
