# EmptyState

Figma: **5.3 Empty state**. Bo'sh ro'yxat, natija yo'q yoki oflayn holat.

```tsx
import { EmptyState } from '@bek-ui/react';

<EmptyState
  size="m"
  media={<img src={mascotSleepy} alt="" />}
  title="Nothing here yet"
  description="When you add something, it will appear here."
  primaryAction={{ label: 'Add item', onClick: add }}
  secondaryAction={{ label: 'Learn more' }}
/>;
```

| Prop              | Qiymatlar                                               | Default |
| ----------------- | ------------------------------------------------------- | ------- |
| `size`            | `s` karta ichida · `m` sahifa bo'limi · `l` butun ekran | `m`     |
| `media`           | maskot/illyustratsiya: s 64 · m 96 · l 200 px           | —       |
| `title`           | s Title/M · m Headline/S · l Headline/M                 | —       |
| `description`     | s Body/S · m/l Body/M, `text/secondary`                 | —       |
| `primaryAction`   | `{ label, onClick }` — `action` tugma (s: M, m/l: L)    | —       |
| `secondaryAction` | `{ label, onClick }` — `outline` tugma                  | —       |

- Kenglik: s 320 · m 440 · l 560; padding 16 / 24 / 32; gap 16.
- Maskot (2.3) litsenziyali asset — paketga kiritilmagan, `media` orqali bering. Pose: `sleepy` — bo'sh, `dizzy` — xato/oflayn, `success` — yakun. Dark rejimda maskotni `neutral/default` yoki `elevated` fon ustiga qo'ymang.

## Do / Don't

- ✅ Bitta qisqa gap va aniq keyingi qadam. ❌ Uzun matn yoki ikkitadan ortiq tugma.
