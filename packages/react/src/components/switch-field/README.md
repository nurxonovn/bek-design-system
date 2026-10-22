# Switch field

Figma: **3.6 Switch field** — label, ixtiyoriy izoh (description) va Switch bitta konteynerda; butun qator bosish maydoni. Sozlamalar paneli, afzalliklar va ControlGroup qatorlari uchun. `size`: `s` · `m` (36 · 44, `field/height/sm · md`; ichidagi Switch S → S, M → M).

```tsx
const [glow, setGlow] = useState(true);

<SwitchField label="Pointer highlight" checked={glow} onChange={(e) => setGlow(e.target.checked)} />
<SwitchField label="Reduce motion" description="Stops background animations" />
<SwitchField label="Show grid" size="s" defaultChecked />
```

## Qoidalar (Figma doc)

- Sozlama **darhol** qo'llanadi — Saqlash tugmasi yo'q. Saqlash kerak bo'lsa (Submit'li forma) — CheckboxField.
- Qatorning istalgan joyini bosish almashtiradi; fokusda Space.
- Label nima yoqilishini aytadi ("Pointer highlight"), buyruq emas ("Enable pointer highlight").
- ControlGroup (3.20) ichida qatorlar orasida 4–8; Switch field'larni kartadagi karta ichiga joylamang.
- Qurilmalar: Mobile — M (44), to'liq kenglik; Tablet — M; Web — S (36), 280–360 kenglikdagi yon panellarda. ControlGroup ichida `size` berilmasa zichlikdan: `default` → `m`, `compact` → `s`.
- Holatlar: hover konteynerni bo'yaydi (fill/soft → fill/soft-hover); fokus halqasi butun qatorda, Switch'ning o'zida emas; disabled — label va izoh text/disabled.

## A11y

Native `<input type="checkbox" role="switch">` (Switch komponenti): nom — `aria-labelledby` (label), izoh — `aria-describedby`. Input butun qatorni qoplaydi, shuning uchun qator bosilganda ham, Space bilan ham almashadi. Barcha input atributlari (`checked`, `defaultChecked`, `onChange`, `name`, `disabled`) Switch'ga uzatiladi; `className` / `style` — qatorga.
