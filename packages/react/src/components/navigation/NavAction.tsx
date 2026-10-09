import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export interface NavActionProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Berilsa — `<a>`, aks holda `<button>`. */
  href?: string;
  /** Joriy sahifa — `aria-current="page"`. */
  selected?: boolean;
  disabled?: boolean;
  /** Ichki ro'yxatni ochib-yopadi — `aria-expanded`. */
  expanded?: boolean;
  children?: ReactNode;
}

/** Navigatsiya elementlari uchun umumiy asos: havola yoki tugma. */
export function NavAction({
  href,
  selected = false,
  disabled = false,
  expanded,
  className,
  children,
  ...rest
}: NavActionProps) {
  const common = {
    className: cx('bek-focus-ring', className),
    'aria-current': selected ? ('page' as const) : undefined,
    'aria-expanded': expanded,
    'data-selected': selected || undefined,
  };
  if (href !== undefined) {
    return (
      <a
        {...rest}
        {...common}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : rest.tabIndex}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as Record<string, unknown>)} {...common} disabled={disabled}>
      {children}
    </button>
  );
}
