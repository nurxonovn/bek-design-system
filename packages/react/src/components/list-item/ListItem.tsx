import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronRightGlyph } from '../../icons/index.js';

/** Minimal balandlik: s 48 · m 56 · l 72 px. */
export type ListItemSize = 's' | 'm' | 'l';

export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Chap slot: Checkbox, Icon yoki Avatar. */
  leading?: ReactNode;
  /** O'ng slot: Badge, Switch, qiymat. */
  trailing?: ReactNode;
  /** O'ngda › — qator boshqa ekranga olib boradi. */
  chevron?: boolean;
  size?: ListItemSize;
  selected?: boolean;
  disabled?: boolean;
  /** Butun qator havola bo'lsa. */
  href?: string;
}

/** Figma "4.4 List item": ro'yxat qatori, chap va o'ng slotlar bilan. Faqat butun qator havola yoki
 *  tugma bo'lganda fokuslanadi (Enter ochadi). */
export function ListItem({
  title,
  description,
  leading,
  trailing,
  chevron = false,
  size = 'm',
  selected = false,
  disabled = false,
  href,
  onClick,
  className,
  ...rest
}: ListItemProps) {
  const classes = cx(
    'bek-list-item',
    `bek-list-item--${size}`,
    selected && 'bek-list-item--selected',
    disabled && 'bek-list-item--disabled',
    (href || onClick) && 'bek-list-item--interactive',
    className,
  );
  const content = (
    <>
      {leading && <span className="bek-list-item__leading">{leading}</span>}
      <span className="bek-list-item__content">
        <span className="bek-list-item__title">{title}</span>
        {description && <span className="bek-list-item__description">{description}</span>}
      </span>
      {trailing && <span className="bek-list-item__trailing">{trailing}</span>}
      {chevron && <ChevronRightGlyph className="bek-list-item__chevron" />}
    </>
  );

  if (href && !disabled) {
    return (
      <a href={href} aria-current={selected ? 'page' : undefined} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  if (onClick) {
    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        event.currentTarget.click();
      }
    };
    return (
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-pressed={selected || undefined}
        className={classes}
        onClick={disabled ? undefined : onClick}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {content}
      </div>
    );
  }
  return (
    <div aria-selected={selected || undefined} className={classes} {...rest}>
      {content}
    </div>
  );
}
