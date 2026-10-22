# Scrub field

Figma: **3.21 Scrub field** — maydon bo'ylab gorizontal sudrab o'zgartiriladigan son yoki bosib aniq qiymat kiritiladigan maydon. Sozlamalar paneli, muharrir va tool UI uchun — ko'p qiymat zich ustunda turadigan joylar. `size`: `xs` · `s` · `m` · `l` (32 · 36 · 44 · 56, `field/height/*`).

```tsx
const [speed, setSpeed] = useState(1.75);

<ScrubField label="Speed" value={speed} onChange={setSpeed} min={0.25} max={4} step={0.05} unit="×" />
<ScrubField label="Opacity" defaultValue={64} unit="%" size="xs" />
<ScrubField label="Radius" defaultValue={122} max={400} unit="px" showTrack={false} />
```

Anatomiya: konteyner (fill/soft) · track (neytral, kengligi `(value − min) / (max − min)`) · handle (track oxirida 2 px chiziq) · label (qisqaradi, hech qachon ikki qatorga o'tmaydi) · qiymat (o'ngda, bosilganda tahrirlanadi) · birlik (`unit`, ixtiyoriy).

## Boshqaruv

- **Sudrash** — maydonning istalgan joyida chapga/o'ngga (kursor `ew-resize`, pointer capture). To'liq kenglik ≈ butun `min…max` oralig'i, kamida 1 px = 1 qadam. Shift + sudrash — ×10 qadam, Alt — ×0.1 qadam. RTL'da yo'nalish teskari.
- **Bosish yoki Tab** — kiritish rejimi (Focus: kursor + fokus halqasi). Enter yoki blur saqlaydi, Esc bekor qiladi.
- **Klaviatura** (fokusda): ↑ / ↓ — bir qadam (Shift ×10, Alt ×0.1), PageUp / PageDown — ×10 qadam, Home / End — `min` / `max`. ← / → kiritilayotgan matnda kursorni siljitadi.
- Qiymat doim `min…max` ga qisiladi; kasr xonalari `precision` yoki `step` dan (0.05 → 2 xona).

## Qoidalar (Figma doc)

- Birlikni son yolg'iz noaniq bo'lganda doim ko'rsating (px, %, ms).
- O'lchamlar: XS 32 — faqat Web/Tablet zich panellari (200–320 kenglik); S 36 — header qidiruvi, filtrlar (Button L bilan); M 44 — standart formalar va sozlamalar (Button XL); L 56 — Mobile va touch panellar (Button 2XL). Maydon va yonidagi tugma balandligi bir xil.
- Touch'da gorizontal sudrash sahifa scroll'i bilan to'qnashadi: L o'lchamni oling, tap-to-type'ni qoldiring (`touch-action: pan-y` — vertikal scroll ishlaydi). Miqdor (dona) uchun 3.9 Stepper afzal.
- ControlGroup ichida `size` berilmasa zichlikdan olinadi: `default` → `m`, `compact` → `xs`.

## A11y

Native `<input type="text" inputMode="decimal" role="spinbutton">`: `aria-valuenow` / `aria-valuemin` / `aria-valuemax`, `aria-valuetext` birlik bilan ("1.75 ×"), nom `<label for>` orqali. Bitta Tab to'xtashi. `name` berilsa qiymat formaga matn sifatida yuboriladi. Track va handle `aria-hidden`. `prefers-reduced-motion` da fon o'tishlari o'chadi; track kengligi animatsiyasiz (sudrash darhol aks etadi).
