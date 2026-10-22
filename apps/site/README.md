# @bek-ui/site

BEK Design System hujjat sayti — Figma «BEK Design System» faylidagi har bir bo'limni jonli ko'rsatadi:
landing, Foundations (tokenlar), komponentlar katalogi, ikonkalar.

```bash
pnpm --filter @bek-ui/site dev      # http://localhost:5173
pnpm --filter @bek-ui/site build    # dist/ (GitHub Pages: .github/workflows/deploy-site.yml)
```

## Manba — bitta haqiqat

- **Komponentlar katalogi** `scripts/build-catalog.mjs` bilan `packages/react/src/components/*/`
  dan yig'iladi: `README.md` (hujjat), `figma.json` (Figma spetsifikatsiyasi: prop'lar, variantlar,
  tokenlar, `accepted` farqlar), `index.ts` (eksportlar) → `src/app/data/catalog.generated.json`.
  Yangi komponent qo'shilsa katalogda o'zi paydo bo'ladi.
- **Jonli namunalar** — `src/app/demos/index.tsx`: har komponent papkasi uchun `@bek-ui/react` dan
  bitta demo. Demo yo'q bo'lsa karta «Namuna tez orada» ko'rsatadi.
- **Tokenlar** (`#/tokens`) — `@bek-ui/tokens/tokens.json` dan: ranglar (Light/Dark), tipografika,
  o'lchamlar (Mobile/Tablet/Web), soya, layout.
- Sayt qobig'i shadcn/ui asosida; uning o'zgaruvchilari `src/styles/bek-bridge.css`
  orqali BEK tokenlariga bog'langan, Dark rejim `data-theme="dark"` bilan sinxron.

## Marshrutlar

Hash-marshrutlar (GitHub Pages'da server sozlamasiz ishlaydi): `#/`, `#/components`,
`#/components/<papka>` (masalan `#/components/button`), `#/tokens`, `#/docs`, `#/icons`.

## Joylash

`main` ga push → GitHub Pages (`Settings → Pages → Source: GitHub Actions`). Boshqa branch'ni
ko'rish uchun workflow'ni qo'lda ishga tushiring (`workflow_dispatch`). `VITE_BASE` — repo nomi.
