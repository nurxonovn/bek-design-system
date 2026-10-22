# Figma ↔ kod farqlari — dizayner uchun ro'yxat

1-bosqich yakuni (2026-10). Manba: har komponentning `figma.json → accepted[]` (hujjatlangan farqlar) va ECC
ko'rib chiqish hisobotlari. `pnpm check:figma -- --strict` → 58 komponent, 0 ogohlantirish — ya'ni quyidagilar
ataylab yoki Figma tomonidagi kamchilik sababli qabul qilingan. Noyabr yangilanishida Figma'da tuzatilsa,
`/figma-sync` bilan `accepted` yozuvlari olib tashlanadi.

## A. Figma'da tuzatish tavsiya etiladi

### A1. Variables → Code syntax (WEB) to'ldirilmagan tokenlar

Bu tokenlar `@bek-ui/tokens` ga eksport bo'lmaydi; kod fallback bilan ishlaydi.

- `accent/soft-hover` — button (3.1 Button)
- `status/danger/soft-hover` — button (3.1 Button)
- `status/info/soft-hover` — button (3.1 Button)
- `status/success/soft-hover` — button (3.1 Button)
- `status/utility/soft-hover` — button (3.1 Button)
- `status/warning/soft-hover` — button (3.1 Button)
- `text/accent-hover` — link (3.18 Link)

### A2. Komponentda tokenga bog'lanmagan qatlamlar (doc'da bor, komponentda yo'q)

