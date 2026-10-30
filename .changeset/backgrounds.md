---
'@bek-ui/backgrounds': minor
---

Yangi paket `@bek-ui/backgrounds` (Figma 2.6 Backgrounds): `MatrixRain` (tone neutral · brand · classic, intensity, charset — istalgan satr, kursor nuri va zonasi), `DotField` (kursor atrofida kattalashuvchi nuqtalar, bosilganda halqa), `GrainGradient` (siljiydigan dog'lar + donadorlik, `blobs` token ro'yxati) va `Aurora` (oqadigan tasmalar, `bands` 1–5, `position` top · center). Hammasi `<canvas>` (`'use client'`, `aria-hidden`, `pointer-events: none`): konteynerni to'ldiradi (ResizeObserver, devicePixelRatio ≤ 2), 30 fps, ekrandan tashqarida va yashirin tabda pauza, `prefers-reduced-motion` da bitta statik kadr; ranglar tokenlardan `getComputedStyle` orqali — Light/Dark avtomatik. Umumiy sikl `useBackgroundCanvas` ham eksport qilinadi. Runtime bog'liqlik — faqat `react`.
