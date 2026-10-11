# BEK Design System — Claude Code uchun yo'riqnoma

Figma «BEK Design System» (https://www.figma.com/design/6ADJMMCbBHzYiIW0MBxJqh) → kod. Monorepo:
pnpm 10 + Turborepo. Javoblar va hujjatlar **o'zbekcha**, kod identifikatorlari inglizcha.

## Tuzilma

- `packages/tokens` — `@bek/tokens`: Figma Variables (`figma/*.json`) → `dist/tokens.css`, `typography.css`, `materials.css`, `tokens.json`.
- `packages/react` — `@bek/react`: 58 komponent, `src/components/<kebab>/` (tsx · css · index · README · figma.json), testlar `test/*.test.mjs`, `scripts/check-figma.mjs`.
- `apps/site` — hujjat sayti (Vite; katalog `scripts/build-catalog.mjs` bilan README + figma.json dan). GitHub Pages: `.github/workflows/deploy-site.yml`.
- `apps/templates` — Figma 8.x namuna ekranlar.
- `.claude/skills/figma-component` — Figma ↔ kod skili (extractor, konventsiyalar, foundations, tekshiruv qoidalari).

## Buyruqlar

```bash
pnpm install
pnpm build · pnpm typecheck · pnpm test · pnpm format · pnpm format:check
pnpm check:figma                 # Figma ↔ kod (CI: faqat xatolar)
pnpm check:figma -- --strict     # ogohlantirish ham xato
pnpm --filter @bek/react check:figma <nom> --strict
pnpm --filter @bek/site dev      # sayt
```

## Ish oqimi (ECC)

1. `/plan` — murakkab ish oldidan reja, tasdiq.
2. Yangi Figma bo'limi → `/new-component`; Figma yangilanishi → `/figma-sync <sahifalar>`; moslik → `/parity`.
3. Kod → `/react-review` yoki `/code-review`; build xato → `/build-fix`; xavfsizlik → `/security-scan`.
4. Darvozalar: format · typecheck · build · test · check:figma → commit (Conventional Commits, tana o'zbekcha) → push → `/pr`.
5. Reliz → `/release`.

Agentlar (`.claude/agents`): `figma-parity` (BEK), `planner`, `architect`, `code-reviewer`, `typescript-reviewer`,
`react-reviewer`, `react-build-resolver`, `tdd-guide`, `a11y-architect`, `security-reviewer`, `refactor-cleaner`,
`code-simplifier`, `doc-updater`, `database-reviewer` (Supabase), `e2e-runner`, `performance-optimizer`,
`pr-test-analyzer`, `silent-failure-hunter`, `type-design-analyzer`, `commit-reviewer`, `build-error-resolver`.
Mustaqil ishlarni parallel subagentlarga bo'ling (komponent papkalari kesishmasin), commit'ni asosiy sessiya qiladi.

Qoidalar `.claude/rules/` (ECC common/typescript/react/web + `bek/design-system.md` — ziddiyatda BEK ustun).
Skill'lar `.claude/skills/` (figma-component, tdd-workflow, react-patterns, react-testing, accessibility,
frontend-a11y, git-workflow, coding-standards, verification-loop, design-system, frontend-design-direction,
e2e-testing, postgres-patterns, security-review, conventional-commit-review).

## Figma yangilanishi (oylik)

Foydalanuvchi qaysi sahifa/komponent o'zgarganini aytadi → `/figma-sync`. Spec (`figma.json`) qayta olinadi,
farq ko'rsatiladi, kod tuzatiladi, `--strict` 0, sayt katalogi qayta yig'iladi, changeset, commit.
Figma'ning o'zidagi kamchiliklar (codeSyntax yo'q, tokensiz rang, doc ≠ komponent) dizaynerga ro'yxat sifatida.

## Git

Branch `feat/…`, `fix/…`, `sync/…` `main` dan; PR'ni foydalanuvchi so'raganda. Commit tanasi o'zbekcha,
sarlavha Conventional Commits. `main` ga to'g'ridan-to'g'ri push yo'q. Model nomi commit/PR'ga yozilmaydi.

## Tashqi tizimlar

Figma MCP (`use_figma` read-only, `get_screenshot`, `get_variable_defs`); GitHub MCP; Supabase MCP
(loyiha `BEK Design System`, `hiyagjqdmixjygkcrocv` — hozircha bo'sh; migratsiyalar `supabase/migrations/`
ga yoziladi, `database-reviewer` bilan ko'rib chiqiladi).

ECC: `.claude/ECC-VERSION` (asl: https://github.com/affaan-m/everything-claude-code, MIT — `.claude/ECC-LICENSE`).
Yangilash: ECC'dan kerakli fayllarni qayta nusxalang; `bek/` qoidalari va BEK komandalari (`figma-sync`,
`new-component`, `parity`, `release`, `figma-parity` agenti) ECC'ga tegishli emas.
