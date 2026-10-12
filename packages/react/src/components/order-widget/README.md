# OrderWidget

Figma: **4.15 Widget · Active order** — jarayondagi buyurtma holati (bosh ekranda). `status`: `accepted` · `preparing` · `on-the-way` · `delivered`; `size`: `compact` · `expanded` (4 bo'lakli progress + bosqich nomlari).

```tsx
<OrderWidget
  status="preparing"
  size="expanded"
  icon={<FireIcon />}
  title="Buyurtmangiz tayyorlanmoqda"
  subtitle="Taxminan 12 daqiqa"
  href="/orders/42"
  stageLabels={['Qabul qilindi', 'Tayyorlanmoqda', "Yo'lda", 'Yetkazildi']}
  progressLabel="Buyurtma holati"
/>
```

Bosqichlar chizig'i `role="progressbar"`: nomi `progressLabel` (standart "Order status"), qiymat matni joriy bosqich yorlig'i. `href` yoki `onClick` — kuzatish sahifasiga o'tadi. `delivered` — success ranglar.
