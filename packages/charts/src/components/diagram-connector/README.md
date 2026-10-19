# Diagram connector

Figma: **4.19 Diagram · Connector** — ikki diagramma tuguni orasidagi strelka. `variant`: `straight` · `dashed` · `elbow` · `labeled`.

```tsx
<svg width={480} height={120} aria-hidden="true">
  <DiagramConnector from={{ x: 0, y: 20 }} to={{ x: 120, y: 20 }} />
  <DiagramConnector variant="dashed" from={{ x: 0, y: 60 }} to={{ x: 120, y: 60 }} />
  <DiagramConnector variant="elbow" from={{ x: 160, y: 20 }} to={{ x: 280, y: 80 }} />
  <DiagramConnector variant="labeled" label="Yes" from={{ x: 320, y: 60 }} to={{ x: 460, y: 60 }} />
</svg>
```

`DiagramConnector` SVG `<g>` qaytaradi — diagramma `<svg>` (yoki `ChartSvg`) ichida chiziladi. `from` / `to` — SVG koordinatalari (tugun cheti); strelka uchi doim `to` nuqtasida.

- **Prop'lar:** `route` (`straight` | `elbow`) — chiziq yo'li variantdan alohida: `variant="dashed" route="elbow"` — uzuq ortogonal, `variant="labeled" route="elbow"` — yorliqli burilish. `direction` (`horizontal` | `vertical`) — Elbow burilish o'qi (oqim yo'nalishi). `active` — walkthrough'dagi joriy yo'l (`accent/default`).
- **Yordamchi:** `orthogonalPath(from, to, direction)` → SVG `d` (`M0,0H60V48H120`), `orthogonalPoints(...)` → burilish nuqtalari. Mind map, Swimlane, Org chart shu funksiyalar bilan ulanadi.
- **Qachon:** istalgan ikki tugunni bog'lash. Labeled — qaror tarmoqlari (Yes / No); Dashed — ixtiyoriy, async yoki zaxira yo'l.
- **Kodlash:** chiziq `dataviz/label` · `chart/line/stroke`, strelka 8 × 10 `dataviz/label`, yorliq pill `bg/sheet` · Caption/M · `text/secondary`.
- **Qoidalar:** diagonal o'rniga Elbow (gridda burilish); strelka tugunlarni kesib o'tmaydi, kesishishlar minimal; har qaror tarmog'ini yorliqlang — Yes / No ni rang bilan ajratmang.
- **A11y:** chiziqlar ko'rinmaydi ekran o'quvchiga — bog'lanishlarni tartiblangan ro'yxatda yozing ("If approved → Issue card").
- **O'lchamlar:** Figma namunasi uzunligi `scale/128`; o'lcham `from` / `to` dan, strelka uchi doim oxirida.
