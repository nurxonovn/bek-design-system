# Number ticker

Figma: **4.18 Chart · Number ticker** — jonli hisoblagich va muddat taymeri. Variant `Ticker` → `NumberTicker` (faqat o'zgargan raqamlar aylanadi), `Countdown` → `Countdown` (vaqt birliklarga bo'linadi).

```tsx
<NumberTicker
  value={12480}
  format="uz"
  label="Active learners right now"
  delta={12.4}
  context="vs. same time yesterday"
/>
<Countdown
  to="2026-10-22T18:00:00+05:00"
  units={['days', 'hours', 'min', 'sec']}
  label="Enrolment closes in"
  endMessage="Enrolment is closed"
/>
```

- **Qachon:** dashboard va landing'dagi jonli hisoblagichlar (hozir onlayn o'quvchilar, bugungi to'lovlar), muddatlar (qabul yopiladi, aksiya tugaydi, vebinar boshlanadi), har necha soniyada yangilanadigan asosiy raqamlar. Statik KPI uchun — `KpiCard`, jonli chiziq uchun — `LiveChart`.
- **Qoidalar:** raqamlar tabular (`tabular-nums`) — eni sakramaydi; faqat o'zgargan raqam aylanadi (300 ms, eskisi 0.3 shaffoflikda chiqib ketadi); uz-UZ guruhlash (`12 480`); raqamni nima sanayotgani bilan birga bering (`label`). Faqat haqiqiy o'zgarishda yangilang — to'xtovsiz ticker sahifadan diqqatni tortadi. Countdown foydalanuvchi vaqt mintaqasida; qayta boshlanadigan soxta shoshilinch taymerlar yo'q; tor joyda > 1 kun bo'lsa `sec` ni olib tashlang.
- **A11y:** yakuniy qiymat doim ko'rinmas matnda (aylanayotgan raqamlar `aria-hidden`); o'zgarishlar `aria-live` bilan e'lon qilinadi — `live`: `polite` (standart) · `assertive` · `off`, `announceInterval` (standart 60 000 ms — daqiqada ko'pi bilan bir marta, oxirgi qiymat albatta e'lon qilinadi). Countdown matnli ekvivalentga ega ("2 days 14 hours left", `formatText`, `unitLabels`, `leftLabel`); tugaganda 00 va `endMessage` (`role="status"`), `onEnd`.
- **Harakat:** `prefers-reduced-motion: reduce` — raqam aylanmasdan almashadi. Countdown tab yashirin bo'lsa to'xtaydi va qaytganda yangilanadi.
- **Tarkib:** label Caption/M · `text/secondary`; raqam Display/M · `text/primary`; `Delta` + izoh Caption/M · `text/tertiary`; Countdown birligi `bg/sheet` blok (`scale/64`, padding 8 / 12, `radius/surface/sm`), qiymat Headline/M, birlik Caption/S. Oraliq `scale/12`, meta `scale/8`.
- **SSR:** Countdown `now` bilan boshlang'ich vaqtni oladi (gidratsiyada farq bo'lsa ham `suppressHydrationWarning`), keyin har soniyada yangilanadi.
