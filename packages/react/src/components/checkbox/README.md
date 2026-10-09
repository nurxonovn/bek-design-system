# Checkbox

Figma: **3.4 Checkbox** — Unchecked · Checked · Indeterminate, o'lcham `s` 16 · `m` 20 · `l` 24 px.

```tsx
<Checkbox name="terms" required>Shartlarga roziman</Checkbox>
<Checkbox checked={all} indeterminate={some && !all} onChange={toggleAll}>Hammasi</Checkbox>
```

| Prop            | Qiymatlar       | Default |
| --------------- | --------------- | ------- |
| `children`      | yorliq          | —       |
| `size`          | `s` · `m` · `l` | `s`     |
| `indeterminate` | `boolean`       | `false` |

Native `<input type="checkbox">` — `checked`, `defaultChecked`, `onChange`, `name`, `disabled` o'tadi; `ref` input'ga. Bosish maydoni kamida 24 px, yorliq ham bosiladi. Space belgilaydi; fokus — `border/focus` halqa.