- **button** `--bek-fill-secondary` — Raised hover foni — Figma doc Design tokens jadvalida 'Raised: fill/primary → fill/secondary' deb yozilgan, lekin komponent set'dagi Raised Hover varianti bu tokenga bog'lanmagan. Figma'da Raised/Hover variantini fill/secondary ga bog'lash kerak.
- **button** `--bek-fill-tertiary` — Raised bosilgan (:active) holati — doc'da 'Pressed (code)' deb belgilangan, Figma'da Pressed varianti yo'q; fill/primary → secondary → tertiary zinasi davom ettirilgan.
- **button** `--bek-fill-on-color` — Normal/Outline/Flat-contrast fonlari — doc 'Contrast family keeps fill/on-color' deydi, komponent set'da bu tokenlar yo'q (ehtimol opacity bilan chizilgan). Figma'da contrast variantlarini fill/on-color (+hover/pressed) ga bog'lash kerak.
- **button** `--bek-fill-on-color-hover` — Contrast oilasi hover holati — fill/on-color-hover (doc: 'Contrast family keeps fill/on-color'); Figma variantlarida token bog'lanmagan.
- **button** `--bek-fill-on-color-pressed` — Contrast oilasi pressed/selected holati — fill/on-color-pressed; Figma'da Pressed varianti yo'q (doc: 'Pressed (code)').
- **card** `--bek-border-hairline` — Figma doc Outlined variantida "1px border" deydi, lekin komponentda chiziq rangi tokenga bog'lanmagan (spec tokens.color ichida border/\* yo'q). Kodda border/hairline ishlatiladi; Figma'da Outlined stroke'ni border/hairline variable'ga bog'lash kerak.
- **carousel** `--bek-border-strong` — Figma doc "Thumb Hover ring — border/strong (2 px)" deydi, lekin .Carousel/Thumb komponentida hover halqasi variable'ga bog'lanmagan (tokens.color: faqat border/focus, fill/tertiary). Figma'da Hover holat stroke'ini border/strong ga bog'lash kerak.
- **keyboard** `--bek-surface-card` — Doc Spec: iOS tugmalari surface/card — set'da nested instance bog'lanmagan.
- **keyboard** `--bek-surface-raised` — Doc Spec: Android tugmalari surface/raised — set'da bog'lanmagan.
- **keyboard** `--bek-text-primary` — Tugma harflari rangi — native instance'da bog'lanmagan; BEK matn tokeni.
- **keyboard** `--bek-text-secondary` — Raqamli klaviaturadagi ABC/DEF harflari — native instance'da bog'lanmagan.
- **keyboard** `--bek-accent-default` — Android (Gboard) return tugmasi accent rangda — native instance'da bog'lanmagan.
- **list-item** `--bek-border-hairline` — Qatorlar orasidagi ajratuvchi (border/hairline) faqat kodda — Figma List item bitta qator, doc ajratuvchini ko'rsatmaydi. Ro'yxatda qatorlar yonma-yon turganda chegara kerak; Figma'da List (ro'yxat) misolida divider token sifatida qo'shilishi kerak.
- **navigation** `--bek-bg-base` — AppShell sahifa foni bg/base — doc "Separate the header from the page by surface colour, not a border" qoidasi uchun header/menu (surface/card) dan ajralishi kerak; Figma'da App shell o'rami bg/sheet, kontent esa demo placeholder (fill/secondary). Figma'da Content slot foniga bg/base berish kerak.
- **notification-bar** `--bek-text-success` — Figma doc ikonka rangini "text/success · text/danger · text/info · text/secondary" deb beradi, lekin Success variantida ikonka rangi variable'ga bog'lanmagan (spec'da faqat text/info). Figma'da Success ikonkasini text/success ga bog'lash kerak.
- **notification-bar** `--bek-text-danger` — Figma Error varianti ikonkasi doc bo'yicha text/danger, lekin variable'ga bog'lanmagan (spec'da faqat text/info). Figma'da Error ikonkasini text/danger ga bog'lash kerak.
- **overlay** `--bek-bg-sheet` — Action sheet (iOS 27 / Material 3 native instance) va Share sheet sirti Figma'da bg/sheet (nested native komponent, spec tokenlariga tushmagan); doc'da "Card / sheet: surface/raised" deyilgan — doc yoki native instance tokenini moslashtirish kerak. Kod komponentga ergashadi (bg/sheet).
- **rating** `--bek-status-warning-default` — Figma doc "Filled star — status/warning/default" deydi, lekin .Rating/Star komponentida yulduz rangi variable'ga bog'lanmagan (tokens.color bo'sh, tavsifda eski color/foreground/rating nomi). Figma'da Solid yulduz fill'ini status/warning/default ga bog'lash kerak.
- **rating** `--bek-border-strong` — Figma doc "Empty star — border/strong" deydi, lekin .Rating/Star komponentida stroke rangi variable'ga bog'lanmagan (tavsifda eski color/border/neutral/strong). Figma'da Stroke yulduzni border/strong ga bog'lash kerak.
- **slider** `--bek-border-default` — Thumb chegarasi 1 px border/default — Figma doc Design tokens jadvalida ('Thumb border: border/default · Hover border/focus') bor, lekin komponent set'dagi thumb bu tokenga bog'lanmagan. Figma'da thumb stroke'ini border/default ga bog'lash kerak.
- **system-bars** `--bek-static-dark` — Doc Tokens: Content=Dark → static/dark (mavzu tokeni emas); komponent set'ida nested native instance bog'lanmagan.
- **system-bars** `--bek-static-white` — Doc Tokens: Content=Light → static/white; set'da bog'lanmagan.

### A3. Tokensiz ranglar

- **logo** `#d9d9d9` — Logo komponenti ichidagi yordamchi to'rtburchak (placeholder/bo'sh joy chegarasi) tokensiz #d9d9d9 bilan bo'yalgan; kodda bunday qatlam yo'q. Figma'da shu qatlamni o'chirish yoki fill/soft tokeniga bog'lash kerak.

### A4. Hujjat (📘) ≠ komponent

