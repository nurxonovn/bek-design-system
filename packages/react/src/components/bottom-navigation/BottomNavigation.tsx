import { Children, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { NavAction, type NavActionProps } from '../navigation/NavAction.js';

export type BottomNavigationDevice = 'mobile' | 'tablet';
export type BottomNavGroupVariant = 'dual' | 'solo';
export type BottomNavItemVariant = 'label' | 'icon-only';

export interface BottomNavigationProps extends HTMLAttributes<HTMLElement> {
  /** Figma `Variant`: `mobile` — yon inset 24 · `tablet` — yon inset 64. Yuqori 16, past 24 (home indicator). */
  device?: BottomNavigationDevice;
  /**
   * @deprecated Figma 6.7 (2026-10) da Bar / Floating uslublari yo'q — hamma joyda kapsula
   * (`BottomNavGroup`). Qiymat e'tiborsiz qoldiriladi.
   */
  variant?: 'bar' | 'floating';
  /** `BottomNavGroup` lar (Dual + Solo). To'g'ridan-to'g'ri `BottomNavItem` berilsa — bitta kapsulaga o'raladi. */
  children: ReactNode;
  'aria-label'?: string;
}

export interface BottomNavGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `Variant`: `dual` — ikki nomli manzil (240×64) · `solo` — bitta icon-only manzil (64×64). */
  variant?: BottomNavGroupVariant;
  children: ReactNode;
}

/** Figma "Bottom nav group": surface/raised + Elevation/3 kapsula, radius/full, padding 4. */
export function BottomNavGroup({ variant, className, ...rest }: BottomNavGroupProps) {
  return (
    <div
      {...rest}
      className={cx(
        'bek-bottom-nav-group',
        variant && `bek-bottom-nav-group--${variant}`,
        className,
      )}
    />
  );
}

/**
 * Figma "6.7 Bottom navigation": mobil va planshet uchun yagona pastki navigatsiya — boshida Dual
 * kapsula (ikki nomli manzil), oxirida Solo dumaloq kapsula. Fon shaffof, kontent ustida turadi.
 */
export function BottomNavigation({
  device = 'mobile',
  variant: _legacyVariant,
  className,
  children,
  'aria-label': ariaLabel = 'Main',
  ...rest
}: BottomNavigationProps) {
  const grouped = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === BottomNavGroup,
  );
  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      className={cx('bek-bottom-nav', `bek-bottom-nav--${device}`, className)}
    >
      {grouped ? (
        children
      ) : (
        <BottomNavGroup className="bek-bottom-nav-group--fill">{children}</BottomNavGroup>
      )}
    </nav>
  );
}

export interface BottomNavItemProps extends NavActionProps {
  /** 24 px ikonka (BEK Icons, Solid). */
  icon: ReactNode;
  /** Tanlanganda ko'rsatiladigan ikonka (berilmasa — `icon`). */
  selectedIcon?: ReactNode;
  /** Figma `Variant`: `label` — ikonka + nom (116×56) · `icon-only` — 56×56, nom faqat ekran o'quvchi uchun. */
  variant?: BottomNavItemVariant;
  /** `'dot'` — yangi mazmun; son — hisoblagich (99 dan katta — "99+"). Figma 6.7 da endi yo'q, moslik uchun. */
  badge?: 'dot' | number;
  /** @deprecated `variant="icon-only"` ishlating. */
  hideLabel?: boolean;
  children: ReactNode;
}

/** Figma "Bottom nav item": bitta manzil. Selected — accent/soft fon + text/accent; Default — text/secondary. */
export function BottomNavItem({
  icon,
  selectedIcon,
  variant,
  badge,
  hideLabel = false,
  selected = false,
  className,
  children,
  ...rest
}: BottomNavItemProps) {
  const kind: BottomNavItemVariant = variant ?? (hideLabel ? 'icon-only' : 'label');
  return (
    <NavAction
      {...rest}
      selected={selected}
      className={cx('bek-bottom-nav-item', `bek-bottom-nav-item--${kind}`, className)}
    >
      <span className="bek-bottom-nav-item__icon" aria-hidden="true">
        {selected && selectedIcon ? selectedIcon : icon}
        {badge === 'dot' && <span className="bek-bottom-nav-item__dot" />}
        {typeof badge === 'number' && badge > 0 && (
          <span className="bek-bottom-nav-item__count">{badge > 99 ? '99+' : badge}</span>
        )}
      </span>
      <span className={kind === 'icon-only' ? 'bek-visually-hidden' : 'bek-bottom-nav-item__label'}>
        {children}
      </span>
    </NavAction>
  );
}
