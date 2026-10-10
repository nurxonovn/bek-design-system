# Radio

Figma: **3.5 Radio** — bitta tanlov, o'lcham `s` 16 · `m` 20 · `l` 24 px.

```tsx
<fieldset>
  <legend>Tarif</legend>
  <Radio name="plan" value="free" defaultChecked>
    Free
  </Radio>
  <Radio name="plan" value="pro">
    Pro
  </Radio>
</fieldset>
```

Native `<input type="radio">`: bir guruh — bir xil `name`, guruh bitta Tab to'xtashi, ↑↓ bilan almashadi. `size`: `s` · `m` · `l` (default `s`).

| Figma prop   | Kod                                                |
| ------------ | -------------------------------------------------- |
| `Size`       | `size`: `s` 16 · `m` 20 · `l` 24                   |
| `Selected`   | native `checked` / `defaultChecked` (On = checked) |
| `Label`      | `children`                                         |
| `Show label` | `children` bo'lmasa — `aria-label` bering          |
| `State`      | `:hover` · `:focus-visible` · `disabled`           |

Tokenlar: doira `fill/primary` + `border/strong` (hover — `border/accent`), tanlangan `accent/default` (hover — `accent/hover`), nuqta `text/on-color`, radius `radius/full`, label Body/S (`l` — Body/M).
