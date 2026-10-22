# Floating action container

Figma: **6.9 Floating action container** — Mobile'da asosiy amalni ushlab turadigan pastki panel. `layout`: `single` · `horizontal` · `vertical` · `summary`; `info` (Show info), `legal` (Show legal + Legal), `homeIndicator` (Home indicator space), `position`: `fixed` · `sticky` · `static`.

```tsx
<FloatingActions primary={{ label: 'Davom etish', onClick: next }} />

<FloatingActions
  layout="horizontal"
  primary={{ label: "Qo'ng'iroq" }}
  secondary={{ label: 'Yozish' }}
/>

<FloatingActions
  layout="summary"
  total="159 000 soʻm"
  primary={{ label: "To'lash", loading: paying }}
  legal="Davom etib, shartlarga rozilik bildirasiz"
/>
```

## Qoidalar

- Bitta ekran — bitta asosiy amal: Davom etish, To'lash, Filtrlarni qo'llash, Qo'ng'iroq. Primary — Button Action XL, Secondary — Button Normal XL.
- Ko'pi bilan ikkita amal. Uchinchisi kontentga yoki Action sheet (7.10) ga.
- Pul bo'lsa — `summary`: jami summa amal yonida.
- **Bottom navigation (6.7) bilan bitta ekranda emas** — vazifa ekranlarida (checkout, forma, filtr) panel uning o'rnini oladi.
- Home indicator space iOS uchun yoqiq qoladi (`homeIndicator`). Faqat o'z safe area'si bor Bottom sheet ichida o'chiring.
- Asosiy amal hech qachon Disabled emas (CMP-06): bosilganda tekshiring va nima yetishmayotganini ko'rsating. Kutishda — `loading`.
- Faqat Mobile. Tablet (834) va Web (1440) da amallar forma oxirida, maydonlarning chap chetida (1.12 Forms · Actions).
- Checkout bar (6.8) shu konteyner asosida: Cart = `single` + `info`, Checkout = `summary` + `legal`.

## O'lchamlar, safe area, RTL, Dark

Bitta o'lcham: kenglik ekran bo'yicha, tugmalar XL (44), balandlik kontentga qarab (bitta tugma bilan 88). surface/raised + Elevation/1, padding 12 / 16, qatorlar orasida 12, tugmalar orasida 8 (`summary` — 16). Home indicator: pastda 32 yoki `env(safe-area-inset-bottom)` + 12 — qaysi katta bo'lsa; yonlarda `env(safe-area-inset-left/right)` (landshaft). `position="fixed"` — ekran pastiga `z-sticky` bilan qotadi; sahifa oxiridagi kontent panel ostida qolmasligi uchun unga pastki joy qoldiring. RTL'da gorizontal amallar va jami summa tartibi o'zi aks etadi. Dark'da soya yo'q — surface/raised ostidagi ekrandan och.
