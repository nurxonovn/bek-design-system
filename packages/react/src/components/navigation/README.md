# Navigation

Figma: **6.2 Navigation**. Web (≥ 1024), Tablet (600–1023) va Mobile (< 600) uchun ilova navigatsiyasi.

## Web: ModuleRail + MenuPanel + AppHeader

```tsx
import { AppHeader, AppShell, MenuPanel, ModuleRail, NavGroup, NavItem, NavSubList } from '@bek-ui/react';

<AppShell
  header={
    <AppHeader
      start={<BekLogo size="s" />}
      end={
        <>
          <Button variant="flat" size="l">EN</Button>                                {/* Language */}
          <Button variant="flat" size="l" iconOnly startIcon={<MoonIcon />}>Theme</Button>
          <Button variant="flat" size="l" iconOnly startIcon={<BellIcon />}>Notifications</Button>
          <NavProfile avatar={<Avatar name="Alex Brown" size="s" />} name="Alex Brown" role="Administrator" />
          <Button variant="flat" size="l" iconOnly startIcon={<LogoutIcon />}>Log out</Button>
        </>
      }
    />
  }
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

| Komponent    | Asosiy prop'lar                                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NavItem`    | `mode`: `expanded` 240×40 · `collapsed` 40×40 · `module` 40×40 · `sub` 32; `icon`, `badge`, `chevron`, `expanded`, `selected`, `disabled`, `href`                          |
| `NavGroup`   | `title` (UPPERCASE Caption/S `text/tertiary`), `collapsed`, `variant` `web`·`touch`, `divider`                                                                             |
| `NavSubList` | `open`, `variant` (`web` — 32, `touch` — 40 px chekinish)                                                                                                                  |
| `MenuPanel`  | `collapsed` (256 → 56 px), `top`, `bottom` (qotirilgan); `surface/card`, padding 8, gap 8                                                                                  |
| `ModuleRail` | `title`, `bottom`, `showLabels`; 64 px, `surface/raised`, padding 12, gap 4                                                                                                |
| `AppHeader`  | `start` (Menu button, Logo), `end` (Language, Theme, Notifications + Count, Profile/Avatar, Logout), `children` (Search); balandlik `layout/header/height`, `surface/card` |
| `NavProfile` | `avatar`, `name` (Label/M), `role` (Caption/M `text/tertiary`), `action` — Header `end` va NavDrawer `footer` uchun                                                        |
| `AppShell`   | `header`, `rail`, `menu`, `bottomNav`, `children` (`<main>`, padding `layout/page-margin`)                                                                                 |

- Header · Web (Figma): Logo · Language · Theme · Notifications (+ Count — tugma ustidagi Badge) · Profile (`NavProfile`: Avatar, Name, Role) · Logout — barchasi `start`/`end` slotlari orqali; Header · Tablet: Menu button · Logo · Search (`children`) · Notifications · Avatar.
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
  footer={
    <>
      <NavProfile
        avatar={<Avatar name="Alex Brown" size="s" />}
        name="Alex Brown"
        role="Administrator"
      />
      <DrawerItem icon={<LogoutIcon />}>Log out</DrawerItem>
    </>
  }
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

- Kenglik `layout/drawer/width` (Tablet 360 · Mobile 304 — token qurilmaga ko'ra o'zgaradi, Figma `Device` prop'i kodda alohida emas), `surface/card`, `Elevation/4`; sarlavha `layout/header/height`; body scroll (padding 8 12, gap 16); footer `surface/raised` qotirilgan (profil — `NavProfile`, Settings, Log out).
- DrawerItem: `item` 48 px (ikonka 24, Label/L) · `sub` 44 px (Body/M); radius 12; Pressed `fill/tertiary`, Selected `accent/soft` + `text/accent`.
- Native `<dialog>` (`showModal`): fokus ichida, Esc va scrim (`bg/overlay`) bosilganda `onClose`; ochilish — chapdan siljish (`motion/overlay/slide`).

## Do / Don't

- ✅ Joriy sahifa doim `selected`. ❌ Bir vaqtda ikkita tanlangan element.
- ✅ Header sahifadan sirt rangi bilan ajraladi. ❌ Header ostiga chegara chizig'i.

## App shell · Tablet / Mobile (Figma 6.2)

`AppShell` uchta qurilma uchun bitta: Web — `header` + `rail` + `menu`; Tablet — `header` + `rail`
(`NavRail`); Mobile — `header` (`TopNavigation`) + `bottomNav` (`BottomNavigation`). Figma "Drawer: Closed / Open"
→ `drawer` slotiga `NavDrawer` (`open` prop'i); u scrim bilan panellarni ham yopadi. Kontent padding'i
`layout/page-margin` (Mobile 16 · Tablet 24 · Web 32) — tokenning o'zi rejimga qarab o'zgaradi.

```tsx
<AppShell
  header={<TopNavigation title="BEK" leading="menu" onLeadingClick={() => setOpen(true)} />}
  bottomNav={<BottomNavigation>…</BottomNavigation>}
  drawer={
    <NavDrawer open={open} onClose={() => setOpen(false)}>
      …
    </NavDrawer>
  }
>
  …
</AppShell>
```
