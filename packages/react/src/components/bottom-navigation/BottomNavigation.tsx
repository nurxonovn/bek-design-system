import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { NavAction, type NavActionProps } from '../navigation/NavAction.js';

export interface BottomNavigationProps extends HTMLAttributes<HTMLElement> {
  /** `bar` — chetdan-chetga · `floating` — kontent ustidagi pill. */
  variant?: 'bar' | 'floating';
  /** 3–5 ta BottomNavItem. */
  children: ReactNode;
  'aria-label'?: string;
}

/** Figma "6.7 Bottom navigation": mobil pastki navigatsiya, 3–5 manzil. */
export function BottomNavigation({
  variant = 'bar',
  className,
  'aria-label': ariaLabel = 'Main',
  ...rest
}: BottomNavigationProps) {
  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      className={cx('bek-bottom-nav', `bek-bottom-nav--${variant}`, className)}
    />
  );
}

export interface BottomNavItemProps extends NavActionProps {
  /** 24 px ikonka (Stroke). */
  icon: ReactNode;
  /** Tanlanganda ko'rsatiladigan ikonka (Solid). */
  selectedIcon?: ReactNode;
  /** `'dot'` — yangi mazmun; son — hisoblagich (99 dan katta — "99+"). */
  badge?: 'dot' | number;
  /** Nomni yashirish (faqat ekran o'quvchi uchun qoladi). */
  hideLabel?: boolean;
  children: ReactNode;
}

/** Figma "Bottom nav item": bitta manzil. Selected — text/accent; Pressed — fill/soft. */
export function BottomNavItem({
  icon,
  selectedIcon,
  badge,
  hideLabel = false,
  selected = false,
  className,
  children,
  ...rest
}: BottomNavItemProps) {
  return (
    <NavAction {...rest} selected={selected} className={cx('bek-bottom-nav-item', className)}>
      <span className="bek-bottom-nav-item__icon" aria-hidden="true">
        {selected && selectedIcon ? selectedIcon : icon}
        {badge === 'dot' && <span className="bek-bottom-nav-item__dot" />}
        {typeof badge === 'number' && badge > 0 && (
          <span className="bek-bottom-nav-item__count">{badge > 99 ? '99+' : badge}</span>
        )}
      </span>
      <span className={hideLabel ? 'bek-visually-hidden' : 'bek-bottom-nav-item__label'}>
        {children}
      </span>
    </NavAction>
  );
}
