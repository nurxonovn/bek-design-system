# Confusion matrix

Figma: **4.18 Chart · Confusion matrix** — klassifikator baholash: qatorlar — haqiqiy sinf, ustunlar — bashorat, diagonal — to'g'ri javoblar. `variant`: `counts` · `normalized`.

```tsx
<ConfusionMatrix
  labels={['Payments', 'Cards', 'Loans', 'Other']}
  matrix={[
    [412, 18, 9, 11],
    [22, 286, 6, 14],
    [7, 9, 198, 16],
    [21, 17, 12, 182],
  ]}
  variant="normalized"
  label="Ticket routing model: 86,9% accuracy; Other is confused with Payments most"
/>
```

- **Qachon:** klassifikatorni baholash (murojaatlarni yo'naltirish, firibgarlik, intent) — o'qitishdan keyin yoki production monitoringda; faqat umumiy aniqlik emas, qaysi sinflar adashtirilishini ko'rsatish. Sinflar nomutanosib bo'lsa — `normalized`. 2–10 sinf.
- **Kodlash:** katak rangi = qator ulushi, faqat `dataviz/sequential` 200 · 300 · 600 · 700 (`textCellLevel`, CMP-07); matn 200/300 da `text/primary`, 600/700 da `text/inverse` (`textOnCell` juftligi) — Light va Dark'da ≥ 4.5:1. `counts` — xom son (`412`), `normalized` — qator ulushi (`91,6%`); rang ikkalasida bir xil. `normalize` — `variant="normalized"` qisqa yozuvi.
- **Xulosa:** pastda `Accuracy 86,9% · 1 240 samples · columns = predicted` (Caption/M · `text/secondary`); `summary` bilan almashtiriladi yoki `false` bilan yashiriladi. `confusionStats(matrix)` — accuracy, precision, recall.
- **Interaksiya:** hover — katak konturi, `title`: haqiqiy → bashorat, son, qator %, precision / recall. Katakni bosish (xato namunalarga o'tish), qayta o'qitish xabari (`ChartInsight`) va yuklanish (`Skeleton`) — ota komponentda.
- **A11y:** haqiqiy `<table>`: `<caption>` (`label`, ko'rinmas), ustun sarlavhalari `scope="col"`, sinf nomlari `scope="row"` — ekran o'quvchi jadvalni to'g'ridan-to'g'ri o'qiydi; skroll maydoni klaviaturadan suriladi.
- **O'lchamlar:** `width` (`scale/480`) — tor ekranda gorizontal skroll; `height` (`scale/200`) — qator balandligi shundan (24–40 px). Katak oralig'i `scale/4`, radius `chart/bar/radius`; burchak va ustun sarlavhasi Caption/S · `dataviz/label`, qator nomi Caption/M · `text/secondary`, qiymat Caption/M.
