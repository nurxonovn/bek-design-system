import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';

/** Belgi o'lchami: s 16 · m 20 · l 24 px. */
export type ControlSize = 's' | 'm' | 'l';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Yorliq (label bosilganda ham belgilanadi). Bo'lmasa — `aria-label` bering. */
  children?: ReactNode;
  size?: ControlSize;
  /** Qisman tanlangan ("hammasini tanlash" ro'yxatning bir qismi tanlanganda). */
  indeterminate?: boolean;
}

/** Figma "3.4 Checkbox" — Unchecked · Checked · Indeterminate, S/M/L. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, size = 's', indeterminate = false, className, disabled, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={cx(
        'bek-checkbox',
        `bek-checkbox--${size}`,
        disabled && 'bek-checkbox--disabled',
        className,
      )}
    >
      <span className="bek-checkbox__control">
        <input
          ref={inner}
          type="checkbox"
          className="bek-checkbox__input"
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : undefined}
          {...rest}
        />
        <span className="bek-checkbox__box" aria-hidden="true">
          <svg className="bek-checkbox__check" viewBox="0 0 24 24" focusable="false">
            <path
              d="M18.2061 6.57813C18.4392 6.32374 18.8344 6.306 19.0889 6.53907C19.3433 6.77231 19.3602 7.16743 19.127 7.42188L9.96094 17.4219C9.84576 17.5475 9.68407 17.6213 9.51367 17.625C9.34324 17.6287 9.17816 17.5629 9.05761 17.4424L5.30761 13.6924C5.06354 13.4483 5.06354 13.0517 5.30761 12.8076C5.55169 12.5635 5.9483 12.5635 6.19238 12.8076L9.48047 16.0967L18.2061 6.57813Z"
              fill="currentColor"
            />
          </svg>
          <span className="bek-checkbox__dash" />
        </span>
      </span>
      {children && <span className="bek-checkbox__label">{children}</span>}
    </label>
  );
});
