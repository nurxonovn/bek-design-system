## What

<!-- One paragraph: what changed and why. Link the issue if there is one. -->

## Figma

<!-- Page / component this mirrors (e.g. 3.17 Uploader). Any accepted differences added to figma.json → accepted[] with a reason? -->

## Checklist

- [ ] `pnpm format` · `pnpm typecheck` · `pnpm build` · `pnpm test` pass
- [ ] `pnpm check:figma -- --strict` — 0 warnings (or differences documented in `figma.json → accepted[]`)
- [ ] Works at Mobile 390 · Tablet 834 · Web 1440, Light and Dark, RTL
- [ ] Keyboard and screen reader checked (`:focus-visible`, labels, roles)
- [ ] Component `README.md` updated (the docs site catalogue is built from it)
- [ ] `pnpm changeset` added for package changes
