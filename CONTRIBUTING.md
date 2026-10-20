# Contributing to BEK Design System

Thanks for helping. This guide covers how the project works and how to land a change. Uzbek summary at the end ([O'zbekcha](#ozbekcha)).

## Ground rules

1. **Figma is the source of truth.** A component in code mirrors a page in the [BEK Design System Figma file](https://www.figma.com/community/file/1684198240912616154/bek-design-system). Names, variant axes and sizes match Figma (`variant`, `size`: M · L · XL · 2XL · 3XL). If the design is wrong, open an issue — don't fix it in code only.
2. **Tokens only.** No hard-coded colours, sizes, radii or fonts. Everything resolves to `--bek-*` custom properties from `@bek/tokens`.
3. **Three devices.** Every component works at Mobile 390, Tablet 834 and Web 1440. Device-dependent values come from token modes.
4. **Accessible.** Text contrast AA ≥ 4.5:1, `:focus-visible` ring, full keyboard control, targets ≥ 24 px (44 iOS / 48 Android on touch), RTL via `dir="rtl"` and logical properties.
5. **States in CSS, not props.** Hover, pressed and focus are `:hover`, `:active`, `:focus-visible`.
6. **Plain CSS.** No Tailwind in packages; consumers must not need it either.

## Setup

```bash
corepack enable
pnpm install
pnpm dev            # docs site
pnpm build · pnpm typecheck · pnpm test · pnpm format
pnpm check:figma -- --strict   # Figma ↔ code parity, must be 0 warnings
```

Node 22 (`.nvmrc`), pnpm 10.

## Repository layout

```
packages/tokens    @bek/tokens   figma/*.json → dist/tokens.css, typography.css, materials.css, tokens.json
packages/react     @bek/react    src/components/<kebab>/  Component.tsx · component.css · index.ts · README.md · figma.json
packages/charts    @bek/charts   same layout, SVG + d3 modules
apps/site          docs site     catalogue is generated from component README.md + figma.json (scripts/build-catalog.mjs)
apps/templates     example screens from Figma 8.x
docs/              figma-discrepancies.md — accepted Figma ↔ code differences
```

## Adding or changing a component

1. **Spec first.** Export the Figma page spec into `src/components/<name>/figma.json` (maintainers do this with the `figma-component` skill in `.claude/skills/`; contributors can copy values from the Figma page — the 📘 doc frame lists tokens, sizes and props).
2. **Write the component** in `Component.tsx` + `component.css`. Props follow Figma property names; variants are a `variant` union, sizes a `size` union.
3. **README.md** in the component folder: purpose, props table, Do/Don't, Figma page number. The docs site builds its catalogue from this file.
4. **Tests** in `packages/react/test/<name>.test.mjs` (Node test runner): rendering, variants, keyboard behaviour.
5. **Parity.** `pnpm --filter @bek/react check:figma <name> --strict` must pass. A deliberate difference goes into `figma.json → accepted[]` with a reason.
6. **Export** from `src/index.ts`; the site catalogue picks it up on the next build.
7. **Changeset.** `pnpm changeset` → pick the package, `minor` for a new component, `patch` for a fix. Write the summary in English.

## Branches, commits, pull requests

- Branch from `main`: `feat/<name>`, `fix/<name>`, `docs/<name>`, `sync/<figma-pages>`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org): `feat(react): add Uploader`, `fix(tokens): dark bg/base value`. English or Uzbek body — both are fine.
- One PR per component or fix. Fill in the PR template; CI (format · typecheck · build · test · check:figma) must be green.
- No direct pushes to `main`. A maintainer reviews and merges.

## Reporting

- **Bug** — use the bug template: component, device, theme, steps, screenshot.
- **Component request** — name the Figma page if it exists; if not, describe the use case first.
- **Figma ↔ code mismatch** — use the parity template and quote the token/variant that differs.
- **Security** — see [SECURITY.md](SECURITY.md); don't open a public issue.

## Becoming a maintainer

We are actively looking for core maintainers for `@bek/react` and `@bek/charts`. After a few merged PRs, say so in Discussions — maintainers get review rights, release duty and a say in the roadmap.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## O'zbekcha

- **Figma — yagona manba.** Komponent nomi, variant o'qlari va o'lchamlar Figma bilan bir xil. Dizayn xato bo'lsa — issue oching, faqat kodda tuzatmang.
- **Faqat tokenlar** (`--bek-*`), qattiq qiymat yo'q. **3 qurilma:** 390 · 834 · 1440. **Accessibility:** AA ≥ 4.5, focus halqasi, klaviatura, target ≥ 24 px, RTL.
- **Komponent qo'shish:** `figma.json` spec → `Component.tsx` + `component.css` → `README.md` → test → `check:figma --strict` 0 → `index.ts` eksport → `pnpm changeset`.
- **Branch:** `feat/…`, `fix/…` `main` dan; commit — Conventional Commits; PR → CI yashil → ko'rib chiqish → Merge. `main` ga to'g'ridan-to'g'ri push yo'q.
- **Maintainer bo'lish:** bir nechta PR merge bo'lgach Discussions'da yozing.
