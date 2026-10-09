# Chip

Figma: **3.13 Chip** — foydalanuvchi yoqadigan (Filter) yoki olib tashlaydigan (Input) ixcham pill. `size`: `s` 32 · `m` 40.

```tsx
<Chip selected={vegan} onClick={() => setVegan(!vegan)} count={12}>Vegan</Chip>
<Chip variant="input" onRemove={() => removeCity('tas')}>Toshkent</Chip>
```

Filter — `<button aria-pressed>`, tanlanganda `fill/inverse`. Input — × tugmasi (`aria-label="Remove …"`, Delete/Backspace ham). Holat yoki kategoriya ko'rsatish uchun Tag / Badge (4.2).
