# Dot field

Figma: **2.6 Backgrounds · Dot field** — kursor atrofida kattalashib yorishadigan nuqtalar to'ri; bosilganda tashqariga halqa yuguradi. 2.5 Pattern · Dots ning animatsiyali juftligi. `tone`: `neutral` · `brand`; `intensity`: `subtle` · `default` · `intense`.

```tsx
import { DotField } from '@bek-ui/backgrounds';

<div style={{ position: 'relative', minHeight: 360 }}>
  <DotField intensity="subtle" />
  <EmptyState title="Hali buyurtma yo'q" />
</div>

<DotField tone="brand" gap={24} radius={200} rippleOnClick={false} />
```

## Ton va tokenlar

| Rol             | Neutral          | Brand                  |
| --------------- | ---------------- | ---------------------- |
| Fon             | `bg/base`        | `bg/base`              |
| Nuqta           | `text/disabled`  | `gradient/brand-start` |
| Issiq nuqta     | `accent/default` | `gradient/brand-end`   |
| Nur (`pointer`) | `accent/default` | `gradient/brand-start` |

Nuqtalar va nur mavzu bilan almashadi (CSS o'zgaruvchilari `--bek-dot-field-*`).

## Prop'lar

| Prop                          | Figma        | Qiymat                                  | Standart                         |
| ----------------------------- | ------------ | --------------------------------------- | -------------------------------- |
| `tone`                        | Tone         | `neutral` · `brand`                     | `neutral`                        |
| `intensity`                   | Intensity    | `subtle` · `default` · `intense`        | `default`                        |
| `pointer`                     | Show pointer | boolean — kursor nuri (260 px, blur 72) | `true`                           |
| `gap` · `dotSize`             | kod          | px                                      | 20 · `intensity` (1.5 · 2 · 2.5) |
| `speed`                       | kod          | ×                                       | 1                                |
| `pointerHighlight` · `radius` | kod          | bool · px                               | `true` · 150                     |
| `rippleOnClick`               | kod          | bool                                    | `true`                           |
| `fps`                         | BGR-04       | kadr/s                                  | 30                               |

Intensity: Subtle — shaffoflik .45, nuqta 1.5 (matn ortida); Default — .7 · 2 (hero); Intense — 1 · 2.5 (bo'sh holat, yuklanish). Kursor zonasida nuqtalar +4 px gacha kattalashadi va issiq rangga o'tadi.

## Qoidalar

- BGR-01 … BGR-06 (Matrix rain README) — bezak (`aria-hidden`, `pointer-events: none`), kontrast, `prefers-reduced-motion` → statik kadr, 30 fps + pauza, ekranda bitta fon, zich kontent ostida emas.
- Eng tinch kursor effekti — bo'sh holat va onboarding kabi mahsulot ekranlarida ham xavfsiz.
- `gap` 16–24 px; kichikroq to'r mobil ekranda bezovta qiladi.
- Sensorli ekranda zona oxirgi teginish joyida qoladi va asta so'nadi.
- Boshqa animatsiyali fon bilan ustma-ust qo'ymang (BGR-05).
