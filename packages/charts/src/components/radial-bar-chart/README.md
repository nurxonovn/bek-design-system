# Radial bar chart

Figma: **4.18 Chart · Radial bar** — ixcham progress solishtiruvi: har kategoriya bitta halqa, hammasi bir xil 0–100% shkalada. `variant`: `default` · `progress`.

```tsx
<RadialBarChart
  data={[
    { label: 'Cards', value: 0.82 },
    { label: 'Transfers', value: 0.64 },
    { label: 'Loans', value: 0.47 },
  ]}
  label="Plan completion: Cards 82%, Transfers 64%, Loans 47%"
/>

<RadialBarChart
  variant="progress"
  centerLabel="weekly goal"
  data={[
    { label: 'Move', value: 0.76, color: 'var(--bek-dataviz-categorical-05)' },
    { label: 'Learn', value: 0.58 },
  ]}
  label="Weekly goal 75%"
/>
```

- **Qachon:** kichik joyda 3–4 progress qiymati (maqsadlar, reja bajarilishi). `progress` — 2–3 shaxsiy maqsad halqasi, markazda umumiy qiymat (`centerValue`, standart — o'rtacha). Yaqin qiymatlarni aniq solishtirish uchun emas — Bar.
- **Kodlash:** yoy uzunligi = qiymat (0…1), soat 12 dan soat yo'nalishida; rang = kategoriya (`dataviz/categorical/0i`); trek `dataviz/track`. Birinchi element — tashqi halqa (eng kattasi); tartibni davrlar orasida saqlang. Ko'pi bilan 4 halqa.
- **Interaksiya:** hover — halqa va uning legend qatori ajraladi, qolganlari 40% (CSS, server-safe).
- **A11y:** `role="img"` + `label`; qiymatlar legend'da doim yozilgan, jadval "Cards 82%" ro'yxati.
- **O'lchamlar:** chizma qat'iy kvadrat `scale/200` (`size`) — konteyner kengaysa ham cho'zilmaydi, legend yonida (`scale/200` en) yoki tor ekranda pastida. Markaz: Headline/M · `text/primary` + Caption/M · `text/tertiary`; legend qiymati Label/S · `text/primary`.
