# Avatar

Figma: **4.1 Avatar** — `size`: `s` 32 · `m` 40 · `l` 48 · `xl` 64 px; `status`: `online` · `away` · `busy`.

```tsx
<Avatar src={user.photo} name="Nurbek Nurxonov" status="online" />
<Avatar name="Nurbek Nurxonov" size="s" />   // rasm yo'q — "NN"
<Avatar />                                     // ism ham yo'q — user ikonka
```

Turi o'zi tanlanadi: `src` → rasm (yuklanmasa — bosh harflar), `name` → bosh harflar, aks holda ikonka. `name` ekran o'quvchi nomi bo'ladi (`role="img"`); ismsiz avatar bezak sifatida yashiriladi.
