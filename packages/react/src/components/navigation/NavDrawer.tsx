'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronDownGlyph, ChevronRightGlyph, CloseGlyph } from '../../icons/index.js';
import { Badge } from '../badge/Badge.js';
import { Button } from '../button/Button.js';
import { useDialog } from '../overlay/useDialog.js';
import { NavAction, type NavActionProps } from './NavAction.js';

export interface DrawerItemProps extends NavActionProps {
  /** `item` — 48 px, ikonka 24, Label/L; `sub` — 44 px, Body/M, ikonkasiz. */
  mode?: 'item' | 'sub';
  icon?: ReactNode;
  badge?: ReactNode;
  chevron?: boolean;
  children: ReactNode;
}

/** Figma "Nav item · Touch": drawer qatori (planshet va mobil). */
export function DrawerItem({
  mode = 'item',
  icon,
  badge,
  chevron = false,
  expanded,
  className,
  children,
  ...rest
}: DrawerItemProps) {
  return (
    <NavAction
      {...rest}
      expanded={expanded}
      className={cx('bek-drawer-item', `bek-drawer-item--${mode}`, className)}
    >
      {icon && mode === 'item' && (
        <span className="bek-drawer-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="bek-drawer-item__label">{children}</span>
      {badge !== undefined && (
        <Badge color="accent" size="s">
          {badge}
        </Badge>
      )}
      {(chevron || expanded !== undefined) && (
        <span className="bek-drawer-item__chevron" aria-hidden="true">
          {expanded !== undefined ? <ChevronDownGlyph /> : <ChevronRightGlyph />}
        </span>
      )}
    </NavAction>
  );
}

export interface NavDrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  open: boolean;
  /** Scrim, yopish tugmasi yoki Esc bosilganda. */
  onClose: () => void;
  /** Sarlavha qatori chap qismi (odatda logo). */
  header?: ReactNode;
  /** Qotirilgan pastki qism: profil, Settings, Log out. */
  footer?: ReactNode;
  closeLabel?: string;
  children: ReactNode;
}

/**
 * Figma "Nav drawer": planshet va mobil uchun navigatsiya paneli. Kenglik layout/drawer/width
 * (Tablet 360 · Mobile 304). Native `<dialog>` — fokus ichida ushlanadi, Esc yopadi,
 * scrim (bg/overlay) bosilganda yopiladi.
 */
export function NavDrawer({
  open,
  onClose,
  header,
  footer,
  closeLabel = 'Close menu',
  className,
  children,
  ...rest
}: NavDrawerProps) {
  const dialog = useDialog({ open, onClose });
  return (
    <dialog {...rest} {...dialog} className={cx('bek-nav-drawer', className)}>
      <div className="bek-nav-drawer__header">
        <div className="bek-nav-drawer__brand">{header}</div>
        <Button variant="flat" size="xl" iconOnly startIcon={<CloseGlyph />} onClick={onClose}>
          {closeLabel}
        </Button>
      </div>
      <nav className="bek-nav-drawer__body bek-scrollbar">{children}</nav>
      {footer && <div className="bek-nav-drawer__footer">{footer}</div>}
    </dialog>
  );
}
