import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** `line` — 1 px chiziq; `block` — guruhlar orasida 8 px `bg/base` tasma; `labeled` — chiziq · matn · chiziq. */
  type?: 'line' | 'block' | 'labeled';
  orientation?: 'horizontal' | 'vertical';
  /** Chetdan 16 px: `leading` — boshidan, `both` — ikki tomondan. */
  inset?: 'none' | 'leading' | 'both';
  /** `labeled` uchun matn ("yoki"). */
  label?: ReactNode;
}

/** Figma "4.13 Separator": chegarasiz yuzalarda kontentni ajratish. Avval sirt ranglari pog'onasini afzal ko'ring. */
export function Separator({
  type = 'line',
  orientation = 'horizontal',
  inset = 'none',
  label,
  className,
  ...rest
}: SeparatorProps) {
  const classes = cx(
    'bek-separator',
    `bek-separator--${type}`,
    `bek-separator--${orientation}`,
    `bek-separator--inset-${inset}`,
    className,
  );
  if (type === 'labeled') {
    return (
      <div role="separator" className={classes} {...rest}>
        <span className="bek-separator__line" />
        <span className="bek-separator__label">{label}</span>
        <span className="bek-separator__line" />
      </div>
    );
  }
  return (
    <div
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={classes}
      {...rest}
    >
      {type === 'line' && <span className="bek-separator__line" />}
    </div>
  );
}
