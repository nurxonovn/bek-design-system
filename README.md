# BEK Design System

Mobile, Tablet va Web uchun universal dizayn tizimi — Figma kutubxonasi, tokenlar, React komponentlari va hujjat sayti.

- Figma Community: https://www.figma.com/community/file/1684198240912616154/bek-design-system
- Shrift: Inter · Urg'u rangi: Indigo · Mavzular: Light / Dark
- Qurilmalar: Mobile 360–599 · Tablet 600–1023 · Web 1024+

## Tuzilma

| Papka             | Paket         | Nima                                         |
| ----------------- | ------------- | -------------------------------------------- |
| `packages/tokens` | `@bek/tokens` | Figma variables → CSS (`--bek-*`), JSON      |
| `packages/react`  | `@bek/react`  | React komponentlari                          |
| `apps/site`       | `@bek/site`   | Hujjat sayti (landing, Foundations, katalog) |

## Ishga tushirish

```bash
corepack enable
pnpm install
pnpm dev        # hujjat sayti
pnpm build      # hamma paketlar
```

## Ish tartibi

1. Har o'zgarish alohida branch'da (`feat/button`, `fix/tokens-dark`).
2. Pull Request → CI (format, typecheck, build) yashil → ko'rib chiqish → Merge.
3. Paketga ta'sir qiladigan o'zgarishda `pnpm changeset` — versiya va changelog shundan yoziladi.

## Litsenziya

Kod — MIT (`LICENSE`). Ikonkalar, maskot, 3D obyektlar va brend belgilari bu litsenziyaga kirmaydi.
