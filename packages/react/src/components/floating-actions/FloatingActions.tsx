import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Button, type ButtonProps } from '../button/Button.js';

/** Tugma prop'lari — variant va o'lcham konteynerdan (Action/Normal, XL). */
export interface FloatingAction extends Omit<ButtonProps, 'variant' | 'size' | 'children'> {
  label: ReactNode;
}

export type FloatingActionsLayout = 'single' | 'horizontal' | 'vertical' | 'summary';

export interface FloatingActionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma "Layout": `single` — bitta Action · `horizontal` — ikkita yonma-yon · `vertical` — ikkita
   * ustma-ust · `summary` — jami summa + bitta Action (Checkout bar shu asosda).
   */
  layout?: FloatingActionsLayout;
  /** Asosiy amal — Button Action XL. Hech qachon disabled emas (CMP-06): bosilganda tekshiring. */
  primary: FloatingAction;
  /** Ikkinchi amal — Button Normal XL (`horizontal`, `vertical`). */
  secondary?: FloatingAction;
  /** Figma "Show info": yuqoridagi izoh qatori (odatda InfoWrap 5.5). */
  info?: ReactNode;
  /** Figma "Show legal" + "Legal": tugmalar ostidagi bir qator (Caption/M, text/tertiary). */
  legal?: ReactNode;
  /** `summary`: jami summa ("159 000 soʻm", Title/L). */
  total?: ReactNode;
  totalLabel?: ReactNode;
  /**
   * Figma "Home indicator space": pastda iOS home indicator uchun joy (12 + 8 + 12 = 32 yoki
   * `env(safe-area-inset-bottom)` — qaysi katta bo'lsa). Bottom sheet ichida (o'z safe area'si bor) o'chiring.
   */
  homeIndicator?: boolean;
  /**
   * `fixed` — ekran pastiga qotiriladi (standart) · `sticky` — scroll konteyner oxirida ·
   * `static` — oqim ichida (Bottom sheet, namunalar).
   */
  position?: 'fixed' | 'sticky' | 'static';
}

function ActionButton({
  action,
  variant,
}: {
  action: FloatingAction;
  variant: 'action' | 'normal';
}) {
  const { label, className, ...props } = action;
  return (
    <Button
      {...props}
      variant={variant}
      size="xl"
      className={cx('bek-floating-actions__button', className)}
    >
      {label}
    </Button>
  );
}

/**
 * Figma "6.9 Floating action container": Mobile'da asosiy amalni ushlab turadigan pastki panel.
 * surface/raised + Elevation/1 (Dark'da soya yo'q), padding 12 / 16, qatorlar gap 12, tugmalar XL.
 * Safe area (`env(safe-area-inset-*)`) va RTL hisobga olinadi. Bottom navigation bilan bitta ekranda emas.
 */
export function FloatingActions({
  layout = 'single',
  primary,
  secondary,
  info,
  legal,
  total,
  totalLabel = 'Total',
  homeIndicator = true,
  position = 'fixed',
  className,
  ...rest
}: FloatingActionsProps) {
  const withSecondary = (layout === 'horizontal' || layout === 'vertical') && secondary;
  return (
    <div
      {...rest}
      className={cx(
        'bek-floating-actions',
        `bek-floating-actions--${layout}`,
        `bek-floating-actions--${position}`,
        homeIndicator && 'bek-floating-actions--home-indicator',
        className,
      )}
    >
      {info && <div className="bek-floating-actions__info">{info}</div>}
      <div className="bek-floating-actions__actions">
        {layout === 'summary' && (
          <div className="bek-floating-actions__total">
            <span className="bek-floating-actions__total-label">{totalLabel}</span>
            <span className="bek-floating-actions__amount">{total}</span>
          </div>
        )}
        <ActionButton action={primary} variant="action" />
        {withSecondary ? <ActionButton action={withSecondary} variant="normal" /> : null}
      </div>
      {legal && <p className="bek-floating-actions__legal">{legal}</p>}
    </div>
  );
}
