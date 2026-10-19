# Agent node

Figma: **4.19 Diagram · Agent node** — avtomatlashtirish yoki AI-agent oqimining bitta qadami va uning jonli holati. `status`: `idle` · `running` · `success` · `error`.

```tsx
<AgentNode title="Summarize with AI" type="LLM step" meta="Waiting for input" />
<AgentNode title="Summarize with AI" type="LLM step" status="running" meta="Processing 12 of 40 items" />
<AgentNode title="Summarize with AI" type="LLM step" status="success" meta="1,4 s · 40 items" />
<AgentNode title="Summarize with AI" type="LLM step" status="error" meta="Rate limit — retry in 30 s" href="/steps/summarize" />
```

- **Qachon:** workflow canvas'lar (n8n uslubi), BEK AI agent builder — run qayerdaligi va qaysi qadam yiqilganini ko'rsatish. Statik jarayon hujjati uchun — `DiagramNode`.
- **Tarkib:** ikonka plitkasi 32 × 32 `dataviz/ai/soft` (`icon` — glyph almashtiriladi), `title` Label/M, `type` Caption/S · `text/tertiary`, holat — 4.2 `Badge` Subtle nuqta bilan (Running'da `Spinner`), `meta` Caption/M, portlar vertikal markazda (`ports`).
- **Holat — ma'lumot, hover emas:** Idle — kirishni kutmoqda; Running — `border/accent` halqa + progress matni; Success — "Done" + davomiylik; Error — `border/danger` halqa, `meta` `text/danger` da sabab va keyingi qadam. Badge matnini `statusLabel` bilan o'zgartirish mumkin.
- **Qoidalar:** Title qadam nima qilishini aytadi ("Summarize with AI"), Type — turini (LLM step, HTTP, Filter); Error doim sabab va keyingi harakatni yozadi; portlarni `DiagramConnector` bilan ulang — bitta kirish chapda, chiqishlar o'ngda.
- **Interaksiya:** `href` — bosilganda qadam sozlamalari (butun tugun havola, hover `fill/soft-hover`, fokus halqasi).
- **A11y:** holat badge'i `role="status"` ichida — o'zgarsa e'lon qilinadi ("Running"); spinner o'zi jim (`label={null}`).
- **O'lchamlar:** eni `scale/280`, padding `scale/12`, gap `scale/8`, radius `radius/surface/md`, Elevation/1; RTL'da portlar logical xususiyatlar bilan almashadi.