- Checkout bar: doc `bg/sheet · Elevation/2`, komponent `surface/raised · Elevation/1`.
- App bar: doc qidiruv maydoni `fill/tertiary`, komponent `fill/secondary`; qidiruv maydoni Search bar (3.12) instance bo'lishi kerak (6.5, 6.6).
- Card: doc Elevated = `fill/primary + Elevation/1`, komponent `surface/card`; Outlined chegarasi tokenga bog'lanmagan.
- Date picker: doc sarlavha Title/S, tugmalar 36, `radius/surface/lg`; komponent Title/M, 40, `radius/surface/xl`.
- Time slot: doc radius `control/md`, Express `accent/soft · text/accent`, note Caption/L; komponent `surface/lg`, `fill/secondary` + `text/warning`, Caption/M.
- Accordion: doc Card fill `fill/tertiary`, komponent `fill/secondary` (hover `fill/tertiary`).
- Table: doc props (Show checkbox/avatar/badge/actions) ≠ komponent (`Type` varianti + Show tag 2/3); doc `Header border: border/default` komponentda yo'q.
- Rating `.Rating/Star`: yulduz ranglari bog'lanmagan (`status/warning/default`, `border/strong`); description eski token nomlarini ishlatadi.
- Carousel `.Carousel/Thumb`: hover/active halqalar bog'lanmagan; `_Slot` placeholder tokenlari komponent spec'iga sizib chiqadi; Controls `Dots only` ↔ kod `dots`.
- Notification bar: Success/Error ikonka ranglari bog'lanmagan (faqat `text/info`).
- Pincode: doc padding `scale/10`, komponentda faqat scale/12, scale/24.
- Slider: doc thumb `border/default` + `shadow/soft · shadow/float`; komponent `Elevation/Inset`.
- Logo: doc mahsulot nomi `text/secondary`, komponent `text/tertiary`; doc gap 22% vs komponent 5/9/14 px; `#d9d9d9` yordamchi qatlam.
- Radio doc: default Size `M` yozilgan, komponent (va kod) `S`.
- Mascot: 📘 doc frame nomi `📘` bilan boshlanmaydi (extractor topmaydi); Mascot message sarlavhasi doc Title/L, komponent Headline/S.
- Hover card Profile: `status/success/default` (onlayn nuqta) doc/props'da yozilmagan.
- Navigation: App shell `Page content` placeholder tokenlari komponentga sizadi; menyu paneli 256 = 240 + 2×8 — token yo'q (`size/menu-panel/w`?).
- Action/Share sheet (7.10, 7.11): native iOS/M3 instance yuzasi bog'lanmagan; Share sheet Dark'da Copy pill fon bilan bir rang.
- Demo fonlari komponent ichida: `bg/base` (Checkout bar, Bottom navigation, Bottom nav item, Date picker, Time slot) — `bg/sheet` o'ram sifatida ishlatilsa checker e'tiborsiz qoldiradi.
- 10.2 / 10.3: nested native (iOS 27 / M3) instance'lar `static/dark`, `static/white`, `surface/card`, `surface/raised` ga bog'lanmagan.

### A5. 2-bosqich: 3.16 Selector card, 4.17 Steps (2026-10)

Ikkala sahifa `--strict` 0 bilan kodga o'tdi (`accepted[]` bo'sh). Figma tomonida:

- 📘 doc'larda "Design tokens" sarlavhasi o'rniga "Tokens" — extractor doc matnini sahifa boshidan olib 3200 belgida
  kesadi, Rules/Props/Tokens/Do-Don't `figma.json` ga tushmaydi. Boshqa sahifalardagidek "Design tokens" deb nomlang.
- Selector card: `State` bitta o'qda — Selected+Hover/Disabled/Error/Focus kombinatsiyalari chizilmagan (kodda:
  tanlangan kartada ham hover qatlami, disabled+checked `accent/soft` saqlaydi).
- Selector card: Default karta `bg/sheet` ustida `surface/card`, chegarasiz — Light'da bosish nishoni noaniq;
  `border/subtle` kerakmi, tasdiqlang.
- Selector card: Switch indikatori (24) birinchi qatorga (Title/S, 20) yuqoridan tekislangan — 1.11 qoidasi bo'yicha
  markazda bo'lishi kerak. Kod Figma'ga ergashgan.
- Selector card: Image top varianti qat'iy 280 px (kodda suyuq, gorizontal guruhda ≥ 240); Selector group tavsifi
  "Vertical on Mobile", doc "Mobile and Tablet".
