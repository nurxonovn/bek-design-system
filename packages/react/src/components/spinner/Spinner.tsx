import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export type SpinnerSize = 16 | 20 | 24;

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: SpinnerSize;
  /** Ekran o'quvchi uchun matn. Tugma ichida (u o'zi holatni aytsa) `null` bering — spinner yashiriladi. */
  label?: string | null;
}

/** Figma `_Spinner` ikonkasi (24×24): sakkiz nur. */
const SPINNER_PATH =
  'M12 17.25C12.4142 17.25 12.75 17.5858 12.75 18V21C12.75 21.4142 12.4142 21.75 12 21.75C11.5858 21.75 11.25 21.4142 11.25 21V18C11.25 17.5858 11.5858 17.25 12 17.25ZM7.22754 15.7119C7.5204 15.4191 7.99518 15.4191 8.28809 15.7119C8.58098 16.0048 8.58098 16.4796 8.28809 16.7725L6.16699 18.8936C5.8741 19.1864 5.39934 19.1864 5.10645 18.8936C4.81365 18.6007 4.81358 18.1259 5.10645 17.833L7.22754 15.7119ZM15.7119 15.7119C16.0048 15.419 16.4796 15.419 16.7725 15.7119L18.8936 17.833C19.1864 18.1259 19.1864 18.6007 18.8936 18.8936C18.6007 19.1864 18.1259 19.1864 17.833 18.8936L15.7119 16.7725C15.419 16.4796 15.419 16.0048 15.7119 15.7119ZM6 11.25C6.41421 11.25 6.75 11.5858 6.75 12C6.75 12.4142 6.41421 12.75 6 12.75H3C2.58579 12.75 2.25 12.4142 2.25 12C2.25 11.5858 2.58579 11.25 3 11.25H6ZM21 11.25C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75H18C17.5858 12.75 17.25 12.4142 17.25 12C17.25 11.5858 17.5858 11.25 18 11.25H21ZM5.10645 5.11035C5.39934 4.81746 5.8741 4.81746 6.16699 5.11035L8.28809 7.23145C8.58098 7.52434 8.58098 7.9991 8.28809 8.29199C7.99519 8.58489 7.52043 8.58489 7.22754 8.29199L5.10645 6.1709C4.81355 5.87801 4.81355 5.40324 5.10645 5.11035ZM17.833 5.11035C18.1259 4.81749 18.6007 4.81756 18.8936 5.11035C19.1864 5.40324 19.1864 5.878 18.8936 6.1709L16.7725 8.29199C16.4796 8.58489 16.0048 8.58488 15.7119 8.29199C15.4191 7.99909 15.4191 7.5243 15.7119 7.23145L17.833 5.11035ZM12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V6C12.75 6.41421 12.4142 6.75 12 6.75C11.5858 6.75 11.25 6.41421 11.25 6V3C11.25 2.58579 11.5858 2.25 12 2.25Z';

/** Figma "9.1 Slots & Helpers → _Spinner": yuklanish belgisi (Button va Input ichida ham ishlatiladi). */
export function Spinner({ size = 16, label = 'Loading', className, ...rest }: SpinnerProps) {
  const a11y = label ? { role: 'status', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <span {...a11y} {...rest} className={cx('bek-spinner', `bek-spinner--${size}`, className)}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={SPINNER_PATH} fill="currentColor" />
      </svg>
    </span>
  );
}
