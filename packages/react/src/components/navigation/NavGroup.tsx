'use client';

import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export interface NavGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Guruh sarlavhasi (katta harflarda, text/tertiary). */
  title?: ReactNode;
  /** `collapsed` — sarlavha yashiriladi (ekran o'quvchi uchun qoladi). */
  collapsed?: boolean;
  /** `web` — Nav item · Web uchun; `touch` — drawer (Nav item · Touch). */
  variant?: 'web' | 'touch';
  /** Pastda ajratuvchi chiziq. */
  divider?: boolean;
  children: ReactNode;
}

/** Figma "Nav group": sarlavhali Nav item'lar bloki. */
export function NavGroup({
  title,
  collapsed = false,
  variant = 'web',
  divider = false,
  className,
  children,
  ...rest
}: NavGroupProps) {
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={title ? id : undefined}
      {...rest}
      className={cx(
        'bek-nav-group',
        `bek-nav-group--${variant}`,
        divider && 'bek-nav-group--divider',
        className,
      )}
    >
      {title && (
        <div id={id} className={collapsed ? 'bek-visually-hidden' : 'bek-nav-group__title'}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export interface NavSubListProps extends HTMLAttributes<HTMLDivElement> {
  /** `web` — 32 px chekinish; `touch` — 40 px (matn ota matni ostida). */
  variant?: 'web' | 'touch';
  /** Yopiq bo'lsa — yashiriladi. */
  open?: boolean;
}

/** Ikkinchi daraja (Sub) elementlar ro'yxati; ota element bilan `aria-controls` orqali bog'lang. */
export function NavSubList({ variant = 'web', open = true, className, ...rest }: NavSubListProps) {
  return (
    <div
      {...rest}
      hidden={!open}
      className={cx('bek-nav-sub-list', `bek-nav-sub-list--${variant}`, className)}
    />
  );
}
