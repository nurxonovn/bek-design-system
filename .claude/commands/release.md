---
description: Reliz tayyorlash — changeset'larni tekshirish, versiya ko'tarish, CHANGELOG, build/test darvozalari, sayt deploy. "reliz", "versiya chiqar", "publish" uchun.
argument-hint: '[--dry-run]'
---

# /release

1. `ls .changeset/*.md` — har o'zgarish uchun changeset bormi? Yo'q bo'lsa `pnpm changeset` mantiqida fayl yozing
   (`'@bek/react': minor|patch`, `'@bek/tokens': …`, o'zbekcha xulosa).
2. Darvozalar: `pnpm format:check && pnpm typecheck && pnpm build && pnpm test && pnpm check:figma`.
3. `--dry-run` bo'lmasa: `pnpm version-packages` (changesets → versiya + CHANGELOG), natijani ko'rsating.
4. Commit `chore(release): version packages`, push. Publish (`pnpm release`) faqat foydalanuvchi aniq so'rasa — npm token kerak.
5. Sayt: `main` ga merge bilan `deploy-site.yml` avtomatik; boshqa branch uchun `workflow_dispatch`.
