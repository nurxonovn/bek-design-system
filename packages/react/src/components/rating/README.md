# Rating

Figma: **4.10 Rating** — faqat o'qish uchun reyting (mahsulot, kurs, joy). `variant`: `stars` (5 yulduz, 0.5 qadam) · `compact` (bitta yulduz + ball); `size`: `s` 16 · `m` 20 · `l` 24 px.

```tsx
<Rating value={4.5} count="(1 245 sharh)" locale="uz" />
<Rating value={4.8} variant="compact" size="s" />
```

`role="img"` + `aria-label="4,5 / 5"`; Tab to'xtashi emas. Ball locale bo'yicha formatlanadi. To'liq yulduz — `status/warning/default`, bo'sh — `border/strong`.
