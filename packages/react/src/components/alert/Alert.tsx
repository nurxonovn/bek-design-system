import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { CloseGlyph, StatusGlyph, type StatusTone } from '../../icons/index.js';
import { Button } from '../button/Button.js';

export type AlertVariant = 'subtle' | 'solid';
export type AlertTone = StatusTone;
export type AlertLayout = 'inline' | 'stacked';

export interface AlertAction {
  label: ReactNode;
  onClick?: () => void;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `subtle` — sahifa ichidagi xabar; `solid` — kuchli, diqqat talab qiladigan. */
  variant?: AlertVariant;
  tone?: AlertTone;
  /** `inline` — amallar matn yonida; `stacked` — matn ostida (tor joy, uzun matn). */
  layout?: AlertLayout;
  title?: ReactNode;
  /** Izoh matni. */
  children?: ReactNode;
  /** Asosiy amal (danger — `danger` tugma). */
  primaryAction?: AlertAction;
  /** Ikkinchi amal — `flat` tugma. */
  secondaryAction?: AlertAction;
  /** Berilsa — yopish tugmasi chiqadi. */
  onClose?: () => void;
  closeLabel?: string;
  /** Standart holat ikonkasi o'rniga; `null` — ikonkasiz. */
  icon?: ReactNode;
}

/** Figma "5.4 Alert": sahifa ichidagi doimiy xabar — holat, sabab va keyingi qadam. */
export function Alert({
  variant = 'subtle',
  tone = 'info',
  layout = 'inline',
  title,
  children,
  primaryAction,
  secondaryAction,
  onClose,
  closeLabel = 'Close',
  icon,
  className,
  role,
  ...rest
}: AlertProps) {
  const solid = variant === 'solid';
  const glyph = icon === undefined ? <StatusGlyph tone={tone} variant="stroke" /> : icon;
  const hasActions = primaryAction || secondaryAction;
  return (
    <div
      role={role ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status')}
      {...rest}
      className={cx(
        'bek-alert',
        `bek-alert--${variant}`,
        `bek-alert--${tone}`,
        `bek-alert--${layout}`,
        className,
      )}
    >
      {glyph && (
        <span className="bek-alert__icon" aria-hidden="true">
          {glyph}
        </span>
      )}
      <div className="bek-alert__main">
        <div className="bek-alert__body">
          {title && <p className="bek-alert__title">{title}</p>}
          {children && <div className="bek-alert__description">{children}</div>}
        </div>
        {hasActions && (
          <div className="bek-alert__actions">
            {secondaryAction && (
              <Button variant={solid ? 'flat-contrast' : 'flat'} onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant={solid ? 'normal-contrast' : tone === 'danger' ? 'danger' : 'action'}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          className="bek-alert__close bek-focus-ring"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseGlyph />
        </button>
      )}
    </div>
  );
}
