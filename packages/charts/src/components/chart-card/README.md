# Chart card

Figma: **4.18 Chart · Card** — har dashboard chartining o'ramasi: sarlavha, davr tanlagich, KPI qatori, chart sloti va manba. `state`: `default` · `loading` · `empty` · `error`.

```tsx
<ChartCard
  title="Revenue"
  subtitle="Last 6 months · UZS"
  periods={[
    { value: '1m', label: '1M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' },
  ]}
  period={period}
  onPeriodChange={setPeriod}
  kpi={{ value: '4 820 mln', delta: 12.4, comparison: 'vs previous 6 months' }}
  footer="Source: Core banking · Updated 18 Oct, 09:40"
  state={isLoading ? 'loading' : rows.length ? 'default' : 'empty'}
  onChangePeriod={() => setPeriod('1y')}
>
  <ChartContainer>
    {(w) => <LineChart width={w} labels={months} series={series} label="…" />}
  </ChartContainer>
</ChartCard>
```

- **Tarkib:** Title/M sarlavha + Caption/M izoh, 3.10 Segmented control (davr), KPI — Headline/M qiymat + `Delta` + taqqoslash, chart sloti, Caption/M footer (manba va yangilanish vaqti).
- **Holatlar:** Loading — chart shaklida 5.4 Skeleton, header interaktiv qoladi (`aria-busy`); Empty — 5.3 Empty state (maskotsiz) + "Change period"; Error — xabar + "Try again" (`role="alert"`), footer xato manbasini (`errorSource`) ko'rsatadi.
- **Qachon:** dashboard yoki hisobotdagi har chart. Boshqa karta ichiga solmang — chartni to'g'ridan-to'g'ri joylang.
- **Sirt:** `surface/card`, `radius/surface/md`, padding `chart/padding` (12 / 16 / 24), oraliq `chart/gap`; chart sloti kamida `chart/height/md`. Kenglik konteynerga to'liq moslashadi (FILL).
