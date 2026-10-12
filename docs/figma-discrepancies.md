# Figma ↔ kod farqlari — dizayner uchun ro'yxat

1-bosqich yakuni (2026-10). Manba: har komponentning `figma.json → accepted[]` (hujjatlangan farqlar) va ECC
ko'rib chiqish hisobotlari. `pnpm check:figma -- --strict` → 58 komponent, 0 ogohlantirish — ya'ni quyidagilar
ataylab yoki Figma tomonidagi kamchilik sababli qabul qilingan. Noyabr yangilanishida Figma'da tuzatilsa,
`/figma-sync` bilan `accepted` yozuvlari olib tashlanadi.

## A. Figma'da tuzatish tavsiya etiladi

### A1. Variables → Code syntax (WEB) to'ldirilmagan tokenlar

Bu tokenlar `@bek/tokens` ga eksport bo'lmaydi; kod fallback bilan ishlaydi.

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