- Steps: chiziq (Line before/after) 2 px kengligi tokenga bog'lanmagan — `stroke/strong` (kodda shu).
- Steps: tavsiflarda `<Steps.Item …>`, kodda `StepsItem` (`DescriptionListItem` kabi); horizontal qadam qat'iy 160 px
  (kodda konteynerni teng bo'ladi); vertical oxirgi qadamda ham 24 px pastki padding — ataylabmi?
- 2026-10-22 qayta tekshiruv: ikkala sahifa o'zgarmagan (props, tokenlar, o'lchamlar, doc bir xil). Qo'shimcha:
  - Steps komponent tavsiflari HTML entity bilan saqlangan (`&lt;Steps.Item …&gt;`, `&quot;horizontal&quot;`) — oddiy
    `<`, `>`, `"` bilan qayta yozing (spec'da ochib yozildi).
  - Doc bo'limlari endi `📘 Selector card` / `📘 Steps` SECTION'lari — nomi set nomiga teng bo'lgani uchun extractor
    ularni oila sahifasi (4.18 Chart) deb tushunadi va doc'ni ikki kalit ostida takrorlaydi; spec'da sahifa kaliti qoldirildi.
    `📘 3.16 Selector card` kabi nomlash yoki "Design tokens" sarlavhasi bu muammoni ham yopadi.
  - Tokens jadvalida yozilgan, lekin qatlamda bog'lanmagan o'lchamlar: Selector card Error chizig'i 2 px (`stroke/strong`),
    Steps vertical pastki padding 24 (`scale/24`) va sarlavha tepasidagi 10 px, Steps chizig'i 2 px — Variables'ga bog'lang.

### A6. Variables (2026-10-22 sinxron)

- Variable **description** maydonlarida apostrof va qo'shtirnoq HTML entity bo'lib saqlangan: `o&#39;lcham`,
  `&quot;Other&quot;` (`scale/*`, `icon/*`, `text/*`, `fill/*`, `_doc/*`, `dataviz/categorical/*` va boshqalar —
  ~70 ta). Figma'da `'` va `"` ga qaytarish kerak. Eksportda kod tomonda decode qilinadi (oldingi qiymat saqlangan).
- `effect/matrix/*` — Color kolleksiyasida, lekin faqat 2.6 Backgrounds uchun (UI emas). Light/Dark qiymati bir xil;
  alohida kolleksiya yoki `hiddenFromPublishing` + codeSyntax bilan `effect/` guruhi aniq ajratilsa yaxshi.
- `brand/3d-violet`, `brand/3d-blue` endi yashirin va codeSyntax'siz — `--brand-3d-*` palitra o'zgaruvchilari
  `palette.css` dan chiqdi (kodda ishlatilmagan). Ular faqat `gradient/brand-start/end` orqali.

### A7. Inputs v2: 3.1 Button, 3.2 Text field, 3.3 Select, 3.12 Search field (2026-10-22)

- **Text field** 📘 doc eskirgan: Size jadvalida 2XL (72) yo'q, Prefix/Suffix prop'lari yo'q, "Background — Outlined
  fill/primary" (komponent `bg/sheet`), balandlik `scale/36–4` (komponent `field/height/*`); token nomlari buzilgan
  (`scale/36–4`, `scale/2–3`, `scale/32–2`, `control/height/`).
- **Select** doc: Variant "Filled, Outlined, Underlined" deyilgan, komponentda **Plain** (Underlined yo'q); radius
  "10 / 12 / 16 / 20", komponent 8 / 12 (`radius/control/md · lg`); balandlik `scale/*`, komponent `field/height/*`.
- **Textarea** Outlined foni hali `fill/primary` (deprecated alias) — `bg/sheet` ga bog'lash kerak (kodda
  `accepted`).
- **Button** komponent tavsifi: "2XL · 3XL (52 / 60 px)" — variable endi 56 / 64.
- **Search field**:
  - doc Tokens jadvalida balandlik `scale/36 · 44 · 56`, komponent `field/height/sm|md|lg`.
  - doc frame'da "Design tokens" sarlavhasi yo'q ("Tokens") — extractor matnni boshidan kesadi, boshqa sahifalar
    bilan bir xil sarlavha kerak.
  - On-media Disabled Default'dan farq qilmaydi (doc: `text/disabled`); Disabled'da Scope `text/secondary`, Shortcut
    `text/disabled` — bir xil bo'lishi kerak. Kodda doc qoidasi.
  - Loading `_Spinner` hamma variantda `text/primary` — On-media'da `text/on-color` bo'lishi kerak; `_Spinner`
    (loading-03) ichida tokensiz `#323233`.
  - Komponent set foni `bg/base` (boshqa sahifalarda `bg/sheet`) — kodda `accepted`.
  - Tavsifda `&amp;lt;SearchField … /&amp;gt;` — ikki marta HTML-kodlangan.
  - On-media Hover Default bilan bir xil — ataylab bo'lsa doc'da yozish kerak.
  - 6.5 App bar va 6.6 Top navigation qidiruv maydonini hali inline chizadi (`fill/secondary`) — "Search field"
    (Filled, S) instance'iga almashtirish kerak.

### A8. 6.2 Navigation va 7.x Overlays spec qayta olindi (2026-10-22)

- 6.2 sahifasida **Header · Tablet** (650:76771) hali bor va ishlatiladi (5 instance) — agar u olib tashlanishi kerak
  bo'lsa, Figma'da o'chirish kerak; kod Figma'ga ergashadi.
- Set o'ramlari fonlari tokeni har xil: App shell · Web — `fill/primary`, Menu panel — `fill/tertiary`, Popover —
  `bg/base`; boshqa set'lar kabi `bg/sheet` bo'lishi kerak (kodda `accepted`).
- Doc ≠ komponent: Command palette va Hover card doc'ida "Surface fill/primary", komponent `bg/sheet`; Modal va
  Popover doc'ida "fill/primary + 1px hairline border", komponent `surface/raised`, chegarasiz; Dropdown menu doc
  "Elevation/3", komponent `Elevation/2 Raised-hover`; Action/Share sheet doc "surface/raised", native instance `bg/sheet`.
- Eskirgan tavsiflar: Menu panel "Collapsed 56 (40 + 2×8)" va flyout "surface/overlay" — aslida 64 (padding 12) va
  `surface/raised`; Menu item "16 variants" — aslida 20 (Focus qo'shilgan).
- Tavsiflarda mavjud bo'lmagan token nomlari: `color/background/neutral/elevated`, `background/neutral/elevated`
  (Modal, Command palette, Hover card), `radius/7`, `shadow/3`, `size/menu/w`, `size/menu/w-sub` (Dropdown, Context
  submenu, Popover), `size/nav-rail/*`, `size/nav-item`, `size/touch-target/min` (Rail item, Nav rail, Nav item ·
  Touch), `color/background/overlay` (Nav drawer, App shell · Tablet).
- Tokensiz qiymatlar: App shell · Web ildiz radiusi 16; iOS action sheet karta radiusi 34; Bottom sheet rasm
  balandliklari 260 / 180.
- Menu panel `Search` qismida endi nested Search field (3.12) — kodda `SearchField size="s"`.

### A9. Yangi inputlar: 3.21 Scrub field, 3.6 Switch field, 3.4 Checkbox field, 3.20 Control group (2026-10-22)

- Set o'rami foni: Scrub/Switch/Checkbox field — `bg/base`, Control group — `surface/card`; `bg/sheet` ga o'tkazish
  kerak (kodda `accepted`).
- Scrub field: Label qatlamida `textTruncation = DISABLED`, doc esa "Truncates, never wraps" — "Truncate text" ni
  yoqish kerak. L o'lchamida Focus ring radiusi 8, konteyner 12 (`radius/control/lg`) — moslash kerak.
- Scrub field fill'lari tokenga bog'langan, lekin ustidan paint opacity (fill/soft 0.07, fill/soft-hover 0.12,
  fill/soft-pressed 0.17) — rang token qiymatidan farq qiladi; opacity'ni olib tashlash kerak.
- Switch field / Checkbox field doc'ida "Label Body/M", S varianti `Label/M` — doc'ga "S — Label/M · M — Body/M".
- 4 ta set tavsifida HTML entity (`&lt;ScrubField … /&gt;`); doc frame'larda "Design tokens" o'rniga "Tokens".
- 3.20 sahifasidagi **Chip group** (1179:381) va **Range field** (1179:799) set'lari kodda hali yo'q (rejada emas).

### A10. 3.12 Search suggestions, Search result row, Facet panel (2026-10-22)

- Search suggestions (1130:3023) va Facet panel (1131:2897) set o'ramlari `bg/base` — `bg/sheet` ga o'tkazish kerak
  (kodda `accepted`).
- Search suggestions → Loading: skelet chiziqlari qo'lda chizilgan (`fill/soft`) — 5.7 Skeleton instance bo'lishi
  kerak (`fill/soft-pressed`). Kodda `Skeleton`.
- File qatori ikonkasi `text/info` — instance ichida, hujjatda "file-01 · text/info" deb yozish kerak.
- Results'dagi Person qatorida Avatar bosh harflari "NN", ism "Alicia Kumar" — "AK" bo'lishi kerak.
- Tavsiflar 400 belgida kesilgan va HTML entity'li (`&lt;SearchResultRow … /&gt;`).
- Empty holatidagi search-remove `_Icon` ichida bitta vektor tokensiz — `text/primary` ga bog'lash kerak.
- "See all" / "Clear" doc'da oddiy matn (Label/S text/accent) — kodda listbox ichida `role="option"` (klaviatura);
  doc'da aniqlashtirish kerak.

## B. Kodda ataylab qabul qilingan farqlar (Figma'ga tegilmaydi)

| Komponent         | Qoida              | Mos                    | Sabab                                                                                                                                                                                                                                                       |
| ----------------- | ------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accordion         | prop-missing       | `Show slot`            | Figma Slot (ixtiyoriy komponent) React'da `children` orqali beriladi — matn ham, komponent ham bitta kontent slotida; alohida `slot` prop'i kerak emas.                                                                                                     |
| app-bar           | token-missing      | `--bek-fill-secondary` | Variant=Search/Brand qidiruv maydoni (36 px pill) fill/secondary fonli — kodda SearchBar (3.12) komponenti `children` orqali; token unga tegishli. Doc'da esa "Search field: fill/tertiary" deyilgan — doc va komponentni bir xil tokenga keltirish kerak.  |
| bottom-navigation | token-missing      | `--bek-bg-base`        | bg/base — Figma'da Bottom navigation va Bottom nav item variant frame'lari ortidagi ekran foni (demo), bar o'zi surface/raised. Figma'da variant frame fonini o'chirish (yoki bg/sheet o'ramiga olish) kerak.                                               |
| bottom-navigation | token-missing      | `--bek-border-focus`   | Fokus halqasi BottomNavItem'ga NavAction (navigation papkasi) orqali `.bek-focus-ring` klassi bilan beriladi — border/focus shu umumiy uslubda (styles/focus.css); shu papkada bevosita yozilmaydi.                                                         |
| carousel          | token-missing      | `--bek-fill-secondary` | Carousel set'idagi fill/secondary — Slide INSTANCE_SWAP'ning \_Slot placeholder foni ("Slot / Swap with any component"), komponentning o'zi emas; kodda slayd — children.                                                                                   |
| carousel          | token-missing      | `--bek-text-secondary` | \_Slot placeholder matni ("Slot", Label/M) rangi — demo slayd, Carousel'ning o'z qismi emas.                                                                                                                                                                |
| carousel          | token-missing      | `--bek-text-tertiary`  | \_Slot placeholder matni ("Swap with any component", Caption/M) rangi — demo slayd, Carousel'ning o'z qismi emas.                                                                                                                                           |
| carousel          | text-style-missing | `Label/M`              | \_Slot placeholder sarlavhasi ("Slot") — demo slayd matni, kodda slayd children orqali keladi.                                                                                                                                                              |
| carousel          | text-style-missing | `Caption/M`            | \_Slot placeholder izohi ("Swap with any component") — demo slayd matni, kodda slayd children orqali keladi.                                                                                                                                                |
| checkout-bar      | token-missing      | `--bek-bg-base`        | bg/base — Figma'da Checkout bar variant frame'i ortidagi ekran foni (demo); bar o'zi surface/raised + Elevation/1. Doc'da esa "Bar: bg/sheet · Elevation/2" deyilgan — doc komponentga moslanishi kerak.                                                    |
| date-picker       | token-missing      | `--bek-bg-base`        | bg/base faqat komponent set o'ramining (795:823) foni — Single/Range/Wheel variantlarining hech birida ishlatilmaydi (get_variable_defs bilan tekshirildi), bg/sheet kabi o'ram tokeni. Kodda talab qilinmaydi.                                             |
| date-picker       | variant-missing    | `Type=Wheel`           | Wheel (kun · oy · yil g'ildiragi) — mobil'da native <input type="date"> bilan hal qilinadi (README); alohida React varianti yo'q. Keyinchalik kerak bo'lsa qo'shiladi.                                                                                      |
| date-picker       | token-missing      | `--bek-fill-soft`      | fill/soft — doc Tokens: "Wheel highlight" (Type=Wheel g'ildirak varianti); kodda Wheel native <input type="date"> bilan (accepted Type=Wheel), shuning uchun highlight tokeni ishlatilmaydi.                                                                |
| description-list  | px-figma           | `152px`                | Figma doc (4.16 Layouts): Columns term ustuni 152 px — bu kenglik, extractor sizes ro'yxatiga width kirmaydi. --bek-dl-term-width orqali o'zgartiriladi.                                                                                                    |
| empty-state       | px-figma           | `440px`                | M varianti maksimal kengligi 440 — Figma doc "Text width follows variant width" (aniq token yo'q), spec size faqat bitta variant (320) ni ko'rsatadi; scale/440 tokeni yo'q.                                                                                |
| empty-state       | px-figma           | `560px`                | L varianti (butun ekran) maksimal kengligi 560 — Figma doc "Text width follows variant width", spec sizes kenglikni olmaydi; scale/560 tokeni yo'q.                                                                                                         |
| fieldset          | token-missing      | `--bek-fill-secondary` | fill/secondary — Figma'dagi "Control — swap me" \_Slot placeholder foni; React'da control children orqali keladi, fieldset'ning o'z foni yo'q.                                                                                                              |
| keyboard          | token-missing      | `--bek-bg-overlay`     | bg/overlay — Figma'dagi nested native klaviatura instance ichidagi qatlam (bosilgan tugma popup soyasi); mockup kodida popup yo'q.                                                                                                                          |
| keyboard          | px-figma           | `42px`                 | iOS 27 tugma balandligi 42 (native) — scale tokeni yo'q.                                                                                                                                                                                                    |
| keyboard          | px-figma           | `46px`                 | Gboard tugma balandligi 46 (native) — scale tokeni yo'q.                                                                                                                                                                                                    |
| keyboard          | px-figma           | `34px`                 | Pastki xavfsiz maydon 34 (10.2 Home indicator iOS).                                                                                                                                                                                                         |
| loader            | variant-missing    | `Size=M24`             | Figma Size nomlari S16/M24/L40 — kodda `size` raqamli (16 · 24 · 40, `bek-loader--24`), piksel qiymati nomning o'zi.                                                                                                                                        |
| loader            | variant-missing    | `Size=L40`             | Figma Size nomlari S16/M24/L40 — kodda `size` raqamli (16 · 24 · 40, `bek-loader--40`), piksel qiymati nomning o'zi.                                                                                                                                        |
| logo              | px-figma           | `17px`                 | S wordmark font-size (Inter Extra Bold 17 px) — Figma matn qatlamining o'lchami, `sizes` (padding/gap/radius) ga tushmaydi va scale/17 tokeni yo'q. Belgi 24 px bilan nisbat Figma'dan olingan.                                                             |
| logo              | px-figma           | `46px`                 | L wordmark font-size (46 px) — Figma matn qatlamining o'lchami, `sizes` ga tushmaydi va scale/46 tokeni yo'q.                                                                                                                                               |
| logo              | px-figma           | `23px`                 | L mahsulot nomi font-size (23 px = wordmark 46 ning 50 %i, Figma doc qoidasi) — matn o'lchami, scale/23 tokeni yo'q.                                                                                                                                        |
| mascot            | text-style-missing | `Headline/S`           | Mascot message sarlavhasi — komponentda Headline/S, doc jadvalida Title/L; kod komponentga ergashadi (.bek-mascot-message\_\_title Headline/S). Figma doc yangilanishi kerak.                                                                               |
| navigation        | token-missing      | `--bek-fill-secondary` | App shell · Web'dagi fill/secondary — "Page content · Swap with any component" placeholder frame'ining foni (demo); kodda kontent `children` orqali, shell foni bg/base. Figma'da placeholder'ni komponentdan chiqarish yoki uni bg/base ga bog'lash kerak. |
| navigation        | variant-missing    | `Drawer=Closed`        | App shell Tablet/Mobile Drawer=Closed/Open — kodda `drawer` slotidagi NavDrawer `open` prop'i (false = Closed); alohida variant klassi yo'q.                                                                                                                |
| overlay           | px-figma           | `260px`                | Bottom sheet · Promo rasm balandligi 260 — Figma'da `height` qiymati sizes'ga yozilmaydi va scale/260 tokeni yo'q; Figma rasm frame'iga mos.                                                                                                                |
| overlay           | px-figma           | `180px`                | Bottom sheet · Content rasm balandligi 180 — Figma'da `height` sizes'ga yozilmaydi, scale/180 tokeni yo'q.                                                                                                                                                  |
| overlay           | px-figma           | `560px`                | Command palette maksimal balandligi 560 — ro'yxat uchun UI cheklovi (8 natija + qidiruv + footer); Figma'da max-height yo'q, doc "at most 8 visible before scrolling" qoidasidan.                                                                           |
| overlay           | px-figma           | `34px`                 | iOS 27 action sheet kartasining radiusi (34) — Figma'da native iOS instance ichida, spec sizes'ga tushmagan; scale/34 tokeni yo'q. Figma'da radiusni tokenga bog'lash yoki doc'dagi "12 (cards)" qiymatini native kartaga moslash kerak.                    |
| skeleton          | px-figma           | `180px`                | Title suyagining kengligi 180 — Figma Title variantining kengligi (resizable, "set the instance width or FILL"); sizes kenglikni olmaydi, scale/180 tokeni yo'q.                                                                                            |
| skeleton          | px-figma           | `168px`                | Card suyagining kengligi 168 — Figma Card variantining kengligi (resizable); sizes kenglikni olmaydi, scale/168 tokeni yo'q.                                                                                                                                |
| spinner           | token-missing      | `--bek-text-accent`    | \_Spinner Button va Input ichida ishlatiladi — rang `currentColor` (ota elementdan), Figma'dagi text/accent faqat demo rang. Standalone holat uchun Loader (5.7) ishlatiladi.                                                                               |
| system-bars       | token-missing      | `--bek-fill-strong`    | fill/strong — Figma'dagi nested native (iOS 27 / M3) instance qatlami; doc Tokens jadvali bo'yicha kontent rangi static/dark yoki static/white, kod shunga amal qiladi.                                                                                     |
| system-bars       | px-figma           | `62px`                 | Status bar iOS balandligi 62 (doc Sizes jadvali) — balandlik extractor sizes ro'yxatiga kirmaydi, scale tokeni yo'q.                                                                                                                                        |
| system-bars       | px-figma           | `34px`                 | Home indicator iOS xavfsiz maydoni 34 (doc Sizes) — scale tokeni yo'q.                                                                                                                                                                                      |
| system-bars       | px-figma           | `144px`                | Home indicator iOS chizig'i 144 × 5 (doc Sizes) — native o'lcham.                                                                                                                                                                                           |
| system-bars       | px-figma           | `5px`                  | Home indicator iOS chizig'i balandligi 5 (doc Sizes) — native o'lcham.                                                                                                                                                                                      |
| system-bars       | px-figma           | `108px`                | Home indicator Android chizig'i 108 × 4 (doc Sizes) — native o'lcham.                                                                                                                                                                                       |
| system-bars       | px-figma           | `124px`                | Dynamic Island kengligi (iOS 27 native, 124 × 36) — scale tokeni yo'q.                                                                                                                                                                                      |
| time-slot         | token-missing      | `--bek-bg-base`        | bg/base faqat komponent set o'ramining (796:223) foni — Direction=LTR variantida ishlatilmaydi (get_variable_defs bilan tekshirildi), bg/sheet kabi o'ram tokeni. Kodda talab qilinmaydi.                                                                   |
| time-slot         | token-missing      | `--bek-surface-raised` | surface/raised ichki Segmented control (days) tanlangan segmentining foni — nested komponent tokeni; kodda SegmentedControl import qilinadi va o'z CSS'ida shu tokenni ishlatadi.                                                                           |
| toast             | px-figma           | `420px`                | Toast kengligi 420 — Figma komponent frame kengligi (size.w = 420); sizes faqat padding/gap/radius'ni oladi, scale/420 tokeni yo'q.                                                                                                                         |
| top-navigation    | token-missing      | `--bek-fill-secondary` | Type=Search qidiruv maydoni Figma'da inline chizilgan (fill/secondary fon, text/tertiary placeholder, Body/M matn, fill/strong ikonka); kodda bu SearchBar (3.12) komponenti `children` orqali qo'yiladi. Figma'da Search bar instance ishlatish kerak.     |
| top-navigation    | token-missing      | `--bek-fill-strong`    | Qidiruv maydoni ikonkasi/ajratgichi — SearchBar komponentiga tegishli (qarang: fill/secondary sababi).                                                                                                                                                      |
| top-navigation    | token-missing      | `--bek-text-tertiary`  | Qidiruv maydoni placeholder rangi — SearchBar komponentiga tegishli (qarang: fill/secondary sababi).                                                                                                                                                        |
| top-navigation    | text-style-missing | `Body/M`               | Body/M — qidiruv maydoni matni, SearchBar komponentida; TopNavigation'ning o'z matnlari Title/M va Headline/L.                                                                                                                                              |

## C. Statistika

Jami `accepted`: 84 — prop-missing 1, token-missing 19, token-unmapped 7, token-extra 26, text-style-missing 4, variant-missing 4, px-figma 22, figma-raw-color 1.
