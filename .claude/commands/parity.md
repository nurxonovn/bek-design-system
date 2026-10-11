---
description: Figma ↔ kod mosligini tekshirish va tuzatish — check:figma natijasini o'qib, har ogohlantirishni kod tuzatishi yoki sababli accepted bilan yopish. "mosligini tekshir", "parity", "farqlarni ko'r" uchun.
argument-hint: "[komponent nomlari | bo'sh = hammasi] [--strict]"
---

# /parity

1. `cd packages/react && node scripts/check-figma.mjs $ARGUMENTS --strict` (bo'sh bo'lsa hammasi).
2. Har topilma uchun qaror (`.claude/skills/figma-component/references/spec.md` jadvali):
   - kod xato → tuzating (px → `var(--bek-scale-N)`, token, variant, prop, matn uslubi);
   - Figma tomonidagi kamchilik yoki ataylab farq → `figma.json → accepted[]` `{rule, match, reason}`,
     sabab aniq va o'zbekcha; `components`/`doc` ga tegmang.
3. Noto'g'ri ogohlantirish 2+ komponentda takrorlansa — `scripts/check-figma.mjs` evristikasini tuzating,
   `accepted` bilan yashirmang.
4. `pnpm --filter @bek/react build && pnpm --filter @bek/react test`; yakunda `pnpm check:figma -- --strict` → 0.
5. Hisobot: komponent bo'yicha kod/accepted; dizaynerga Figma'da tuzatish ro'yxati.

Katta ro'yxat → komponent guruhlari bo'yicha `figma-parity` subagentlariga parallel bering (papkalar kesishmasin).
