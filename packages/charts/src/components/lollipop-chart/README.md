# Lollipop chart

Figma: **4.18 Chart · Lollipop** — ko'p kategoriyali reyting: ingichka poya va nuqta og'ir ustunlardan tezroq o'qiladi. `variant`: `default`.

```tsx
<ChartContainer>
  {(width) => (
    <LollipopChart
      width={width}
      data={[
        { label: 'Design', value: 88 },
        { label: 'Frontend', value: 74 },
        { label: 'QA', value: 52 },
      ]}
      label="Skills ranking: Design leads with 88"
    />
  )}
</ChartContainer>
```

- **Qachon:** 6–20 kategoriya reytingi (ko'nikma, filial, mahsulot); qiymatlar yaqin va ustunlar "rang devori" bo'lib qolganda. Butunning qismlari uchun emas — Waffle yoki Donut.
- **Kodlash:** y = kategoriya (kamayish bo'yicha, `sort={false}` — tabiiy tartib), x = qiymat 0 dan, rang = seriya (`dataviz/categorical/01`, `color`). Poya `dataviz/track` · `stroke/strong`, bosh `chart/point/size`.
- **Interaksiya:** hover — qator ajraladi, qolganlari 40%; qiymat har qator oxirida yozilgan, tooltip shart emas (`<title>` bor). Drill-down — ota komponent.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval tartiblangan ro'yxat kabi o'qiladi ("1. Design, 88").
- **O'lchamlar:** kategoriya ustuni `scale/80`, qator `scale/16`, qatorlar orasi `scale/16`, oraliq `scale/12`; en `scale/480` (`width`), balandlik qatorlar sonidan. Matn: kategoriya Caption/L · `text/secondary`, qiymat Label/S · `text/primary`.
