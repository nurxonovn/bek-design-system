# Toast

Figma: **5.1 Toast**. Amal natijasi haqida qisqa vaqtli xabar ("Saved", "Payment failed").

```tsx
import { Toast, ToastViewport } from '@bek-ui/react';

<ToastViewport placement="bottom-end">
  <Toast
    tone="success"
    title="Changes saved"
    action={{ label: 'Undo', onClick: undo }}
    onClose={close}
  />
  <Toast variant="subtle" tone="danger" title="Payment failed" description="Try another card." />
</ToastViewport>;
```

| Prop          | Qiymatlar                                             | Default   |
| ------------- | ----------------------------------------------------- | --------- |
| `variant`     | `solid` · `subtle`                                    | `solid`   |
| `tone`        | `neutral` · `info` · `success` · `warning` · `danger` | `neutral` |
| `title`       | qisqa natija                                          | —         |
| `description` | ixtiyoriy izoh                                        | —         |
| `action`      | `{ label, onClick }` — bitta amal (Undo, Retry)       | —         |
| `onClose`     | berilsa — yopish tugmasi                              | —         |
| `icon`        | standart holat ikonkasi o'rniga; `null` — ikonkasiz   | holat     |

`ToastViewport` — `position: fixed` qatlam, `z/toast`; `placement`: `bottom` · `top` · `bottom-end` · `top-end` (keng ekranda burchakda).

- Tokenlar: Solid — fon `status/{tone}/default` (neutral `fill/inverse`), matn `text/on-color` (warning `text/on-warning`, neutral `text/inverse`). Subtle — fon `status/{tone}/soft` (neutral `fill/soft-hover`), sarlavha `text/{tone}`, izoh `text/secondary`, amal `text/accent`. Padding 16, gap 12, radius `surface/sm`, `Elevation/3`.
- A11y: `warning`/`danger` — `role="alert"`, qolganlari — `role="status"`. Yopish tugmasi `closeLabel` bilan nomlanadi.
- Taymer (odatda 4–6 s) ilovada; amal bor toast'ni hover/fokusda to'xtating.

## Do / Don't

- ✅ Bitta toast — bitta xabar va ko'pi bilan bitta amal. ❌ Toast ichida forma yoki bir nechta tugma.
- ✅ Muhim xatoni Alert yoki dialog bilan ham ko'rsating. ❌ Qaytarib bo'lmaydigan ma'lumotni faqat toast'da berish.
