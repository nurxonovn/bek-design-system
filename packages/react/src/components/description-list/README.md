# Description list

Figma: **4.16 Description list** — term · qiymat juftliklari: xususiyatlar, cheklar, buyurtma tafsilotlari. Table'dan yengil. `layout`: `justified` · `columns` · `inline`; `size`: `s` (Body/S) · `m` (Body/M) · `l` (Body/L).

```tsx
<DescriptionList title="Buyurtmangiz" total={{ term: 'Jami', value: '149 000 so‘m' }}>
  <DescriptionListItem term="BEK Pro, 1 oy">99 000 so‘m</DescriptionListItem>
  <DescriptionListItem term="Jamoa o'rinlari × 2">60 000 so‘m</DescriptionListItem>
  <DescriptionListItem term="Promo BEK15">−10 000 so‘m</DescriptionListItem>
  <DescriptionListItem term="Yetkazib berish" hint="Buyurtma 200 000 dan oshsa bepul" leader>Bepul</DescriptionListItem>
</DescriptionList>

<DescriptionList layout="columns" size="m" title="Shrift" action={<Link href="/font" variant="accent">Hammasini ko'rish</Link>}>
  <DescriptionListItem term="Og'irliklar">Regular · Medium · Semi Bold</DescriptionListItem>
  <DescriptionListItem term="Tillar">Lotin · Kirill · Arab</DescriptionListItem>
</DescriptionList>

<DescriptionList layout="inline">
  <DescriptionListItem term="Holat">Yo'lda</DescriptionListItem>
  <DescriptionListItem term="Kuryer">Akmal</DescriptionListItem>
</DescriptionList>
```

Qoidalar (Figma doc):

- `justified` — qisqa qiymatlar, raqamlar, narxlar: qiymat o'ngga tekislanadi, raqamlar bir ustunda turadi.
- `columns` — uzun yoki o'raladigan qiymatlar (xususiyatlar, manzil); term ustuni 152 px (`--bek-dl-term-width`). Tor ekranda qiymatlar qisqa bo'lsa `justified` yoki `inline` ga o'ting.
- `inline` — karta ichidagi 2–3 fakt yoki Mobile'da joy tor bo'lganda; `Term: qiymat`.
- `leader` — nuqtali chiziq (1 px `border/default`) term va qiymat orasida; ko'z uzoq yurganda.
- `hint` — `information-circle` 16, tushuntirish `title` orqali va ekran o'quvchiga.
- `total` — Divider (`border/hairline`) + Body Strong; `action` — sarlavha qatoridagi `Link` (accent).
- Statik kontent — interaktiv holatlar yo'q. Biror narsani ochadigan qiymat uchun qiymat ichiga `Link` (3.18) qo'ying yoki `ListItem` (4.4) ishlating.
- 3–8 qator; ko'proq bo'lsa "Hammasini ko'rish" ortiga yashiring.
- Semantika: `<dl>` → `<dt>` / `<dd>`; sarlavha `<h3>`.
