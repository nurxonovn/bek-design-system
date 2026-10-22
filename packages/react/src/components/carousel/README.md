# Carousel

Figma: **4.11 Carousel** — `controls`: `arrows` · `dots` (Figma "Dots only") · `none`; `placement`: `inside` · `below`; `peek` — keyingi slayd cheti; `onMedia` — rasm ustidagi oq nuqtalar. Indikator (`indicator`): `dots` · `fraction` ("1 / 5") · `progress` · `thumbnails` (`thumbnails` — kichik rasmlar, `orientation`: `horizontal` · `vertical`, `thumbSize`: `s` 56 · `m` 64).

```tsx
<Carousel aria-label="Aksiyalar" peek>
  <img src="/promo-1.jpg" alt="Pitsa −20%" />
  <img src="/promo-2.jpg" alt="Bepul yetkazish" />
</Carousel>
```

```tsx
<Carousel
  aria-label="Mahsulot rasmlari"
  controls="dots"
  indicator="thumbnails"
  orientation="vertical"
  thumbnails={photos.map((p) => (
    <img src={p.thumb} alt="" />
  ))}
>
  {photos.map((p) => (
    <img key={p.id} src={p.src} alt={p.alt} />
  ))}
</Carousel>
```

CSS scroll-snap: touch'da surish, sichqonchada strelkalar (Raised icon-only Button), nuqtalar sichqoncha uchun (Tab'da emas — 1.6 Accessibility). Skroll maydoni fokuslanadi (`tabIndex=0`): Tab bilan kirib, ←/→ bilan suriladi. Har slayd `role="group"` + "2 / 5" nomi; RTL qo'llab-quvvatlanadi.
