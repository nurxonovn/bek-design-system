# ProgressBar

Figma: **4.6 Progress** — chiziqli jarayon (yuklash, kurs, profil to'ldirish). `size`: `s` 4 · `m` 6 · `l` 8 px; `status`: `neutral` · `accent` · `success` · `warning` · `danger`.

```tsx
<ProgressBar value={uploaded} max={total} label="Yuklanmoqda" showValue />
```

`role="progressbar"` + `aria-valuenow`. `label` bo'lmasa `aria-label` bering — nomsiz progress ekran o'quvchiga tushunarsiz. `showValue`: `true` — foiz, yoki istalgan matn ("3 / 5"). Davomiyligi noma'lum kutish uchun — `Spinner`.
