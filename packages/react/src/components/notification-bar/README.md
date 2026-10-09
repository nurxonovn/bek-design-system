# NotificationBar

Figma: **5.6 Notification bar**. Mobil snackbar — ekran pastida bir qatorli xabar.

```tsx
import { NotificationBar } from '@bek/react';

<NotificationBar tone="success" action={{ label: 'Undo', onClick: undo }}>
  Item moved to archive
</NotificationBar>;
```

| Prop       | Qiymatlar                                                       | Default   |
| ---------- | --------------------------------------------------------------- | --------- |
| `tone`     | `neutral` · `info` · `success` · `warning` · `danger` (= error) | `neutral` |
| `children` | bir qatorli xabar, Body/S                                       | —         |
| `action`   | `{ label, onClick }`, Label/S                                   | —         |
| `icon`     | holat ikonkasi o'rniga; `null` — ikonkasiz                      | holat     |

- Doim Dark rejimda (`data-theme="dark"` o'zi qo'yiladi): `surface/raised`, `Elevation/3`, padding 12 × 16, gap 8, radius `surface/xl`, Solid ikonka 20.
- `role="status"`. Taxminan 4 s dan keyin yashiring (taymer ilovada).

## Do / Don't

- ✅ Qisqa tasdiq: "Copied", "Item moved to archive". ❌ Xato tafsilotlari — ular uchun Alert.
