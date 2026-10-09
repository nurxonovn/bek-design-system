# Pagination · LoadMore

Figma: **6.4 Pagination**.

```tsx
import { LoadMore, Pagination } from '@bek/react';

<Pagination page={page} pageCount={52} onPageChange={setPage}
  summary="1–24 of 1 240" pageSize={<Select size="s" … />} />   // web
<Pagination variant="compact" page={3} pageCount={52} onPageChange={setPage} />  // planshet
<LoadMore loaded={24} total={120} onLoadMore={fetchMore} label="Showing 24 of 120" />  // mobil
```

| Prop (`Pagination`)                         | Qiymatlar                                 | Default    |
| ------------------------------------------- | ----------------------------------------- | ---------- |
| `page` · `pageCount` · `onPageChange`       | 1 dan boshlanadi                          | —          |
| `variant`                                   | `numbered` · `compact` (‹ 3 / 52 ›)       | `numbered` |
| `size`                                      | `s` 36 · `m` 44 px                        | `s`        |
| `summary`                                   | chapdagi xulosa (Body/S `text/secondary`) | —          |
| `pageSize`                                  | o'ngdagi Select (24 / 48 / 96)            | —          |
| `siblings`                                  | joriy sahifa atrofidagi qo'shnilar        | `1`        |
| `previousLabel` · `nextLabel` · `pageLabel` | ekran o'quvchi matnlari                   | EN         |

- Element: min-width = balandlik, radius 8, Label/M (M — Label/L); Hover `fill/tertiary`; Selected `accent/default` + `text/on-color` (`aria-current="page"`); "…" `text/secondary`. Previous/Next — Flat icon Button.
- `paginationRange(page, count, siblings)` — sahifalar ro'yxati (doim bir xil uzunlik, "…" bilan).
- `LoadMore`: ProgressBar S + to'liq kenglikdagi Outline tugma (`loading` bilan); hammasi yuklanganda tugma yashiriladi.
