# Slider · RangeSlider

Figma: **3.8 Slider** — `Type=Single` → `Slider`, `Type=Range` → `RangeSlider`. O'lcham `s` · `m` · `l` (yo'lak 6/8/10, thumb 14/16/20 px).

```tsx
<Slider aria-label="Ovoz" value={volume} onChange={(e) => setVolume(+e.target.value)} />
<RangeSlider min={0} max={1_000_000} step={10_000} value={price} onChange={setPrice}
  formatValue={(v) => `${v.toLocaleString('uz')} so'm`} labels={['Narx dan', 'Narx gacha']} />
```

`Slider` — native `<input type="range">` (← → qadam, Page ↑↓, Home/End). `RangeSlider` — ikki thumb, har biri alohida Tab to'xtashi; `showValueLabels` (default `true`) qiymatlarni ustida ko'rsatadi. Figma'dagi "Show inputs" (From / To maydonlari) — kerak bo'lsa ikki `TextField` bilan yig'iladi.
