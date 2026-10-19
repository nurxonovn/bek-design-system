# Diagram node

Figma: **4.19 Diagram · Node** — oqim diagrammasi tuguni (jarayon xaritasi, bank workflow, onboarding). `variant`: `process` · `terminal` · `note` · `subprocess` · `decision` · `data`.

```tsx
<DiagramNode variant="terminal" label="Start" />
<DiagramNode label="Check documents" highlighted />
<DiagramNode variant="decision" label="Approved?" />
```

Katta diagrammada (Mind map, Swimlane, Journey map) tugunlar HTML qatlamida absolyut joylashadi, strelkalar ostidagi `<svg>` da `DiagramConnector` bilan:

```tsx
const { width, height } = diagramNodeSize('decision'); // 160 × 80
<div style={{ position: 'relative' }}>
  <svg width={480} height={200} aria-hidden="true">
    <DiagramConnector from={{ x: 160, y: 28 }} to={{ x: 192, y: 28 }} />
  </svg>
  <DiagramNode style={{ position: 'absolute', left: 0, top: 0 }} variant="terminal" label="Start" />
</div>;
```

- **Qachon:** qarorli jarayonni hujjatlash (kredit tasdiqlash, KYC, qaytarish), mahsulot oqimini tushuntirish. Jonli avtomatlashtirish qadamlari uchun — `AgentNode`.
- **Kodlash:** shakl ← qadam turi: Process — `surface/card` + Elevation/1, Terminal — `fill/inverse` pill, Note — `status/warning/soft`, Subprocess — ichki yon chiziqlar (`border/strong`), Decision — `accent/soft` romb, Data — `status/info/soft` parallelogram. Label/M markazda, ko'pi bilan 2 qator.
- **Qoidalar:** 8 pt grid, tugunlar orasi kamida `scale/32` (`DIAGRAM_NODE_GAP`); oqim yo chapdan o'ngga, yo yuqoridan pastga — bitta diagrammada ikkalasi emas; bitta boshlanish Terminal, har tugashga bittadan; Decision'da doim ikkita yorliqli chiqish; bitta diagrammada ko'pi bilan 4 rang.
- **Interaksiya:** hujjatlarda statik. `highlighted` — walkthrough'dagi joriy qadam (`border/accent`, 2 px). Canvas muharrirlarida tanlash — `tabIndex={0}` bering, fokus halqasi (`bek-focus-ring`) chiqadi.
- **A11y:** diagramma yonida oqimni tartiblangan ro'yxat (`<ol>`) sifatida bering; romb va parallelogram foni `aria-hidden` SVG.
- **O'lchamlar:** eni `scale/160`, balandligi `scale/56` (Decision — `scale/80`), padding `scale/8` / `scale/16`, radius `radius/surface/sm`. Joylashuv uchun `diagramNodeSize(variant)`, `DIAGRAM_NODE_WIDTH`, `DIAGRAM_NODE_HEIGHT`, `DIAGRAM_DECISION_HEIGHT`.
