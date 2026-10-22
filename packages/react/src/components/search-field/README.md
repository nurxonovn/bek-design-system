# SearchField

Figma: **3.12 Search bar** — Search field: ro'yxat, katalog va butun ilova uchun pill qidiruv maydoni.
`variant`: `filled` · `elevated` · `on-media`; `size`: `s` 36 · `m` 44 · `l` 56 (Text field bilan bir xil
`field/height/*` shkalasi).

```tsx
<SearchField
  aria-label="Mahsulot qidirish"
  placeholder="Mahsulot qidirish"
  value={q}
  onChange={(e) => setQ(e.target.value)}
  onClear={() => setQ('')}
  onCancel={close}
  cancelLabel="Bekor qilish"
/>

// Katalog: qamrov, ovoz, ⌘K yorlig'i va filtr (Facet panel)
<SearchField
  variant="elevated"
  size="l"
  scope="All"
  shortcut="⌘K"
  onVoice={startDictation}
  onFilter={openFacets}
  loading={isFetching}
/>
```

| Prop                       | Figma                          | Qiymatlar / ma'nosi                                              | Default    |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------- | ---------- |
| `variant`                  | Variant                        | `filled` · `elevated` · `on-media`                               | `filled`   |
| `size`                     | Size                           | `s` 36 · `m` 44 · `l` 56                                         | `m`        |
| `placeholder`              | Placeholder                    | matn (text/tertiary)                                             | `'Search'` |
| `value` · `defaultValue`   | Value                          | boshqariladigan / boshqarilmaydigan qiymat                       | —          |
| `scope`                    | Show scope · Scope label       | qidiruv qayerda ishlaydi ("All"); inputga `aria-describedby`     | —          |
| `onVoice` · `voiceLabel`   | Show voice                     | mikrofon tugmasi (mic-01)                                        | —          |
| `shortcut`                 | Show shortcut · Shortcut label | `⌘K` yorlig'i, faqat web; inputga `aria-keyshortcuts` (`Meta+K`) | —          |
| `onFilter` · `filterLabel` | Show filter                    | Facet panelini ochuvchi tugma                                    | —          |
| `onClear` · `clearLabel`   | Clear                          | tozalash (cancel-circle) — faqat qiymat bo'lsa                   | `'Clear'`  |
| `onCancel` · `cancelLabel` | Show cancel · Cancel label     | mobil "Cancel" — focus paytida, qidiruvni yopadi                 | `'Cancel'` |
| `loading` · `loadingLabel` | State=Loading                  | Clear o'rnida `Spinner`, o'ramda `aria-busy`                     | `false`    |
| `disabled`                 | State=Disabled                 | text/disabled, Elevated soyasiz                                  | `false`    |
| `dir`                      | Direction                      | `rtl` — o'ramga qo'yiladi, joylashuv logical properties bilan    | —          |

## Variantlar

- **Filled** — `fill/soft` (hover `fill/soft-hover`). Ro'yxat va ekranlar uchun standart, `bg/base` va kartalar ustida.
- **Elevated** — `surface/card` + `Elevation/1` (hover `Elevation/2`). Tusli yoki gavjum sarlavhalarda ajralib turadi.
- **On-media** — `fill/on-media` + `Glass/Small`, matn `text/on-color`. **Faqat** rasm, gradient yoki brend rangi
  ustida; `bg/base` yoki oq karta ustida ishlatmang. To'liq shisha effekti uchun `@bek-ui/tokens/materials.css` ni ulang.

## Holatlar

Holatlar prop emas, CSS: Hover — `:hover`; Focus — `_Focus ring` (2 px `border/focus`, radius 9999) va caret
`accent/default`; Filled — qiymat + Clear; Disabled — `disabled`; Loading — `loading`. Dark mode alohida variantsiz,
tokenlardan.

## Qoidalar (Figma doc)

- `role="search"` o'ram, `type="search"` input. Natijalar yozish bilan yangilanadi — alohida "Qidirish" tugmasi shart emas.
- Focus bo'lishi bilan oxirgi qidiruvlarni (Recent), 1–2 belgidan keyin takliflarni ko'rsating; kutish paytida
  bo'sh panel emas, `loading`.
- Filtrlar maydon ichida emas: `onFilter` faqat kataloglarda, u Facet panelni ochadi; qo'llangan filtrlar maydon
  ostida `Chip` sifatida.
- Mobil: to'liq ekranli takliflar va `onCancel`. Web: takliflar maydon ostida, ↑ ↓ ↵ esc bilan boshqariladi.
- `shortcut` — faqat yorliq va `aria-keyshortcuts`; tugmalar bog'lanishini (masalan, ⌘K → `input.focus()`) ilova
  o'zi qiladi. Butun mahsulot bo'yicha qidiruv va amallar uchun — 7.7 Command palette.
- `aria-label` (yoki tashqi `<label>`) bering: placeholder yorliq o'rnini bosmaydi.

## Eski `SearchBar`

`SearchBar` — eskirgan (deprecated) alias: `size="m"` → `s` (36), `size="l"` → `m` (44). Yangi kodda `SearchField`.
