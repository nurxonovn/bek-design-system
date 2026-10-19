import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek/react';

export type TimelineItemState = 'done' | 'current' | 'upcoming';

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** `TimelineItem` lar — tarix uchun eng yangisi tepada, jarayon uchun xronologik. */
  children: ReactNode;
}

/** Vertikal voqealar ro'yxati (`<ol>`). Oxirgi elementning chizig'i avtomatik yashiriladi. */
export function Timeline({ className, children, ...rest }: TimelineProps) {
  return (
    <ol {...rest} className={cx('bek-diagram', 'bek-timeline', className)}>
      {children}
    </ol>
  );
}

/** Ekran o'quvchi uchun holat so'zi — rang va marker yagona belgi bo'lmasligi uchun (WCAG 1.4.1). */
export const TIMELINE_STATE_LABEL: Record<TimelineItemState, string> = {
  done: 'Completed',
  current: 'Current',
  upcoming: 'Upcoming',
};

export interface TimelineItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** `done` — bajarilgan (status/success), `current` — joriy (accent + halqa), `upcoming` — kutilmoqda. */
  state?: TimelineItemState;
  /** Holat so'zini almashtirish (masalan o'zbekcha: "Bajarildi"). Standart — `TIMELINE_STATE_LABEL`. */
  stateLabel?: string;
  /** Voqea nomi: "Credit check" (Label/M). */
  title: ReactNode;
  /** Sana — yaqinda bo'lsa nisbiy ("Today"), aks holda aniq. Caption/M. */
  date?: ReactNode;
  /** `<time dateTime>` uchun mashina o'qiydigan sana (ISO). */
  dateTime?: string;
  /** Izoh: "Usually takes up to 2 hours" (Body/S · text/secondary). */
  description?: ReactNode;
  /** Keyingi elementga chiziq. `Timeline` ichida oxirgisida avtomatik yashiriladi. Standart: true. */
  line?: boolean;
}

/**
 * Figma "4.19 Diagram · Timeline item": ariza holati, yetkazib berish, loyiha bosqichlari tarixi.
 * Joriy element `aria-current="step"`.
 */
export function TimelineItem({
  state = 'done',
  title,
  date,
  dateTime,
  description,
  line = true,
  stateLabel,
  className,
  ...rest
}: TimelineItemProps) {
  const srState = stateLabel ?? TIMELINE_STATE_LABEL[state];
  return (
    <li
      {...rest}
      aria-current={state === 'current' ? 'step' : undefined}
      className={cx(
        'bek-diagram',
        'bek-timeline-item',
        `bek-timeline-item--${state}`,
        !line && 'bek-timeline-item--last',
        className,
      )}
    >
      <span className="bek-timeline-item__rail" aria-hidden="true">
        <span className="bek-timeline-item__marker" />
        <span className="bek-timeline-item__line" />
      </span>
      <span className="bek-timeline-item__content">
        <span className="bek-timeline-item__head">
          <span className="bek-timeline-item__title">{title}</span>
          <span className="bek-chart__sr"> — {srState}</span>
          {date != null && (
            <time className="bek-timeline-item__date" dateTime={dateTime}>
              {date}
            </time>
          )}
        </span>
        {description != null && (
          <span className="bek-timeline-item__description">{description}</span>
        )}
      </span>
    </li>
  );
}
