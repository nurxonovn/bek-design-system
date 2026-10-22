# FacetPanel

Figma: **3.12 Search bar** — Facet panel: katalog qidiruvining filtrlari, `SearchField` ning Filter tugmasidan
(`onFilter`) ochiladi. `device`: `web` (popover, chapda facet ro'yxati) · `mobile` (bottom sheet kontenti). Ichida
`Checkbox` (M) va `Button` (Flat "Clear all", Action "Show results").

```tsx
const facets = [
  {
    id: 'type',
    label: 'Type',
    options: [
      { value: 'symbol-text', label: 'Symbol & Text', count: 661 },
      { value: 'wordmark', label: 'Wordmark', count: 428 },
      { value: 'symbol', label: 'Symbol', count: 118 },
    ],
  },
  { id: 'industry', label: 'Industry', options: [{ value: 'finance', label: 'Finance', count: 312 }] },
];
const [filters, setFilters] = useState<FacetValue>({ type: ['symbol-text', 'wordmark'] });

<FacetPanel
  facets={facets}
  value={filters}
  onChange={setFilters}
  summary="2 filters · 1,089 results"
  onShowResults={apply}
/>

// Mobile — pastdan chiqadigan panel ichida; tugma natijalar sonini aytadi
<FacetPanel device="mobile" facets={facets} value={filters} onChange={setFilters}
  resultsLabel="Show 1,089 results" onShowResults={apply} />
```

| Prop                                                         | Figma             | Ma'nosi                                                                                                                       | Default        |
| ------------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `device`                                                     | Device            | `web` — surface/raised, Elevation/3, chapda facet'lar · `mobile` — surface/card, yuqori radius 24, dastak, guruhlar ketma-ket | `web`          |
| `facets`                                                     | Facets · Options  | `{ id, label, options: [{ value, label, count?, disabled? }] }[]`                                                             | —              |
| `value` · `defaultValue` · `onChange`                        | Checkbox Checked  | `{ [facetId]: value[] }` — boshqariladigan / boshqarilmaydigan                                                                | `{}`           |
| `activeFacet` · `defaultActiveFacet` · `onActiveFacetChange` | Facet (fill/soft) | Web: chapda tanlangan facet; yonida tanlanganlar soni (text/accent)                                                           | birinchi facet |
| `title`                                                      | Title             | Label/L                                                                                                                       | `Filters`      |
| `onClearAll` · `clearAllLabel`                               | Clear all         | Flat M; hamma tanlovni tozalaydi, keyin `onClearAll`                                                                          | `Clear all`    |
| `summary`                                                    | Summary           | Web pastki qator: "2 filters · 1,089 results" (Caption/M text/secondary)                                                      | —              |
| `resultsLabel` · `onShowResults`                             | Show results      | Web — Action L; Mobile — Action XL to'liq kenglik ("Show 1,089 results")                                                      | `Show results` |
| `selectedCountLabel`                                         | —                 | facet yonidagi son uchun ekran o'quvchi matni                                                                                 | `n selected`   |

## A11y

- Ildiz — `section`, sarlavha `h2` orqali nomlanadi.
- Har facet — `fieldset` + `legend` (1.12 Forms: group fieldset), variantlar — `Checkbox`; son
  `aria-describedby` bilan checkbox'ga bog'langan.
- Web: chap ro'yxat — vertikal `tablist` (↑ ↓ Home End), o'ng tomon — `tabpanel`; yashirin panellar DOM'da qoladi.
- "Show results" hech qachon disabled emas (1.12) — tanlov bo'lmasa ham bosiladi.

## Qoidalar (Figma doc)

- Filtrlar maydon ichida emas: Facet panel faqat kataloglarda, `SearchField onFilter` dan ochiladi; qo'llangan
  filtrlar maydon ostida `Chip` sifatida ko'rsatiladi.
- Web — Filter tugmasi ostidagi popover; Mobile — bottom sheet (dastak bilan), tugma natijalar sonini aytadi.
- Har variant yonida natijalar soni; sonlar o'ng chetda tekislanadi (`tabular-nums`).
