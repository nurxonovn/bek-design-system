# Draw the line

Figma: **4.18 Chart · Draw the line** — interaktiv taxmin: qatorning boshi ko'rsatiladi, o'quvchi davomini chizadi, so'ng haqiqiy chiziq ochiladi va farq chip'da yoziladi. `variant`: `draw` (chizish) · `reveal` (javob darhol ochiq — hisobot, statik namuna).

```tsx
<DrawTheLine
  data={[
    { x: 2019, y: 12 },
    { x: 2020, y: 15 },
    { x: 2021, y: 19 },
    { x: 2022, y: 24 },
    { x: 2023, y: 31 },
    { x: 2024, y: 38 },
    { x: 2025, y: 47 },
    { x: 2026, y: 52 },
  ]}
  revealFrom={2022}
  formatValue={(v) => `${Math.round(v)}k`}
  onReveal={(guess) => saveGuess(guess)}
  label="BEK Academy o'quvchilari 2019–2022; davomini taxmin qiling"
/>
```

- **Qachon:** darslar va tushuntirishlar — o'quvchi javobdan oldin taxminga bog'lansin; kutilmagan trend e'tibor talab qiladigan hisobotlar; mahsulotning o'z ma'lumoti haqida onboarding savollari.
- **Qoidalar:** taxmin zonasidan oldin kamida 3 ma'lum nuqta; taxmin ma'lumotning x qadamlariga yopishadi; "Skip" doim bor — taxmin ixtiyoriy; y shkalasi qat'iy (`yDomain`), taxmindan keyin qayta masshtablanmaydi; y o'qini yashirmang. Farqni so'z va raqam bilan ko'rsating, taxminni baholamang.
- **Holatlar:** Ready — "Draw your guess →" chip (`hint`); Drawing — pero ko'rsatkichga ergashadi, x qadamiga yopishadi (oraliq qadamlar chiziqli to'ldiriladi); Complete — Reveal tugmasi yoqiladi; Revealed — haqiqiy chiziq chizilib chiqadi (reduced motion'da darhol), chip "Actual 52k · you: 40k" (`actualLabel`, `youLabel`); Skipped — taxminsiz ochish.
- **Kodlash:** x = vaqt, y = qiymat; ma'lum qism — `dataviz/categorical/01` yaxlit, taxmin — `dataviz/categorical/02` uzuq (6 4), haqiqiy — 01 yaxlit; taxmin zonasi `dataviz/track`, radius `chart/bar/radius`. Chip — `surface/card` · `text/primary`, Caption/S. Legend — `ChartLegend` (Line · Dashed).
- **A11y:** chizish maydoni — `role="slider"`: ←/→ — x qadami, ↑/↓ — qiymat, Enter — ochish; `aria-valuetext` jonli o'qiydi ("2024: 34k"). Ochilish `role="status"` orqali matn bilan aytiladi; ko'rinmas jadval ochilgandan keyin taxmin ustuni bilan to'ladi (oldin — faqat ma'lum qism). Tugmalar — `Button` (Skip · Reveal).
- **O'lchamlar:** plot `scale/480` × `scale/200`, chiziq `chart/line/stroke`, grid `chart/grid/stroke`; legend oralig'i `chart/legend/gap`.
