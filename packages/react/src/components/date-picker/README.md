# DatePicker

Figma: **3.14 Date picker** — `Type=Single` va `Type=Range`. Dushanbadan boshlanadigan oy to'ri, bugun nuqtasi, oraliq tasmasi; mobil'da Bottom sheet, web'da Popover ichida.

```tsx
<DatePicker value={date} onChange={setDate} minDate={new Date()} locale="uz" />
<DatePicker mode="range" value={range} onChange={setRange} locale="uz" />
```

| Prop                 | Qiymatlar                          |
| -------------------- | ---------------------------------- |
| `mode`               | `single` (default) · `range`       |
| `minDate`, `maxDate` | chegaradan tashqari kunlar o'chadi |
| `locale`             | oy va hafta kunlari nomlari (Intl) |

Klaviatura: ← → kun, ↑ ↓ hafta, PageUp/PageDown oy, Home/End hafta boshi/oxiri, Enter/Space tanlaydi (`role="grid"`, bitta Tab to'xtashi). Range: birinchi bosish — boshlanish, ikkinchisi — tugash. `Type=Wheel` (tug'ilgan kun kabi uzoq sanalar) uchun mobil'da native `<input type="date">` tavsiya etiladi.
