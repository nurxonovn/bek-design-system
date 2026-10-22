# Button

Figma: **3.1 Button**. Har qanday amal uchun bitta komponent: 22 Variant × 5 o'lcham, pill shakli.

```tsx
import { Button } from '@bek-ui/react';

<Button variant="action">Save changes</Button>
<Button variant="outline-danger" size="l" startIcon={<TrashIcon />}>Delete</Button>
<Button loading>Saving</Button>
<Button variant="flat" pressed={isBold} onClick={toggleBold}>Bold</Button>
<Button variant="flat" iconOnly startIcon={<CloseIcon />}>Close</Button>   // "Close" — ekran o'quvchi uchun
```

| Prop        | Qiymatlar                                                                                                                                                                                                          | Default  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `variant`   | `normal` · `action` · `danger` · `raised` · `outline` · `outline-{action·info·success·warning·danger·utility}` · `flat` · `flat-{…}` · `flat-secondary` · `normal-contrast` · `outline-contrast` · `flat-contrast` | `normal` |
| `size`      | `m` 28 · `l` 36 · `xl` 44 · `2xl` 52 · `3xl` 60 px                                                                                                                                                                 | `m`      |
| `startIcon` | `ReactNode` — o'lchami tugmaga qarab: 16 · 16 · 20 · 24 · 24 px                                                                                                                                                    | —        |
| `endIcon`   | `ReactNode`                                                                                                                                                                                                        | —        |
| `loading`   | spinner start icon o'rnida, `aria-busy`, bosish bloklanadi, ranglar saqlanadi                                                                                                                                      | `false`  |
| `pressed`   | toggle — `aria-pressed` (Figma: State=Selected)                                                                                                                                                                    | —        |
| `iconOnly`  | faqat ikonka; `children` ko'rinmas nom bo'lib qoladi                                                                                                                                                               | `false`  |

Qolgan `<button>` atributlari (`disabled`, `type`, `onClick`, `aria-*`) o'tadi; `type` default — `button`. Focus — `.bek-focus-ring` (faqat klaviatura).

## Qachon qaysi variant

- **Action** — hududdagi bitta asosiy amal (Save, Pay, Continue).
- **Normal, Outline** — asosiy amal yonidagi ikkinchi darajali (Cancel, Back, Export).
- **Flat** — toolbar, jadval qatori, "Show more".
- **Danger / Outline-danger / Flat-danger** — qaytarib bo'lmaydigan amal; Alert dialog (7.6) bilan tasdiqlang.
- info / success / warning / utility ohanglari — faqat ma'no tashisa. **Raised** — xarita yoki media ustida. **Contrast** — faqat to'q yoki rasm fon ustida.

## O'lcham va qurilma

- Mobile: default **xl** (44 px), asosiy amal **2xl** va to'liq kenglik; touch'da xl dan kichik emas.
- Tablet: touch'da xl, pointer toolbarida l.
- Web: formalarda **l**, zich UI'da (jadval, filtr) **m**; xl–3xl faqat marketing CTA.
- Guruhdagi oraliq: m/l — 8 px, xl–3xl — 12 px. Bir guruhda bitta o'lcham, ko'pi bilan 3 tugma.

## Matn

Fe'l bilan boshlang va natijani ayting: "Save changes", "Create project". 1–3 so'z, gap shaklida, nuqtasiz, bir qatorda. Sahifani almashtirsa — bu havola, tugma emas.
