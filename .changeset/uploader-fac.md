---
'@bek-ui/react': minor
---

Yangi komponentlar: Uploader (Figma 3.17 — `MediaUploader`, `FileUploader`, `DropZone`, `FileItem`; haqiqiy `<input type="file">`, `accept`/`multiple`/`maxSize` tekshiruvi, drag-and-drop va browse klaviatura muqobili, progress/xato/Remove/Retry, `aria-live` e'lonlari; yordamchilar `formatFileSize`, `matchesAccept`, `validateFiles`), `FloatingActions` (Figma 6.9 Floating action container — `single`/`horizontal`/`vertical`/`summary`, safe-area va RTL) va `ScrollArea` (Figma 4.8 Scrollbar). Ichki ikonkalar (`src/icons`): upload-01, file-01, image-add-01, image-01, video-01. `.bek-scrollbar` endi Chromium'da ham Figma o'lchamlarini (12/8 px, thumb kamida 32 px) beradi: standart `scrollbar-color`/`scrollbar-width` faqat Firefox uchun.
