# Keyboard

Figma: **10.3 Keyboard** — ekran maketlari uchun tizim klaviaturasi (iOS 27 / Material 3 Gboard) BEK tokenlarida. **Faqat mockup**: haqiqiy klaviaturani OS chizadi; bu komponent maydon fokusda bo'lganda ko'rinadigan maydonni tekshirish uchun. `platform`: `ios` · `android`; `type`: `alphabet` · `numeric`.

```tsx
<Keyboard />                                        // iOS · QWERTY · taklif qatori
<Keyboard type="numeric" />                         // iOS Number pad — telefon, kod, summa
<Keyboard platform="android" type="alphabet" returnLabel="Done" />
```

Qoidalar (Figma doc):

- Telefon, kod va summa maydonlarida raqamli klaviaturani so'rang — kodda `inputMode="numeric"`; mockupda `type="numeric"`.
- Sticky tugma yoki fokusdagi maydon klaviatura ortida qolmasin — kontent yuqorida skroll bo'ladi.
- Ranglar: fon `fill/tertiary`; tugmalar iOS `surface/card`, Android `surface/raised`; funksional tugmalar `fill/tertiary-hover`; Android return `accent/default`. Light/Dark tokenlar bilan.
- Pastda Home indicator uchun 34 xavfsiz maydon (`10.2 System bars`).
- Mobile: to'liq kenglik; Tablet: maket kengligiga cho'ziladi. Interaktiv emas (`aria-hidden`), holatlar yo'q.
