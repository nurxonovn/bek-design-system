# Live chart

Figma: **4.18 Chart · Live** — real vaqt oqimi: oyna chapga siljiydi, bosh nuqta pulsatsiyalanadi, LIVE badge yangilikni ko'rsatadi. `variant`: `default`; `status`: `live` · `paused` · `stale`.

```tsx
<ChartContainer>
  {(width) => (
    <LiveChart
      width={width}
      stream={points} // [{ t: Date.now(), v: 42 }, …]
      window={5 * 60_000}
      domain={[0, 100]}
      updated="Updated every 5 s"
      label="Transactions per second, last 5 minutes"
    />
  )}
</ChartContainer>
```

- **Qachon:** har soniya / daqiqada yangilanadigan qiymatlar (kurs, yuklama, tranzaksiyalar), monitoring va operator panellari. Kunlik va sekinroq ma'lumot uchun emas — `LineChart`.
- **Kodlash:** x = vaqt (siljuvchi `window`), y = qiymat. Chiziq `dataviz/positive`, maydon `status/success/soft`, bosh nuqta `motion/duration/live-pulse` (1600 ms) bilan pulsatsiyalanadi.
- **Qoidalar:** vaqt oynasi qat'iy (oxirgi 5 daqiqa, oxirgi soat) — X o'qi siljiydi, Y o'qi barqaror: `domain` bering. Oxirgi ma'lumot qachon kelganini ko'rsating (`updated`).
- **Holatlar:** `live` — oqim; `paused` — foydalanuvchi pauza qildi, badge neytral "PAUSED"; `stale` — 3 intervaldan ortiq ma'lumot yo'q, badge ogohlantirish "DELAYED". Holatni ota komponent boshqaradi (`status`, `statusLabel`).
- **Interaksiya:** hover pulsni to'xtatadi (CSS); pause/play tugmasi va orqaga brush — ota komponentda (`ChartBrush`), oqimni to'xtatish ham.
- **Harakat:** `prefers-reduced-motion: reduce` da puls o'chadi.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval. Jonli hudud (`role="status"`) faqat `announce` o'zgarganda o'qiladi — uni har nuqtada emas, faqat chegara kesib o'tilganda yangilang.
- **O'lchamlar:** plot `chart/height/md` (200 / 240 / 320) → `height`; Y yozuvlari ustuni `scale/40`, badge padding `scale/2`·`scale/8`, gap `scale/6`. Matn: badge Label/S · `text/danger`, izoh Caption/M · `text/tertiary`, o'q Caption/S · `dataviz/label`.
