# Pattern

Figma: **2.5 Pattern** — empty state, promo sheet, onboarding va karta fonlari uchun bezak plitka (320 × 320, takrorlanadi). `type`: `dots` · `grid` · `diagonal` · `logo-petals`; `tone`: `subtle` · `accent`.

```tsx
<div style={{ position: 'relative' }}>
  <Pattern type="dots" style={{ position: 'absolute', inset: 0 }} />
  <EmptyState … />
</div>

<Pattern type="logo-petals" tone="accent" style={{ height: 200 }} />
```

Qoidalar (Figma doc):

- Plitka kontent **ostida** turadi (`aria-hidden`, `pointer-events: none`); ekranda bitta pattern.
- `subtle` — `fill/soft-pressed` siyoh `bg/base` ustida: empty state va yorug' fonlar. `accent` — `fill/on-color-hover` siyoh `accent/default` ustida: promo, onboarding, brend lahzalari — ustida qisqa oq matn.
- Matn yoki forma ustiga qo'ymang; siyoh rangi o'zgartirilmaydi (tokenlar bilan Dark rejimda o'zi almashadi).
- Web'da plitka viewport'ning 40% dan kam qismini egallasin; o'lcham `--bek-pattern-tile` (320) orqali masshtablanadi.
- Dots 16 px panjara · Grid 32 px chiziqlar · Diagonal 20 px yo'llar · Logo petals — brend belgisi 48 qadam (Mono 10% / Reversed 18% Figma'da; kodda token siyohi).
