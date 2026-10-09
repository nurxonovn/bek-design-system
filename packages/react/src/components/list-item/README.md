# ListItem

Figma: **4.4 List item** — ro'yxat qatori, chap (`leading`: Checkbox, Icon, Avatar) va o'ng (`trailing`: Badge, Switch, qiymat; `chevron`) slotlar bilan. `size`: `s` 48 · `m` 56 · `l` 72 px (min).

```tsx
<ListItem leading={<Avatar name="Nurbek" />} title="Nurbek" description="Dizayner" chevron href="/u/1" />
<ListItem title="Wi-Fi" trailing={<Switch checked={wifi} onChange={toggle} aria-label="Wi-Fi" />} />
<ListItem title="Uzbek" selected onClick={() => setLang('uz')} />
```

Fokus faqat butun qator havola (`href`) yoki tugma (`onClick`) bo'lganda — Enter ochadi. Qatorlar orasida `border/hairline` ajratuvchi o'zi chiziladi.
