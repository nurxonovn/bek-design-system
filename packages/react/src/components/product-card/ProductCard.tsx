import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Button } from '../button/Button.js';
import { Stepper } from '../stepper/Stepper.js';

export interface ProductCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** `vertical` — 2 ustunli to'r; `horizontal` — menyu ro'yxati; `featured` — aksiya va tavsiyalar. */
  layout?: 'vertical' | 'horizontal' | 'featured';
  /** Rasm (`<img>`), slot. */
  image?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Odatda `<Price />`. */
  price?: ReactNode;
  /** Rasm ustidagi yorliq ("Yangi"). */
  badge?: ReactNode;
  /** Savatdagi miqdor. > 0 bo'lsa tugma o'rniga Stepper. */
  quantity?: number;
  onAdd?: () => void;
  onQuantityChange?: (quantity: number) => void;
  /** Mavjud emas — karta xiralashadi, amal o'chadi. */
  unavailable?: boolean;
  addLabel?: ReactNode;
  unavailableLabel?: ReactNode;
  /** Mahsulot sahifasiga havola (sarlavha orqali). */
  href?: string;
}

/** Figma "4.14 Product card": rasm, nom, tavsif, narx va qo'shish amali. */
export function ProductCard({
  layout = 'vertical',
  image,
  title,
  description,
  price,
  badge,
  quantity = 0,
  onAdd,
  onQuantityChange,
  unavailable = false,
  addLabel = 'Add',
  unavailableLabel = 'Unavailable',
  href,
  className,
  ...rest
}: ProductCardProps) {
  const action = unavailable ? (
    <Button variant="flat" disabled className="bek-product-card__action">
      {unavailableLabel}
    </Button>
  ) : quantity > 0 ? (
    <Stepper
      value={quantity}
      min={0}
      onChange={onQuantityChange}
      aria-label={typeof title === 'string' ? title : undefined}
      className="bek-product-card__action"
    />
  ) : (
    <Button variant="outline-action" onClick={onAdd} className="bek-product-card__action">
      {addLabel}
    </Button>
  );
  const name = href ? (
    <a href={href} className="bek-product-card__title">
      {title}
    </a>
  ) : (
    <span className="bek-product-card__title">{title}</span>
  );
  return (
    <article
      className={cx(
        'bek-product-card',
        `bek-product-card--${layout}`,
        unavailable && 'bek-product-card--unavailable',
        className,
      )}
      {...rest}
    >
      <div className="bek-product-card__image">
        {image}
        {badge && <span className="bek-product-card__badge">{badge}</span>}
      </div>
      <div className="bek-product-card__content">
        {name}
        {description && <span className="bek-product-card__description">{description}</span>}
        <div className="bek-product-card__footer">
          {price}
          {action}
        </div>
      </div>
    </article>
  );
}
