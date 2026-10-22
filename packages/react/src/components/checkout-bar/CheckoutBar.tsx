import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { FloatingActions } from '../floating-actions/FloatingActions.js';

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
 * Figma "6.8 Checkout bar": buyurtmani oldinga suradigan pastki panel. Figma'da Cart va Checkout 6.9
 * Floating action container ustiga qurilgan — kodda ham `FloatingActions` (Cart = Layout Single + Info
 * wrap, Checkout = Layout Summary + huquqiy matn), scroll konteyner oxirida `sticky`.
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
  return (
    <FloatingActions
      {...rest}
      layout={type === 'checkout' ? 'summary' : 'single'}
      position="sticky"
      info={info}
      total={total}
      totalLabel={totalLabel}
      legal={legal}
      primary={{
        label: action.label,
        onClick: action.onClick,
        loading: action.loading,
        disabled: action.disabled,
      }}
      className={cx('bek-checkout-bar', `bek-checkout-bar--${type}`, className)}
    />
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
