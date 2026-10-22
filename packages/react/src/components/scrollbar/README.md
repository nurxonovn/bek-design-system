# Scrollbar · ScrollArea

Figma: **4.8 Scrollbar** — brauzerning o'z scroll'i, BEK tokenlari bilan. `orientation`: `vertical` · `horizontal` · `both`; `size`: `m` (track 12, thumb 8) · `s` (track 8, thumb 4). Holatlar (Default · Hover · Active) — CSS'da, sudrash paytida Active.

```tsx
<ScrollArea style={{ maxHeight: 320 }} aria-label="Buyurtmalar tarixi">
  {orders}
</ScrollArea>

<ScrollArea orientation="horizontal" size="s">
  <Table>…</Table>
</ScrollArea>
```

Komponentsiz ham: scroll bo'ladigan istalgan elementga `bek-scrollbar` (M) yoki `bek-scrollbar bek-scrollbar--s` (S) klassi — Modal, Bottom sheet, Nav drawer, Command palette shunday qiladi.

## Tokenlar

Track — `border/default`, thumb — `fill/scrollbar` → `fill/scrollbar-hover` → `fill/scrollbar-active`, radius/full, track ichida 2 px (`scale/2`), thumb uzunligi kamida 32 px (`scale/32`). Ranglar alfa shkalada — istalgan sirt ustida ishlaydi, Light/Dark o'zi. Chegara yo'q.

## Qoidalar

- Kontent sig'masa scrollbar ko'rinsin. `scrollbar-width: none` bilan yashirmang — kontent kesiladi, belgisi yo'q.
- Thumb 32 px dan qisqarmaydi — sichqoncha bilan ushlab bo'ladi.
- Gorizontal scroll — ichki konteynerda (jadval, kod bloki, karusel). Sahifaning o'zida gorizontal scroll — deyarli doim layout xatosi.
- S — overlay va ixcham konteynerlar uchun; doimiy ko'rinadigan scroll — M.

## A11y va brauzerlar

- `ScrollArea` klaviatura bilan fokuslanadi (`tabIndex=0`, `bek-focus-ring`): strelkalar, PageUp/PageDown, Home/End. `aria-label` (yoki `aria-labelledby`) berilsa `role="region"`.
- Chromium va Safari aniq o'lcham va holatlarni `::-webkit-scrollbar` dan oladi; Firefox — standart `scrollbar-color` / `scrollbar-width: thin` (hover/active ranglari va 32 px minimumi Firefox'da yo'q). Figma'dagi 24 px hit area — brauzer scroll'ining o'z maydoni; native scroll'da alohida kattalashtirilmaydi.
