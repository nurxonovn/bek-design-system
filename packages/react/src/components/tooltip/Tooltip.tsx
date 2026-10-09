import {
  cloneElement,
  useId,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';

export type TooltipVariant = 'dark' | 'light';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title' | 'content'> {
  /** Qisqa matn (Label/M). */
  content: ReactNode;
  /** Ixtiyoriy ikkinchi qator (Caption/M). */
  description?: ReactNode;
  /** `dark` — fill/inverse (default); `light` — surface/raised. */
  variant?: TooltipVariant;
  /** Trigger'ga nisbatan joylashuv; strelka trigger tomonga qaraydi. */
  placement?: TooltipPlacement;
  /** Strelkani ko'rsatish. */
  arrow?: boolean;
  /** Bitta fokuslanadigan element (odatda icon-only Button). */
  children: ReactElement<{ 'aria-describedby'?: string }>;
}

/**
 * Figma "5.2 Tooltip": hover yoki fokusda chiqadigan qisqa izoh. Escape bilan yopiladi.
 * Icon-only tugmalarda majburiy; ichida interaktiv element bo'lmaydi.
 */
export function Tooltip({
  content,
  description,
  variant = 'dark',
  placement = 'top',
  arrow = true,
  children,
  className,
  ...rest
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation();
      hide();
    }
  };
  const describedBy = cx(children.props['aria-describedby'], id) || undefined;

  return (
    <span
      {...rest}
      className={cx('bek-tooltip-anchor', className)}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className={cx(
          'bek-tooltip',
          `bek-tooltip--${variant}`,
          `bek-tooltip--${placement}`,
          arrow && 'bek-tooltip--arrow',
        )}
      >
        <span className="bek-tooltip__title">{content}</span>
        {description && <span className="bek-tooltip__description">{description}</span>}
      </span>
    </span>
  );
}
