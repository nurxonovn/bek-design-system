# SelectorCard

Figma: **3.16 Selector card** — izohli katta tanlov: tarif, yetkazib berish usuli, to'lov turi, onboarding maqsadi. Butun karta bosiladi; indikator tanlov modelini ko'rsatadi. `control`: `radio` · `checkbox` · `switch`; `media`: `none` · `icon` · `image-start` · `image-top`. Kartalar `SelectorGroup` (`orientation`: `vertical` · `horizontal`) bilan Fieldset ichida guruhlanadi.

```tsx
<Fieldset label="Yetkazib berish usuli" status="error" message="Yetkazib berish usulini tanlang">
  <SelectorGroup name="delivery" error>
    <SelectorCard
      value="courier"
      icon={<FlashGlyph />}
      title="Kuryer"
      description="Toshkent bo'ylab 2 soat ichida"
      meta="15 000 so'm"
    />
    <SelectorCard value="pickup" icon={<UserGlyph />} title="Topshirish punkti" description="Ertaga tayyor" meta="Bepul" />
  </SelectorGroup>
</Fieldset>

<SelectorCard control="switch" title="Buyurtma holati" description="Push va SMS" defaultChecked />
```

Prop'lar (Figma → kod):

| Figma                                     | React                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| Title                                     | `title` (Title/S · text/primary)                                       |
| Show description · Description            | `description` (Body/S · text/secondary)                                |
| Show meta · Meta                          | `meta` (Label/M — narx yoki muddat)                                    |
| Media                                     | `media` + `icon` / `image`                                             |
| Control                                   | `control`                                                              |
| State=Error                               | `error` (`aria-invalid`)                                               |
| State=Selected · Hover · Focus · Disabled | `checked`/`defaultChecked`, CSS `:hover`, `:focus-visible`, `disabled` |
| Direction                                 | `dir="rtl"` (logical properties)                                       |
| Selector group · Orientation              | `SelectorGroup orientation`                                            |

`media` berilmasa: `icon` → `icon`, `image` → `image-start`, aks holda `none`. Qolgan atributlar (`name`, `value`, `checked`, `onChange`, `required`, `ref` …) ichidagi native input'ga uzatiladi; `className`/`style` — karta ildiziga.

Qoidalar (Figma doc):

- Indikator modelni aytadi: **Radio** — ko'pdan bittasi; **Checkbox** — ko'pdan istalgancha; **Switch** — har karta alohida yoqiladi/o'chiriladi.
- Guruhda **2–4 karta**. 4 tadan ko'p bo'lsa — Select yoki Radio ro'yxati. Izohsiz 2–4 qisqa variant — Segmented control (3.10).
- Bitta guruhda media turi va indikator bir xil — aralash indikator "bitta tanlovmi yoki bir nechta?" degan savol tug'diradi.
- Qisqa sarlavha va bir qator izoh. Karta ichida paragraf yozmang — tafsilotni Tooltip yoki havolaga oling.
- Joylashuv: Mobile va Tablet'da `vertical`; Web'da har karta kamida 240 px sig'sa `horizontal` (sig'masa keyingi qatorga o'tadi).
- Error: karta `border/danger` 2 px; xabar kartada emas — guruh atrofidagi Fieldset'da (`status="error"`, "Yetkazib berish usulini tanlang"). `SelectorGroup error` hamma kartalarga uzatadi.
- Statik kontent kartasi uchun Card (4.3) ishlating.

Anatomiya va o'lchamlar: konteyner `surface/card` → `accent/soft` (tanlanganda), `radius/surface/md`, padding `scale/16`, gap `scale/12`; media Icon 40 (`accent/soft` doira, ikonka 20 `text/accent`; tanlanganda doira `surface/card`), Image start 64 (`radius/surface/sm`), Image top 140 balandlik (padding faqat pastki qismda); matnlar orasida `scale/4`; indikator M o'lchamda, oxirgi chetda, birinchi qator balandligida. Hover — `fill/soft-hover` qatlami (faqat Web). Guruh gap `scale/12`.

A11y:

- Har karta — native `<input type="radio|checkbox">` (Switch'da `role="switch"`); nomi `aria-labelledby` → sarlavha, izoh va meta `aria-describedby` orqali o'qiladi.
- Klaviatura: Tab guruhga kiradi, Radio kartalar orasida strelkalar (bir xil `name`), Checkbox va Switch kartani Space almashtiradi. Fokus halqasi butun kartada (`:focus-visible`, `border/focus`).
- Guruh uchun Fieldset (`<fieldset>` + `<legend>`) ishlating; Fieldset'siz bo'lsa `SelectorGroup role="radiogroup" aria-label="…"`.
- `disabled` — native disabled, `text/disabled`, fokuslanmaydi. `error` — `aria-invalid="true"`.
- RTL: `dir="rtl"` da media, matn va indikator tartibi logical properties bilan ko'zgulanadi.
