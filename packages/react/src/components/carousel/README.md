# Carousel

Figma: **4.11 Carousel** — `controls`: `arrows` · `dots` · `none`; `placement`: `inside` · `below`; `peek` — keyingi slayd cheti; `onMedia` — rasm ustidagi oq nuqtalar.

```tsx
<Carousel aria-label="Aksiyalar" peek>
  <img src="/promo-1.jpg" alt="Pitsa −20%" />
  <img src="/promo-2.jpg" alt="Bepul yetkazish" />
</Carousel>
```

CSS scroll-snap: touch'da surish, sichqonchada strelkalar (Raised icon-only Button), nuqtalar sichqoncha uchun (Tab'da emas — 1.6 Accessibility). Har slayd `role="group"` + "2 / 5" nomi; RTL qo'llab-quvvatlanadi.
