# Link

Figma: **3.18 Link** — foydalanuvchini boshqa joyga olib boradigan matn havolasi. `variant`: `inherit` · `accent` · `neutral` · `subtle`; `size`: `s` (Body/S) · `m` (Body/M) · `l` (Body/L). Padding va fon yo'q — bu matn, tugma emas.

```tsx
<p>
  To'lov bilan siz <Link href="/offer">oferta shartlarini</Link> qabul qilasiz.
</p>
<Link href="/components" variant="accent" size="m" endIcon={<ChevronRightGlyph />}>
  Hammasini ko'rish
</Link>
<Link href="/privacy" variant="subtle">Maxfiylik siyosati</Link>
```

Qayerda qaysi variant (Figma doc):

- `inherit` — matn ichida; atrofidagi rangni oladi, **doim** tagi chizilgan.
- `accent` — mustaqil havola ("Hammasini ko'rish", "Shaharni o'zgartirish"); tag chizig'i hover'da.
- `neutral` — karta, ro'yxat elementi, qidiruv natijasi sarlavhasi; tag chizig'i hover'da.
- `subtle` — huquqiy satrlar, footer, ikkilamchi meta; doim tagi chizilgan.

Qoidalar:

- Rangli (tinted) fonda accent ko'k yo'qoladi — `inherit` yoki `neutral` ishlating; `.bek-tone--*` ichida neutral doim chizilgan bo'ladi.
- Hover faqat Web (`@media (hover: hover)`); touch'da bosilgan holat yo'q.
- Touch'da mustaqil havolaga kamida 44 px (`target/min`) nishon maydonini matnni kattalashtirish bilan emas, qatorning padding'i bilan bering.
- `disabled` — `href` olib tashlanadi, `aria-disabled="true"`, `text/disabled`.
- Joyida bajariladigan amal (modal ochish, qo'shish) uchun `Button variant="flat"`, havola emas.
- RTL: `endIcon` (chevron) avtomatik aks ettiriladi.
