# Slope chart

Figma: **4.18 Chart · Slope** — 3–10 element uchun aynan ikki nuqta orasidagi o'zgarish; uchlaridagi yozuvlar o'q o'rnini bosadi. `variant`: `default` · `highlight`.

```tsx
<SlopeChart
  periods={['2025', '2026']}
  data={[
    { label: 'Cards', from: 42, to: 61 },
    { label: 'Transfers', from: 55, to: 48 },
    { label: 'Loans', from: 30, to: 44 },
  ]}
  highlight="Loans"
  label="Loans 30 → 44, up"
/>
```

- **Qachon:** oldin / keyin, o'tgan yil / bu yil; yo'nalish yo'ldan muhimroq bo'lganda. Ikkidan ortiq davr — Line yoki Bump.
- **Kodlash:** y1 = `from`, y2 = `to` (ikkala tomonda bir xil shkala), rang = o'zgarish ishorasi: o'sish `dataviz/positive`, pasayish `dataviz/negative`, o'zgarishsiz `dataviz/neutral`. `highlight` — bitta element `dataviz/categorical/01` da, qolganlari neytral, qatlam shaffofligi 45% (BND-09), yozuvlar `text/tertiary`.
- **Yozuvlar:** chapda nom + qiymat, o'ngda qiymat; to'qnashsa yozuvlar suriladi, nuqtalar joyida qoladi.
- **Interaksiya:** hover — chiziq ajraladi, `<title>` "Loans 30 → 44, up" deydi.
- **A11y:** `role="img"` + `label`; jadval: element · ikki davr · ishorali o'zgarish.
- **O'lchamlar:** o'qlar orasi qat'iy `scale/200`, balandlik `scale/200` (`height`) — shakl cho'zilmaydi, chizma `width` ichida markazda. O'q `dataviz/axis` · `chart/grid/stroke`, chiziq `chart/line/stroke`. Matn: nom Caption/M · `text/secondary`, qiymat va davr Label/S · `text/primary`.
