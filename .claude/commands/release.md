---
description: Reliz tayyorlash — changeset'larni tekshirish, versiya ko'tarish, CHANGELOG, build/test darvozalari, sayt deploy. "reliz", "versiya chiqar", "publish" uchun.
argument-hint: '[--dry-run]'
---

# /release

1. `ls .changeset/*.md` — har o'zgarish uchun changeset bormi? Yo'q bo'lsa `pnpm changeset` mantiqida fayl yozing
   (`'@bek-ui/react': minor|patch`, `'@bek-ui/tokens': …`, o'zbekcha xulosa).
2. Darvozalar: `pnpm format:check && pnpm typecheck && pnpm build && pnpm test && pnpm check:figma`.
3. Reliz avtomatik (`.github/workflows/release.yml`): changeset'li PR `main`ga merge qilinganda
   changesets/action **"chore: version packages"** PR ochadi (versiya + CHANGELOG). Uni ko'rib chiqib merge qiling —
   `@bek-ui/react`, `@bek-ui/tokens`, `@bek-ui/charts` npm'ga provenance bilan chiqadi. Nashrdan oldin
   `scripts/check-npm-auth.mjs` tokenni va `bek-ui` org a'zoligini tekshiradi. Pre-rejimda (`.changeset/pre.json`)
   versiyalar `-beta.N`, tag `beta`; barqaror reliz uchun `pnpm changeset pre exit`.
   Mahalliy `--dry-run`: alohida worktree'da `pnpm version-packages`, commit qilmang.
4. Nashrdan keyin: `npm view @bek-ui/react dist-tags`; npmjs.com'da Trusted Publishing (OIDC) sozlansa, tokenni olib tashlash mumkin.
5. Sayt: `main` ga merge bilan `deploy-site.yml` avtomatik; boshqa branch uchun `workflow_dispatch`.
