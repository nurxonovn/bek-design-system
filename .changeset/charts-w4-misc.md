---
'@bek-ui/charts': minor
---

Figma 4.18 Chart va 4.19 Diagram — yangi komponentlar va yangilanishlar.

- Yangi `Gantt` (4.18 Chart · Gantt): vazifa barlari, jamoa ranglari, milestone, bugun chizig'i, `dependsOn` bog'liqliklari; `variant`: `default` · `progress` (reja 0.28 + bajarilgan qism, % bar tashqarisida, muddati o'tgan — `dataviz/negative` kontur). Barlar `listbox` variantlari (↑ / ↓ / Home / End), tooltip, `onTaskClick`, ko'rinmas jadval; joylashuv foizlarda — RTL'da o'zi teskari.
- Yangi `NumberTicker` va `Countdown` (4.18 Chart · Number ticker): faqat o'zgargan raqam aylanadi (`prefers-reduced-motion` da aylanmaydi), yakuniy qiymat doim ko'rinmas matnda, `live` (`polite` · `assertive` · `off`) va `announceInterval` (standart daqiqada bir marta); Countdown — `bg/sheet` birliklar, matnli ekvivalent, tab yashirin bo'lsa to'xtaydi, `countdownParts`.
- Yangi `DataExplorer` (4.18 Chart · Data explorer): saralanadigan `<table>` (`aria-sort`) ichida `Sparkline`, ulush chizig'i va `Delta`; `variant`: `default` · `compact`.
- `MindMap`: `MindMapNode.collapsed` — Tree'da barglar o'rniga "+n"; hover shox qolganlarini 0.3 ga so'ndiradi; Figma doc yangilandi (ildiz namunasi "BEK launch").
- `ChartCard`: `actions` sloti (eksport menyusi), holat o'zgarishi `role="status"` bilan e'lon qilinadi (`loadingLabel`); sarlavha qatori oralig'i `scale/16` (Figma doc).
- `GeneratedChart`: karta nomi "AI-generated chart: <title>" (`aiLabel`); sarlavha qatori oralig'i `scale/6` (Figma doc).
