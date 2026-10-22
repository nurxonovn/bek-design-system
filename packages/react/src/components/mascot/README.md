# Mascot

Figma: **2.3 Mascot** — BEK maskoti, panda: `Mascot` (sprite-sheet kadri) va `MascotMessage` (maskot + sarlavha + tavsif + tugma). `pose`: `idle` + 8 qarash (`look-up`, `look-down-right` …) + 9 his (`happy`, `love`, `success`, `celebrate`, `wink`, `surprised`, `shy`, `sleepy`, `dizzy`); `size`: `xs` 32 · `s` 48 · `m` 64 · `l` 96 · `xl` 140 · `2xl` 200.

```tsx
<Mascot pose="sleepy" />                       // L 96, bezak (aria-hidden)
<Mascot pose="wink" size="m" label="BEK panda" />
<Mascot interactive size="xl" />                // kursorga qaraydi, bosganda reaksiya — landing, onboarding, 404

<MascotMessage pose="sleepy" title="Hali kurslar yo'q" description="Birinchi kursni qo'shing — tarix shu yerda ko'rinadi." action={{ label: "Kurs qo'shish", onClick: add }} />
<MascotMessage layout="inline" pose="love" size="m" title="Sevimlilarga qo'shildi" description="Saqlangan darslar Sevimlilar bo'limida." />
```

Varaqlar: panda `page-mascot` (MIT © Kamran Ahmed) dan, paket ichida (`@bek-ui/react/assets/mascot/panda-{directions,reactions}.webp`) — standart holatda avtomatik yuklanadi; `directions` / `reactions` prop'lari bilan boshqa personaj berish mumkin. Bundler (Vite, webpack) varaqlarni o'zi oladi; bundler'siz Node SSR'da yoki Vite dev'da paket pre-bundle qilinsa (`optimizeDeps.exclude: ['@bek-ui/react']`) — URL'larni prop bilan bering.

Qoidalar (Figma doc):

- Maskot **doim matn bilan**: maskot hisni, matn ma'noni tashiydi. Ekranda bitta maskot, hislar aralashtirilmaydi.
- His ekran ma'nosiga mos: bo'sh holat → `sleepy`, xato / 404 / aloqa uzildi → `dizzy`, muvaffaqiyat → `success`, onboarding → `wink`, yangilik → `surprised`, sevimlilar / rahmat → `love`.
- Statik holatda qarash pozalari ishlatilmaydi (faqat `idle` yoki his); qarashlar `interactive` rejim uchun.
- Rasm ranglari o'zgartirilmaydi, fon shaffof. Dark rejimda `fill/tertiary-hover` yoki undan yorug' yuzaga qo'ying — eng qorong'i yuzada qora quloqlar ko'rinmaydi.
- O'lchamlar: XS chat/inline · S toast, list item · M karta · L empty state · XL hero, onboarding · 2XL 404, to'liq ekran. Minimum XS 32.
- `label` berilmasa bezak (`aria-hidden`); yolg'iz yoki interaktiv bo'lsa `label="BEK panda"`.
- `MascotMessage`: `surface/card`, padding 32, gap 24, sarlavha ↔ tavsif 8; tugma `Button · action · m`. Figma doc jadvalida sarlavha Title/L, komponentda Headline/S — kod komponentga ergashadi.
