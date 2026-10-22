# Uploader

Figma: **3.17 Uploader** — rasm, video va fayllarni qo'shish. To'rt qism: `MediaUploader` (Uploader · Media — `kind`: `photo` · `video`; `size`: `s` 80 · `m` 104 · `l` 128; `showLabel`, `coverBadge`), `FileUploader` (Uploader · File — tugma va fayllar ro'yxati; `size`: `m` · `l`), `DropZone` (Uploader · Drop zone — Web uchun drag-and-drop, `hint`) va `FileItem` (File item — `status`: `uploading` · `done` · `error`).

```tsx
<Fieldset label="Hujjatlar" message="PDF, JPG yoki PNG · 10 MB gacha">
  <FileUploader accept=".pdf,.jpg,.png" maxSize={10 * 1024 * 1024} multiple />
</Fieldset>

<DropZone
  accept=".pdf,.jpg,.png"
  maxSize={10 * 1024 * 1024}
  multiple
  hint="PDF, JPG yoki PNG · 10 MB gacha"
  files={files}
  onFilesAdded={(accepted, rejected) => upload(accepted, rejected)}
  onRemove={(f) => remove(f.id)}
  onRetry={(f) => retry(f.id)}
/>

<MediaUploader kind="photo" size="m" src={cover} coverBadge onRemove={clear} />
```

## Qaysi qismni tanlash

- **Media** — odamlar rasm sifatida ko'radigan rasm va videolar (e'lon, profil, hujjat skani). Birinchi rasm — muqova: `coverBadge` ("Main"). Video uchun `src` — poster, `duration` — "0:24" badge.
- **File** — Mobile va Tablet'da hujjatlar (CV, shartnoma). Bitta tugma; ro'yxat ostida o'sadi, `multiple` da tugma "Upload another" bo'ladi.
- **Drop zone** — faqat Web, bir yoki bir nechta hujjat. Browse havolasi doim bor: sudrab tashlash ixtiyoriy. Mobile'da File yoki Media ishlating.

## Qoidalar

- Har doim **Fieldset (3.19)** ichida: label, format va hajm chegarasi (Helper) va xato xabari Fieldset'da, Uploader ichida emas.
- Chegarani yuklashdan **oldin** ko'rsating (`hint`), jarayonni faylning o'zida (`progress`), xatoni ham faylda — sababi va Retry bilan. Natijani hech qachon Toast bilan bildirmang.
- Muvaffaqiyatsiz yoki tugallanmagan yuklash submit tugmasini **disabled qilmaydi** (CMP-06) — submit'da tekshiring va faylga ishora qiling.
- Drop zone — ko'rinadigan chegarasi bor yagona konteyner (1.7 Border istisnosi): uzuq chiziq border/strong 1, Drag over — border/accent 2 + accent/soft, Error — border/danger 2. Qolgan hammasi chegarasiz.

## Prop'lar (umumiy)

| Prop                               | Vazifa                                                                                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accept` · `multiple` · `name`     | `<input type="file">` atributlari. `accept` drag-and-drop'da ham tekshiriladi.                                                                              |
| `maxSize`                          | Eng katta hajm, baytda. Oshgani `rejected` ga `file-too-large` bilan tushadi.                                                                               |
| `files`                            | Boshqariladigan ro'yxat (`UploaderFile[]`: `id`, `name`, `size`, `status`, `progress`, `error`). Berilmasa komponent tanlanganlarni o'zi saqlaydi (`done`). |
| `onFilesAdded(accepted, rejected)` | Tanlangan/tashlangan fayllar. `rejected[].reason`: `file-too-large` · `file-invalid-type` · `too-many-files`.                                               |
| `onRemove` · `onRetry`             | File item'dagi Remove tugmasi va Retry havolasi.                                                                                                            |
| `messages`                         | `aria-live` e'lonlari va rad etish sabablari matni (lokalizatsiya).                                                                                         |

`formatFileSize(bytes)` ("2.4 MB"), `matchesAccept(file, accept)` va `validateFiles(files, rules)` ham eksport qilinadi — server bilan bir xil tekshiruv uchun.

Holatlar prop emas: Hover/Focus — CSS, Loading — `files` da `uploading` bor, Filled — ro'yxat bo'sh emas, Error — `error` holatidagi fayl, Drag over — sudrash paytida, Disabled — `disabled`.

## A11y

- Haqiqiy `<input type="file">` ko'rinmas (`tabIndex=-1`); uni Button (File), browse havolasi (Drop zone) yoki tile (Media) ochadi — Enter/Space bilan ham ishlaydi. Drag-and-drop'ning klaviatura muqobili — browse.
- Boshqarilmaydigan rejimda ichki input ro'yxatga sinxronlanadi — oddiy `<form>` yuborishda o'chirilgan fayllar ketmaydi.
- Qo'shish, o'chirish, rad etish va `uploading → done/error` o'zgarishlari `role="status"` (aria-live) orqali e'lon qilinadi. Remove'dan keyin fokus tugma/browse'ga qaytadi.
- Remove tugmasi nomi fayl nomi bilan ("Remove Passport-scan-front.pdf"); progress — `role="progressbar"`, nomi fayl nomi.
- Media tile — butun tile bosiladigan nishon (S 80 ≥ target/min 44). `showLabel={false}` bo'lsa matn `aria-label` sifatida qoladi.

## O'lchamlar va RTL

File item: padding 12, gap 12, radius/surface/md, Name Label/M (bir qatorda qisqaradi), Meta Caption/M, Progress bar S Accent, Remove — Button Flat M Icon only. File: `m` → Button L 36, `l` → Button XL 44. Drop zone: padding 32, gap 16, radius/surface/lg, ikonka 32, Title Body/M, Hint Caption/L. Media: ikonka 20 · 24 · 32, Remove — Button Raised M burchakda 6 px, badge'lar pastda 6 px. RTL — logical xossalar bilan o'zi aks etadi.
