# User journey map

Figma: **4.19 Diagram · User journey map** — bir persona yo'li: bosqichlar bo'yicha harakat, aloqa nuqtalari, emotsiya chizig'i, og'riq va imkoniyatlar. `layout`: `default` · `compact`.

```tsx
<JourneyMap
  label="Talaba yo'li: 4 bosqich, eng og'ir — birinchi to'lov"
  stages={[
    { name: 'Discover', action: 'Sees a course ad in a Telegram channel', touchpoints: ['Telegram', 'Landing'], emotion: { score: 1, label: 'Positive' }, opportunity: 'Show the price in the ad' },
    { name: 'First payment', action: 'Pays for the first course by card', touchpoints: ['App', 'Payme'], emotion: { score: -1, label: 'Frustrated' }, pain: 'Card check fails twice', opportunity: 'Save cards, retry inline' },
  ]}
/>
<JourneyMap layout="compact" label="…" stages={stages} />
```

- **Qachon:** product discovery va workshoplar, dizayn · marketing · support'ni foydalanuvchi qiynaladigan joy bo'yicha kelishtirish. 3–6 bosqich.
- **Tarkib:** bosqich sarlavhasi Label/M (raqam `categorical/01`), harakat — `surface/card` katak, aloqa nuqtalari — pill chip, emotsiya — `categorical/01` chiziq + `positive` / `neutral` / `negative` nuqta va so'z, og'riq — `negative` nuqta, imkoniyat — `positive` nuqta. Bo'sh katak — "—" (`text/tertiary`), hech qachon bo'sh quti emas.
- **Qoidalar:** emotsiya bali −2…+2, so'z majburiy (rang yagona belgi emas, CMP-07); tor ekranda `compact` (eni `scale/360`), keng ekran va printda `default` (eni `scale/720`, kerak bo'lsa gorizontal scroll).
- **A11y:** `figure` + `aria-label` xulosasi; matnlar haqiqiy matn, emotsiya so'z bilan; Compact — tartiblangan ro'yxat (`ol`).
- **O'lchamlar:** padding `scale/16` (Compact `scale/12`), gap `scale/8`, emotsiya qatori balandligi `scale/48`, chiziq `chart/line/stroke`, bazaviy chiziq `chart/grid/stroke`.
