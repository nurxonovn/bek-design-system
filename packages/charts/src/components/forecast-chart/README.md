# Forecast chart

Figma: **4.18 Chart · Forecast** — kuzatilgan seriya (to'liq chiziq) va model prognozi (uzuq, `dataviz/ai/accent`) Prediction zone ichida, 80% va 95% ishonch oraliqlari bilan. `variant`: `default` · `target` (maqsad chizig'i).

```tsx
<ChartContainer>
  {(width) => (
    <ForecastChart
      width={width}
      labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']}
      actual={[42, 48, 45, 55, 58, 54, 67]}
      forecast={[
        { value: 71, range: { 80: [66, 76], 95: [63, 80] } },
        { value: 74, range: { 80: [66, 82], 95: [62, 88] } },
        { value: 78, range: { 80: [67, 88], 95: [63, 95] } },
        { value: 82, range: { 80: [71, 93], 95: [64, 100] } },
      ]}
      target={85}
      label="Forecast for November 82, likely between 71 and 93 (80%)"
    />
  )}
</ChartContainer>
```

- **Qachon:** model keyingi davrda nimani kutayotganini ko'rsatish (daromad, talab, balans). `target` — prognozni maqsad bilan solishtirish. Oraliqsiz prognoz — hech qachon.
- **Kodlash:** x = vaqt, y = qiymat, uzuq chiziq = prognoz (doim AI rangi, seriya rangi emas), band = har daraja uchun `[lo, hi]` (`dataviz/uncertainty/50 · 80 · 95`, `bands` bilan tanlanadi). Prognoz aynan oxirgi haqiqiy nuqtadan boshlanadi; "Today" belgisi (fill/inverse tag) ma'lumotni prognozdan ajratadi; Prediction zone — `dataviz/grid` fon, sparkles + "Forecast" yorlig'i pastki o'ngda.
- **Interaksiya:** prognoz nuqtalari ustida `<title>` — qiymat va oraliq ("Nov: 82 (80%: 71–93 · 95%: 64–100)"). `recalculating` — oraliqlar va chiziq 40%, legend yonida Spinner.
- **A11y:** `role="img"` + `label` xulosa (prognoz, oraliq, ufq), ko'rinmas `<table>`: Date · Actual · Forecast · oraliqlar. Sarlavhada ufqni ayting ("next 4 months").
- **O'lchamlar:** plot `chart/height/md` (200 / 240 / 320) → `height`, chiziq `chart/line/stroke` 2 px, prognoz uzuq 6/4. Responsiv en — `ChartContainer`.
- **Halollik:** oraliqlarni "soddalashtirish" uchun yashirmang — oraliqsiz prognoz va'daga o'xshaydi.
