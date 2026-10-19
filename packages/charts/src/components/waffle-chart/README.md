# Waffle chart

Figma: **4.18 Chart · Waffle** — 100 katak, bitta katak 1%; yaqin ulushlarni pie'dan aniqroq ko'rsatadi va Mobile'da yaxshi o'qiladi. `variant`: `default`.

```tsx
<WaffleChart
  data={[
    { label: 'Mobile app', share: 0.46 },
    { label: 'Web', share: 0.28 },
    { label: 'Branch', share: 0.16 },
  ]}
  label="46 percent Mobile app, 28 percent Web, 16 percent Branch, 10 percent other"
/>
```

- **Qachon:** bitta ulush yoki aniq solishtiriladigan 2–4 ulush; maqsad va progress sanaladigan birliklarda. 4 tadan ko'p kategoriya uchun emas.
- **Kodlash:** kataklar = `round(share × 100)` (eng katta qoldiq usuli, yig'indi 100), rang = kategoriya (`dataviz/categorical`), qoldiq — `dataviz/track` (legendda `remainderLabel`, standart "Other").
- **Qoidalar:** doim 100 katak; to'ldirish pastki chapdan o'ngga, qatorma-qator; ko'pi bilan 4 kategoriya + qoldiq.
- **Interaksiya:** hover — kategoriya kataklari ajraladi, qolganlari 40%.
- **A11y:** `role="img"` + `label` ("38 percent Cards, 22 percent Transfers, 40 percent other"), ko'rinmas jadval.
- **O'lchamlar:** katak `scale/16` (`cellSize`), oraliq `scale/4`, radius `scale/4`; 10 × 10 to'r kvadrat qoladi — cho'zilmaydi. To'r va legend orasi `scale/32`, legend qatorlari `scale/12`. Legend — `LegendItem` (Square) + qiymat Label/S · `text/primary`.
