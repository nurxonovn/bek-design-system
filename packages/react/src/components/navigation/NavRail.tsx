import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Badge } from '../badge/Badge.js';
import { NavAction, type NavActionProps } from './NavAction.js';

export interface RailItemProps extends NavActionProps {
  /** 24 px ikonka — 56×32 pill indikator ichida. */
  icon: ReactNode;
  /** Pill ustidagi hisoblagich. */
  badge?: ReactNode;
  /** Doim ko'rinadigan nom (Label/S). */
  children: ReactNode;
}

/** Figma "Rail item · Tablet": bitta modul. Selected — accent/default pill, nom text/accent. */
export function RailItem({ icon, badge, className, children, ...rest }: RailItemProps) {
  return (
    <NavAction {...rest} className={cx('bek-rail-item', className)}>
      <span className="bek-rail-item__indicator" aria-hidden="true">
        <span className="bek-rail-item__icon">{icon}</span>
        {badge !== undefined && (
          <Badge color="danger" size="s" className="bek-rail-item__badge">
            {badge}
          </Badge>
        )}
      </span>
      <span className="bek-rail-item__label">{children}</span>
    </NavAction>
  );
}

export interface NavRailProps extends HTMLAttributes<HTMLElement> {
  /** Pastga qotirilgan element. */
  bottom?: ReactNode;
  /** 6 tagacha RailItem; qolganini drawer'ga o'tkazing. */
  children: ReactNode;
}

/** Figma "Nav rail · Tablet": 72 px, surface/raised, nomlar doim ko'rinadi. */
export function NavRail({ bottom, className, children, ...rest }: NavRailProps) {
  return (
    <nav {...rest} className={cx('bek-nav-rail', className)}>
      <div className="bek-nav-rail__items">{children}</div>
      {bottom && <div className="bek-nav-rail__bottom">{bottom}</div>}
    </nav>
  );
}
