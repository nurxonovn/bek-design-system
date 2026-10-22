---
paths:
  - 'packages/react/**'
  - 'packages/tokens/**'
  - 'apps/site/src/app/demos/**'
---

# BEK Design System — loyiha qoidalari

Figma «BEK Design System» — yagona haqiqat manbai; kod uning aksi. ECC umumiy qoidalari (`common/`,
`typescript/`, `react/`, `web/`) shu qoidalarga bo'ysunadi; ziddiyatda shu fayl ustun.

## Komponent

- Har komponent `packages/react/src/components/<kebab>/`: `<Pascal>.tsx`, `<kebab>.css`, `index.ts`,
  `README.md` (o'zbekcha, `Figma: **N.N Nom**` qatori), `figma.json` (spec + `accepted[]`).
- Figma spec'siz komponent yozilmaydi: avval `figma-extract.js` → `figma.json`, keyin kod.
- CSS faqat `var(--bek-*)` tokenlari; hex/rgb/hsl taqiqlangan; px faqat Figma `sizes`da bor va
  `scale/N` tokeni bo'lmagan qiymatlar. Matn uslubi — `--bek-type-<family>-<size>-{size,line-height,tracking}`.
- Holatlar CSS orqali (`:hover`, `:active`, `:focus-visible`, `[disabled]`), prop emas; fokus `.bek-focus-ring`.
- RTL — logical properties; Dark — tokenlar (`data-theme="dark"`), alohida CSS yo'q.
- Nested Figma komponentlari import qilinadi, qayta chizilmaydi. Ommaviy API faqat changeset bilan o'zgaradi.
- Ikonkalar `src/icons/`; komponent ichida inline SVG yozilmaydi (status/glyph kutubxonasiga qo'shing).

## Darvozalar (har push oldidan)

`pnpm format:check && pnpm typecheck && pnpm build && pnpm test && pnpm check:figma` — CI shu.
Komponent yoki demo o'zgarsa: `pnpm --filter @bek-ui/site test:e2e` (CI `e2e` job) — axe topilmasi komponentda
tuzatiladi; `ACCEPTED`ga faqat axe'ning noto'g'ri topilmasi, sababi bilan.
Yangi/o'zgargan komponent: `pnpm --filter @bek-ui/react check:figma <nom> --strict` → 0 ogohlantirish.
PostToolUse hook komponent fayli yozilganda tekshiruvni o'zi ishga tushiradi — chiqishini e'tiborsiz qoldirmang.

## Testlar

`packages/react/test/*.test.mjs` — `node:test` + `renderToStaticMarkup` (dist'dan). Har eksport kamida bir
testda; rollar/aria, variant klasslari, slotlar, disabled/selected. ECC'ning 80% qamrov talabi bu yerda
"har eksport + har variant yo'li" sifatida qo'llanadi.

## Hujjat va sayt

README va sharhlar o'zbekcha; kod identifikatorlari inglizcha. `apps/site` katalogi `README.md + figma.json`
dan avtomatik (`node apps/site/scripts/build-catalog.mjs`); yangi komponentga demo: react — `demos/index.tsx`, charts — `demos/charts/{a,b,c,d}.tsx` (e2e namunasiz sahifani yiqitadi).
`.changeset/*.md` — API o'zgarsa `minor`, uslub bo'lsa `patch`.
