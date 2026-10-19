# Line chart

Figma: **4.18 Chart · Line** — vaqt bo'yicha trend. Figma variantlari: Single (1 seriya), Multi (2–5 seriya + legend), Area (`area`), Hover — interaksiya holati (Crosshair + Tooltip), alohida prop emas.

```tsx
<ChartContainer>
  {(width) => (
    <LineChart
      width={width}
      labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
      series={[
        { name: 'Revenue', values: [42, 55, 48, 66, 61, 82] },
        { name: 'Plan', values: [50, 55, 60, 65, 70, 75], dashed: true },
      ]}
      label="Revenue grew 95% in six months and passed the plan in June"
    />
  )}
</ChartContainer>
```

- **Kodlash:** x = vaqt, y = qiymat (0 dan boshlanishi shart emas; `area` bilan — 0 dan), rang = seriya, uzuq chiziq = prognoz yoki reja (`dataviz/target`).
- **Chiziq:** silliq (monotone), `chart/line/stroke` 2 px; nuqtalar faqat hover'da. `null` qiymat chiziqda bo'shliq qoldiradi — yo'q ma'lumot "tekislanmaydi".
- **Interaksiya:** hover — vertikal crosshair, nuqtalar va `ChartTooltip` (kursordan 12 px, chetda teskari tomonga). Klaviatura: plotga Tab, ← → nuqtalar bo'ylab, Esc yopadi; tooltip `aria-live`.
- **Seriyalar:** ko'pi bilan 5 (Mobile'da 3); legend ko'p seriyada avtomatik.
- **A11y:** `role="img"` + `label` xulosa, ko'rinmas `<table>`.
- O'lcham: plot `chart/height/md` (200 / 240 / 320), tick `chart/axis/tick-count`; responsiv en `ChartContainer` bilan.
