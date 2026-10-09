# Navigation

Figma: **6.2 Navigation**. Web (≥ 1024), Tablet (600–1023) va Mobile (< 600) uchun ilova navigatsiyasi.

## Web: ModuleRail + MenuPanel + AppHeader

```tsx
import { AppHeader, AppShell, MenuPanel, ModuleRail, NavGroup, NavItem, NavSubList } from '@bek/react';

<AppShell
  header={<AppHeader start={<BekLogo size="s" />} end={<Button variant="flat">Log out</Button>} />}
  rail={
    <ModuleRail title="Apps" bottom={<NavItem mode="module" icon={<SettingsIcon />}>Settings</NavItem>}>
      <NavItem mode="module" icon={<HomeIcon />} href="/" selected>Home</NavItem>
    </ModuleRail>
  }
  menu={
    <MenuPanel collapsed={collapsed} top={<NavItem icon={<SearchIcon />}>Search</NavItem>}
      bottom={<NavItem icon={<SidebarIcon />} onClick={toggle}>Collapse</NavItem>}>
      <NavGroup title="Workspace" collapsed={collapsed}>
        <NavItem mode={collapsed ? 'collapsed' : 'expanded'} icon={<GridIcon />} href="/dash" selected>Dashboard</NavItem>
        <NavItem icon={<FolderIcon />} expanded={open} aria-controls="p-subs" onClick={…}>Projects</NavItem>
        <NavSubList id="p-subs" open={open}>
          <NavItem mode="sub" href="/p/alpha">Alpha</NavItem>
        </NavSubList>
      </NavGroup>
    </MenuPanel>
  }
>
  {page}
</AppShell>
```

| Komponent    | Asosiy prop'lar                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NavItem`    | `mode`: `expanded` 240×40 · `collapsed` 40×40 · `module` 40×40 · `sub` 32; `icon`, `badge`, `chevron`, `expanded`, `selected`, `disabled`, `href` |
| `NavGroup`   | `title` (UPPERCASE Caption/S `text/tertiary`), `collapsed`, `variant` `web`·`touch`, `divider`                                                    |
| `NavSubList` | `open`, `variant` (`web` — 32, `touch` — 40 px chekinish)                                                                                         |
| `MenuPanel`  | `collapsed` (256 → 56 px), `top`, `bottom` (qotirilgan); `surface/card`, padding 8, gap 8                                                         |
| `ModuleRail` | `title`, `bottom`, `showLabels`; 64 px, `surface/raised`, padding 12, gap 4                                                                       |
| `AppHeader`  | `start`, `end`, `children`; balandlik `layout/header/height`, `surface/card`                                                                      |
| `AppShell`   | `header`, `rail`, `menu`, `bottomNav`, `children` (`<main>`, padding `layout/page-margin`)                                                        |

- Nav item ranglari: Default `text/secondary` · Hover `fill/tertiary` + `text/primary` · Selected `accent/soft` + `text/accent` · Module Selected `accent/default` + `text/on-color` (hover `accent/hover`) · Disabled `text/disabled`. Radius 8, ikonka 20, Label/M (Sub — Body/S).
- `collapsed`/`module` da nom ekran o'quvchi uchun yashirin matn va hover/fokusda chip (`surface/raised`, `Elevation/3`, 8 px o'ngda).
- `href` berilsa — `<a>`, aks holda `<button>`; `selected` → `aria-current="page"`; `expanded` → `aria-expanded` + aylanadigan chevron.

## Tablet: NavRail + RailItem

```tsx
<NavRail bottom={<RailItem icon={<SettingsIcon />}>Settings</RailItem>}>
  <RailItem icon={<HomeIcon />} href="/" selected>
    Home
  </RailItem>
  <RailItem icon={<BoxIcon />} badge={3}>
    Orders
  </RailItem>
</NavRail>
```

- 72 px, `surface/raised`; element 56 kenglik, 56×32 pill indikator (ikonka 24), nom Label/S doim ko'rinadi. Selected — `accent/default` pill + `text/on-color` ikonka, nom `text/accent`; Pressed — `fill/tertiary`. 6 tagacha modul — qolgani drawer'da.

## Tablet / Mobile: NavDrawer + DrawerItem

```tsx
<NavDrawer
  open={open}
  onClose={() => setOpen(false)}
  header={<BekLogo size="s" />}
  footer={<DrawerItem icon={<LogoutIcon />}>Log out</DrawerItem>}
>
  <NavGroup title="Menu" variant="touch">
    <DrawerItem icon={<HomeIcon />} href="/" selected>
      Home
    </DrawerItem>
    <DrawerItem icon={<BoxIcon />} badge={4}>
      Orders
    </DrawerItem>
  </NavGroup>
</NavDrawer>
```

- Kenglik `layout/drawer/width` (Tablet 360 · Mobile 304), `surface/card`, `Elevation/4`; sarlavha `layout/header/height`; body scroll (padding 8 12, gap 16); footer `surface/raised` qotirilgan.
- DrawerItem: `item` 48 px (ikonka 24, Label/L) · `sub` 44 px (Body/M); radius 12; Pressed `fill/tertiary`, Selected `accent/soft` + `text/accent`.
- Native `<dialog>` (`showModal`): fokus ichida, Esc va scrim (`bg/overlay`) bosilganda `onClose`; ochilish — chapdan siljish (`motion/overlay/slide`).

## Do / Don't

- ✅ Joriy sahifa doim `selected`. ❌ Bir vaqtda ikkita tanlangan element.
- ✅ Header sahifadan sirt rangi bilan ajraladi. ❌ Header ostiga chegara chizig'i.
