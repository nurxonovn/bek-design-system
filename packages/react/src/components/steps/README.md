# Steps

Figma: **4.17 Steps** — foydalanuvchi jarayonning qayerida: buyurtma kuzatuvi, ariza bosqichlari, onboarding, uzun formalar. `orientation`: `vertical` · `horizontal`; qadam `status`: `complete` · `current` · `upcoming` · `error`; `marker`: `dot` · `number` · `icon`. 3.9 Stepper (± son kiritish) bilan adashtirmang.

```tsx
<Steps marker="icon" aria-label="Buyurtma holati">
  <StepsItem status="complete" title="Buyurtma qabul qilindi" meta="10 okt, 09:12" />
  <StepsItem status="complete" title="To'landi" meta="10 okt, 09:13" />
  <StepsItem
    status="current"
    title="Yig'ildi"
    description="Kuryer 15:00 da olib ketadi"
    action={<Button size="m">Kuzatish</Button>}
    meta="Bugun"
  />
  <StepsItem status="upcoming" title="Yo'lda" />
  <StepsItem status="upcoming" title="Yetkazildi" />
</Steps>

<Steps orientation="horizontal" marker="number" aria-label="Rasmiylashtirish">
  <StepsItem status="complete" title="Savat" />
  <StepsItem status="current" title="Yetkazish" caption="10 okt" />
  <StepsItem status="upcoming" title="To'lov" />
  <StepsItem status="upcoming" title="Tayyor" />
</Steps>
```

## API

`Steps` (`<ol>`):

| Prop           | Qiymatlar                                         | Default    |
| -------------- | ------------------------------------------------- | ---------- |
| `orientation`  | `vertical` · `horizontal`                         | `vertical` |
| `marker`       | `dot` · `number` · `icon` — barcha qadamlar uchun | `dot`      |
| `statusLabels` | `{ complete, current, upcoming, error }` matnlari | inglizcha  |

`StepsItem` (`<li>`):

| Prop                       | Figma                                   | Izoh                                                                   |
| -------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `status`                   | Status                                  | default `complete` (Figma bilan bir xil)                               |
| `marker`                   | Marker                                  | `Steps` dagidan ustun                                                  |
| `title`                    | Title                                   | Label/L (vertical) · Label/M (horizontal)                              |
| `description`              | Show description · Description          | faqat vertical; Body/S `text/secondary`                                |
| `action`                   | Show action                             | faqat vertical; `Button` Normal M                                      |
| `meta`                     | Show meta · Meta                        | faqat vertical; Caption/L `text/tertiary` — vaqt, narx, davomiylik     |
| `caption`                  | Show caption · Caption                  | faqat horizontal; Caption/M `text/tertiary`                            |
| `number`                   | Number                                  | default — tartib raqami (1, 2, 3 …)                                    |
| `icon`                     | Marker icon (\_Icon)                    | default — holatga qarab check · info · alert (16 px)                   |
| `lineBefore` · `lineAfter` | Line before · Line after                | `Steps` ichida avtomatik: birinchida "before", oxirgida "after" o'chiq |
| `statusLabel`              | —                                       | ekran o'quvchi uchun holat matni                                       |
| `orientation`              | Steps · Vertical item / Horizontal item | odatda `Steps` dan keladi                                              |

Figma "Count" (3 · 4 · 5) — prop emas: qadamlar soni `children` soniga teng. Figma'dagi `Steps.Item` — koddagi `StepsItem`.

## Qoidalar (Figma doc)

| Status     | Marker                                               | Sarlavha         | Qachon                                            |
| ---------- | ---------------------------------------------------- | ---------------- | ------------------------------------------------- |
| `complete` | `accent/default` · check                             | `text/primary`   | Bajarilgan; undan keyingi chiziq ham accent       |
| `current`  | `accent/default` + 4 px `accent/soft` halqa          | `text/primary`   | **Bir vaqtda faqat bitta**                        |
| `upcoming` | `fill/soft` · `text/secondary` (Dot: `fill/control`) | `text/secondary` | Hali yetib kelinmagan                             |
| `error`    | `status/danger/default` · alert                      | `text/danger`    | To'siq — sababini ayting va keyingi amalni bering |

- Chiziq 2 px: "line before" — qadam `upcoming` bo'lmasa `accent/default`; "line after" — `complete` dan keyin accent, aks holda `border/default`. Birinchi va oxirgi qadamda osilib qolgan chiziq bo'lmaydi.
- Vertical — hamma qurilmada batafsil kuzatuv uchun. Horizontal — 3–5 qisqa qadam (bir-ikki so'z) karta yoki oqim tepasida; Mobile'da ko'pi bilan 4 qadam. Horizontal qadamlar kengligi teng (Figma'da 160; kodda konteyner teng bo'linadi), chiziqlar qo'shnigacha to'ladi; yashirin chiziq joyini saqlaydi — markerlar tekis turadi.
- 5 tadan ko'p qadam bo'lsa hammasini ko'rsatmang — hisoblagich ("3-qadam, jami 8") yoki 4.6 Progress.
- Xato qadam sababini (`description`) va keyingi amalni (`action`) aytsin — sababsiz qizil qadam yo'q.
- O'lchamlar: rail 24 → kontent 12 (`scale/12`), vertical qadamlar orasi — 24 pastki padding (`scale/24`), meta Caption/L.

## A11y

- `<ol>` — tartibli ro'yxat; `aria-label` bering ("Buyurtma holati").
- Joriy qadam `aria-current="step"`. Har qadam sarlavhasi oldida holat matni `.bek-visually-hidden` da ("Completed: …"); lokalizatsiya — `statusLabels` / `statusLabel`.
- Marker va chiziqlar dekorativ (`aria-hidden`) — rang yagona belgi emas.
- Komponent statik (server-safe): bosiladigan qadam kerak bo'lsa `title` ichiga `Link` (3.18) qo'ying, amal uchun `action`.

RTL: `dir="rtl"` da rail o'ngga, meta chapga o'tadi (logical props). Dark — tokenlar orqali.
