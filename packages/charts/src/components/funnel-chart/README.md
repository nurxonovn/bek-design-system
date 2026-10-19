# Funnel chart

Figma: **4.18 Chart · Funnel** — tartiblangan bosqichlar orqali konversiya (onboarding, checkout, kredit arizasi). `variant`: `stepped` · `horizontal`.

```tsx
<FunnelChart
  variant="stepped"
  steps={[
    { label: 'Visited', value: 12400 },
    { label: 'Signed up', value: 5210 },
    { label: 'Verified', value: 3880 },
  ]}
  label="Signup funnel: biggest drop after the first visit"
/>
```

- **Qachon:** bir xil birlikdagi 3–7 tartiblangan bosqich. `stepped` — bosqichdan bosqichga konversiya, `horizontal` — birinchi bosqichdan ulush. Tartibsiz kategoriyalar uchun emas — `BarChart`.
- **Kodlash:** x = bosqich tartibi, balandlik = son, yozuv = `count[i] / count[i−1]`. Ustun `dataviz/categorical/01` (`chart/bar/radius` faqat tepada), oqim maydoni `dataviz/sequential/100`.
- **Qoidalar:** bosqichlar jarayon tartibida, qiymat bo'yicha saralanmaydi. Eng katta tushish ajratiladi (`highlightDrop`) — mahsulot ishi shu yerda; AI insight yoki annotatsiyani shu bosqichga qo'ying. Sonlar uz-UZ (12 400).
- **Interaksiya:** hover — bosqichdan boshqalari 40%, `<title>`: son, oldingidan va birinchidan konversiya. Tushib qolganlar ro'yxati — ota komponentda.
- **A11y:** `role="img"` + `label`, ko'rinmas jadval ("Signed up 5 210, 42% of visited").
- **O'lchamlar:** Stepped `height` — `chart/height/md` (200 / 240 / 320) + yozuvlar qatori; Horizontal qalinlik `chart/bar/thickness` (16 / 24 / 32) → `barThickness`, nom ustuni `scale/80`. Matn: konversiya va son Label/S · `text/primary`, Stepped nomi Caption/M, Horizontal nomi Body/S · `text/secondary`, ulush Caption/M · `text/tertiary`.
