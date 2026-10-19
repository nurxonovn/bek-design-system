# AI insight

Figma: **4.18 Chart · AI insight** — chart haqida model yozgan jumla; doim sparkles belgisi va `dataviz/ai/*` ranglari bilan. `variant`: `inline` · `callout`.

```tsx
<figure className="bek-chart">
  <LineChart … label="Revenue, last 7 days" />
  <ChartInsight text="Sales dropped 34% on Tuesday after the price change" />
</figure>

<ChartInsight variant="callout" text="Revenue grew 34% since January" />
<ChartInsight loading text="" />
```

- **Qachon:** model ma'lumotni xulosalagan yoki o'zgarish sababini topgan. `inline` — chart ostida bir qator; `callout` — plotdagi joyga ishora qiluvchi karta (Elevation/2). Odam yozgan doimiy izoh uchun emas — subtitle ishlating.
- **Kodlash:** `text` ← model chiqishi, `variant` ← joylashuv. Bir chartga bitta insight, ko'pi bilan 2 qator; avval topilma, keyin sabab. Faqat ma'lumot tasdiqlaydigan narsani yozing va manba qatorlariga havola bering.
- **Interaksiya:** "Generating" — `loading` (1 qatorli `Skeleton`, `aria-busy`); kengaytirish va "Was this helpful?" — ota komponent (`children` emas, alohida tugma).
- **A11y:** `role="note"`; inline matn oldidan ko'rinmas "AI insight:" (`srPrefix`), callout'da ko'rinadigan sarlavha (`title`). Belgi `aria-hidden`. `dataviz/ai/soft` ustida matn ≥ 4,5:1.
- **O'lchamlar:** inline padding `scale/6` × `scale/12`, gap `scale/8`; callout padding `scale/12`, eni ≤ `scale/320`; radius `radius/surface/sm`. Matn: inline Label/S · `text/utility`; callout sarlavha Label/S · `text/utility`, matn Body/S · `text/primary`.
- Ishonch past bo'lsa — Chart/Confidence meter bilan birga. AI belgisini olib tashlamang.
