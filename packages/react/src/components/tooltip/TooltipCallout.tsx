import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export type TooltipCalloutSize = 'm' | 's';
export type TooltipCalloutTip =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface TooltipCalloutProps extends HTMLAttributes<HTMLDivElement> {
  /** `m` — 280 px, Body/S; `s` — 240 px, Caption/M. */
  size?: TooltipCalloutSize;
  /** "Fikr pufagi" dumining joyi — trigger tomonida. */
  tip?: TooltipCalloutTip;
  /** Bir-ikki qatorli izoh. */
  children: ReactNode;
  /** Ixtiyoriy amal: "Got it". */
  action?: { label: ReactNode; onClick?: () => void };
}

/**
 * Figma "5.2 Tooltip → Tooltip callout": yangi yoki yashirin funksiyani tushuntiruvchi
 * ishora. Doim Dark (`surface/raised`), ekranda bittadan; amal yoki tashqariga bosish bilan yopiladi.
 */
export function TooltipCallout({
  size = 'm',
  tip = 'bottom-center',
  children,
  action,
  className,
  ...rest
}: TooltipCalloutProps) {
  return (
    <div
      data-theme="dark"
      {...rest}
      className={cx(
        'bek-tooltip-callout',
        `bek-tooltip-callout--${size}`,
        `bek-tooltip-callout--${tip}`,
        className,
      )}
    >
      <div className="bek-tooltip-callout__content">
        <p className="bek-tooltip-callout__text">{children}</p>
        {action && (
          <button
            type="button"
            className="bek-tooltip-callout__action bek-focus-ring"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
      <span className="bek-tooltip-callout__bubble" aria-hidden="true" />
      <span className="bek-tooltip-callout__dot" aria-hidden="true" />
    </div>
  );
}
