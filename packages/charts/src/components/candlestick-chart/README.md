# Candlestick chart

Figma: **4.18 Chart · Candlestick** — davr bo'yicha narx harakati: tana = ochilish → yopilish, pilik = yuqori → past. `variant`: `default` · `volume`.

```tsx
<CandlestickChart
  variant="volume"
  data={[
    { t: '12 Oct', o: 61, h: 63, l: 56, c: 58, v: 12400 },
    { t: '13 Oct', o: 58, h: 62, l: 57, c: 61, v: 9800 },
  ]}
  upLabel="O'sish"
  downLabel="Pasayish"
  label="USD/UZS fell 5% over two weeks"
/>
```

- **Qachon:** valyuta kurslari, aksiya va kripto narxlari — har qanday OHLC ma'lumot. Volume — narx ostida savdo faolligi. Faqat yopilish narxi kerak bo'lsa — `LineChart`.
- **Kodlash:** x ← davr, tana ← [open, close], pilik ← [low, high], rang ← close ≥ open: o'sish `dataviz/positive`, pasayish `dataviz/negative` — hech qachon seriya ranglari. Tana radiusi `scale/1`; Volume ustunlari qatlam shaffofligi 40%, balandligi `scale/40`.
- **Interaksiya:** hover — sham ustuni belgilanadi, `<title>`: sana, O, H, L, C, hajm. Zoom va Range brush — ota komponent `data` oynasini toraytiradi; Mobile'da standart oyna 1 hafta, pinch-zoom.
- **A11y:** `role="img"` + `label`; ko'rinmas jadval ("12 Oct: open 61, close 58, high 63, low 56"). Rang yolg'iz ma'no tashimaydi — legend Up · Down.
- **O'lchamlar:** plot `chart/height/md` (200 / 240 / 320), Y ustuni `scale/32`, o'q oralig'i `chart/axis/label-gap`. O'q yozuvi Caption/S · `dataviz/label`, legend Caption/L · `text/secondary` (ChartLegend).
