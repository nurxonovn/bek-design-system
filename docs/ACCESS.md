# Kirish huquqlari va foydalanish

BEK Design System uch joyda yashaydi: **Figma** (manba), **GitHub** (kod) va **npm** (paketlar). Har birida
kim nima qila olishi alohida sozlanadi. Bu hujjat — maintainer uchun qo'llanma; sozlamalarning o'zi GitHub, npm va
Figma interfeyslarida.

## 1. Foydalanuvchilar (paketlarni ishlatish)

Paketlar ochiq (`publishConfig.access: public`), MIT litsenziyasi bilan — ruxsat so'rash shart emas:

```bash
npm i @bek-ui/tokens@beta @bek-ui/react@beta          # + @bek-ui/charts@beta, @bek-ui/backgrounds@beta
```

```tsx
import '@bek-ui/tokens/tokens.css';
import '@bek-ui/tokens/typography.css';
import '@bek-ui/react/styles.css';
import { Button } from '@bek-ui/react';
```

Shriftlar, ikonkalar va rasmlar litsenziyasi — `LICENSE-ASSETS.md`: Hugeicons Pro manba fayllari tarqatilmaydi, paketlarda faqat litsenziya ruxsat bergan gliflar.

Agar paketlar faqat ichki jamoa uchun bo'lishi kerak bo'lsa (yopiq), `publishConfig.access` va
`.changeset/config.json → access` ni `restricted` ga o'zgartiring — bu npm'da pullik org rejasini talab qiladi va
har foydalanuvchiga npm org'da `read` huquqi kerak bo'ladi.

## 2. npm — kim nashr qiladi

| Rol (npmjs.com/org/bek-ui) | Kim                    | Huquq                                            |
| -------------------------- | ---------------------- | ------------------------------------------------ |
| Owner                      | Asoschi (`nurxonov_n`) | A'zolar, jamoalar, billing, paketlarni o'chirish |
| Admin                      | 1–2 maintainer         | Jamoalar va paket huquqlari                      |
| Member + `developers` team | Reliz qiluvchilar      | `@bek-ui/*` paketlariga read-write               |

- Odamlar qo'lda `npm publish` qilmaydi: nashr faqat `.github/workflows/release.yml` orqali (changesets →
  "chore: version packages" PR → merge → npm, provenance bilan).
- CI token: `NPM_TOKEN` (GitHub → Settings → Secrets → Actions) — **Granular access token**, faqat `@bek-ui` scope'iga
  Read and write, muddati 90 kun. Token egasi org'da bo'lishi shart — `scripts/check-npm-auth.mjs` buni nashrdan oldin
  tekshiradi.
- Keyingi qadam: npmjs.com → har paket → Settings → **Trusted Publishing** (GitHub Actions, `nurxonovn/bek-design-system`,
  `release.yml`) — shunda token umuman kerak bo'lmaydi va `NPM_TOKEN` ni o'chirish mumkin.
- Ikki bosqichli autentifikatsiya: org sozlamalarida "Require 2FA" yoqilsin.

## 3. GitHub — kim o'zgartiradi

**Repo rollari** (Settings → Collaborators and teams):

| Rol      | Kim                       | Nima qila oladi                      |
| -------- | ------------------------- | ------------------------------------ |
| Admin    | Asoschi                   | Sozlamalar, secrets, branch himoyasi |
| Maintain | Core maintainer           | PR merge, issue/label boshqaruvi     |
| Write    | Jamoa dasturchilari       | Branch push, PR ochish               |
| Triage   | Dizayner, QA              | Issue va PR'larni belgilash, izoh    |
| Read     | Boshqa hamma (ochiq repo) | Fork orqali PR                       |

**`main` himoyasi** (Settings → Rules → Rulesets → New branch ruleset, target `main`):

- Restrict deletions, Block force pushes.
- Require a pull request before merging — 1 approval, "Dismiss stale approvals", **Require review from Code Owners**
  (`.github/CODEOWNERS`).
- Require status checks to pass: `check`, `e2e` (CI), "Require branches to be up to date".
- Bypass list: faqat Admin (va changesets "version packages" PR'i uchun GitHub Actions bot kerak bo'lsa).

**Secrets va muhitlar:** `NPM_TOKEN` faqat Admin ko'radi. Xohlasangiz `release` environment yarating va
`release.yml` job'iga `environment: release` qo'shib, nashrdan oldin qo'lda tasdiqlashni yoqing.

## 4. Figma — kim dizaynni o'zgartiradi

| Rol                | Kim                        | Huquq                                   |
| ------------------ | -------------------------- | --------------------------------------- |
| Owner / Can edit   | Dizayn tizimi dizayneri    | Komponentlar, Variables, nashr          |
| Can view + Library | Mahsulot dizaynerlari      | Kutubxonani o'z fayllarida ishlatadi    |
| Can view           | Dasturchilar, Claude (MCP) | O'qish, `use_figma` read-only, Dev Mode |

- Kutubxonani nashr qilish (Assets → Publish) — faqat dizayn tizimi dizayneri; har nashrdan keyin `/figma-audit` bilan
  kod tekshiriladi.
- Branching (Organization/Enterprise rejasida) — katta o'zgarishlar alohida Figma branch'da, review bilan.
- Figma Community nusxasi CC BY 4.0 (`LICENSE-ASSETS.md`) — har kim nusxa olib ishlatishi mumkin; manba faylni
  tahrirlash faqat "Can edit" rollarga.

## 5. Yangi a'zo qo'shish — tekshiruv ro'yxati

- [ ] GitHub: kerakli rol, CODEOWNERS'ga (core bo'lsa)
- [ ] npm: org'ga taklif, `developers` jamoasi (faqat reliz qilsa)
- [ ] Figma: fayl yoki jamoaga taklif, rol jadvaldagidek
- [ ] `CONTRIBUTING.md` va `CLAUDE.md` bilan tanishtirish

Chiqib ketganda — xuddi shu uch joydan olib tashlang va u ko'rgan tokenlarni almashtiring.
