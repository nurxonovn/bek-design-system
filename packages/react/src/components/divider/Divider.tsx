import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  orientation?: DividerOrientation;
  /** Faqat bezak bo'lsa (`true`) — ekran o'quvchidan yashiriladi. */
  decorative?: boolean;
}

/** Figma "9.1 Slots & Helpers → _Divider": 1 px chiziq (List, Menu, Card ichida). */
export function Divider({
  orientation = 'horizontal',
  decorative = false,
  className,
  ...rest
}: DividerProps) {
  const a11y = decorative
    ? { role: 'none' }
    : {
        role: 'separator',
        'aria-orientation': orientation === 'vertical' ? ('vertical' as const) : undefined,
      };
  return (
    <div
      {...a11y}
      {...rest}
      className={cx('bek-divider', `bek-divider--${orientation}`, className)}
    />
  );
}
