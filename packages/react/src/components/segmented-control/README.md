# SegmentedControl

Figma: **3.10 Segmented control** — 2–4 o'zaro istisno ko'rinish yoki rejim (davr, o'lcham). `size`: `m` · `l`; `variant`: `solid` · `overlay` (rasm/video ustida).

```tsx
<SegmentedControl
  aria-label="Davr"
  value={period}
  onChange={setPeriod}
  options={[
    { value: 'day', label: 'Kun' },
    { value: 'week', label: 'Hafta' },
    { value: 'month', label: 'Oy' },
  ]}
/>
```

Ichida native radio guruh: bitta Tab to'xtashi, ← → bilan almashadi; RTL'da tartib avtomatik ko'zgulanadi. Sahifa bo'limlari orasida o'tish uchun — Tabs (6.1).
