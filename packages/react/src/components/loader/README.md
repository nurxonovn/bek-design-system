# Loader · PullToRefresh

Figma: **5.7 Loading**.

## Loader

Trek + yoy ko'rinishidagi yuklanish indikatori (Figma "Spinner"). Tugma va input ichidagi kichik
sakkiz nurli belgi — [`Spinner`](../spinner/README.md).

```tsx
import { Loader } from '@bek/react';

<Loader />                          // 24 · default · cheksiz
<Loader size={40} label="Loading orders" />
<Loader tone="on-color" size={16} />
<Loader value={0.6} />              // aniq jarayon, aylanmaydi
```

| Prop    | Qiymatlar                                                 | Default   |
| ------- | --------------------------------------------------------- | --------- |
| `size`  | `16` matn ichida · `24` ro'yxat, tugma · `40` butun ekran | `24`      |
| `tone`  | `default` · `on-color`                                    | `default` |
| `value` | `0–1` — aniq jarayon; berilmasa cheksiz aylanish          | —         |
| `label` | ekran o'quvchi matni; `null` — yashirin                   | `Loading` |

- Tokenlar: trek `fill/soft-hover`, yoy `accent/default`; On color — `fill/on-color-hover` + `static/white`. Halqa 11 % (ichki radius 0.78), yoy 135°, aylanish 800 ms linear.
- A11y: cheksiz — `role="status"`; `value` bilan — `role="progressbar"` va `aria-valuenow`.

## PullToRefresh

Ro'yxat ustidagi 64 px indikator. Ishora (gesture) mantiqi ilovada.

```tsx
<PullToRefresh state={state} progress={distance / 64} />
```

| Prop       | Qiymatlar                         | Default |
| ---------- | --------------------------------- | ------- |
| `state`    | `pull` · `release` · `refreshing` | `pull`  |
| `progress` | `pull` holatida 0–1 (yoy o'sadi)  | `0`     |
| `labels`   | holat matnlari                    | EN      |

- Pull: spinner 40 % shaffof, matn `text/tertiary`; Release (64 px chegarasi) va Refreshing: matn `text/secondary`, Caption/L. Release'da haptik signal bering.

## Do / Don't

- ✅ Butun ekran yuklanishida `size={40}`. ❌ Bitta blokda Loader va Skeleton birga.
