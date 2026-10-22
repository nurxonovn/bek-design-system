---
name: figma-component
description: >-
  BEK Design System'da Figma sahifasidan React komponent yaratish, yangilash yoki tekshirish uchun
  ishlatiladi. Figma ↔ kod bir xilligini saqlaydi: Figma'dan spetsifikatsiya (figma.json) olinadi,
  komponent shu spec bo'yicha yoziladi va `check-figma.mjs` bilan avtomatik tekshiriladi. Foydalanuvchi
  "komponent yarat/qo'sh", "keyingi bo'lim", "Figma'dagi X ni kodga o'tkaz", "X ni Figma bilan
  solishtir/tekshir", "figma.json", "token/variant mos emas" desa — Figma yoki bo'lim raqami (3.18,
  4.16 …) tilga olinsa ham, olinmasa ham — shu skillni ishlating. `packages/react/src/components/*`
  ichidagi .tsx/.css/README tahrirlanganda ham amal qiladi.
---

# figma-component — Figma ↔ kod bir xilligi

Maqsad: `packages/react` dagi har bir komponent Figma "BEK Design System" faylidagi (fileKey
`6ADJMMCbBHzYiIW0MBxJqh`) o'z sahifasining aynan o'zi bo'lsin — tokenlar, matn uslublari,
variantlar, prop'lar, o'lchamlar va 📘 doc frame'dagi qoidalar. Har komponent papkasida
`figma.json` (Figma'dan olingan spec) yotadi; `scripts/check-figma.mjs` kodni shu spec bilan
solishtiradi. Yozish → tekshirish → tuzatish sikli skillning o'zagi.

Nega shunday: Figma'da har sahifada Design tokens / Props / Rules / Do-Don't jadvallari bor.
Komponent "ko'rinishiga qarab" yozilsa, tokenlar va holatlar sekin-asta Figma'dan uzoqlashadi.
Spec faylga tushirilib, mashina tekshirsa — farq ko'rinadi va yo tuzatiladi, yo sabab bilan
`accepted[]` ga yoziladi (hujjatlangan ataylab farq).

## Ish tartibi

### 0. Sahifani toping

Figma sahifalari raqamlangan: `3.18 Link`, `4.16 Description list`, … Sahifa ID va komponent
set ID'larini olish uchun `use_figma` (read-only) bilan `figma.root.children` ni o'qing yoki
`get_metadata` ishlating. Sahifada komponent set(lar) + `📘 …` doc frame bo'ladi.
Yordamchilar (`_Icon`, `.Rating/Star`) asosiy komponentning qismi — alohida komponent qilmang.

### 1. Spec oling → `figma.json`

`scripts/figma-extract.js` ni oching, `INPUT.sets` ga sahifadagi komponent set ID'larini yozing
(`doc: true` — doc matni ham olinadi) va butun faylni `use_figma` ga `code` sifatida bering
(`fileKey` yuqorida). Natija JSON:

- `components[]` — nom, props (VARIANT → variantlar ro'yxati; BOOLEAN/TEXT/INSTANCE_SWAP →
  `{type, default}`), `tokens.{color,text,effect,dimension}`, `sizes` (padding/gap/radius px),
  `rawColors` (tokensiz ranglar — Figma'da xato), `nested` (boshqa sahifadagi komponentlar —
  kodda ham shu komponentlardan tuzing), `description`.
- `doc[page]` — doc frame'dan "Design tokens … Related" bo'lagi (≤3200 belgi) va unda uchragan
  token nomlari.

Natija 20 KB dan oshsa — set'larni ikki chaqiruvga bo'ling (doc faqat birinchisida).
Saqlang: `packages/react/src/components/<nom>/figma.json` →
`{ "page", "components": [...], "doc": {...}, "accepted": [] }` (`references/spec.md`).
Spec'ni **kod yozishdan oldin** o'qib chiqing: doc matnidagi qoidalar (Rules, Do/Don't,
Devices, Dark) README va implementatsiyaga kiradi.

### 2. Komponentni yozing

`references/conventions.md` — papka tuzilmasi, nomlash, CSS token qoidalari, a11y, RTL.
Qisqacha:

- `src/components/<nom>/` → `<Nom>.tsx`, `<nom>.css`, `index.ts`, `README.md`, `figma.json`.
- CSS'da faqat `var(--bek-*)` — hex/rgb yo'q; px faqat Figma `sizes` da bor qiymatlar va
  `scale/N` tokeni bo'lmaganlar. Matn uslubi: `--bek-type-<family>-<size>-{size,line-height,tracking}`
  yoki `.bek-text-<family>-<s|m|l>` klassi.
- Variant nomi Figma bilan bir xil, kichik harf (`Variant=Outline-action` → `'outline-action'`,
  CSS `.bek-x--outline-action`). Boolean `Show badge` → `badge` prop'i. `State` propdan emas,
  CSS `:hover/:active/:focus-visible/:disabled` dan; `Direction` — `dir="rtl"` + logical props.
- `nested` dagi komponentlarni qayta chizmang — import qiling (Card ichida Button, Badge).
- `src/index.ts` ga export, `packages/react/README.md` jadvaliga qator, `test/*.test.mjs` ga
  SSR test (`renderToStaticMarkup`) — `check-figma` bularni xato (E) sifatida talab qiladi.
- README (o'zbekcha): `Figma: **<raqam> <nom>**` qatori, 1–2 misol, Figma doc'dagi qoidalar
  (qachon ishlatish/ishlatmaslik, o'lchamlar, a11y).

Asos qoidalar (kompensatsiya +4 px, ikonka birinchi qator balandligida, forma/fieldset
standarti, hover/pressed/focus tokenlari) — `references/foundations.md`.

### 3. Tekshiring

```bash
pnpm --filter @bek-ui/react check:figma <nom> --strict   # yangi komponent: ogohlantirish ham xato
pnpm --filter @bek-ui/react check:figma                  # hammasi (CI shu rejimda: faqat E xato)
```

Qoidalar ro'yxati va ma'nosi — `references/spec.md`. Har topilma uchun uch yo'l:

1. **Kod xato** → tuzating (ko'pincha shunday: token o'rniga px, variant tushib qolgan).
2. **Figma noaniq/xato** (tokensiz rang, `codeSyntax` yo'q token) → kodni Figma _niyatiga_ mos
   yozing va `accepted[]` ga `{ "rule", "match", "reason" }` qo'shing; sababda Figma'da nima
   tuzatilishi kerakligini yozing — bu dizaynerga xabar.
3. **Ataylab farq** (masalan, Figma demo prop'i `Show item 4` React'da children orqali) →
   `accepted[]` sabab bilan.

`accepted` sababsiz qabul qilinmaydi (E). Hook: `.claude/settings.json` PostToolUse — komponent
fayli tahrirlanganda tekshiruv avtomatik ishlaydi va natijani kontekstga qaytaradi; chiqishni
e'tiborsiz qoldirmang.

### 4. Ko'z bilan solishtiring

Figma `get_screenshot` (set node ID) ↔ `apps/templates` yoki qisqa SSR HTML. Light va Dark
(`data-theme="dark"`), LTR va RTL. Checker o'lchov qila olmaydigan narsalar: joylashuv,
ikonka tekisligi (1.11), rang kontrasti.

### 5. Yakunlash

- `.changeset/*.md` (`'@bek-ui/react': minor` yoki `patch`), `pnpm format`, `pnpm typecheck`,
  `pnpm build`, `pnpm test`, `pnpm check:figma`.
- Commit: `feat(react): <Nom> — Figma <raqam> <sahifa>`; tanada topilgan Figma farqlarini
  (`accepted` sabablarini) qisqa sanab o'ting.

## Mavjud komponentni yangilash

Figma sahifasi o'zgargan bo'lsa — 1-qadamni qayta bajarib `figma.json` ni yangilang
(`accepted` ni saqlab qoling), `check:figma <nom>` ni ishga tushiring; yangi ogohlantirishlar —
aynan o'zgargan joylar. Kodni o'zgartirganda spec'ga tegmang: spec Figma'ning aksi, kodning emas.

## Chegaralar

- Global uslublar (`src/styles/*.css`: focus ring, scrollbar, cursor, tone) spec'siz — ular
  Foundations sahifalariga tayanadi; komponent ularni ishlatsa checker pool'ga qo'shadi.
- Checker — evristika: `prop-missing`/`variant-missing` so'z bo'yicha qidiradi, shuning uchun
  "✓" hali "Figma bilan bir xil" degani emas; 4-qadam shart. Noto'g'ri ogohlantirish takrorlansa
  checker qoidasini yaxshilang (`scripts/check-figma.mjs`), har komponentda `accepted` yozmang.
