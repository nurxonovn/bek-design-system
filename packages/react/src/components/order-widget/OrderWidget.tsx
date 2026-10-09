import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronRightGlyph } from '../../icons/index.js';

export type OrderStatus = 'accepted' | 'preparing' | 'on-the-way' | 'delivered';

const STAGES: OrderStatus[] = ['accepted', 'preparing', 'on-the-way', 'delivered'];

export interface OrderWidgetProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  status: OrderStatus;
  /** `compact` — bir qator; `expanded` — 4 bo'lakli progress va bosqich nomlari. */
  size?: 'compact' | 'expanded';
  /** 24 px ikonka (holatga mos). */
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Bosqich nomlari (expanded): Qabul qilindi · Tayyorlanmoqda · Yo'lda · Yetkazildi. */
  stageLabels?: [ReactNode, ReactNode, ReactNode, ReactNode];
  /** Buyurtmani kuzatish sahifasi. */
  href?: string;
  onClick?: () => void;
  chevron?: boolean;
}

/** Figma "4.15 Widget · Active order": jarayondagi buyurtmaning jonli holati. Delivered — success ranglar. */
export function OrderWidget({
  status,
  size = 'compact',
  icon,
  title,
  subtitle,
  stageLabels = ['Accepted', 'Preparing', 'On the way', 'Delivered'],
  href,
  onClick,
  chevron = true,
  className,
  ...rest
}: OrderWidgetProps) {
  const reached = STAGES.indexOf(status);
  const body = (
    <>
      <span className="bek-order-widget__row">
        {icon && <span className="bek-order-widget__icon">{icon}</span>}
        <span className="bek-order-widget__text">
          <span className="bek-order-widget__title">{title}</span>
          {subtitle && <span className="bek-order-widget__subtitle">{subtitle}</span>}
        </span>
        {chevron && (href || onClick) && (
          <ChevronRightGlyph className="bek-order-widget__chevron" />
        )}
      </span>
      {size === 'expanded' && (
        <>
          <span
            className="bek-order-widget__progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={reached + 1}
          >
            {STAGES.map((s, i) => (
              <span key={s} className={cx('bek-order-widget__step', i <= reached && 'is-done')} />
            ))}
          </span>
          <span className="bek-order-widget__labels" aria-hidden="true">
            {stageLabels.map((label, i) => (
              <span key={i} className={cx(i <= reached && 'is-done')}>
                {label}
              </span>
            ))}
          </span>
        </>
      )}
    </>
  );
  const classes = cx(
    'bek-order-widget',
    `bek-order-widget--${size}`,
    `bek-order-widget--${status}`,
    className,
  );
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {body}
      </a>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
    );
  }
  return (
    <section className={classes} {...rest}>
      {body}
    </section>
  );
}
