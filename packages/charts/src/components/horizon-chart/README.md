# Horizon chart

Figma: **4.18 Chart · Horizon** — zich vaqt qatorlari: har qator qiymatini 3 ta teng balandlikdagi rang bandiga buklaydi, ko'p seriya kam joyga sig'adi. `variant`: `positive` · `diverging`.

```tsx
<HorizonChart
  variant="positive"
  bands={3}
  data={[
    { series: 'Toshkent', date: '00:00', value: 42 },
    { series: 'Toshkent', date: '06:00', value: 118 },
    { series: 'Buxoro', date: '00:00', value: null },
  ]}
  label="Load per region: Toshkent peaks at 06:00, Farg'ona at 15:00"
/>
```

- **Qachon:** bir xil vaqt oralig'ida 4–20 seriya, Line ustma-ust tushib ketadigan joyda (hudud bo'yicha yuklama, servis bo'yicha kechikish); cho'qqi qachon va qayerda ekanini ko'rish, aniq qiymat emas. `diverging` — asos atrofidagi qiymatlar (rejaga nisbatan, o'tgan haftaga nisbatan).
- **Kodlash:** qator ← seriya, x ← vaqt, qiymat ← band (har band bir xil balandlik, ustma-ust buklanadi; to'qroq = kattaroq). `positive`: `dataviz/sequential/300 · 500 · 700`; `diverging`: asosdan yuqori `dataviz/diverging/pos-2 · 3 · 4`, past `neg-2 · 3 · 4`. Bo'sh qator — `dataviz/track`.
- **Qoidalar:** band o'lchami hamma qatorga bir xil (`bandSize`) va legend'da yoziladi (standart yozuv — band oralig'i, `bandLabels` bilan almashtiriladi). Mobil'da qator ≥ 24 px — ingichka qatordan ko'ra kamroq qator. Naqsh muhim bo'lsa qatorlarni cho'qqi vaqti yoki jami bo'yicha saralang (`series`), alifbo bo'yicha emas.
- **Interaksiya:** qator ustida hover — qolganlari xiralashadi, `<title>` max/min qiymat va vaqtini aytadi; aniq qiymat har doim ko'rinmas jadvalda. Ustunlar bo'yicha crosshair va qatorni Chart/Line'ga ochish — ota komponentda. Ma'lumot yo'q (`value: null`) — trek ko'rinadi, `<title>` «no data» deydi. Yuklanish — Skeleton qatorlar.
- **A11y:** `role="img"` + `label`; ko'rinmas jadval: har sana × seriya aniq qiymati. Legend matn bilan — rang yolg'iz ma'no tashimaydi.
- **O'lchamlar:** chizma `scale/480` × `scale/200`, qator nomlari ustuni `scale/80`, legend ostida (`chart/gap`, `chart/legend/gap`). Qator nomi Caption/M · `text/secondary`, vaqt o'qi Caption/S · `dataviz/label`, legend Caption/L (ChartLegend).
