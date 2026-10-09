# Card

Figma: **4.3 Card** — `variant`: `elevated` · `outlined` · `filled`; `size`: `s` · `m` · `l` (padding 16 / 24 / 32).

```tsx
<Card
  title="To'lov"
  description="Visa · 4421"
  badge={
    <Badge variant="subtle" color="success" size="s">
      To'langan
    </Badge>
  }
  footer={
    <>
      <Button variant="action">Tasdiqlash</Button>
      <Button variant="outline">Bekor</Button>
    </>
  }
>
  Kartadan har oyning 1-sanasida yechiladi.
</Card>
```

Slotlar: `media`, `icon`, `title`, `description`, `badge`, `action`, `children` (matn), `footer`. `href` — butun karta havola; `onClick` — tugma (`role="button"`); `selected` — `accent/soft` + `border/accent`.

Elevated kartaning soyasi 1.8 Elevation bo'yicha: tinch holatda Elevation 1, hover'da 2. Figma komponentida bu teskari qo'yilgan.
