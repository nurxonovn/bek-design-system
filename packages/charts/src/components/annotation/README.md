# Annotation

Figma: **4.18 Chart · Annotation** — ma'lumotdagi lahzani tushuntiradi, SVG `<g>` bo'lagi. `variant`: `marker` · `point` · `range`.

```tsx
<svg
  role="img"
  aria-label="Revenue 2026. Annotation: Price change on 1 May"
  width={480}
  height={200}
>
  {/* … chiziq … */}
  <ChartAnnotation x={x('2026-05-01')} text="Price change" note="Tariff +8% from 1 May" />
  <ChartAnnotation variant="point" x={320} y={48} text="Record" />
  <ChartAnnotation variant="range" x={60} x2={140} text="Holiday season" />
</svg>
```

- **Qachon:** ma'lumotdan tashqaridagi voqea o'zgarishni tushuntiradi (narx, kampaniya, uzilish) — `marker`; bitta qiymatga izoh (rekord, maqsadga yetildi) — `point`; davr soyasi (bayram mavsumi, test oynasi) — `range`.
- **Kodlash:** x (va `range` uchun x2) ← voqea sanasi, y ← qiymat (`point`), `text` ← teg, `note` ← to'liq izoh.
- **Qoidalar:** bir chartda ko'pi bilan 3 ta; teg ≤ 24 belgi (`ANNOTATION_MAX_CHARS`, ortig'i `…`), tafsilot `note` ga; oxirgi qiymatni va tushuntirilayotgan chiziqni yopmang. Teg plot chegarasidan (`left` / `right`) chiqmaydi.
- **Interaksiya:** hover — `<title>` to'liq izohni ko'rsatadi; bosib yozuvni ochish yoki Mobile'da raqamli nuqtalar + chart ostidagi ro'yxat — ota komponent.
- **A11y:** chart xulosasida aytilsin: "Annotation: Price change on 1 May"; mustaqil ko'rinishda `label` shu matndan.
- **O'lchamlar:** teg `fill/inverse` pill (`radius/full`, padding `scale/2` × `scale/8`) + Label/S · `text/inverse`; chiziq `dataviz/target` · `chart/grid/stroke`, `marker` uzuq 4/4, tegdan `scale/4` pastda; `point` oyog'i `scale/16` + Chart/Data point Active; `range` soyasi `dataviz/grid`. Plot balandligi `chart/height/md`.
