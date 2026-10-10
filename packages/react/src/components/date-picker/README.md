# DatePicker

Figma: **3.14 Date picker** — `Type=Single` va `Type=Range`. Dushanbadan boshlanadigan oy to'ri, bugun nuqtasi, oraliq tasmasi; mobil'da Bottom sheet, web'da Popover ichida.

```tsx
<DatePicker value={date} onChange={setDate} minDate={new Date()} locale="uz" />
<DatePicker mode="range" value={range} onChange={setRange} locale="uz" />
```

| Prop                 | Qiymatlar                                |
| -------------------- | ---------------------------------------- |
| `mode`               | `single` (default) · `range`             |
| `minDate`, `maxDate` | chegaradan tashqari kunlar o'chadi       |
| `locale`             | oy va hafta kunlari nomlari (Intl)       |
| `formatRange`        | Range xulosasi matni; `null` — yashiradi |

Klaviatura: ← → kun, ↑ ↓ hafta, PageUp/PageDown oy, Home/End hafta boshi/oxiri, Enter/Space tanlaydi (`role="grid"`, bitta Tab to'xtashi). Range: birinchi bosish — boshlanish, ikkinchisi — tugash; ikkalasi tanlangach to'r ostida Figma'dagi xulosa chiqadi ("12 – 16 oktyabr · 5 kun", Label/M · text/secondary). `Type=Wheel` (tug'ilgan kun kabi uzoq sanalar) uchun mobil'da native `<input type="date">` tavsiya etiladi.

Tokenlar (Figma): karta `surface/raised` + `radius/surface/xl`, sarlavha Title/M, nav tugmalari 40 px `fill/secondary`, hafta kunlari Caption/M `text/tertiary`, kun Body/L, tanlangan kun Label/L `accent/default` + `text/on-color`, oraliq tasmasi `accent/soft`, bugun nuqtasi `accent/default`.
