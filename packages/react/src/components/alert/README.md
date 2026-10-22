# Alert

Figma: **5.4 Alert**. Sahifa ichidagi doimiy xabar: nima bo'ldi, nega va keyingi qadam.

```tsx
import { Alert } from '@bek-ui/react';

<Alert tone="danger" title="Payment failed" primaryAction={{ label: 'Retry', onClick: retry }}
  secondaryAction={{ label: 'Later' }} onClose={dismiss}>
  Your card was declined. Try another card.
</Alert>
<Alert variant="solid" tone="warning" layout="stacked" title="Low balance">Add funds to continue.</Alert>
```

| Prop              | Qiymatlar                                                | Default  |
| ----------------- | -------------------------------------------------------- | -------- |
| `variant`         | `subtle` · `solid`                                       | `subtle` |
| `tone`            | `neutral` · `info` · `success` · `warning` · `danger`    | `info`   |
| `layout`          | `inline` (amallar yonida) · `stacked` (matn ostida)      | `inline` |
| `title`           | Title/S                                                  | —        |
| `children`        | izoh, Body/S                                             | —        |
| `primaryAction`   | `{ label, onClick }` — `action` (danger: `danger`) tugma | —        |
| `secondaryAction` | `{ label, onClick }` — `flat` tugma                      | —        |
| `onClose`         | berilsa — yopish tugmasi                                 | —        |
| `icon`            | holat ikonkasi o'rniga; `null` — ikonkasiz               | holat    |

- Tokenlar: Subtle — fon `status/{tone}/soft` (neutral `fill/tertiary`), Stroke ikonka 20 `text/{tone}`, sarlavha `text/primary`, izoh `text/secondary`. Solid — fon `status/{tone}/default` (neutral `fill/inverse`), matn `text/on-color` (warning `text/on-warning`), asosiy tugma `normal-contrast`. Padding 16, gap 12, radius `surface/md`.
- A11y: `warning`/`danger` — `role="alert"`, qolganlari — `role="status"`.

## Do / Don't

- ✅ Sabab va yechim: "Card declined — try another card". ❌ Faqat "Error".
- ✅ Bitta blokda bitta Alert. ❌ Bir nechta Alert'ni ketma-ket qalashtirish.
