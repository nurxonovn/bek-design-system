# Checkbox field

Figma: **3.4 Checkbox field** — label, ixtiyoriy izoh (description) va Checkbox bitta konteynerda; butun qator bosish maydoni. Formalar, rozilik va Saqlash tugmasi bilan saqlanadigan ro'yxatlar uchun. `size`: `s` · `m` (36 · 44, `field/height/sm · md`; Checkbox S 16 · M 20); `controlPosition`: `start` · `end`.

```tsx
<CheckboxField label="Remember this device" description="Skip the code on this browser for 30 days" name="remember" />
<CheckboxField label="Email me updates" description="Product news, once a month" />
<CheckboxField label="Show hidden layers" size="s" controlPosition="end" defaultChecked />
<CheckboxField label="Barcha bildirishnomalar" checked={all} indeterminate={some && !all} onChange={toggleAll} />
```

## Qoidalar (Figma doc)

- Tanlov Submit / Save tugmasi bilan saqlanganda ishlating — darhol qo'llanadigan sozlama uchun SwitchField.
- `controlPosition="start"` (Figma "Control at start", standart) — formalar va rozilik; `"end"` (Figma "Control at end") — sozlamalar ro'yxati (Web, S 36).
- Rozilik qatorlari (shartlar, marketing) belgi boshida va hech qachon oldindan belgilanmaydi.
- `indeterminate` — faqat bolalari qisman belgilangan ota qator uchun.
- Qatorning istalgan joyini bosish almashtiradi; fokusda Space.
- Qurilmalar: Mobile va Tablet — M (44), formalarda belgi boshida; Web — S (36), sozlamalar ro'yxatida belgi oxirida.
- Holatlar: hover konteynerni bo'yaydi (fill/soft → fill/soft-hover); fokus halqasi butun qatorni o'raydi; disabled — label va izoh text/disabled.

## A11y

Native `<input type="checkbox">` (Checkbox komponenti), indeterminate'da `aria-checked="mixed"`; nom — `aria-labelledby`, izoh — `aria-describedby`. Input butun qatorni qoplaydi. Barcha input atributlari Checkbox'ga uzatiladi; `className` / `style` — qatorga. Belgi joyi DOM tartibi bilan beriladi, RTL'da avtomatik aks etadi.
