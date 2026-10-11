---
description: Figma'dagi oylik yangilanishni kodga sinxronlash — o'zgargan sahifalar/komponentlar uchun spec qayta olinadi, farqlar ko'rsatiladi, kod tuzatiladi, saytga chiqadi. Foydalanuvchi "Figma'da X o'zgardi", "yangilanish bor", "sync qil" desa shu komanda.
argument-hint: "<o'zgargan sahifalar yoki komponent nomlari, masalan: 3.1 Button, 4.3 Card; yangi: 3.20 Upload>"
---

# /figma-sync — Figma → kod sinxronizatsiyasi

Figma «BEK Design System» (fileKey `6ADJMMCbBHzYiIW0MBxJqh`) manba, kod uning aksi. Foydalanuvchi
qaysi sahifa/komponent o'zgarganini aytadi (`$ARGUMENTS`); aytilmagan bo'lsa barcha sahifalarni
tekshirish uchun avval `figma.root.children` ro'yxatini olib, yangi (kodda yo'q) sahifalarni toping.

## Qadamlar

1. **Inventar.** `use_figma` (read-only) bilan sahifa ro'yxati va komponent set ID'larini oling.
   Kodda bor komponentlar: `packages/react/src/components/*/figma.json → components[].id`.
   Natija: _o'zgargan_, _yangi_, _o'chirilgan_ ro'yxati.
2. **Spec yangilash.** Har o'zgargan set uchun `.claude/skills/figma-component/scripts/figma-extract.js`
   (`INPUT.sets`, `doc: true`) → eski `figma.json` bilan solishtiring: props/variantlar, tokenlar,
   sizes, doc matni. `components` va `doc` ni yangi spec bilan almashtiring, `accepted` ni saqlang
   (endi tegishli bo'lmaganlarini olib tashlang).
3. **Farqni ko'rsating** (commit'dan oldin, foydalanuvchiga): "Button: Size ga 4XL qo'shildi;
   fill/soft → fill/secondary; doc: hover qoidasi o'zgardi". Figma'ning o'zidagi kamchiliklar
   (codeSyntax yo'q, tokensiz rang) alohida — dizaynerga.
4. **Kod.** `figma-component` skilli bo'yicha tuzating: token/variant/prop, README, testlar.
   Yangi sahifa → `/new-component`. O'chirilgan → deprecate (export saqlanadi, README'da belgi, changeset `minor`).
5. **Tekshiruv.** `pnpm --filter @bek/react check:figma <nomlar> --strict` → 0 ogohlantirish;
   `pnpm format && pnpm typecheck && pnpm build && pnpm test`.
6. **Sayt.** `node apps/site/scripts/build-catalog.mjs`; yangi komponent bo'lsa `apps/site/src/app/demos/index.tsx` ga demo.
7. **Yakun.** `.changeset/*.md` (API o'zgarsa `minor`, faqat uslub bo'lsa `patch`), commit
   `sync(figma): <sahifalar> — <qisqa xulosa>`, push. Hisobotda: nima o'zgardi, nima `accepted`, dizaynerga ro'yxat.

Bir komandada bir nechta sahifa bo'lishi mumkin; sahifalar mustaqil bo'lsa parallel subagentlarga
(`figma-parity` agenti) bo'lib bering, har biri o'z papkalari bilan ishlasin.
