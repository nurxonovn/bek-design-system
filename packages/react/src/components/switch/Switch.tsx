import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import type { ControlSize } from '../checkbox/Checkbox.js';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Yorliq. Bo'lmasa — `aria-label` bering. */
  children?: ReactNode;
  /** Yo'lak: s 32×20 · m 40×24 · l 48×28 px. */
  size?: ControlSize;
}

/** Figma "3.6 Switch" — darhol kuchga kiradigan yoqish/o'chirish. `role="switch"`. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { children, size = 's', className, disabled, ...rest },
  ref,
) {
  return (
    <label
      className={cx(
        'bek-switch',
        `bek-switch--${size}`,
        disabled && 'bek-switch--disabled',
        className,
      )}
    >
      <span className="bek-switch__control">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="bek-switch__input"
          disabled={disabled}
          {...rest}
        />
        <span className="bek-switch__track" aria-hidden="true">
          <span className="bek-switch__thumb" />
        </span>
      </span>
      {children && <span className="bek-switch__label">{children}</span>}
    </label>
  );
});
