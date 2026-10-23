# Pictogram

Figma: **4.18 Chart · Pictogram** — isotype: son takrorlanuvchi ikonkalar bilan ko'rsatiladi — "3 in 10" hisoblanmaydi, his qilinadi. `variant`: `default` (bitta ulush) · `compare` (guruh/davr bo'yicha qatorlar).

```tsx
<Pictogram
  value={0.3}
  total={20}
  unit="students"
  caption="students finish the first course within a month"
/>

<Pictogram
  variant="compare"
  unit="students"
  rows={[
    { label: '2020', value: 0.2 },
    { label: '2026', value: 0.5 },
  ]}
/>
```

- **Qachon:** ulushni keng auditoriyaga sezdirish — hisobotlar, ijtimoiy postlar, landing sahifalar; kichik butun sonlar ("3 in 10", "1 in 4"); ikki davr yoki guruhni qatorma-qator solishtirish. Ko'p guruhni aniq solishtirish uchun — `BarChart`.
- **Qoidalar:** 10, 20 yoki 100 ikonka (`total`; standart Default 20, Compare 10) — tez sanalsin; bitta chartda bitta shakl (`icon`: `person` yoki o'z SVG'ingiz `currentColor` bilan), bezak emas; birlik va aniq son doim matnda (`unitLabel`, standart "1 icon = 5% of students"); ikonkalar o'raladi, siqilmaydi va cho'zilmaydi. 3D yoki aralash uslubdagi ikonkalar ishlatilmaydi.
- **Kodlash:** ikonkalar soni = jami birlik; yoqilgani = qiymat (`dataviz/categorical/01`), qolgani `dataviz/track`; oxirgi ikonka kasrga qirqiladi (0,5). Sarlavha — Headline/L · `text/primary` (standart `pictogramFraction(value)`), izoh — Caption/M · `text/secondary`; Compare qiymati — Label/S · `text/primary`.
- **Holatlar:** qator ustida — aniq qiymat va n (`title`); `animate` — birinchi ko'rinishda to'lib chiqish (reduced motion'da yo'q).
- **A11y:** ikonkalar guruhi `role="img"` + matnli qiymat ("3 in 10 students"), har ikonka `aria-hidden`; Compare'da ko'rinmas jadval.
- **O'lchamlar:** ikonka 16 × 24 (Person: bosh 8, tana — yuqorisi `radius/full`, pasti `chart/bar/radius`), ikonkalar orasi `scale/8`; sarlavha ustuni `scale/140`, Body oralig'i `scale/24`; Compare qatori `scale/16`, qatorlar `scale/12`; legend `chart/legend/gap`.
