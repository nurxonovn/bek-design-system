# Grain gradient

Figma: **2.6 Backgrounds · Grain gradient** — sekin siljiydigan yumshoq rang dog'lari va ustida mayda donadorlik. Kursor effekti yo'q — uzun o'qish sahifalari va muqovalar uchun eng tinch fon. `tone`: `neutral` · `brand`; `intensity`: `subtle` · `default` · `intense`.

```tsx
import { GrainGradient } from '@bek-ui/backgrounds';

<header style={{ position: 'relative', minHeight: 420 }}>
  <GrainGradient tone="brand" />
  <h1 style={{ position: 'relative' }}>Yangi kurslar</h1>
</header>

<GrainGradient blobs={['accent/soft', 'gradient/brand-end', 'fill/strong']} grain={0.2} />
```

## Ton va tokenlar

| Rol          | Neutral                                            | Brand                  |
| ------------ | -------------------------------------------------- | ---------------------- |
| Fon          | `bg/base`                                          | `bg/base`              |
| Dog' 1       | `fill/soft-pressed`                                | `gradient/brand-start` |
| Dog' 2       | `accent/soft`                                      | `gradient/brand-end`   |
| Dog' 3       | `fill/strong`                                      | `accent/default`       |
| Dog' 4 (.55) | `accent/default`                                   | `brand/logo-solid`     |
| Donadorlik   | `static/dark` (Figma Noise — tokenga bog'lanmaydi) | ←                      |

Dog' ranglari mavzu bilan almashadi; donadorlik bir xil qoladi.

## Prop'lar

| Prop        | Figma     | Qiymat                               | Standart                      |
| ----------- | --------- | ------------------------------------ | ----------------------------- |
| `tone`      | Tone      | `neutral` · `brand`                  | `neutral`                     |
| `intensity` | Intensity | `subtle` · `default` · `intense`     | `default`                     |
| `speed`     | kod       | ×                                    | 1 (sikl 20–40 s)              |
| `grain`     | kod       | 0–1                                  | `intensity` (.18 · .28 · .40) |
| `blobs`     | kod       | token nomlari / CSS ranglar ro'yxati | ton bo'yicha 4 ta             |
| `fps`       | BGR-04    | kadr/s                               | 30                            |

Intensity — dog'lar shaffofligi: Subtle .35, Default .6, Intense .9 (faqat muqova). Dog'lar Figma'dagi to'rt ellips (blur 110) geometriyasidan; konteyner o'lchamiga moslashadi, chetlari kesiladi.

## Qoidalar

- BGR-01 … BGR-06 (Matrix rain README): bezak, kontrast, `prefers-reduced-motion` → statik kadr, 30 fps + pauza, ekranda bitta fon.
- Katta sarlavhalar ortida yaxshi: matn bilan raqobat qiladigan mayda detal yo'q.
- Donadorlik keng gradientlardagi «banding»ni yashiradi — o'chirmang.
- Intense'ni oddiy matn ortida ishlatmang — dog'lar kontrastni tushiradi (BGR-02).
- Figma'da donadorlik — Noise effekti (multitone, 1.2); kodda — qurilma pikselidagi takrorlanuvchi shovqin plitkasi (canvas).
