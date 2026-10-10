# figma.json va check-figma qoidalari

## Fayl shakli

```json
{
  "page": "3.18 Link",
  "components": [
    {
      "name": "Link",
      "id": "1048:5741",
      "page": "3.18 Link",
      "pageId": "1048:3796",
      "props": {
        "Label": { "type": "TEXT", "default": "Link text" },
        "Start icon": { "type": "BOOLEAN", "default": false },
        "Variant": ["Inherit", "Accent", "Neutral", "Subtle"],
        "Size": ["S", "M", "L"],
        "State": ["Default", "Hover", "Focus", "Disabled"],
        "Direction": ["LTR", "RTL"]
      },
      "variants": 96,
      "size": { "w": 56, "h": 20 },
      "tokens": {
        "color": ["border/focus", "text/accent", "text/accent-hover", "text/disabled"],
        "text": ["Body/L", "Body/M", "Body/S"],
        "effect": [],
        "dimension": ["radius/control/sm", "scale/4", "scale/6", "stroke/default"]
      },
      "sizes": [1, 2, 4, 6, 16, 32, 40],
      "rawColors": [],
      "nested": [],
      "description": "Figma komponent tavsifi (≤400)"
    }
  ],
  "doc": {
    "3.18 Link": { "tokens": ["text/accent", "..."], "text": "Design tokens … (≤3200)" }
  },
  "accepted": [
    {
      "rule": "variant-missing",
      "match": "Type=Wheel",
      "reason": "Wheel — native <input type=date> bilan; alohida variant yo'q (README)."
    }
  ]
}
```

`components[]` — `scripts/figma-extract.js` chiqishi o'zgartirilmasdan. Bir papkada bir nechta
Figma set bo'lishi mumkin (Tabs: `Tab item` + `Tabs`). `accepted[].match` — topilma `subject`i
(token var nomi, `Prop=Option`, px qiymati) yoki xabar ichidagi bo'lak; `match` bo'lmasa shu
`rule` ning hamma topilmalari yopiladi (ehtiyot bo'ling). `reason` majburiy.

## Token moslashuvi

- Figma variable nomi → CSS: `packages/tokens/figma/{color,dimension,typography}.json` →
  `codeSyntax.WEB` (`text/accent` → `--bek-text-accent`). `codeSyntax` bo'lmasa `token-unmapped`:
  Figma'da Variables → Code syntax ustunini to'ldirish kerak.
- Matn uslubi (`styles.json → textStyles[].boundVariables.fontSize`): `Label/M` →
  `--bek-type-label-md-size`; muqobil — `.bek-text-label-m` klassi (tokens/typography.css).
- Effekt: `Elevation/N …` → `--bek-elevation-n`; `Glass/X` → `.bek-glass-x` (materials.css).
- `bg/sheet` — Figma'da komponent set o'ramining foni, spec'da bo'lsa ham kodda talab qilinmaydi.

## Qoidalar

| Daraja | rule                 | Nima tekshiradi                                                                                                                                                                                      | Odatiy yechim                             |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| E      | `files`              | `.tsx`, `.css` (yoki `src/styles` dan umumiy), `index.ts`, `README.md`, `figma.json`                                                                                                                 | Faylni yarating                           |
| E      | `export`             | `src/index.ts` da `./components/<nom>/index.js`                                                                                                                                                      | Export qo'shing                           |
| E      | `readme-table`       | `packages/react/README.md` jadvalida README havolasi                                                                                                                                                 | Qator qo'shing                            |
| E      | `test`               | `index.ts` eksportlaridan biri `test/*.test.mjs` da                                                                                                                                                  | SSR test yozing                           |
| E      | `css-hex`            | CSS'da hex/rgb/hsl                                                                                                                                                                                   | Token                                     |
| E      | `spec` / `accepted`  | figma.json shakli; accepted'da rule+reason                                                                                                                                                           | Tuzating                                  |
| E/W    | `readme-figma`       | README'da `Figma: **…**` qatori va sahifa raqami spec bilan mos                                                                                                                                      | Qatorni yozing                            |
| W      | `token-unmapped`     | Figma tokenida `codeSyntax` yo'q                                                                                                                                                                     | Figma Variables'da to'ldirish; `accepted` |
| W      | `figma-raw-color`    | Figma'da tokensiz SOLID rang                                                                                                                                                                         | Figma'da tokenga bog'lash; `accepted`     |
| W      | `token-missing`      | Spec rang tokeni CSS/TSX/umumiy uslubda yo'q                                                                                                                                                         | Tokenni ishlating yoki `accepted`         |
| W      | `token-extra`        | CSS'dagi rang tokeni spec'da yo'q (hover/pressed, umumiy holatlar, bir xil semantik oila hisobga olinmaydi)                                                                                          | Spec'ga qarang; kerak bo'lsa `accepted`   |
| W      | `text-style-missing` | Spec matn uslubi (`--bek-type-*` oilasi yoki `.bek-text-*`) kodda yo'q                                                                                                                               | Uchlikni qo'shing                         |
| W      | `effect-missing`     | `Elevation/Glass` kodda yo'q                                                                                                                                                                         | `box-shadow: var(--bek-elevation-n)`      |
| W      | `px-token`           | CSS'da `Npx`, `scale/N` tokeni bor                                                                                                                                                                   | `var(--bek-scale-N)`                      |
| W      | `px-figma`           | CSS'da Figma `sizes` da yo'q px (0/0.5/1, `@media` hisobga olinmaydi)                                                                                                                                | Figma qiymatini oling yoki `accepted`     |
| W      | `variant-missing`    | VARIANT opsiyasi (`'opt'`, `--opt`, `__opt`, so'z) kodda yo'q. `State`, `Direction`, `Scrolled`, raqamli/demo prop'lar (`Items`, `Lines`, `Value`, `Text configurations`, `… 4`) o'tkazib yuboriladi | Variantni yozing yoki `accepted`          |
| W      | `prop-missing`       | BOOLEAN / On-Off prop'i camelCase, `show…`, `hide…` yoki so'zlari TSX/README'da yo'q                                                                                                                 | Prop/slot qo'shing yoki `accepted`        |

`--strict` — W ham xato (yangi komponent uchun). CI `pnpm check:figma` (E rejimi).
`--json` — mashina o'qiydigan natija. `--hook` — stdin JSON (`tool_input.file_path`) → komponent;
topilma bo'lsa `hookSpecificOutput.additionalContext`, exit 0.

## Checker'ni yaxshilash

Noto'g'ri ogohlantirish 2+ komponentda takrorlansa — `scripts/check-figma.mjs` dagi evristikani
tuzating (SKIP_PROPS, isSlotProp, COMMON_STATE_VARS, semanticKey …), `accepted` bilan yashirmang.
Yangi qoida qo'shganda ushbu jadvalni yangilang.
