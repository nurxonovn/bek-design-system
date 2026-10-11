# System bars

Figma: **10.2 System bars** — `StatusBar` va `HomeIndicator`: iOS va Android tizim panellari **faqat mockup va shablonlar uchun** (haqiqiy qurilmada OS chizadi). `platform`: `ios` · `android`; `content`: `dark` (yorug' fon) · `light` (qorong'i fon, rasm).

```tsx
<StatusBar />                                   // iOS · 9:41 · static/dark
<StatusBar platform="android" content="light" time="9:30" />
<HomeIndicator />                               // iOS · 34 · 144 × 5
<HomeIndicator platform="android" />            // 24 · 108 × 4
```

Qoidalar (Figma doc):

- O'lchamlar: Status bar iOS 62 (Dynamic Island) · Android 52 (kamera kesimi); Home indicator iOS 34 · Android 24 (3 tugmali navigatsiya 48). Interaktiv kontent xavfsiz maydondan tashqarida — kodda `env(safe-area-inset-*)`.
- Rang mavzuga emas, **orqadagi fonga** ergashadi: yorug' ekranda `dark` (`static/dark`), rasm va qorong'i sheet ustida `light` (`static/white`). Qorong'i fonda qorong'i kontent qoldirmang.
- Fon shaffof (orqada `bg/sheet`); holatlar yo'q, interaktiv emas (`aria-hidden`).
- Faqat Mobile; Tablet o'z kengligida (iPad status bar 24), Web'da ishlatilmaydi.
- `apps/templates` dagi `Phone` ramkasi shu komponentlardan foydalanadi.
