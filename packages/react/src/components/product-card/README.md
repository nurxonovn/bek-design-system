# ProductCard

Figma: **4.14 Product card** — rasm, nom, tavsif, narx va qo'shish amali. `layout`: `vertical` (2 ustunli to'r) · `horizontal` (menyu ro'yxati) · `featured` (aksiya, tavsiya).

```tsx
<ProductCard
  image={<img src={p.photo} alt="" />}
  title={p.name}
  href={`/p/${p.id}`}
  price={<Price amount={p.price} currency="soʻm" />}
  badge="Yangi"
  quantity={cart[p.id] ?? 0}
  onAdd={() => add(p.id)}
  onQuantityChange={(q) => setQty(p.id, q)}
  addLabel="Qo'shish"
/>
```

Holatlar: `quantity > 0` — tugma o'rnida `Stepper` (In cart); `unavailable` — xira, amal o'chirilgan.
