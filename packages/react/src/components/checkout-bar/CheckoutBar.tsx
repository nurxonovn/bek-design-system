import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Button } from '../button/Button.js';

export interface CheckoutBarAction {
  label: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface CheckoutBarProps extends HTMLAttributes<HTMLDivElement> {
  /** `cart` — Info wrap + "Go to cart · total" · `checkout` — jami + Pay + huquqiy matn. */
  type?: 'cart' | 'checkout';
  /** Yuqoridagi izoh (odatda InfoWrap). */
  info?: ReactNode;
  /** Jami summasi ("159 000 soʻm"), `checkout` turida. */
  total?: ReactNode;
  totalLabel?: ReactNode;
  /** Asosiy amal — Action XL tugma. */
  action: CheckoutBarAction;
  /** Pastdagi kichik huquqiy matn (Caption/M, text/tertiary). */
  legal?: ReactNode;
}

/**
 * Figma "6.8 Checkout bar": buyurtmani oldinga suradigan pastki panel. surface/raised,
 * Elevation/1, padding 12 16 (+ home indicator), gap 12.
 */
export function CheckoutBar({
  type = 'cart',
  info,
  total,
  totalLabel = 'Total',
  action,
  legal,
  className,
  ...rest
}: CheckoutBarProps) {
  const button = (
    <Button
      variant="action"
      size="xl"
      loading={action.loading}
      disabled={action.disabled}
      onClick={action.onClick}
      className="bek-checkout-bar__button"
    >
      {action.label}
    </Button>
  );
  return (
    <div {...rest} className={cx('bek-checkout-bar', `bek-checkout-bar--${type}`, className)}>
      {info}
      {type === 'checkout' ? (
        <div className="bek-checkout-bar__row">
          <div className="bek-checkout-bar__total">
            <span className="bek-checkout-bar__total-label">{totalLabel}</span>
            <span className="bek-checkout-bar__amount">{total}</span>
          </div>
          {button}
        </div>
      ) : (
        button
      )}
      {legal && <p className="bek-checkout-bar__legal">{legal}</p>}
    </div>
  );
}

export interface CartPillProps extends HTMLAttributes<HTMLButtonElement> {
  /** Chapdagi 24 px ikonka (savat). */
  icon: ReactNode;
  /** "Cart · 3 items". */
  label: ReactNode;
  /** "147 000 soʻm". */
  total: ReactNode;
}

/** Figma "Checkout bar → Floating": savatda mahsulot bor paytda menyu ustidagi accent pill. */
export function CartPill({ icon, label, total, className, ...rest }: CartPillProps) {
  return (
    <button type="button" {...rest} className={cx('bek-cart-pill bek-focus-ring', className)}>
      <span className="bek-cart-pill__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="bek-cart-pill__label">{label}</span>
      <span className="bek-cart-pill__total">{total}</span>
    </button>
  );
}
