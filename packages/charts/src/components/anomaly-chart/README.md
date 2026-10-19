# Anomaly chart

Figma: **4.18 Chart · Anomaly** — model g'ayrioddiy qiymatlarni belgilaydigan vaqt seriyasi; izoh AI insight qatorida. `variant`: `default` · `band` (model o'rgangan kutilgan oraliq).

```tsx
<AnomalyChart
  labels={[
    '1 Jul',
    '2 Jul',
    '3 Jul',
    '4 Jul',
    '5 Jul',
    '6 Jul',
    '7 Jul',
    '8 Jul',
    '9 Jul',
    '10 Jul',
    '11 Jul',
  ]}
  values={[48, 50, 47, 52, 51, 49, 78, 52, 50, 24, 55]}
  anomalies={[
    { index: 6, reason: 'Salary day + promo campaign' },
    { index: 9, reason: 'Payment gateway outage' },
  ]}
  expected={{
    lower: [40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 45],
    upper: [56, 56, 57, 57, 58, 58, 59, 59, 60, 61, 61],
  }}
  seriesLabel="Revenue"
  insight="2 anomalies: spike on 7 Jul (+52%), drop on 10 Jul (−52%) vs expected"
  label="Two anomalies in July: a spike on the 7th and a drop on the 10th"
/>
```

- **Qachon:** g'ayrioddiy qiymat e'tibor talab qiladigan monitoring (firibgarlik, uzilish, sakrash). Band — kutilgan oraliqni ham ko'rsatish. O'zingiz tanlagan yozuvlarni ajratish uchun emas — Annotation ishlating.
- **Kodlash:** x = vaqt, y = qiymat, belgi = model bali chegaradan yuqori (`dataviz/anomaly` nuqta, `status/warning/soft` halo, `surface/card` halqa), band = kutilgan oraliq (`dataviz/uncertainty/95`).
- **Qoidalar:** bir ko'rinishda ko'pi bilan 3 belgi (`maxAnomalies`) — qolganini ro'yxatda tartiblang; har belgining sababi (`reason`) tooltip'da bo'lsin.
- **Interaksiya:** anomaliya ustida `<title>` — qiymat, kutilgan, og'ish va sabab. "Not an issue" (dismiss) — ota komponent `anomalies` dan olib tashlaydi, fikr modelni yaxshilaydi.
- **A11y:** `role="img"` + `label`, AI insight ekran o'quvchiga "AI insight:" bilan o'qiladi, ko'rinmas `<table>` anomaliya va sababni beradi.
- **O'lchamlar:** plot `chart/height/md` (200 / 240 / 320), faol nuqta `chart/point/size-active` 12 px, chiziq `chart/line/stroke`.
