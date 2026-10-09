# @bek/react

BEK Design System React komponentlari. Uslub — oddiy CSS va `@bek/tokens` o'zgaruvchilari (`--bek-*`); iste'molchidan Tailwind talab qilinmaydi.

- Holatlar (hover, pressed, focus) — CSS (`:hover`, `:active`, `:focus-visible`), prop emas.
- RTL — `dir="rtl"` va CSS logical properties.
- Accessibility asosi — Radix primitives.

## Ishlatish

```tsx
import '@bek/tokens/tokens.css';
import '@bek/react/styles.css';
import { Badge, BekLogo, Button, Tag } from '@bek/react';
```

## Komponentlar

| Komponent     | Figma sahifasi   | Hujjat                                       |
| ------------- | ---------------- | -------------------------------------------- |
| `Button`      | 3.1 Button       | [README](src/components/button/README.md)    |
| `Avatar`      | 4.1 Avatar       | [README](src/components/avatar/README.md)    |
| `Card`        | 4.3 Card         | [README](src/components/card/README.md)      |
| `ListItem`    | 4.4 List item    | [README](src/components/list-item/README.md) |
| `ProgressBar` | 4.6 Progress     | [README](src/components/progress/README.md)  |
| `BekLogo`     | 2.2 Logo & Brand | [README](src/components/logo/README.md)      |
| `Badge`       | 4.2 Badge        | [README](src/components/badge/README.md)     |
| `Tag`         | 4.2 Badge        | [README](src/components/tag/README.md)       |

Har komponent `src/components/<nom>/` ichida: `.tsx`, `.css`, `README.md`. CSS fayllar build paytida `dist/styles.css` ga yig'iladi.
