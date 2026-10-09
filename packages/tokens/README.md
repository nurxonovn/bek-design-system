# @bek/tokens

Design tokens of the **BEK Design System** (Tokens v3), generated from the Figma
library. One source of truth: Figma variables → `figma/*` export → this package.

## What you get

| File | Use |
|---|---|
| `@bek/tokens/tokens.css` | CSS custom properties `--bek-*`, Light/Dark, Mobile/Tablet/Web, text-style classes, effects, focus ring |
| `@bek/tokens/tailwind.css` | Tailwind v4 `@theme` mapping (`bg-bg-sheet`, `text-text-primary`, `p-16`, `rounded-surface-md`, `shadow-elevation-1`) |
| `@bek/tokens/tokens.json` | W3C DTCG tokens with per-mode values and the original Figma aliases |
| `@bek/tokens` (JS/TS) | `tokens`, `breakpoints`, `v('accent/default')` → `var(--bek-accent-default)`, typed token names |

```css
@import "@bek/tokens/tokens.css";
@import "@bek/tokens/tailwind.css"; /* optional, Tailwind v4 */

.card {
  background: var(--bek-surface-card);
  border-radius: var(--bek-radius-surface-md);
  padding: var(--bek-scale-16);
}
```

```html
<h1 class="bek-text-display-l">Hello</h1>
<button class="bek-focus-ring">…</button>
```

## How the Figma modes map to code

| Figma | Code |
|---|---|
| Color · Light / Dark | `:root` = Light. Dark follows `prefers-color-scheme` unless the page sets `data-theme="light"`; `data-theme="dark"` forces Dark (also on any subtree). |
| Dimension + Typography · Mobile / Tablet / Web | `:root` = Mobile; `@media (min-width: 600px)` = Tablet; `@media (min-width: 1024px)` = Web. Only values that change are redeclared. |
| Text styles (Display … Code) | `.bek-text-<group>-<size>` classes, e.g. `.bek-text-body-m`, `.bek-text-label-input` |
| Effect styles | `--bek-elevation-inset`, `--bek-elevation-1 … 5` (box-shadow); `.bek-glass-regular · small · clear` |
| `_Focus ring` | `.bek-focus-ring:focus-visible` — 2 px `border/focus` outline, 2 px offset |
| Figma state variants (Hover, Focus, Pressed) | CSS pseudo-classes, not props |
| `Direction = LTR / RTL` | `dir` attribute + logical CSS properties, not a prop |

Primitives (Palette, Typography primitives) are resolved at build time and are
not exposed — components use semantic tokens only, as in Figma. `_doc/*`
tokens are Figma-only.

### Code-only tokens

Not in Figma, needed in code: `--bek-z-*` (base 0 → tooltip 1400),
`--bek-focus-ring-width / -offset / -color`, and `prefers-reduced-motion`
setting every `--bek-motion-duration-*` to 0 ms.

### Approximations

Figma's GLASS effect and its decorative inner shadows have no CSS equivalent;
`.bek-glass-*` uses `backdrop-filter` blur + the glass tint + the shadow layers.

## Updating from Figma

1. Export the variables (Color, Dimension, Typography + primitives, Palette),
   text styles and effect styles into `figma/` in the same format.
2. `pnpm --filter @bek/tokens build` (or `node scripts/build.mjs`).
3. `pnpm --filter @bek/tokens test` — WCAG contrast check of the semantic pairs.

Known gap (reported by the test, not hidden): Light `text/success` on
`status/success/soft` is 4.49 : 1. Fix in Figma: `text/success` Light →
`light/green/850` (5.46 : 1).
