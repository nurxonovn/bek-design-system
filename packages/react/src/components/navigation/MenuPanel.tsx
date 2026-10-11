import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export interface MenuPanelProps extends HTMLAttributes<HTMLElement> {
  /** `false` — 256 px; `true` — 56 px (faqat ikonkalar). */
  collapsed?: boolean;
  /** Yuqori qism (odatda qidiruv Nav item). */
  top?: ReactNode;
  /** Pastki, qotirilgan qism (odatda "Collapse" tugmasi). */
  bottom?: ReactNode;
  /** Nav group'lar — o'rta qism, scroll qiladi. */
  children: ReactNode;
}

/** Figma "Menu panel · Web": tanlangan modul sahifalari. surface/card, padding 8, gap 8. */
export function MenuPanel({
  collapsed = false,
  top,
  bottom,
  className,
  children,
  ...rest
}: MenuPanelProps) {
  return (
    <nav
      {...rest}
      className={cx('bek-menu-panel', collapsed && 'bek-menu-panel--collapsed', className)}
    >
      {top && <div className="bek-menu-panel__top">{top}</div>}
      <div className="bek-menu-panel__middle bek-scrollbar">{children}</div>
      {bottom && <div className="bek-menu-panel__bottom">{bottom}</div>}
    </nav>
  );
}

export interface ModuleRailProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Yuqoridagi kichik sarlavha (Caption/S). */
  title?: ReactNode;
  /** Pastga qotirilgan element (Nav item, mode="module"). */
  bottom?: ReactNode;
  /** Barcha modul nomlarini chip'larda doim ko'rsatish (Figma "Labels"). */
  showLabels?: boolean;
  /** Modullar — Nav item, mode="module". */
  children: ReactNode;
}

/** Figma "Module rail · Web": modul tanlovchi tor panel. 40 + 2×12 = 64 px, surface/raised. */
export function ModuleRail({
  title,
  bottom,
  showLabels = false,
  className,
  children,
  ...rest
}: ModuleRailProps) {
  return (
    <nav
      {...rest}
      className={cx('bek-module-rail', showLabels && 'bek-module-rail--labels', className)}
    >
      <div className="bek-module-rail__top">
        {title && <div className="bek-module-rail__title">{title}</div>}
        {children}
      </div>
      {bottom && <div className="bek-module-rail__bottom">{bottom}</div>}
    </nav>
  );
}

export interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Chap tomon: menyu tugmasi, logo. */
  start?: ReactNode;
  /** O'ng tomon: til, mavzu, bildirishnomalar, profil. */
  end?: ReactNode;
  children?: ReactNode;
}

/**
 * Figma "Header · Web / Tablet": yuqori panel. Balandlik layout/header/height, surface/card;
 * sahifadan chegara bilan emas, sirt rangi bilan ajraladi.
 */
export function AppHeader({ start, end, className, children, ...rest }: AppHeaderProps) {
  return (
    <header {...rest} className={cx('bek-app-header', className)}>
      {start && <div className="bek-app-header__start">{start}</div>}
      <div className="bek-app-header__center">{children}</div>
      {end && <div className="bek-app-header__end">{end}</div>}
    </header>
  );
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  /** Chapdagi rail (ModuleRail yoki NavRail). */
  rail?: ReactNode;
  /** Menyu paneli (MenuPanel). */
  menu?: ReactNode;
  /** Pastki navigatsiya (mobil). */
  bottomNav?: ReactNode;
  /** Figma App shell · Tablet/Mobile "Drawer": NavDrawer (o'zi scrim bilan hamma narsani, panellarni ham yopadi). */
  drawer?: ReactNode;
  /** Sahifa mazmuni — `<main>` ichida, padding layout/page-margin. */
  children: ReactNode;
}

/** Figma "App shell": Header + Rail + Menu + Content (+ Bottom nav mobil uchun). */
export function AppShell({
  header,
  rail,
  menu,
  bottomNav,
  drawer,
  className,
  children,
  ...rest
}: AppShellProps) {
  return (
    <div {...rest} className={cx('bek-app-shell', className)}>
      {header}
      <div className="bek-app-shell__body">
        {rail}
        {menu}
        <main className="bek-app-shell__content">{children}</main>
      </div>
      {bottomNav}
      {drawer}
    </div>
  );
}
