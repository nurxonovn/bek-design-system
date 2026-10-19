# Chord diagram

Figma: **4.18 Chart · Chord** — guruhlar orasidagi ikki tomonlama oqim: tashqi yoy — guruhning chiquvchi jami, lenta — juftlik orasidagi oqim (`d3-chord`). `variant`: `default` · `focus`.

```tsx
<ChordDiagram
  labels={['Toshkent', 'Samarqand', 'Buxoro', 'Andijon']}
  matrix={[
    [0, 120, 80, 60],
    [90, 0, 30, 20],
    [50, 25, 0, 10],
    [40, 15, 12, 0],
  ]}
  variant="focus"
  focus="Toshkent"
  label="Most transfers start in Toshkent; Toshkent → Samarqand is the largest flow"
/>
```

- **Qachon:** 3–10 guruh orasidagi ikki yo'nalishli oqim (hududlar orasidagi o'tkazmalar, tariflar orasidagi migratsiya) — "kim kim bilan eng ko'p almashadi?". Ko'proq guruh — `SankeyChart` yoki matritsa. `focus` — hikoya bitta guruh bog'lanishlari haqida bo'lsa.
- **Kodlash:** yoy burchagi = guruhning chiquvchi jami, lenta uchidagi eni = shu yo'nalishdagi oqim (A → B — A yoyida, B → A — B yoyida), rang = guruh (`dataviz/categorical/01–06`); `default` da lenta rangi — kattaroq manba. `focus` — tanlangan guruh va uning lentalari `categorical/01`, qolgani `dataviz/neutral`. Kirish — kvadrat matritsa `matrix[from][to]`.
- **Lentalar:** qatlam shaffofligi 0.42 — CSS `opacity` (BND-09), rang alfasi emas. Guruhlar tartibini kesishmalar kam bo'ladigan qilib bering (kattasi eng katta hamkori yonida).
- **Interaksiya:** hover yoy — shu guruh lentalari qoladi, qolganlari 0.1, `<title>` kirish / chiqish jami; hover lenta — `<title>` A → B va B → A. Focus'ni almashtirish (yoyni bosish, strelkalar, Enter) — ota komponent `focus` ni boshqaradi.
- **A11y:** `role="img"` + `label`; ko'rinmas matritsa jadvali, sarlavhasida eng katta 3 oqim va Focus guruhi matnda aytiladi.
- **O'lchamlar:** chizma markazdagi kvadratda (`min(width, height)`, `scale/200`) — cho'zilmaydi; eni `scale/480`. Yoy qalinligi `scale/8`, guruh nomi Caption/S · `text/secondary` halqa tashqarisida.
