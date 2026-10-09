import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
/** Ichki bo'shliq: s 16 · m 24 · l 32 px. */
export type CardSize = 's' | 'm' | 'l';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  variant?: CardVariant;
  size?: CardSize;
  /** Yuqoridagi rasm/video bloki. */
  media?: ReactNode;
  /** Sarlavha oldidagi ikonka yoki avatar. */
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Sarlavha yonidagi Badge. */
  badge?: ReactNode;
  /** O'ng yuqoridagi icon-only Button. */
  action?: ReactNode;
  /** Pastdagi tugmalar guruhi. */
  footer?: ReactNode;
  /** Asosiy matn yoki ixtiyoriy kontent. */
  children?: ReactNode;
  selected?: boolean;
  /** Butun karta havola bo'lsa. */
  href?: string;
}

/** Figma "4.3 Card": konteyner — media, sarlavha, tavsif, badge, amal, matn va footer bloklari. */
export function Card({
  variant = 'elevated',
  size = 'm',
  media,
  icon,
  title,
  description,
  badge,
  action,
  footer,
  children,
  selected = false,
  href,
  onClick,
  className,
  ...rest
}: CardProps) {
  const classes = cx(
    'bek-card',
    `bek-card--${variant}`,
    `bek-card--${size}`,
    selected && 'bek-card--selected',
    (href || onClick) && 'bek-card--interactive',
    className,
  );
  const header = (icon || title || description || badge || action) && (
    <div className="bek-card__header">
      {icon && <span className="bek-card__icon">{icon}</span>}
      <div className="bek-card__heading">
        {(title || badge) && (
          <div className="bek-card__title-row">
            {title && <span className="bek-card__title">{title}</span>}
            {badge}
          </div>
        )}
        {description && <span className="bek-card__description">{description}</span>}
      </div>
      {action && <span className="bek-card__action">{action}</span>}
    </div>
  );
  const content = (
    <>
      {media && <div className="bek-card__media">{media}</div>}
      {header}
      {children && <div className="bek-card__body">{children}</div>}
      {footer && <div className="bek-card__footer">{footer}</div>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  if (onClick) {
    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        event.currentTarget.click();
      }
    };
    return (
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected || undefined}
        className={classes}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {content}
      </div>
    );
  }
  return (
    <div className={classes} {...rest}>
      {content}
    </div>
  );
}
