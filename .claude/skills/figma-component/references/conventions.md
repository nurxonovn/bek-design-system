# Komponent konventsiyalari (`packages/react`)

## Papka

```
src/components/<kebab-nom>/
  <PascalNom>.tsx    # bir yoki bir nechta eksport (Tabs, TabList, Tab, TabPanel)
  <kebab-nom>.css    # build'da dist/styles.css ga yig'iladi (scripts/build-css.mjs)
  index.ts           # export { X } from './X.js'; export type { XProps } from './X.js';
  README.md          # o'zbekcha; birinchi qator: Figma: **3.18 Link** — …
  figma.json         # Figma spec (figma-extract.js) + accepted[]
```

`src/index.ts` → `export * from './components/<nom>/index.js';` (import yo'llari `.js` bilan —
NodeNext). `packages/react/README.md` "Komponentlar" jadvaliga qator:
`| \`Link\` | 3.18 Link | [README](src/components/link/README.md) |`.

## TSX

- Funktsional komponent, `cx` (`src/utils/cx.ts`) bilan klasslar: `bek-<nom>`,
  `bek-<nom>--<variant>`, `bek-<nom>--<size>`, `bek-<nom>__<qism>`.
- Prop nomlari Figma'dan: `Variant` → `variant`, `Size` → `size` (`'s' | 'm' | 'l'`),
  `Show badge` → `badge?: ReactNode` (slot) yoki `showBadge?: boolean` (faqat yoqish/o'chirish).
  Matn prop'lari (`Label`, `Title`) → `children` yoki `title`.
- `State` — prop emas: `:hover`, `:active`, `:focus-visible`, `[disabled]`/`aria-disabled`,
  `aria-selected`/`aria-pressed`/`aria-current`. Boshqaruv elementlariga `bek-focus-ring`.
- HTML atributlarini uzating: `extends Omit<HTMLAttributes<HTMLElement>, 'title'>` kabi; nom
  to'qnashuvi (title, onCopy) bo'lsa `Omit`.
- Ikonkalar: `src/icons/index.tsx` (`ChevronDownGlyph`, `CloseGlyph`, …) va
  `src/icons/status.tsx`; yangi glyph kerak bo'lsa shu faylga qo'shing, komponent ichiga svg yozmang.
- RTL: `dir="rtl"` ni tekshirmang — CSS logical properties (`padding-inline`, `margin-inline-start`,
  `inset-inline-end`), yo'nalishli ikonkalar `[dir='rtl'] & { transform: scaleX(-1) }`.
- Nested Figma komponentlari (`figma.json → nested`) — import qilib ishlatiladi (Button, Badge,
  Avatar), qayta chizilmaydi.
- `forwardRef` — overlay/popover/menu kabi fokus boshqariladigan joylarda.

## CSS

- Faqat tokenlar: rang `var(--bek-text-primary)`, o'lcham `var(--bek-scale-8)`, radius
  `var(--bek-radius-control-md)`, soya `var(--bek-elevation-2)`, motion
  `var(--bek-motion-duration-xs) var(--bek-motion-easing-standard)`. Hex/rgb/hsl — xato (E).
- Matn uslubi (Figma `Label/M`, `Body/S`) → uchlik:
  `font-size: var(--bek-type-label-md-size); line-height: var(--bek-type-label-md-line-height);
letter-spacing: var(--bek-type-label-md-tracking);` + `font-weight: var(--bek-weight-medium)`.
  Figma size → token: S→`sm`, M→`md`, L→`lg`, XL→`xl`; `Label/Input` → `control-value`.
- px faqat: `0`, `0.5`, `1` (hairline) va Figma `sizes` da bor, lekin `scale/N` tokeni yo'q sonlar.
  `scale/N` bor bo'lsa `var(--bek-scale-N)`.
- Holatlar: `:hover` → `*-hover`, `:active` → `*-pressed`/`*-active`, disabled →
  `fill/disabled` + `text/disabled`, fokus → `.bek-focus-ring` (border/focus). 1.13 ga qarang.
- Variant o'zgaruvchilari komponent ildizida: `.bek-chip { --bek-chip-height: … }`,
  `.bek-chip--m { --bek-chip-height: … }`.
- Dark mode alohida yozilmaydi — tokenlar `data-theme="dark"` da o'zgaradi. Doimiy qorong'i
  komponent (Tooltip callout, Notification bar) `color-scheme`/dark token to'plamini ishlatadi.
- `@media (prefers-reduced-motion: reduce)` — animatsiyali komponentlarda.
- Umumiy uslublar `src/styles/` (field.css, tone.css, focus.css, scrollbar.css, cursor.css,
  utilities.css) — bir xil pattern 2+ komponentda bo'lsa shu yerga.

## Test

`test/<guruh>.test.mjs`, `node:test` + `renderToStaticMarkup` (dist'dan import):
rollar/aria, klass nomlari (variant, size), slotlar, disabled/selected holati, RTL'ga ta'sir
qilmasligi. Har eksport nomi testlarda kamida bir marta uchrasin (checker `test` qoidasi).

## README shabloni

````md
# Link

Figma: **3.18 Link** — bir gapda nima bu. `variant`: `inherit` · `accent` · `neutral` · `subtle`;
`size`: `s` · `m` · `l`.

```tsx
<Link href="/all" variant="accent">
  Hammasini ko'rish
</Link>
```
````

Qachon ishlatish / ishlatmaslik (Figma doc "Rules", "Do/Don't"), a11y, RTL, o'lchamlar.

```

```
