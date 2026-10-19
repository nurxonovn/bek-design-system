# Org card

Figma: **4.19 Diagram · Org card** — tashkiliy tuzilma va tasdiqlash zanjirlari uchun shaxs tuguni. `variant`: `default` · `collapsed` (`collapsed` prop).

```tsx
<OrgCard name="Dilnoza Nazarova" role="Head of Retail" team="Retail banking" />
<OrgCard name="Dilnoza Nazarova" role="Head of Retail" team="Retail banking" reports={12} collapsed />
// client fayl ichida — shoxni ochish/yig'ish:
<OrgCard name="Dilnoza Nazarova" reports={12} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} nodeRole="treeitem" />
```

- **Qachon:** tashkiliy tuzilma, hisobot chiziqlari, bank workflow'lardagi tasdiqlash zanjirlari. Foydalanuvchilar ro'yxati uchun emas — 4.4 List item.
- **Tarkib:** 4.1 `Avatar` Size M (`avatar` — rasm, bo'lmasa bosh harflar), `name` Label/M, `role` Caption/M · `text/secondary`, `team` Caption/S · `text/tertiary`; Collapsed — 4.2 `Badge` "+12" (`reports`).
- **Qoidalar:** ota yuqorida, bolalar pastda, `DiagramConnector` (`variant="elbow" direction="vertical"`); 2 darajadan chuqur shoxlar standart holda yig'ilgan; ism bir qatorda qisqaradi, to'liq ism tooltip'da (`title`).
- **Interaksiya:** `onToggle` berilsa Badge tugmaga aylanadi (`aria-expanded`), `selected` — `border/accent` halqa (tafsilotlar paneli ochiq). Profilni ochish — ota komponent `onClick` orqali.
- **A11y:** org chart `role="tree"`; har kartaga `nodeRole="treeitem"` — `aria-expanded` (bo'ysunuvchilar bo'lsa) va `aria-selected` avtomatik. `role` prop'i lavozim matni, shuning uchun ARIA roli — `nodeRole`.
- **O'lchamlar:** eni `scale/280`, padding va gap `scale/12`, matn orasi `scale/2`, radius `radius/surface/md`, Elevation/1.
