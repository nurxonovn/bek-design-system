# Delta

Figma: **4.18 Chart · Delta** — o'zgarish pill'i: o'q va `+12,4%`. `variant` qiymatdan hisoblanadi: `positive` · `negative` · `neutral`.

```tsx
<Delta value={12.4} />                     {/* +12,4% — yashil */}
<Delta value={8.2} betterWhen="down" />    {/* xarajat oshdi — qizil */}
<Delta value={0.2} />                      {/* |Δ| < 0,5% — neutral */}
```

- Variant ishoradan olinadi, `betterWhen="down"` uni teskari qiladi (xarajat, xatolar, kechikish). `threshold` (0,5%) dan kichik o'zgarish — Neutral.
- Format uz-UZ: `+12,4%`, haqiqiy minus `−3,1%` (U+2212). Boshqa birlik uchun `label`.
- O'q bezak (`aria-hidden`); ma'no matnda. Rang yolg'iz ma'no tashimaydi.
- Ranglar: positive `status/success/soft` + `text/success`, negative `status/danger/soft` + `text/danger`, neutral `fill/tertiary` + `text/secondary`. Matn Label/S.
- Statik komponent, interaksiya yo'q.
