# Ridgeline chart

Figma: **4.18 Chart · Ridgeline** — tartibli guruhlar bo'yicha bir oz ustma-ust tushgan zichlik egri chiziqlari; taqsimot vaqt bo'yicha qanday siljiganini ko'rsatadi. `variant`: `default` · `highlight`.

```tsx
<RidgelineChart
  highlight="Jun"
  data={[
    { group: 'Jan', values: deliveryMinutes.jan },
    { group: 'Feb', values: deliveryMinutes.feb },
    { group: 'Jun', values: deliveryMinutes.jun },
  ]}
  domain={[0, 60]}
  label="Delivery time shifted from 35 to 20 minutes by June"
/>
```

- **Qachon:** vaqt bo'yicha siljish (oy bo'yicha yetkazish vaqti, reliz bo'yicha sessiya uzunligi); 4–12 tartibli guruh, har guruhga bitta zichlik. `highlight` — bitta guruh (shu oy) kulrang tarix fonida.
- **Kodlash:** y ← tartibli guruh (ustma-ust tushuvchi qator), x ← qiymat (hammaga bitta shkala), qator balandligi ← yadro zichligi (hammaga bitta `bandwidth`). Maydon `dataviz/categorical/01` qatlam shaffofligi 0,28, chiziq `chart/line/stroke`; rang faqat ajratish uchun — `highlight` da qolganlari `dataviz/neutral`, maydon 0,16.
- **Qoidalar:** tartib ma'noli bo'lsin (vaqt yoki rang; alifbo emas). Ustma-ust tushish cho'qqi balandligining ≤ 50% (`overlap`, 0…0,5). Ko'pi bilan 12 qator — undan ko'p bo'lsa Horizon yoki heatmap. Har qator ostida knockout qatlami (`surface/card`) — Light va Dark'da egri chiziq toza. n < 20 — chiziq shtrix, tooltip «low sample».
- **Interaksiya:** qator ustida hover — qolganlari xiralashadi, `<title>` n, mediana va P90 ni aytadi. Yorliqni bosib ajratish — ota komponent `highlight` ni boshqaradi. Yuklanish — Chart/Card Loading.
- **A11y:** `role="img"` + `label`; ko'rinmas jadval har guruh uchun n, mediana, P90. Ajratilgan guruh rang bilan birga yozuv qalinligi bilan ham belgilanadi.
- **O'lchamlar:** chizma `scale/480` × `scale/200`. Guruh nomi Caption/M · `text/secondary` qator asos chizig'ida, o'q yozuvi Caption/S · `dataviz/label`, grid `dataviz/grid`, o'q `dataviz/axis`.
