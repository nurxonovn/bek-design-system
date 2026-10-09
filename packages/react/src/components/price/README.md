# Price

Figma: **4.9 Price** — narx, valyuta, eski narx, chegirma va izoh. `size`: `s` · `m` · `l` · `xl`; `layout`: `inline` · `stacked`.

```tsx
<Price amount={4234000} currency="soʻm" locale="uz" />
<Price amount="4 234 000" currency="soʻm" oldAmount="5 000 000" discount="−15%" layout="stacked" note="oyiga" />
```

`oldAmount` berilsa — Sale: joriy narx `text/danger`, eski narx chizilgan, chegirma Filled danger yorliq.
