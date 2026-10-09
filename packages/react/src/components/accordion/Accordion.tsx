import type { DetailsHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronDownGlyph } from '../../icons/index.js';

export interface AccordionItemProps
  extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  /** `plain` — ajratuvchi chiziq bilan; `card` — fill/secondary kartochka. */
  variant?: 'plain' | 'card';
  /** Sarlavha balandligi: s 48 · m 56 px. */
  size?: 's' | 'm';
  disabled?: boolean;
  children?: ReactNode;
}

/** Figma "4.12 Accordion": yig'iladigan bo'lim. Native `<details>/<summary>` — Enter/Space ochadi,
 *  `aria-expanded` brauzerdan. Bir nechta element — `<Accordion>` ichida. */
export function AccordionItem({
  title,
  description,
  icon,
  badge,
  variant = 'plain',
  size = 'm',
  disabled = false,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const block = (event: MouseEvent<HTMLElement>) => {
    if (disabled) event.preventDefault();
  };
  return (
    <details
      className={cx(
        'bek-accordion-item',
        `bek-accordion-item--${variant}`,
        `bek-accordion-item--${size}`,
        disabled && 'bek-accordion-item--disabled',
        className,
      )}
      {...rest}
    >
      <summary
        className="bek-accordion-item__header"
        aria-disabled={disabled || undefined}
        onClick={block}
      >
        {icon && <span className="bek-accordion-item__icon">{icon}</span>}
        <span className="bek-accordion-item__text">
          <span className="bek-accordion-item__title">{title}</span>
          {description && <span className="bek-accordion-item__description">{description}</span>}
        </span>
        {badge}
        <ChevronDownGlyph className="bek-accordion-item__chevron" />
      </summary>
      <div className="bek-accordion-item__content">{children}</div>
    </details>
  );
}

/** Accordion elementlari ro'yxati. */
export function Accordion({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('bek-accordion', className)} {...rest} />;
}
