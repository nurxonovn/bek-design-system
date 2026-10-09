# Overlays

Figma: **7 · Overlays** (7.1–7.11). Barcha bloklovchi oynalar native `<dialog>` (`showModal`) ustida:
fokus ichida ushlanadi, fon `inert`, Esc va scrim (`bg/overlay`) yopadi (Alert dialog'dan tashqari).
Trigger'ga bog'langan oynalar (Popover, menyular, Hover card) — `document.body` ga portal,
`position: fixed`, sig'masa teskari tomonga o'tadi; tashqariga bosish va Esc yopadi, fokus trigger'ga qaytadi.

| Komponent                                                        | Figma               | Asosiy prop'lar                                                                                                                                             |
| ---------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Modal`                                                          | 7.1 Modal           | `open`, `onClose`, `size` s 480 · m 720 · l 900, `variant` default · danger, `title`, `description`, `primaryAction`, `cancelAction`, `footer`, `hideClose` |
| `BottomSheet`                                                    | 7.1 Sheet · 7.9     | `type` default · content · promo, `title`, `description`, `media`, `primaryAction`, `secondaryAction`, `showHandle`, `showClose`                            |
| `Drawer`                                                         | 7.2 Drawer          | `side` right · left, `size` s 360 · m 480 · l 640, `divider` + Modal prop'lari                                                                              |
| `Popover`                                                        | 7.3 Popover         | `trigger`, `open`/`defaultOpen`/`onOpenChange`, `placement`, `size` s 280 · l 360, `tail`, `title`, `description`, `primaryAction`, `secondaryAction`       |
| `DropdownMenu` · `MenuItem` · `MenuGroupLabel` · `MenuSeparator` | 7.4 Dropdown menu   | `trigger`, `placement`, `size` s 32 · m 40; MenuItem: `icon`, `hotkey`, `danger`, `disabled`, `selected`, `onSelect`, `submenu`                             |
| `ContextMenu`                                                    | 7.5 Context menu    | `menu` (MenuItem'lar), `children` — o'ng tugma / uzoq bosish (500 ms) hududi                                                                                |
| `AlertDialog`                                                    | 7.6 Alert dialog    | `variant` info · success · warning · danger, `layout` inline · stacked, `confirmAction`, `cancelAction`, `icon`                                             |
| `CommandPalette` · `CommandGroup` · `CommandItem`                | 7.7 Command palette | `query`, `onQueryChange`, `placeholder`, `empty`, `hints`; CommandItem: `icon`, `hotkey`, `onSelect`, `closeOnSelect`                                       |
| `HoverCard`                                                      | 7.8 Hover card      | `trigger`, `placement`, `openDelay` 500, `closeDelay` 300                                                                                                   |
| `ActionSheet`                                                    | 7.10 Action sheet   | `actions` `{ label, icon, onSelect, destructive, disabled }[]`, `title`, `message`, `platform` android · ios                                                |
| `ShareSheet`                                                     | 7.11 Share sheet    | `title`, `link`, `thumbnail`, `contacts`, `targets`, `showLinkField`, `onCopy`                                                                              |

```tsx
import { AlertDialog, DropdownMenu, MenuItem, MenuSeparator, Modal } from '@bek/react';

<Modal open={open} onClose={() => setOpen(false)} title="Edit profile"
  primaryAction={{ label: 'Save', onClick: save }} cancelAction={{ label: 'Cancel' }}>
  …
</Modal>

<DropdownMenu trigger={<Button variant="outline">Actions</Button>} aria-label="Order actions">
  <MenuItem icon={<EditIcon />} hotkey="⌘E" onSelect={edit}>Edit</MenuItem>
  <MenuItem icon={<ExportIcon />} submenu={<><MenuItem>PDF</MenuItem><MenuItem>CSV</MenuItem></>}>Export</MenuItem>
  <MenuSeparator />
  <MenuItem icon={<TrashIcon />} danger onSelect={askDelete}>Delete</MenuItem>
</DropdownMenu>

<AlertDialog open={confirm} onClose={() => setConfirm(false)} variant="danger"
  title="Delete this order?" description="This cannot be undone."
  confirmAction={{ label: 'Delete', onClick: remove }} cancelAction={{ label: 'Cancel' }} />
```

## Tokenlar

- Dialog sirti: `surface/raised`, chegarasiz, `Elevation/4`; Modal/Drawer/Alert radius 16; sarlavha Headline/S (Alert — Title/L), izoh Body/S `text/secondary`; header padding 24 24 16, footer 24 (gap 12, o'ngda). Yopish tugmasi 32, radius 8, hover `fill/tertiary`.
- Bottom sheet: yuqori radius 24, dastak 36×4 `fill/control`, footer Action XL + Flat secondary XL, home indicator hisobga olinadi.
- Popover: radius 12, `Elevation/2`, padding 16, gap 12, dum 12×6. Menu: 240 (submenu 200, ota menyudan 4 px), radius 8, padding 4, `Elevation/2`; element hover `fill/tertiary-hover`, selected `fill/strong`, danger `text/danger` + `status/danger/soft`.
- Command palette: 640, `fill/primary`, radius 16, `Elevation/4`; < 600 px — to'liq kenglik, yuqorida, ishoralarsiz.
- Hover card: 320, `fill/primary`, radius 12, `Elevation/3`, `z/dropdown`; touch'da ochilmaydi, fokusda ochiladi.
- Harakat: Modal/Alert/Command — `scale-enter` 0.96 + fade (`motion/overlay/modal/enter`); Drawer va sheet'lar — siljish (`motion/overlay/slide`); anchored — `motion/overlay/anchored/enter`. `prefers-reduced-motion` da o'chadi.

## Klaviatura

- Dropdown/Context menu: ↓ ↑ Home End, Enter/Space — tanlash, → submenu ochadi, ← yopadi, Esc — yopib fokusni trigger'ga qaytaradi, Tab — yopadi. Trigger'da ↓/↑ ham ochadi.
- Command palette: input'da ↑ ↓ (`aria-activedescendant`), Enter — tanlash, Esc — yopish.
- Alert dialog: Esc va scrim **yopmaydi** — faqat tugmalar (`role="alertdialog"`).

## Do / Don't

- ✅ Modal — bitta vazifa, ikki tugmagacha. ❌ Modal ustida Modal.
- ✅ Qaytarib bo'lmaydigan amal — AlertDialog, savol shaklidagi sarlavha. ❌ Danger amal uchun oddiy Modal'siz tasdiqlash.
- ✅ Hover card faqat o'qish uchun. ❌ Ichida tugmalar — buning uchun Popover.
