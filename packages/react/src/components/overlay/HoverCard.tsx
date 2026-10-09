import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.js';
import { useAnchoredPosition, useMounted, type Placement } from './anchored.js';

export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Havola, ism yoki avatar. */
  trigger: ReactNode;
  /** Faqat o'qish uchun mazmun — tugmalarsiz. */
  children: ReactNode;
  placement?: Placement;
  /** Ochilish kechikishi, ms. */
  openDelay?: number;
  /** Yopilish kechikishi, ms. */
  closeDelay?: number;
}

/**
 * Figma "7.8 Hover card": kursor havola ustida to'xtaganda chiqadigan ko'rinish (500 / 300 ms).
 * 320 kenglik, radius 12, Elevation/3, z/dropdown. Touch'da ochilmaydi; fokusda ham ko'rinadi.
 */
export function HoverCard({
  trigger,
  children,
  placement = 'bottom-start',
  openDelay = 500,
  closeDelay = 300,
  className,
  ...rest
}: HoverCardProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useMounted();
  useAnchoredPosition(open, anchorRef, cardRef, placement, 8);
  useEffect(() => () => clearTimeout(timer.current), []);
  const schedule = (next: boolean) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? openDelay : closeDelay);
  };
  const pointer = {
    onPointerEnter: (event: { pointerType: string }) => {
      if (event.pointerType === 'mouse') schedule(true);
    },
    onPointerLeave: (event: { pointerType: string }) => {
      if (event.pointerType === 'mouse') schedule(false);
    },
  };
  return (
    <>
      <span
        ref={anchorRef}
        className="bek-anchor"
        aria-describedby={open ? id : undefined}
        {...pointer}
        onFocus={() => schedule(true)}
        onBlur={() => schedule(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false);
        }}
      >
        {trigger}
      </span>
      {open &&
        mounted &&
        createPortal(
          <div
            {...rest}
            {...pointer}
            ref={cardRef}
            id={id}
            className={cx('bek-hover-card', className)}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
