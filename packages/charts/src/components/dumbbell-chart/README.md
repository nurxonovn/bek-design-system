# Dumbbell chart

Figma: **4.18 Chart · Dumbbell** — har qatorda ikki qiymat trek bilan ulangan: reja va fakt, oldin va keyin; farq — asosiy gap. `variant`: `default`.

```tsx
<DumbbellChart
  fromLabel="Plan"
  toLabel="Actual"
  data={[
    { label: 'Q1', from: 40, to: 56 },
    { label: 'Q2', from: 47, to: 44 },
  ]}
  label="Actual beat plan in Q1 (+16), missed in Q2 (−3)"
/>
```

- **Qachon:** reja va fakt, o'tgan yil va bu yil, o'zgarishdan oldin va keyin; 3–12 qator. Ko'p davrli vaqt qatorlari uchun emas — Line.
- **Kodlash:** y = kategoriya, x1 = `from` (`dataviz/categorical/02`), x2 = `to` (`dataviz/categorical/01`), trek `dataviz/track`, oxirida ishorali farq (`+16`, `−3`, haqiqiy minus). Legend doim ko'rinadi (`fromLabel` / `toLabel`).
- **Interaksiya:** hover — qator ajraladi, `<title>` ikkala qiymat va farqni aytadi. Farq muhim bo'lsa ma'lumotni farq bo'yicha saralang.
- **A11y:** `role="img"` + `label`; jadval: "Q1: plan 40, actual 56, +16".
- **O'lchamlar:** legend `chart/legend/gap`, kategoriya ustuni `scale/80`, qator `scale/16`, nuqta `chart/point/size` · halqa `stroke/strong`. Matn: nom Caption/L · `text/secondary`, farq Label/S · `text/primary`. `zero` — o'qni 0 dan boshlash.
