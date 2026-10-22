# Tag

Figma: **4.2 Badge → Tag**. Metama'lumot yorlig'i (kategoriya, mavzu). Badge'dan farqi: holat emas, ma'lumot; shakli — yumaloq burchakli to'rtburchak (`radius/control/md`).

```tsx
import { Tag } from '@bek-ui/react';

<Tag>Design</Tag>                                     // subtle · neutral · s
<Tag variant="outline" color="utility" size="m">Beta</Tag>
```

| Prop      | Qiymatlar                                                                    | Default   |
| --------- | ---------------------------------------------------------------------------- | --------- |
| `variant` | `subtle` · `outline`                                                         | `subtle`  |
| `color`   | `neutral` · `accent` · `success` · `warning` · `danger` · `info` · `utility` | `neutral` |
| `size`    | `s` 20 · `m` 24 px                                                           | `s`       |
| `icon`    | `ReactNode` — s 12 px, m 16 px                                               | —         |

Shrift Caption/M; ranglar Badge bilan bir xil ohang tokenlaridan (`src/styles/tone.css`).
