# Accordion

Figma: **4.12 Accordion** — yig'iladigan bo'limlar. `variant`: `plain` (ajratuvchi chiziq) · `card` (`fill/secondary`); `size`: `s` 48 · `m` 56 px.

```tsx
<Accordion>
  <AccordionItem title="Yetkazib berish" description="Toshkent" defaultOpen>
    100 000 soʻmdan bepul.
  </AccordionItem>
  <AccordionItem title="Qaytarish">14 kun ichida.</AccordionItem>
</Accordion>
```

Native `<details>/<summary>`: Enter/Space ochadi, holatni brauzer e'lon qiladi, JS kerak emas. Boshqarish: `open` + `onToggle`. `icon` (Figma "Show leading icon"), `badge`, `disabled`, `divider` (Figma "Show divider"; `false` — `plain` variantda pastki chiziqsiz) qo'llab-quvvatlanadi. Slot — `children`.
