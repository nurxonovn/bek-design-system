# @bek/react

BEK Design System React komponentlari. Uslub — oddiy CSS va `@bek/tokens` o'zgaruvchilari (`--bek-*`); iste'molchidan Tailwind talab qilinmaydi.

- Holatlar (hover, pressed, focus) — CSS (`:hover`, `:active`, `:focus-visible`), prop emas.
- RTL — `dir="rtl"` va CSS logical properties.
- Accessibility asosi — Radix primitives.

## Ishlatish

```tsx
import '@bek/tokens/tokens.css';
import '@bek/react/styles.css';
import { Badge, BekLogo, Button, Tag } from '@bek/react';
```

## Komponentlar

| Komponent                                                                                                                                                       | Figma sahifasi         | Hujjat                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------- |
| `BekLogo`                                                                                                                                                       | 2.2 Logo & Brand       | [README](src/components/logo/README.md)              |
| `Mascot` · `MascotMessage`                                                                                                                                      | 2.3 Mascot             | [README](src/components/mascot/README.md)            |
| `Pattern`                                                                                                                                                       | 2.5 Pattern            | [README](src/components/pattern/README.md)           |
| `Button`                                                                                                                                                        | 3.1 Button             | [README](src/components/button/README.md)            |
| `TextField`                                                                                                                                                     | 3.2 Text field         | [README](src/components/text-field/README.md)        |
| `Select`                                                                                                                                                        | 3.3 Select             | [README](src/components/select/README.md)            |
| `Checkbox`                                                                                                                                                      | 3.4 Checkbox           | [README](src/components/checkbox/README.md)          |
| `Radio`                                                                                                                                                         | 3.5 Radio              | [README](src/components/radio/README.md)             |
| `Switch`                                                                                                                                                        | 3.6 Switch             | [README](src/components/switch/README.md)            |
| `Textarea`                                                                                                                                                      | 3.7 Textarea           | [README](src/components/textarea/README.md)          |
| `Slider` · `RangeSlider`                                                                                                                                        | 3.8 Slider             | [README](src/components/slider/README.md)            |
| `Stepper`                                                                                                                                                       | 3.9 Stepper            | [README](src/components/stepper/README.md)           |
| `SegmentedControl`                                                                                                                                              | 3.10 Segmented control | [README](src/components/segmented-control/README.md) |
| `BaseSelector`                                                                                                                                                  | 3.11 Base selector     | [README](src/components/base-selector/README.md)     |
| `SearchBar`                                                                                                                                                     | 3.12 Search bar        | [README](src/components/search-bar/README.md)        |
| `Chip`                                                                                                                                                          | 3.13 Chip              | [README](src/components/chip/README.md)              |
| `DatePicker`                                                                                                                                                    | 3.14 Date picker       | [README](src/components/date-picker/README.md)       |
| `TimeSlotPicker`                                                                                                                                                | 3.15 Time slot picker  | [README](src/components/time-slot/README.md)         |
| `SelectorCard` · `SelectorGroup`                                                                                                                                | 3.16 Selector card     | [README](src/components/selector-card/README.md)     |
| `Link`                                                                                                                                                          | 3.18 Link              | [README](src/components/link/README.md)              |
| `Fieldset`                                                                                                                                                      | 3.19 Fieldset          | [README](src/components/fieldset/README.md)          |
| `Avatar`                                                                                                                                                        | 4.1 Avatar             | [README](src/components/avatar/README.md)            |
| `Badge`                                                                                                                                                         | 4.2 Badge              | [README](src/components/badge/README.md)             |
| `Tag`                                                                                                                                                           | 4.2 Badge              | [README](src/components/tag/README.md)               |
| `Card`                                                                                                                                                          | 4.3 Card               | [README](src/components/card/README.md)              |
| `ListItem`                                                                                                                                                      | 4.4 List item          | [README](src/components/list-item/README.md)         |
| `Table`                                                                                                                                                         | 4.5 Table              | [README](src/components/table/README.md)             |
| `ProgressBar`                                                                                                                                                   | 4.6 Progress           | [README](src/components/progress/README.md)          |
| `CodeInput` · `Pinpad`                                                                                                                                          | 4.7 Pincode            | [README](src/components/pincode/README.md)           |
| `Price`                                                                                                                                                         | 4.9 Price              | [README](src/components/price/README.md)             |
| `Rating`                                                                                                                                                        | 4.10 Rating            | [README](src/components/rating/README.md)            |
| `Carousel`                                                                                                                                                      | 4.11 Carousel          | [README](src/components/carousel/README.md)          |
| `Accordion`                                                                                                                                                     | 4.12 Accordion         | [README](src/components/accordion/README.md)         |
| `Separator`                                                                                                                                                     | 4.13 Separator         | [README](src/components/separator/README.md)         |
| `ProductCard`                                                                                                                                                   | 4.14 Product card      | [README](src/components/product-card/README.md)      |
| `OrderWidget`                                                                                                                                                   | 4.15 Widget            | [README](src/components/order-widget/README.md)      |
| `DescriptionList` · `DescriptionListItem`                                                                                                                       | 4.16 Description list  | [README](src/components/description-list/README.md)  |
| `Toast` · `ToastViewport`                                                                                                                                       | 5.1 Toast              | [README](src/components/toast/README.md)             |
| `Tooltip` · `TooltipCallout`                                                                                                                                    | 5.2 Tooltip            | [README](src/components/tooltip/README.md)           |
| `EmptyState`                                                                                                                                                    | 5.3 Empty state        | [README](src/components/empty-state/README.md)       |
| `Alert`                                                                                                                                                         | 5.4 Alert              | [README](src/components/alert/README.md)             |
| `InfoWrap`                                                                                                                                                      | 5.5 Info wrap          | [README](src/components/info-wrap/README.md)         |
| `NotificationBar`                                                                                                                                               | 5.6 Notification bar   | [README](src/components/notification-bar/README.md)  |
| `Loader` · `PullToRefresh`                                                                                                                                      | 5.7 Loading            | [README](src/components/loader/README.md)            |
| `Skeleton`                                                                                                                                                      | 5.7 Loading            | [README](src/components/skeleton/README.md)          |
| `Tabs` · `TabList` · `Tab` · `TabPanel`                                                                                                                         | 6.1 Tabs               | [README](src/components/tabs/README.md)              |
| `NavItem` · `NavGroup` · `MenuPanel` · `ModuleRail` · `NavRail` · `NavDrawer` · `AppShell`                                                                      | 6.2 Navigation         | [README](src/components/navigation/README.md)        |
| `Breadcrumb`                                                                                                                                                    | 6.3 Breadcrumb         | [README](src/components/breadcrumb/README.md)        |
| `Pagination` · `LoadMore`                                                                                                                                       | 6.4 Pagination         | [README](src/components/pagination/README.md)        |
| `AppBar`                                                                                                                                                        | 6.5 App bar            | [README](src/components/app-bar/README.md)           |
| `TopNavigation`                                                                                                                                                 | 6.6 Top navigation     | [README](src/components/top-navigation/README.md)    |
| `BottomNavigation` · `BottomNavItem`                                                                                                                            | 6.7 Bottom navigation  | [README](src/components/bottom-navigation/README.md) |
| `CheckoutBar` · `CartPill`                                                                                                                                      | 6.8 Checkout bar       | [README](src/components/checkout-bar/README.md)      |
| `Modal` · `Drawer` · `BottomSheet` · `Popover` · `DropdownMenu` · `ContextMenu` · `AlertDialog` · `CommandPalette` · `HoverCard` · `ActionSheet` · `ShareSheet` | 7.1–7.11 Overlays      | [README](src/components/overlay/README.md)           |
| `Icon`                                                                                                                                                          | 9.1 Slots & Helpers    | [README](src/components/icon/README.md)              |
| `Spinner`                                                                                                                                                       | 9.1 Slots & Helpers    | [README](src/components/spinner/README.md)           |
| `Divider`                                                                                                                                                       | 9.1 Slots & Helpers    | [README](src/components/divider/README.md)           |
| `StatusBar` · `HomeIndicator`                                                                                                                                   | 10.2 System bars       | [README](src/components/system-bars/README.md)       |
| `Keyboard`                                                                                                                                                      | 10.3 Keyboard          | [README](src/components/keyboard/README.md)          |

Har komponent `src/components/<nom>/` ichida: `.tsx`, `.css`, `README.md`. CSS fayllar build paytida `dist/styles.css` ga yig'iladi.

## Yordamchi klasslar

| Klass                                                        | Figma             | Vazifa                                          |
| ------------------------------------------------------------ | ----------------- | ----------------------------------------------- |
| `.bek-focus-ring`                                            | 1.6 Accessibility | klaviatura fokusida 2 px `border/focus` halqa   |
| `.bek-visually-hidden`                                       | 1.6 Accessibility | matnni faqat ekran o'quvchi uchun qoldirish     |
| `.bek-scrollbar`                                             | 4.13 Separator    | ingichka, tokenlangan scrollbar                 |
| `.bek-cursor-*` (`pointer`, `grab`, `resize-x`, `zoom-in` …) | 9.2 Cursor        | Figma kursor holatlarining CSS `cursor` mosligi |

Namuna ekranlar (Figma 8 · Templates) — [`apps/templates`](../../apps/templates/README.md).
