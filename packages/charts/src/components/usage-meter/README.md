# Usage meter

Figma: **4.18 Chart · Usage meter** — kvota yoki AI token sarfi va reset sanasigacha prognoz. `variant`: `normal` · `warning` · `limit` (berilmasa qiymatlardan).

```tsx
<UsageMeter label="AI tokens" used={450000} limit={1000000} forecast={650000} resetAt="Resets 1 Nov" />
<UsageMeter label="AI tokens" used={820000} limit={1000000} forecast={960000} resetAt="Resets 1 Nov" />
<UsageMeter label="AI tokens" used={1000000} limit={1000000} resetAt="Resets 1 Nov" note="Limit reached — resets in 3 days" />
```

- **Qachon:** AI token byudjeti, API kvota, xotira, tarif chegarasi — foydalanuvchi chegaraga yetishini oldindan ko'rishi kerak. Bir martalik jarayon uchun emas — 4.6 Progress.
- **Kodlash:** sarflangan = `used / limit` (to'liq rang), prognoz = `forecast / limit` — o'sha rang, qatlam shaffofligi 35% (alohida rang emas). Normal `accent/default` < 80%; Warning `status/warning/default` + `text/warning` izoh — 80–99% **yoki prognoz > 90%**; Limit `status/danger/default` + `text/danger` — 100%, yonida yangilash amali bo'lsin.
- **Format:** uz-UZ, bo'shliq bilan: `820 000 / 1 mln` (`formatValue` bilan o'zgartiriladi).
- **A11y:** `role="meter"` (`aria-valuenow` = used, `aria-valuemax` = limit), `aria-valuetext` sarf, chegara va prognozni aytadi; reset sanasi matnda.
- **O'lchamlar:** eni `scale/320`, track `scale/8` · `radius/full`; sarlavha Label/M, footer Caption/M.
