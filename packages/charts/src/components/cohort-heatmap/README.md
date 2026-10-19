# Cohort heatmap

Figma: **4.18 Chart · Cohort heatmap** — ro'yxatdan o'tish kogortasi bo'yicha saqlanish: qatorlar — kogortalar, ustunlar — boshlanishdan keyingi oylar (M0 = 100%). `variant`: `percent` · `absolute`.

```tsx
<CohortHeatmap
  cohorts={[
    { label: 'Jan 2026', size: 1240, values: [100, 62, 48, 41, 37, 34] },
    { label: 'Feb 2026', size: 1180, values: [100, 58, 45, 38, 35] },
    { label: 'Mar 2026', size: 1420, values: [100, 66, 52, 46] },
  ]}
  label="Newer cohorts retain better: M1 grew from 62% to 66%"
/>
```

- **Qachon:** saqlanish (retention), takroriy xarid, kredit to'lovi — kogorta bo'yicha; yangi kogortalarni eskilari bilan solishtirish. Bitta kogorta — `LineChart`.
- **Kodlash:** katak rangi ← saqlanish ulushi, faqat `dataviz/sequential` 200 · 300 · 600 · 700 (`textCellLevel`, CMP-07): 400/500 bir rejimda matn kontrastidan o'tmaydi. Matn 200/300 da `text/primary`, 600/700 da `text/inverse` (`textOnCell` juftligi) — Light va Dark'da ≥ 4.5:1. Katak radiusi `scale/4`.
- **Variantlar:** `percent` — M0 ulushi (`48%`), `absolute` — son (`size × %`, `595`). Rang ikkalasida bir xil — saqlanish ulushidan.
- **Interaksiya:** hover — qator ajraladi, katak konturi; `<title>` soni va foizini aytadi.
- **Mobile:** kataklar gorizontal skroll qiladi, kogorta va hajm ustuni joyida qoladi (alohida, `aria-hidden` qatlam).
- **A11y:** `role="img"` + `label`; ko'rinmas jadval: kogorta × davr.
- **O'lchamlar:** maydon `scale/480`, katak eni tor ekranda kamida `scale/40`. Sarlavha Caption/S · `dataviz/label`, kogorta Caption/M · `text/secondary`, hajm Caption/M · `text/tertiary`, katak qiymati Caption/S.
