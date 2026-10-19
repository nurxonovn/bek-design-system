# Timeline item

Figma: **4.19 Diagram · Timeline item** — vertikal voqealar tarixi yoki yo'l xaritasi (ariza holati, yetkazib berish, loyiha bosqichlari). `state`: `done` · `current` · `upcoming`.

```tsx
<Timeline aria-label="Application status">
  <TimelineItem title="Application submitted" date="14 Oct, 10:20" dateTime="2026-10-14T10:20" />
  <TimelineItem
    state="current"
    title="Credit check"
    date="Today"
    description="Usually takes up to 2 hours"
  />
  <TimelineItem state="upcoming" title="Card issued" />
</Timeline>
```

- **Qachon:** uzoq jarayon holati ("Credit check — today"), hisob yoki murojaat voqealari tarixi. Raqamlangan wizard uchun — 4.17 Steps.
- **Kodlash:** marker `scale/12` — Done `status/success/default`, Current `accent/default` + `accent/soft` halqa va `text/accent` sana, Upcoming — kontur (`border/strong`) va xira sarlavha; chiziq `scale/2` — Done'da success, qolganlarida `border/default`.
- **Qoidalar:** tarix uchun eng yangisi tepada, jarayon uchun xronologik; aynan bitta Current; oxirgi elementda chiziq yo'q (`Timeline` ichida avtomatik, alohida — `line={false}`); yaqin sanalar nisbiy ("Today"), qolganlari aniq.
- **Interaksiya:** elementlar tafsilot uchun kengayishi mumkin — `description` ga istalgan kontent bering.
- **A11y:** `Timeline` — `<ol>`, element — `<li>`; joriy element `aria-current="step"`; sana `<time dateTime>`.
- **O'lchamlar:** eni `scale/320`, rail–kontent orasi `scale/12`, rail gap/padding `scale/4`, elementlar orasi `scale/20`. Matn: sarlavha Label/M, sana Caption/M, izoh Body/S · `text/secondary`.
