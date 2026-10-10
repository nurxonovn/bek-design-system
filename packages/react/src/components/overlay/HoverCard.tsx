import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.js';
import { useAnchoredPosition, useMounted, type Placement } from './anchored.js';

export type HoverCardVariant = 'profile' | 'link';

export interface HoverCardStat {
  /** "128", "2.4k" — Label/M. */
  value: ReactNode;
  /** "Projects" — Caption/L text/secondary. */
  label: ReactNode;
}

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Havola, ism yoki avatar. */
  trigger: ReactNode;
  /** `profile` — avatar + ism + statistika · `link` — 16:9 preview + sarlavha. Berilmasa — faqat `children`. */
  variant?: HoverCardVariant;
  /** Title/S. */
  title?: ReactNode;
  /** Caption/M text/secondary ("Supporting text", manba). */
  subtitle?: ReactNode;
  /** Body/S text/secondary, 2 qatorgacha (Figma `Show description`). */
  description?: ReactNode;
  /** `profile`: Avatar (48). */
  avatar?: ReactNode;
  /** `link`: preview rasmi/ikonkasi (16:9, fill/tertiary-hover). */
  preview?: ReactNode;
  /** `profile`: statistika (Figma `Show stats`), masalan `[{ value: '128', label: 'Projects' }]`. */
  stats?: HoverCardStat[];
  /** Faqat o'qish uchun qo'shimcha mazmun — tugmalarsiz. */
  children?: ReactNode;
  placement?: Placement;
  /** Ochilish kechikishi, ms. */
  openDelay?: number;
  /** Yopilish kechikishi, ms. */
  closeDelay?: number;
}

/**
 * Figma "7.8 Hover card": kursor havola ustida to'xtaganda chiqadigan ko'rinish (500 / 300 ms).
 * Variant = Profile | Link. 320 kenglik, radius 12, Elevation/3, z/dropdown. Touch'da ochilmaydi;
 * fokusda ham ko'rinadi.
 */
export function HoverCard({
  trigger,
  variant,
  title,
  subtitle,
  description,
  avatar,
  preview,
  stats,
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
  const text = (title || subtitle) && (
    <span className="bek-hover-card__text">
      {title && <span className="bek-hover-card__title">{title}</span>}
      {subtitle && <span className="bek-hover-card__subtitle">{subtitle}</span>}
    </span>
  );
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
            className={cx('bek-hover-card', variant && `bek-hover-card--${variant}`, className)}
          >
            {variant === 'link' && preview && (
              <span className="bek-hover-card__preview" aria-hidden="true">
                {preview}
              </span>
            )}
            {variant === 'profile' ? (
              <span className="bek-hover-card__identity">
                {avatar && (
                  <span className="bek-hover-card__avatar" aria-hidden="true">
                    {avatar}
                  </span>
                )}
                {text}
              </span>
            ) : (
              text
            )}
            {description && <p className="bek-hover-card__description">{description}</p>}
            {variant === 'profile' && stats && stats.length > 0 && (
              <span className="bek-hover-card__stats">
                {stats.map((stat, i) => (
                  <span key={i} className="bek-hover-card__stat">
                    <span className="bek-hover-card__stat-value">{stat.value}</span>
                    {stat.label}
                  </span>
                ))}
              </span>
            )}
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
