# Chip group

Figma: **3.20 Field groups** → Chip group — bitta label ostida Filter chip'lar to'plami va bitta umumiy xabar (reja, kategoriya, chastota). Anatomiyasi Fieldset (3.19) bilan bir xil: sarlavha (Label/M + hint + Optional) → chip'lar qatori (Chip S, gap `scale/8`, sig'masa keyingi qatorga) → xabar (Caption/L).

```tsx
<ChipGroup
  label="Reja"
  message="Bitta rejani tanlang"
  options={[
    { value: 'monthly', label: 'Oylik' },
    { value: 'yearly', label: 'Yillik' },
    { value: 'team', label: 'Jamoa' },
    { value: 'lifetime', label: 'Umrbod' },
  ]}
  defaultValue={['monthly']}
/>

<ChipGroup
  label="Kategoriyalar"
  selection="multiple"
  optional
  status="error"
  message="Davom etish uchun kamida bitta kategoriya tanlang"
  options={categories}
  value={value}
  onValueChange={setValue}
/>
```

## Prop'lar (Figma → React)

| Figma           | React                           | Izoh                                                                   |
| --------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `Label`         | `label`                         | Label/M · text/secondary                                               |
| `Message`       | `message` + `status`            | `helper` (text/tertiary) · `error` (text/danger + ikonka); None — yo'q |
| `Show hint`     | `hint`                          | information-circle 16, matn `title` va `<legend>` orqali               |
| `Show optional` | `optional`                      | "Optional" (Caption/L · text/tertiary) yoki o'z matningiz              |
| `Direction`     | `dir="rtl"`                     | logical properties — chip'lar tartibi teskari                          |
| Chips (nested)  | `options`, `selection`, `value` | har biri haqiqiy `Chip` (Filter, S); `disabled`, `count`, `icon`       |

`selection`: `single` (standart — bittasi tanlanadi, tanlanganini bosish uni o'chirmaydi) · `multiple`. Boshqariladigan (`value` + `onValueChange`) yoki boshqarilmaydigan (`defaultValue`). `chipSize="m"` — faqat touch qatorlari kerak bo'lsa; Figma'da doim S.

## Qoidalar (Figma doc)

- 2–8 qisqa variant, hammasi ekranga sig'adi; 8 dan ko'p — Select yoki Bottom sheet ro'yxati.
- Fieldset bitta control'ni o'raydi; birga tekshiriladigan chip'lar to'plami uchun — Chip group. Chip group'ni **Fieldset ichiga o'ramang** (ikki label, ikki xabar bo'lib qoladi).
- Guruhning o'z holati yo'q: Hover, Focus, Disabled har chip'da; Error — guruhda (`status="error"`), xabar bitta.
- Chip'lar kichraytirilmaydi — qatorga sig'masa keyingisiga o'tadi. Kenglik forma ustunidan (Mobile 358, Web 480 gacha).
- Bir nechta tanlov va tushuntirishli katta variantlar uchun — Selector card (3.16).

## A11y

`<fieldset>` + yashirin `<legend>` (label, optional, hint) — guruh nomi har chip bilan o'qiladi. Har chip — `aria-pressed` li `<button>`; xabar `aria-describedby` bilan bog'lanadi, error'da `aria-invalid`. `disabled` (fieldset) butun guruhni o'chiradi.
