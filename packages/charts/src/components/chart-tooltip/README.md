# Chart tooltip

Figma: **4.18 Chart · Tooltip** — chart ustidagi qiymat kartochkasi. `rows` soni bo'yicha: 1 — `single`, 2+ — `multi` (ko'pi bilan 6).

```tsx
<ChartTooltip
  title="18 Oct 2026"
  rows={[
    { label: 'Daromad', value: formatNumber(12450000) },
    { label: 'Reja', value: formatNumber(12000000), dashed: true },
  ]}
/>
```

- Sarlavha = x (Caption/M · `text/tertiary`), qatorlar: marker + label (Body/S · `text/secondary`) + qiymat (Label/M · `text/primary`, tabular).
- Joylashuv chartda: web'da kursordan 12 px, chetga yetganda teskari tomonga; touch'da nuqtaga mahkamlanadi. Esc yopadi, strelkalar nuqtalar bo'ylab yuradi.
- `role="tooltip"`; chart o'zgarishlarni `aria-live` bilan e'lon qiladi. Format uz-UZ, minus `−`.
- Fon `surface/raised` + Elevation/2 (Dark'da soya 0, rang ajratadi).
