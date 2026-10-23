# @bek-ui/react

## 1.0.0-beta.1

### Minor Changes

- f5769cb: Brauzer (Playwright + axe) tekshiruvi topgan a11y tuzatishlari: `OrderWidget` bosqichlar chizig'iga nom (`progressLabel`, standart "Order status") va joriy bosqich matni (`aria-valuetext`); `Carousel` skroll maydoni klaviaturadan fokuslanadi (`tabIndex=0` + fokus halqasi).
- 5e075c2: Yangi input komponentlari (Figma bilan strict mos): `ScrubField` (3.21 Scrub field — gorizontal sudrab o'zgartiriladigan son: pointer capture, Shift ×10 / Alt ×0.1, ↑↓ · PageUp/PageDown · Home/End, bosib kiritish; `role="spinbutton"`, o'lchamlar xs · s · m · l), `SwitchField` (3.6 Switch field — label + izoh + Switch, butun qator bosiladi; s · m), `CheckboxField` (3.4 Checkbox field — label + izoh + Checkbox, `controlPosition` start · end; s · m) va `ControlGroup` (3.20 Field groups → Control group — `<fieldset>` + `<legend>`, `density` default · compact; ichidagi ScrubField/SwitchField o'lchamni zichlikdan oladi). Umumiy qator uslubi `src/styles/control-field.css`; balandliklar `--bek-field-height-*` tokenlaridan.
- e1098b4: Figma 3.12 Search bar: yangi `SearchField` (Search field, 108 variant) — `variant` `filled` · `elevated` · `on-media`, `size` `s` 36 · `m` 44 · `l` 56 (`--bek-field-height-*`), `scope`, `onVoice`, `shortcut` (`aria-keyshortcuts`), `onFilter`, `loading`, `disabled`, `dir`. `SearchBar` eskirgan alias sifatida qoldi (`m` → `s`, `l` → `m`); CSS klasslari `bek-search*` → `bek-search-field*`. Yangi ikonkalar: `MicGlyph`, `FilterGlyph` (ichki).
- 94d8d00: 3.12 Search bar — qidiruv tizimining qolgan qismlari (Figma bilan strict mos): `SearchSuggestions` (Search suggestions — `device` web · mobile; Recent · Suggestions · Results guruhlari `SearchSuggestionGroup` bilan, sarlavhada "Clear" / "See all" amali; Empty — `emptyTitle` · `emptyDescription`, Loading — `Skeleton` qatorlar + `aria-busy` va live region; Web'da ↑ ↓ ↵ esc ishoralari, Mobile'da tepada `field` slot), `SearchResultRow` (Search result row — `type` query · recent · item · person · file, `title` · `match` · `meta` · `snippet` · `source` · `media`, Selected — `aria-selected` + ↵, ↖ Fill query) va `useSearchSuggestions` (WAI-ARIA combobox: `SearchField` ga `role="combobox"`, `aria-controls`, `aria-activedescendant`, ↑ ↓ / ↵ / esc). `FacetPanel` (Facet panel — `device` web · mobile; facet'lar `fieldset` + `legend` va `Checkbox` M + son, Web'da vertikal `tablist`, "Clear all" va "Show results" tugmalari). Ichki ikonkalar (`src/icons`): clock-01, arrow-up-left-01, image-01, file-01, search-remove.
- 68b5d48: Yangi `SelectorCard` va `SelectorGroup` komponentlari (Figma 3.16 Selector card) — Radio, Checkbox yoki Switch indikatorli, butun kartasi bosiladigan izohli tanlov kartasi va ularning guruhi.
- 68b5d48: Yangi `Steps` · `StepsItem` komponenti (Figma 4.17 Steps): vertikal va gorizontal qadamlar ketma-ketligi — `complete` · `current` · `upcoming` · `error` holatlari, `dot` · `number` · `icon` markerlari, `description` · `meta` · `action` · `caption` slotlari, `<ol>` + `aria-current="step"`.
- ccde9dd: Figma bo'limlari sinxroni (2.x–10.x). Bottom navigation qayta dizayn: yangi `BottomNavGroup` (`dual` · `solo`), `BottomNavigation.device` (`mobile` · `tablet`), `BottomNavItem.variant` (`label` · `icon-only`); eski `variant` (`bar` · `floating`) va `hideLabel` deprecated. App bar: `search` prop'i (SearchField), Scrolled — `surface/card` + hairline + Elevation/1 (Glass o'rniga), orqaga tugma XL. CheckoutBar endi `FloatingActions` (6.9) ustida (API o'zgarmadi). Checkbox/Radio foni va List item/Table katagi `bg/sheet`, RangeSlider thumb `fill/secondary`.
- 15bdeec: Figma 3.2 / 3.3 / 3.1 sinxron: TextField'ga `variant="underlined"` (Figma'da Plain o'rnini oldi; `plain` deprecated — underlined sifatida chiziladi), `size="2xl"` (72, Headline/S) va `prefix` / `suffix` qo'shildi. Maydon balandliklari `--bek-field-height-*` tokenlariga o'tdi (TextField, Select, Textarea qobig'i); Outlined focus foni `bg/sheet`. Button 2XL/3XL endi 56/64 (field/lg · field/xl bilan juft).
- 977180f: Figma 6.2 Navigation va 7.x Overlays spec'lari qayta olindi. `AppHeader` ga `device` (`web` · `tablet`), `AppShell` ga `device` (`web` · `tablet` · `mobile`, berilmasa slotlardan aniqlanadi) prop'lari qo'shildi. Header · Web va App shell · Web foni `fill/secondary`, kontent `bg/sheet` (radius 20), Module rail radius 20, Menu panel padding 8 12 (collapsed 64). Command palette va Hover card sirti `bg/sheet` (ko'rinish o'zgarmaydi).
- b6ff019: Yangi komponentlar: Uploader (Figma 3.17 — `MediaUploader`, `FileUploader`, `DropZone`, `FileItem`; haqiqiy `<input type="file">`, `accept`/`multiple`/`maxSize` tekshiruvi, drag-and-drop va browse klaviatura muqobili, progress/xato/Remove/Retry, `aria-live` e'lonlari; yordamchilar `formatFileSize`, `matchesAccept`, `validateFiles`), `FloatingActions` (Figma 6.9 Floating action container — `single`/`horizontal`/`vertical`/`summary`, safe-area va RTL) va `ScrollArea` (Figma 4.8 Scrollbar). Ichki ikonkalar (`src/icons`): upload-01, file-01, image-add-01, image-01, video-01. `.bek-scrollbar` endi Chromium'da ham Figma o'lchamlarini (12/8 px, thumb kamida 32 px) beradi: standart `scrollbar-color`/`scrollbar-width` faqat Firefox uchun.

### Patch Changes

- d2cf61f: FloatingActions: `layout="vertical"` da tugmalar endi XL (44) balandligida — ustunda `flex: 1` ularni siqib qo'yardi.
- 1aab026: SelectorCard: nofaol kartaning ildiziga `aria-disabled` qo'shildi — description matni nofaol UI sifatida tanildi (axe color-contrast).
- Updated dependencies [6b36ba0]
  - @bek-ui/tokens@1.0.0-beta.1

## 1.0.0-beta.0

### Major Changes

- First public release — 1.0.0-beta. Tokens from Figma Variables, 58 React components, 61 charts and diagrams, Figma ↔ code parity checks. The API may still change before 1.0.

### Minor Changes

- 79ae5de: Figma "BEK Design System" faylidan birinchi to'liq to'lqin: tokenlar (rang, o'lcham, shrift, soya, glass, z-index, motion) va Foundations → Overlays bo'limlaridagi React komponentlari (Inputs, Data display, Feedback, Navigation, Overlays), `.bek-cursor-*` yordamchi klasslari va `apps/templates` namuna ekranlari.
- 3b7447d: Figma ↔ kod bir xilligi: har komponentda `figma.json` spetsifikatsiyasi va `check:figma` tekshiruvi (CI va Claude Code hook); yangi komponentlar — `Link` (3.18), `Fieldset` (3.19), `DescriptionList` (4.16).
- 6a3ff9e: Yangi Figma bo'limlari: `Mascot` · `MascotMessage` (2.3, panda sprite-sheet `page-mascot` MIT), `Pattern` (2.5), `StatusBar` · `HomeIndicator` (10.2), `Keyboard` (10.3); `AppShell` ga `drawer` sloti (6.2 Tablet/Mobile). Sayt katalogiga jonli namunalar.

### Patch Changes

- 920e6c8: Next.js App Router (React Server Components) support: interactive components (hooks or internal event handlers — Button, TextField, Select, Tabs, overlays, Link, Mascot and 30 more) now start with `'use client'`, so they can be rendered from Server Components. Skeleton `card` now fills its container (grid cell) instead of a fixed 168 px; media keeps the Figma 168:140 ratio.
- 70c9f08: Figma tokenlari qayta eksport qilindi: `--bek-dataviz-*` (37), `--bek-chart-*` (17), chart motion, status hover/active va soft-hover, `gradient/brand-*`, `text/accent-hover`. Sirt zinapoyasi Figma'ga moslandi: `bg/base` Dark #0E0E10, `bg/sheet` gray/50. Button: rangli Outline hover endi `{rang}/soft-hover` tokenida.
- Updated dependencies [79ae5de]
- Updated dependencies
- Updated dependencies [70c9f08]
  - @bek-ui/tokens@1.0.0-beta.0
