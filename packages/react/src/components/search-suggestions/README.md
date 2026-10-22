# SearchSuggestions

Figma: **3.12 Search bar** — Search suggestions va Search result row: `SearchField` ostida ochiladigan takliflar
paneli (WAI-ARIA combobox + listbox). `device`: `web` · `mobile`; Content: Recent · Suggestions · Results ·
Empty · Loading. Qator — `SearchResultRow`, `type`: `query` · `recent` · `item` · `person` · `file`.

```tsx
const [q, setQ] = useState('');
const [open, setOpen] = useState(false);
const nav = useSearchSuggestions({ open, onClose: () => setOpen(false) });

<SearchField
  aria-label="Qidirish"
  value={q}
  onChange={(e) => {
    setQ(e.target.value);
    setOpen(true);
  }}
  onFocus={() => setOpen(true)}
  onClear={() => setQ('')}
  {...nav.inputProps}
/>;
{
  open && (
    <SearchSuggestions
      {...nav.listProps}
      label="Takliflar"
      loading={isFetching}
      emptyTitle={`“${q}” bo'yicha hech narsa topilmadi`}
      emptyDescription="Imloni tekshiring yoki umumiyroq so'z yozing."
    >
      <SearchSuggestionGroup label="Takliflar">
        {suggestions.map((s) => (
          <SearchResultRow
            key={s}
            type="query"
            title={s}
            match={q}
            onClick={() => search(s)}
            onFillQuery={() => setQ(s)}
          />
        ))}
      </SearchSuggestionGroup>
    </SearchSuggestions>
  );
}
```

Natijalar guruhlari (Results): `People` — `type="person"` (Avatar), `Files` — `type="file"`, `Items` —
`type="item"` va sarlavhada `actionLabel="See all"`:

```tsx
<SearchSuggestionGroup label="Files">
  <SearchResultRow type="file" title="Vacation_Planning_Handbook.pdf" meta="May 19 · 2025"
    snippet="Planning your vacation is an important part of keeping a healthy work-life balance." />
</SearchSuggestionGroup>
<SearchSuggestionGroup label="Items" actionLabel="See all" onAction={openAll}>
  <SearchResultRow type="item" title="Q2 vacation coordination" meta="Jun 12 · 2025" source="#hr" />
</SearchSuggestionGroup>
```

## SearchSuggestions

| Prop                                                 | Figma                                  | Ma'nosi                                                                                       | Default       |
| ---------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- | ------------- |
| `device`                                             | Device                                 | `web` — suzuvchi panel (surface/raised, Elevation/3) · `mobile` — to'liq ekran (surface/card) | `web`         |
| `label`                                              | —                                      | listbox nomi                                                                                  | `Suggestions` |
| `listId` · `listRef` · `activeId` · `onActiveChange` | State=Selected                         | `useSearchSuggestions().listProps` dan; faol qator accent/soft                                | —             |
| `field`                                              | Mobile · Search field                  | tepadagi Filled `SearchField` (Cancel bilan)                                                  | —             |
| `loading` · `loadingLabel`                           | Content=Loading                        | `Skeleton` qatorlar, listbox `aria-busy`, live region'da `loadingLabel`                       | `false`       |
| `emptyTitle` · `emptyDescription`                    | Content=Empty                          | children bo'sh bo'lsa — search-remove ikonka, Label/L + Body/S (`role="status"`)              | —             |
| `hints`                                              | Footer                                 | `[['↑ ↓','Navigate'],['↵','Open'],['esc','Close']]`, faqat Web; `null` — yashirish            | Figma'dagi    |
| `children`                                           | Content=Recent · Suggestions · Results | `SearchSuggestionGroup` + `SearchResultRow`                                                   | —             |

`SearchSuggestionGroup`: `label` (Caption/M text/tertiary — "Recent searches", "People"), `actionLabel` ·
`onAction` ("Clear", "See all" — Label/S text/accent). Amal listbox ichida turgani uchun u ham `option`:
↑ ↓ bilan yetiladi, ↵ bosadi (listbox ichida tugma bo'lishi mumkin emas).

## SearchResultRow

| Prop                             | Figma                             | Ma'nosi                                                                                                                                  | Default       |
| -------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `type`                           | Type                              | `query` (search-01) · `recent` (clock-01, text/secondary) · `item` (image-01) · `person` (Avatar M) · `file` (file-01, status/info/soft) | `query`       |
| `title`                          | Title                             | Label/L, bir qator                                                                                                                       | —             |
| `match`                          | Query                             | yozilgan qism text/primary, qolgani text/secondary (`title` satr bo'lsa)                                                                 | —             |
| `meta`                           | Show meta · Meta                  | sana/lavozim, Caption/M text/tertiary                                                                                                    | —             |
| `snippet`                        | Show snippet · Snippet            | Body/S text/secondary; bo'lsa qator yuqoriga tekislanadi                                                                                 | —             |
| `source`                         | Show source · Source              | manba pill'i (fill/soft, Label/S)                                                                                                        | —             |
| `media`                          | Leading icon · Thumbnail · Avatar | o'z rasmingiz yoki `<Avatar src>`                                                                                                        | type bo'yicha |
| `selected`                       | State=Selected                    | `aria-selected`, accent/soft, ↵ ishorasi; berilmasa `activeId` dan                                                                       | —             |
| `onFillQuery` · `fillQueryLabel` | Fill query ↖                     | matnni maydonga qaytaradi (Query · Recent)                                                                                               | —             |
| `dir`                            | Direction                         | `rtl` — joylashuv logical properties bilan                                                                                               | —             |

Holatlar prop emas: Hover — `:hover` (fill/soft), Selected — `aria-selected`. Dark mode — tokenlardan.

## useSearchSuggestions

`useSearchSuggestions({ open, onClose })` → `{ inputProps, listProps, activeId, setActiveId }`.
`inputProps` — `SearchField` ga (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`,
`aria-activedescendant`, `onKeyDown`), `listProps` — `SearchSuggestions` ga. ↑ ↓ — option'lar (guruh amallari ham)
bo'ylab, ↵ — faol option'ni bosadi (`onClick`), esc — `onClose`. Fokus doim inputda; sichqoncha ustiga kelgan
qator faol bo'ladi. O'z `onKeyDown` ingiz bo'lsa, `inputProps.onKeyDown` ni ichida chaqiring.

## Qoidalar (Figma doc)

- Focus bo'lishi bilan oxirgi qidiruvlar (Recent, "Clear" bilan), 1–2 belgidan keyin takliflar (Query);
  kutish paytida bo'sh panel emas — `loading` (Skeleton).
- Web: panel maydon ostida suzadi, birinchi qator Selected bo'lishi mumkin, pastda ↑ ↓ ↵ esc ishoralari.
- Mobile: to'liq ekran, tepada Filled `SearchField` + Cancel (`field` slot), ishoralarsiz; teginish — hover yo'q.
- Natijalar guruhlangan: People · Files · Items, ko'p bo'lsa sarlavhada "See all".
- Natija yo'q — nima qilishni ayting ("Imloni tekshiring yoki umumiyroq so'z yozing"), xato kodini emas.
- ↖ (Fill query) — faqat qo'shimcha: option ichida fokuslanuvchi tugma bo'lmaydi (axe `nested-interactive`),
  klaviaturada ↵ shu qatorni ochadi.
