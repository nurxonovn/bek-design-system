---
description: To'liq Figma ↔ kod auditi — Figma'dagi har komponent set'i, prop/variant/token/o'lcham va Variables kodda bormi. "hammasi bormi", "audit", "Figma bilan to'liq solishtir", oylik tekshiruv uchun.
argument-hint: '[sahifa raqamlari | bo''sh = hammasi]'
---

# /figma-audit

`/parity` faqat kodda bor spec'ni kod bilan solishtiradi; `/figma-audit` esa **jonli Figma**ni kod spec'lari bilan
solishtiradi: yangi set'lar (kodda yo'q), o'zgargan set'lar (spec eskirgan), o'chirilganlar va tokenlar.

1. **Sahifalar.** `use_figma` (fileKey `6ADJMMCbBHzYiIW0MBxJqh`, avval `create_session`) bilan
   `.claude/skills/figma-component/scripts/figma-audit.js` ni `INPUT = { pages: 'list' }` bilan ishga tushiring →
   `P|id|nom` ro'yxati.
2. **Set'lar.** Xuddi shu skriptni `INPUT.pages` ga sahifa ID'larini berib, **bitta xabarda parallel** chaqiruvlar
   bilan ishga tushiring (bo'limlar bo'yicha: 1.6 + 2.x + 9.x + 10.x · 3.x · 4.x · 4.18–4.19 · 5.x–7.x). Birinchisiga
   `variables: true` qo'shing. 2.1 Icons ni bermang (minglab ikonka, kodga kirmaydi); 8.x shablonlarda set yo'q.
3. **Solishtirish.** Hamma chiqishni bitta faylga (scratchpad) yig'ing va:
   ```bash
   node scripts/figma-audit.mjs <fayl> --verbose
   ```
   - `✗ kodda yo'q` → `/new-component` (yoki ataylab kirmasa — `scripts/figma-audit.mjs` → `IGNORE` ga sabab bilan,
     va `docs/figma-discrepancies.md` ga).
   - `~ spec eskirgan` → o'sha set uchun `figma-extract.js` bilan spec qayta olinadi (`/figma-sync`), farq ko'rsatiladi,
     kod tuzatiladi. Farq faqat Figma'dagi tasodifiy o'zgarish bo'lsa — dizaynerga ro'yxat.
   - `? Figma'da yo'q` → set o'chirilgan yoki ID o'zgargan: Figma'dan yangi ID'ni topib spec'ni yangilang yoki
     komponentni deprecated qiling (changeset bilan).
   - `~ tokenlar` → `packages/tokens/figma/*.json` ni Figma Variables'dan qayta eksport qiling (`/figma-sync tokens`).
4. Yakun: `pnpm check:figma -- --strict` → 0, `docs/figma-discrepancies.md` ga sana bilan bo'lim, changeset (API
   o'zgarsa), commit.

Xeshlar `figma-extract.js → collect()` va `figma.json` maydonlariga tayanadi; extractor'ni o'zgartirsangiz,
`figma-audit.js` dagi `collect` ham birga o'zgarishi kerak (aks holda hamma set "eskirgan" chiqadi).
