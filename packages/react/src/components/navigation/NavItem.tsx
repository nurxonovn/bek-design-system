import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronDownGlyph, ChevronRightGlyph } from '../../icons/index.js';
import { Badge } from '../badge/Badge.js';
import { NavAction, type NavActionProps } from './NavAction.js';

export type NavItemMode = 'expanded' | 'collapsed' | 'module' | 'sub';

export interface NavItemProps extends NavActionProps {
  /** `expanded` 240×40 · `collapsed` 40×40 · `module` 40×40 (modul rail) · `sub` 32 (ikkinchi daraja). */
  mode?: NavItemMode;
  /** 20 px ikonka (`sub` da ko'rsatilmaydi). */
  icon?: ReactNode;
  /** Hisoblagich — Badge Filled · Accent · S. */
  badge?: ReactNode;
  /** O'ngda chevron (keyingi daraja yoki flyout). `expanded` berilsa — pastga chevron. */
  chevron?: boolean;
  /** Element nomi. `collapsed`/`module` da hover/fokusda chip sifatida chiqadi. */
  children: ReactNode;
}

/**
 * Figma "6.2 Navigation → Nav item · Web": web navigatsiya qatori. Hover — fill/tertiary,
 * Selected — accent/soft + text/accent (Module — accent/default + text/on-color).
 */
export function NavItem({
  mode = 'expanded',
  icon,
  badge,
  chevron = false,
  expanded,
  className,
  children,
  ...rest
}: NavItemProps) {
  const compact = mode === 'collapsed' || mode === 'module';
  const showChevron = !compact && (chevron || expanded !== undefined);
  return (
    <NavAction
      {...rest}
      expanded={expanded}
      className={cx('bek-nav-item', `bek-nav-item--${mode}`, className)}
    >
      {icon && mode !== 'sub' && (
        <span className="bek-nav-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={compact ? 'bek-visually-hidden' : 'bek-nav-item__label'}>{children}</span>
      {badge !== undefined && (
        <Badge color="accent" size="s" className="bek-nav-item__badge">
          {badge}
        </Badge>
      )}
      {showChevron && (
        <span className="bek-nav-item__chevron" aria-hidden="true">
          {expanded !== undefined ? <ChevronDownGlyph /> : <ChevronRightGlyph />}
        </span>
      )}
      {compact && (
        <span className="bek-nav-item__chip" aria-hidden="true">
          {children}
        </span>
      )}
    </NavAction>
  );
}
