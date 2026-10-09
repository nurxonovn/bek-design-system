import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { StatusGlyph, type StatusTone } from '../../icons/index.js';

export type NotificationBarTone = StatusTone;

export interface NotificationBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Ikonka rangi va ma'nosi. Figma "error" = `danger`. */
  tone?: NotificationBarTone;
  /** Bir qatorli xabar. */
  children: ReactNode;
  /** Ixtiyoriy amal: "Undo", "View". */
  action?: { label: ReactNode; onClick?: () => void };
  /** Standart holat ikonkasi o'rniga; `null` — ikonkasiz. */
  icon?: ReactNode;
}

/**
 * Figma "5.6 Notification bar": mobil snackbar — doim Dark rejimda (`data-theme="dark"`),
 * ~4 s dan keyin yashiriladi (taymerni ilova boshqaradi).
 */
export function NotificationBar({
  tone = 'neutral',
  children,
  action,
  icon,
  className,
  ...rest
}: NotificationBarProps) {
  const glyph = icon === undefined ? <StatusGlyph tone={tone} /> : icon;
  return (
    <div
      role="status"
      data-theme="dark"
      {...rest}
      className={cx('bek-notification-bar', `bek-notification-bar--${tone}`, className)}
    >
      {glyph && (
        <span className="bek-notification-bar__icon" aria-hidden="true">
          {glyph}
        </span>
      )}
      <p className="bek-notification-bar__label">{children}</p>
      {action && (
        <button
          type="button"
          className="bek-notification-bar__action bek-focus-ring"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
