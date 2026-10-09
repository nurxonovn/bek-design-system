import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import type { ControlSize } from '../checkbox/Checkbox.js';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Yorliq. Bo'lmasa — `aria-label` bering. Bir guruh — bir xil `name`. */
  children?: ReactNode;
  size?: ControlSize;
}

/** Figma "3.5 Radio" — bitta tanlov, S/M/L. Guruh bitta Tab to'xtashi, ↑↓ bilan almashadi (native). */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, size = 's', className, disabled, ...rest },
  ref,
) {
  return (
    <label
      className={cx(
        'bek-radio',
        `bek-radio--${size}`,
        disabled && 'bek-radio--disabled',
        className,
      )}
    >
      <span className="bek-radio__control">
        <input ref={ref} type="radio" className="bek-radio__input" disabled={disabled} {...rest} />
        <span className="bek-radio__circle" aria-hidden="true" />
      </span>
      {children && <span className="bek-radio__label">{children}</span>}
    </label>
  );
});
