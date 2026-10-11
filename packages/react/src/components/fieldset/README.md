# Fieldset

Figma: **3.19 Fieldset** — bitta label, bitta control (yoki boshqaruvlar guruhi), bitta xabar. O'z label'i bo'lmagan istalgan control'ni o'raydi: Chip qatori, Checkbox/Radio guruhi, Segmented control, Slider, Date picker, yuklovchi. `layout`: `vertical` · `horizontal`; `status`: `helper` · `error` · `success`.

```tsx
<Fieldset label="Yetkazib berish" message="Kuryer 2 soat ichida yetib keladi">
  <SegmentedControl … />
</Fieldset>

<Fieldset label="Promo-kod" optional hint="Chek yoki xabardagi kod" status="success" message="−15% qo'llandi">
  <Chip …>BEK15</Chip>
</Fieldset>

<Fieldset label="Shartnoma" status="error" message="Davom etish uchun shartlarni qabul qiling">
  <Checkbox>Foydalanish shartlarini qabul qilaman</Checkbox>
</Fieldset>
```

Qoidalar (Figma doc + 1.12 Forms):

- Text field va Select'ni **o'ramang** — ularning label'i ichida (Filled).
- Bitta xabar: `helper` (format, chegara, keyin nima bo'ladi), `error` (validatsiyadan keyin, qanday tuzatishni aytadi), `success` (async tekshiruv o'tdi — promo-kod, username). Xabar almashtiriladi, ustma-ust qo'yilmaydi.
- `optional` — kam uchraydigan ixtiyoriy maydonni belgilaydi; ko'p majburiylarga yulduzcha qo'yilmaydi.
- `hint` — `information-circle` 16; matn `title` orqali va `<legend>` ichida ekran o'quvchiga beriladi.
- Fieldset'ning o'z holati yo'q: hover, focus, disabled ichidagi control'dan; Error — `status="error"` dan.
- `horizontal` — faqat Web formalarida (label chapda, `--bek-fieldset-label-width`, standart 10rem ≈ 160 px); Mobile va Tablet'da `vertical`.
- A11y: `<fieldset>` + yashirin `<legend>` (label, optional, hint); xabar `aria-describedby` bilan bog'lanadi, error'da `aria-invalid`.
