# Cluster map

Figma: **4.18 Chart · Cluster map** — embedding / segmentatsiya ko'rinishi: har nuqta 2D ga proyeksiya qilingan element (UMAP, t-SNE), rang = klaster, yumshoq hull 10%. `variant`: `default` (legend) · `labeled` (AI bergan klaster nomlari).

```tsx
<ClusterMap
  variant="labeled"
  points={points /* [{ x: 0.12, y: -0.4, cluster: 'savers', label: 'Client 1042' }] */}
  clusters={[
    { id: 'savers', label: 'Savers' },
    { id: 'young', label: 'Young spenders' },
    { id: 'business', label: 'Business' },
    { id: 'travel', label: 'Travelers' },
  ]}
  caption="UMAP of 12 features · AI-named clusters"
  label="Four customer segments; Savers and Business overlap slightly"
/>
```

- **Qachon:** mijoz segmentlari, hujjat mavzulari, embedding tadqiqoti. Aniq masofani o'qish uchun emas — o'qlarda birlik yo'q.
- **Kodlash:** x, y = 2D proyeksiya (bir xil masshtab, shakllar cho'zilmaydi, chizma markazda), rang = klaster (Figma tartibi: categorical 01 · 02 · 03 · 06 · …), hull — klaster rangi 10%, nuqta r 3, 85%.
- **Qoidalar:** tick qiymatlari yo'q; `caption` nima va qanday proyeksiya qilinganini aytadi (Caption/S · `dataviz/label`); AI bergan nomlar AI deb belgilansin va tahrirlanadigan bo'lsin.
- **Interaksiya:** nuqta ustida `<title>` (element va klaster); legend bosilganda klaster fokuslanadi, qolganlari 25% (`focused` / `onFocusChange` bilan boshqarish mumkin); hover ham shunday.
- **A11y:** `role="img"` + `label`, ko'rinmas `<table>` — klaster, hajm va misol elementlar. Labeled pill'lar (`fill/inverse` · `text/inverse`, Label/S) bezak (`aria-hidden`), nomlar jadvalda.
- **O'lchamlar:** plot balandligi `scale/200` (`height`), eni konteynerga ergashadi.
