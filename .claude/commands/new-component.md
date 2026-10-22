---
description: Figma sahifasidan yangi @bek-ui/react komponenti yaratish (spec → kod → README → test → strict tekshiruv → sayt demosi). "komponent qo'sh", "X ni kodga o'tkaz", "keyingi bo'lim" uchun.
argument-hint: '<Figma sahifa nomi/raqami yoki komponent set node ID, masalan 3.20 Upload yoki 1100:42>'
---

# /new-component

`figma-component` skilini to'liq bajaring (`.claude/skills/figma-component/SKILL.md`). Qisqacha:

1. Sahifani toping (`$ARGUMENTS`): `use_figma` bilan sahifa ID, komponent set ID'lari, 📘 doc frame.
2. `scripts/figma-extract.js` → `packages/react/src/components/<kebab>/figma.json` (`accepted: []`).
3. Doc matnini o'qib, `references/conventions.md` bo'yicha `<Pascal>.tsx`, `<kebab>.css`, `index.ts`,
   `README.md` (o'zbekcha, `Figma: **N.N Nom**` qatori) yozing. `nested` komponentlarni import qiling.
4. `src/index.ts` export, `packages/react/README.md` jadvali, `test/*.test.mjs` SSR testi.
5. `pnpm --filter @bek-ui/react check:figma <kebab> --strict` → 0 ogohlantirish (yoki `accepted` sabab bilan).
6. `apps/site/src/app/demos/index.tsx` ga demo, `node apps/site/scripts/build-catalog.mjs`.
7. `pnpm format && pnpm typecheck && pnpm build && pnpm test`; `.changeset` (`minor`); commit
   `feat(react): <Nom> — Figma <N.N Sahifa>`.

Ko'z bilan solishtirish: Figma `get_screenshot` ↔ sayt (`pnpm --filter @bek-ui/site build`, preview, Chromium skrinshot) Light/Dark.
