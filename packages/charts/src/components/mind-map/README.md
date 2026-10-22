# Mind map

Figma: **4.19 Diagram · Mind map** — markaziy g'oya va uning shoxlari. `layout`: `radial` · `tree`.

```tsx
<MindMap
  label="BEK launch: 6 yo'nalish"
  root={{ label: 'BEK launch', children: [{ label: 'Product' }, { label: 'Marketing' }] }}
/>
<MindMap
  layout="tree"
  label="Q4 goals: 3 shox, 6 barg"
  root={{
    label: 'Q4 goals',
    children: [{ label: 'Product', children: [{ label: 'Mobile app' }, { label: 'AI tutor' }] }],
  }}
/>
```

- **Qachon:** brainstorm, loyiha doirasi, onboarding mavzulari — 3–8 shox. Ketma-ket jarayon uchun emas — `Swimlane` yoki `DiagramConnector` bilan oqim.
- **Tarkib:** ildiz — `DiagramNode` Terminal, shoxlar — Process; Tree'da barglar nuqta + Body/S. Bog'lanishlar kubik egri, `chart/line/stroke`, har shox o'z kategorik rangida (`--bek-dataviz-categorical-01…08`).
- **Qoidalar:** nom ≤ 3 so'z; Radial 3–8 shox (ko'p bo'lsa Tree); Tree balandligi barglar soniga qarab o'sadi, kenglik `width` (standart `scale/720`) — geometriya cho'zilmaydi, tor ekranda gorizontal scroll.
- **Holatlar:** hover shox — shox, uning bog'lanishlari va barglari qoladi, qolganlari 0.3 ga so'nadi (CSS); `collapsed: true` shox Tree'da barglar o'rniga "+n" ko'rsatadi (ekran o'quvchi ro'yxatida barglar qoladi). Tahrirlash va bo'sh holat ("Add a branch") — ilova darajasida.
- **A11y:** canvas `role="img"` + `label`; to'liq ierarxiya ekran o'quvchi uchun ichma-ich ro'yxat (`bek-chart__sr`) sifatida takrorlanadi. Rang yagona belgi emas — shox nomi har doim yozilgan.
- **O'lchamlar:** canvas `bg/sheet`, `radius/surface/md`, ichki chekka `scale/24`; tugun 160 × 56; nuqta `chart/point-size`.
