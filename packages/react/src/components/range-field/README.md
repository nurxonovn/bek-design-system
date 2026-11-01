# Range field

Figma: **3.20 Field groups** → Range field — bitta label ostida ikki Text field (From · To), birga tekshiriladi va bitta umumiy xabarga ega: narx, sana, yosh. Anatomiyasi Fieldset (3.19) bilan bir xil: sarlavha → ikki Text field L Filled (56, FILL kenglik, gap `scale/12`) → xabar.

```tsx
<RangeField
  label="Narx, soʻm"
  message="“Gacha” bo'sh qolsa — yuqori chegara yo'q"
  from={{ label: 'Dan', inputMode: 'numeric', name: 'price_from' }}
  to={{ label: 'Gacha', inputMode: 'numeric', name: 'price_to' }}
/>

<RangeField
  label="Narx, soʻm"
  status="error"
  message="“Dan” qiymati “Gacha”dan kichik bo'lishi kerak"
  from={{ value: '5 000 000', onChange: … }}
  to={{ value: '1 000 000', onChange: … }}
/>
```

## Prop'lar (Figma → React)

| Figma           | React                | Izoh                                                                                             |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| `Label`         | `label`              | Label/M · text/secondary; birlikni label'ga yozing ("Narx, soʻm")                                |
| `Message`       | `message` + `status` | `helper` · `error` — Error ikkala maydonni Error holatiga o'tkazadi                              |
| `Show hint`     | `hint`               | information-circle 16                                                                            |
| `Show optional` | `optional`           | "Optional" yoki o'z matningiz                                                                    |
| `Direction`     | `dir="rtl"`          | To · From tartibi avtomatik teskari                                                              |
| From · To       | `from`, `to`         | `TextField` prop'lari (value, onChange, name, inputMode, prefix …); standart label "From" / "To" |

O'lcham (`l`), variant (`filled`), `error` va `supportingText` guruhdan keladi — maydonlarga alohida bermang.

## Qoidalar (Figma doc)

- Bir xil turdagi ikki qiymat. Bitta label, bitta xabar; birlik har maydonda emas, label'da.
- Juftlikni bitta deb tekshiring: From > To bo'lsa ikkala maydon Error va **bitta** xabar tushuntiradi. Har maydon ostida bir xil xatoni takrorlamang.
- Range field'ni Fieldset ichiga o'ramang — guruhda label ham, xabar ham bor.
- Maydonlar kichraytirilmaydi (L, 56); juda tor ekranda ustma-ust tushadi. Kenglik forma ustunidan (Mobile 358, Web 480 gacha).
- Guruhning o'z holati yo'q: Hover, Focus, Disabled har maydonda; Error — guruhda.

## A11y

`<fieldset>` + yashirin `<legend>` — guruh nomi ("Narx, soʻm") har maydon bilan o'qiladi; har maydonning o'z label'i bor (From / To). Xabar `aria-describedby` bilan fieldset'ga bog'lanadi, error'da fieldset va ikkala input'da `aria-invalid`.
