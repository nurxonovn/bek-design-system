# Swimlane

Figma: **4.19 Diagram · Swimlane** — bir necha ishtirokchi (odam, tizim, AI agent) o'rtasidagi jarayon. `direction`: `horizontal` · `vertical`.

```tsx
<Swimlane
  label="Kredit arizasi: 4 ishtirokchi, 7 qadam, 1 qaror"
  lanes={['Client', 'App', 'AI agent', 'Backoffice']}
  steps={[
    { id: 'apply', lane: 'Client', column: 0, shape: 'terminal', label: 'Apply for loan' },
    { id: 'validate', lane: 'App', column: 1, label: 'Validate form' },
    { id: 'score', lane: 'AI agent', column: 2, label: 'Score risk' },
    { id: 'approve', lane: 'Backoffice', column: 2, shape: 'decision', label: 'Approve?' },
    { id: 'offer', lane: 'App', column: 3, label: 'Show offer' },
    { id: 'decline', lane: 'Backoffice', column: 4, label: 'Explain decline' },
  ]}
  edges={[
    { from: 'apply', to: 'validate' },
    { from: 'validate', to: 'score' },
    { from: 'score', to: 'approve' },
    { from: 'approve', to: 'offer', label: 'Yes' },
    { from: 'approve', to: 'decline', label: 'No' },
  ]}
/>
<Swimlane direction="vertical" … />
```

- **Qachon:** qadamlar odamlar, tizimlar va AI agentlar o'rtasida o'tadigan jarayonlar (kredit tasdiqlash, onboarding, support) — kim nimaga javobgar va qayerda kutish/qaror bor. 2–6 yo'lak, ≤ 12 qadam.
- **Tarkib:** canvas `bg/sheet`, yo'lak nomi Label/M · `text/secondary`, ajratgich `border/hairline`; qadam — `DiagramNode` (Terminal · Process · Decision); bog'lanish — ortogonal `DiagramConnector`, qaror tarmog'i Yes / No pill bilan, ixtiyoriy yo'l — `dashed`.
- **Qoidalar:** `column` — oqimdagi o'rin; keyingi ustunga o'tish elbow bilan, bir ustundagi yo'laklar orasi — to'g'ri chiziq. Horizontal web, slayd va print uchun, Vertical tor ekran uchun. Canvas cho'zilmaydi — joy yetmasa gorizontal scroll.
- **A11y:** canvas `role="img"` + `label`; ekran o'quvchi uchun yo'laklar bo'yicha qadamlar va barcha bog'lanishlar ro'yxati (`bek-chart__sr`). Noma'lum yo'lak yoki qadam — xato bilan to'xtaydi.
- **O'lchamlar:** tugun 160 × 56 (Decision 80), qadamlar qadami 192 (`scale/160` + `DIAGRAM_NODE_GAP`), yo'lak 96, nom ustuni 112, chekka `scale/8`.
