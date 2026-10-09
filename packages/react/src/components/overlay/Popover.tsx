import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.js';
import { useAnchoredPosition, useDismiss, useMounted, type Placement } from './anchored.js';
import { ActionButton, CloseButton, type OverlayAction } from './parts.js';

type TriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: 'dialog' | 'menu' | boolean;
};

/** Boshqariladigan yoki ichki `open` holati. */
export function useOpenState(
  open: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [inner, setInner] = useState(defaultOpen);
  const value = open ?? inner;
  const set = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return [value, set] as const;
}

/** Trigger ichidagi birinchi fokuslanadigan element (fokusni qaytarish uchun). */
export function focusTrigger(anchor: HTMLElement | null) {
  const el =
    anchor?.querySelector<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])') ??
    anchor;
  el?.focus();
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Ochuvchi element (odatda Button). Bosilganda ochiladi/yopiladi. */
  trigger: ReactElement<TriggerProps>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trigger'ga nisbatan joylashuv; sig'masa — teskari tomonga o'tadi. */
  placement?: Placement;
  /** S 280 · L 360 px. */
  size?: 's' | 'l';
  /** Trigger tomondagi 12×6 uchburchak. */
  tail?: boolean;
  /** Title/S. */
  title?: ReactNode;
  /** Caption/M text/secondary. */
  description?: ReactNode;
  children?: ReactNode;
  primaryAction?: OverlayAction;
  secondaryAction?: OverlayAction;
  hideClose?: boolean;
  closeLabel?: string;
}

/**
 * Figma "7.3 Popover": trigger'ga bog'langan yengil oyna. surface/raised, radius 12,
 * Elevation/2, padding 16, gap 12. Tashqariga bosish va Esc yopadi; fokus trigger'ga qaytadi.
 */
export function Popover({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  size = 's',
  tail = true,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  hideClose = false,
  closeLabel = 'Close',
  className,
  ...rest
}: PopoverProps) {
  const id = useId();
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const side = useAnchoredPosition(open, anchorRef, floatingRef, placement, tail ? 12 : 8);
  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) focusTrigger(anchorRef.current);
  };
  useDismiss(open, (reason) => close(reason === 'escape'), [anchorRef, floatingRef]);
  useEffect(() => {
    if (open) floatingRef.current?.focus();
  }, [open]);

  const anchor = (
    <span ref={anchorRef} className="bek-anchor">
      {cloneElement(trigger, {
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        'aria-haspopup': 'dialog',
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          setOpen(!open);
        },
      })}
    </span>
  );
  if (!open || !mounted) return anchor;
  return (
    <>
      {anchor}
      {createPortal(
        <div
          {...rest}
          ref={floatingRef}
          id={id}
          role="dialog"
          aria-labelledby={title ? `${id}-title` : undefined}
          tabIndex={-1}
          data-side={side}
          className={cx(
            'bek-popover',
            `bek-popover--${size}`,
            tail && 'bek-popover--tail',
            className,
          )}
        >
          {(title || !hideClose) && (
            <div className="bek-popover__header">
              {title && (
                <p id={`${id}-title`} className="bek-popover__title">
                  {title}
                </p>
              )}
              {!hideClose && <CloseButton label={closeLabel} onClick={() => close()} small />}
            </div>
          )}
          {description && <p className="bek-popover__description">{description}</p>}
          {children}
          {(primaryAction || secondaryAction) && (
            <div className="bek-popover__actions">
              {secondaryAction && <ActionButton action={secondaryAction} variant="flat" size="m" />}
              {primaryAction && <ActionButton action={primaryAction} variant="action" size="m" />}
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
