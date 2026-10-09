# @bek/templates

Figma **8 · Templates** ekranlari — faqat `@bek/react` komponentlari va `@bek/tokens` dan yig'ilgan
namuna sahifalar. Kutubxona emas (npm'ga chiqmaydi): komponentlar birga qanday ishlashini ko'rsatadi
va vizual tekshiruv uchun xizmat qiladi.

```bash
pnpm --filter @bek/templates dev      # http://localhost:5173
pnpm --filter @bek/templates build    # dist/
```

| Sahifa        | Figma               | Nimalar ishlatilgan                                                                                  |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| `#/dashboard` | 8.1 Dashboard (Web) | NavItem, SearchBar, Card, Badge, Tag, ProgressBar, ListItem, Avatar, BottomNavigation                |
| `#/ecommerce` | 8.2 E-commerce      | Chip, ProductCard, Price, Rating, Carousel, Stepper, Accordion, InfoWrap, CheckoutBar, TopNavigation |
| `#/landing`   | 8.3 Landing (Web)   | Button, Badge, Card, Avatar, BekLogo                                                                 |
| `#/workspace` | 8.4 AI Workspace    | NavGroup, NavItem, Tabs, Checkbox, Tooltip, Avatar                                                   |

- Yuqoridagi panel: sahifa (SegmentedControl) va **Dark** rejim (`<html data-theme="dark">`).
- Layout ≥ 1024 px — sidebar; kichikroq ekranda — BottomNavigation (Figma Desktop 1440 / Mobile 390).
- `templates.css` faqat sahifa joylashuvi; rang, o'lcham va shriftlar — tokenlar.
- Ikonkalar (`src/icons.tsx`) — namunaviy; ilovada BEK Icons kutubxonasidan oling. Status bar va Home
  indicator (Figma 10.2) — faqat mockup ramkasida (`src/Phone.tsx`), haqiqiy qurilmada ularni OS chizadi.
