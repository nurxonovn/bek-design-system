# BEK Design System

**An open design system for mobile, tablet and web — Figma library, design tokens, React components, charts and a docs site. Built in Uzbekistan, made for everyone.**

[Figma Community](https://www.figma.com/community/file/1684198240912616154/bek-design-system) · [Docs site](https://nurxonovn.github.io/bek-design-system/) · [Changelog](packages/react/CHANGELOG.md) · [Contributing](CONTRIBUTING.md) · [O'zbekcha](#ozbekcha)

> **Status: v1.0-beta.** The Figma library is v1.0. The code is in public beta — the API may still change before 1.0. We are looking for **core maintainers and contributors** — see [Contributors wanted](#contributors-wanted).

## What's inside

| Package          | What it is                                                                                                    | Figma           |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | --------------- |
| `@bek/tokens`    | Design tokens generated from Figma Variables — CSS custom properties (`--bek-*`), JSON, typography, materials | 1 · Foundations |
| `@bek/react`     | 58 React components, plain CSS on top of tokens, Light/Dark, RTL, keyboard and screen-reader support          | 3–7, 9–10       |
| `@bek/charts`    | 61 chart and diagram components (SVG + d3 modules) — bar, line, sankey, treemap, maps, mind map and more      | 4.18, 4.19      |
| `apps/site`      | Documentation site — foundations, component catalogue generated from component READMEs, tokens, templates     | —               |
| `apps/templates` | Example screens rebuilt from the Figma 8.x templates                                                          | 8 · Templates   |

### Principles

- **Figma is the single source of truth.** Every component in code mirrors a Figma page; `pnpm check:figma` verifies tokens, variants and props against the exported spec (`figma.json`) — 0 warnings in `--strict` mode.
- **Three devices, one component.** Mobile 360–599 · Tablet 600–1023 · Web 1024+. Device-dependent values are token modes, not separate components.
- **Border-free surfaces.** Layers are separated by surface colour and barely-there elevation; borders only for focus, unchecked controls and errors.
- **Tokens only.** No hard-coded colours, sizes or radii in components — everything resolves to `--bek-*`.
- **Accessible by default.** AA contrast (≥ 4.5:1) for all text, `:focus-visible` rings, 24/44/48 px targets, RTL via logical properties.
- **Typeface Inter · accent Indigo · Light and Dark.**

## Quick start

```bash
pnpm add @bek/tokens @bek/react        # charts: pnpm add @bek/charts
```

```tsx
// main.tsx
import '@bek/tokens/tokens.css'; // colours, sizes, fonts — Light/Dark via data-theme="dark"
import '@bek/tokens/typography.css'; // .bek-text-* text styles
import '@bek/react/styles.css'; // component styles

import { Button, Card, TextField } from '@bek/react';

export function Example() {
  return (
    <Card title="Profile" description="Update your details">
      <TextField label="Name" />
      <Button variant="action">Save</Button>
    </Card>
  );
}
```

Requires React 18+. Inter is not bundled — load it from Fontsource, Google Fonts or your own host.

## Development

```bash
corepack enable
pnpm install
pnpm dev            # docs site at http://localhost:5173
pnpm build          # all packages
pnpm test           # unit tests
pnpm check:figma    # Figma ↔ code parity (add -- --strict to fail on warnings)
```

Node 22 (`.nvmrc`), pnpm 10, Turborepo. CI runs format · typecheck · build · test · check:figma on every PR.

## Contributors wanted

BEK is built in public by one designer with AI assistance (see below). To grow it into a community project we need:

- **Core maintainers** for `@bek/react` and `@bek/charts` — review PRs, own releases, keep Figma ↔ code parity.
- **Contributors** — pick a [`good first issue`](https://github.com/nurxonovn/bek-design-system/labels/good%20first%20issue), add a component from a Figma page, improve accessibility, write tests.
- **Designers** — use the Figma library and report what breaks.

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Questions go to [Discussions](https://github.com/nurxonovn/bek-design-system/discussions).

## Built with AI

The Figma file and this codebase are developed by [Nurbek Nurxonov](https://github.com/nurxonovn) together with Claude (Anthropic): the design decisions, standards and reviews are human; much of the component code, documentation and parity tooling is AI-generated under those standards and checked by CI. The `.claude/` folder holds the agent instructions, skills and rules that make this repeatable — fork it if you want the same workflow.

## Roadmap

- **1.0-beta (now)** — tokens, 58 components, 61 charts, docs site, Figma parity checks.
- **1.0** — API freeze, full component catalogue on the site, npm release.
- **Next** — UX patterns section, more templates, native (Compose / SwiftUI) token packages.

See the public [roadmap](https://github.com/nurxonovn/bek-design-system/projects) and the weekly changelog in the Figma file (02 · Changelog).

## Licence

- **Code** — [MIT](LICENSE).
- **Figma file** — Figma Community licence (CC BY 4.0).
- **Logo, brand mark, mascot poses, 3D renders, icon set** — not covered by MIT; see [LICENSE-ASSETS.md](LICENSE-ASSETS.md).

## Support

BEK is free. If it saves you time, support it from the **03 · Support us** page in the Figma file.

---

## O'zbekcha

**BEK Design System** — mobil, planshet va veb uchun ochiq dizayn tizimi: Figma kutubxonasi, tokenlar, React komponentlari, chartlar va hujjat sayti. O'zbekistonda qurilgan, hamma uchun.

- **Holat:** Figma — v1.0, kod — **v1.0-beta** (API hali o'zgarishi mumkin).
- **Paketlar:** `@bek/tokens` (Figma Variables → CSS/JSON), `@bek/react` (58 komponent), `@bek/charts` (61 chart va diagramma), `apps/site` (hujjat sayti), `apps/templates` (8.x namuna ekranlar).
- **Tamoyillar:** Figma — yagona manba; 3 qurilma (Mobile 390 · Tablet 834 · Web 1440); chegarasiz sirtlar; faqat tokenlar; AA kontrast va klaviatura.
- **Ishga tushirish:** `corepack enable && pnpm install && pnpm dev`.
- **Hissa qo'shish:** [CONTRIBUTING.md](CONTRIBUTING.md). Core maintainer va dasturchilar qidiryapmiz — `good first issue` belgili masalalardan boshlang.
- **Litsenziya:** kod MIT; Figma fayli CC BY 4.0; logo, maskot, 3D va ikonka to'plami — [LICENSE-ASSETS.md](LICENSE-ASSETS.md).
- **Qo'llab-quvvatlash:** Figma faylidagi **03 · Support us** sahifasi.

Claude Code bilan ishlash: `CLAUDE.md` — loyiha yo'riqnomasi; `.claude/` ichida agentlar, komandalar (`/new-component`, `/figma-sync`, `/parity`, `/release`) va qoidalar.
