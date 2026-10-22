# InfoWrap

Figma: **5.5 Info wrap**. Forma yoki karta ichidagi kichik yordamchi izoh bloki.

```tsx
import { InfoWrap } from '@bek-ui/react';

<InfoWrap icon={<TruckIcon />}>Delivery is free from 200 000 sum</InfoWrap>
<InfoWrap emphasis title="Free delivery" onInfo={openDetails}>From 200 000 sum</InfoWrap>
```

| Prop        | Qiymatlar                                     | Default     |
| ----------- | --------------------------------------------- | ----------- |
| `emphasis`  | `true` — `fill/tertiary` fon                  | `false`     |
| `icon`      | boshidagi (leading) 16 px ikonka              | —           |
| `title`     | ikki qatorli ko'rinish, Label/M `text/accent` | —           |
| `children`  | matn, Caption/L `text/primary`                | —           |
| `onInfo`    | berilsa — oxirida "info" tugmasi (16 px)      | —           |
| `infoLabel` | info tugmasi nomi                             | `More info` |

- Tokenlar: fon `fill/secondary`, padding 12 × 16, gap 8, radius `surface/xl`.

## Do / Don't

- ✅ Bir-ikki qatorli maslahat. ❌ Xato yoki ogohlantirish — ular uchun Alert.
