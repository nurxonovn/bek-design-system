import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Button } from '../button/Button.js';

export type EmptyStateSize = 's' | 'm' | 'l';

export interface EmptyStateAction {
  label: ReactNode;
  onClick?: () => void;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `s` — karta ichida · `m` — sahifa bo'limi · `l` — butun ekran. */
  size?: EmptyStateSize;
  /** Maskot yoki illyustratsiya (s 64 · m 96 · l 200 px). Bezak — `alt=""`. */
  media?: ReactNode;
  title: ReactNode;
  /** Bitta qisqa gap. */
  description?: ReactNode;
  /** Asosiy amal — `action` tugma. */
  primaryAction?: EmptyStateAction;
  /** Ikkinchi amal — `outline` tugma. */
  secondaryAction?: EmptyStateAction;
}

/** Figma "5.3 Empty state": bo'sh ro'yxat, natija yo'q yoki oflayn holat. */
export function EmptyState({
  size = 'm',
  media,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...rest
}: EmptyStateProps) {
  const buttonSize = size === 's' ? 'm' : 'l';
  return (
    <div {...rest} className={cx('bek-empty-state', `bek-empty-state--${size}`, className)}>
      {media && <div className="bek-empty-state__media">{media}</div>}
      <div className="bek-empty-state__text">
        <p className="bek-empty-state__title">{title}</p>
        {description && <p className="bek-empty-state__description">{description}</p>}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="bek-empty-state__actions">
          {primaryAction && (
            <Button variant="action" size={buttonSize} onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" size={buttonSize} onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
