import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@bek/react';
import { formatPercent } from '../../core/format.js';
import { Delta } from '../delta/Delta.js';
import { Sparkline } from '../sparkline/Sparkline.js';

export type KpiCardVariant = 'default' | 'compact' | 'progress';

export interface KpiGoal {
  /** 0…1 — maqsadga erishish ulushi. */
  progress: number;
  /** Izoh: "3,6 of 5 mln". */
  label?: ReactNode;
}

export interface KpiCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `default` — qiymat + Delta + sparkline, `compact` — zich grid va Mobile ro'yxat, `progress` — maqsadga nisbatan. */
  variant?: KpiCardVariant;
  /** Metrika nomi: "Active users". */
  label: ReactNode;
  /** Formatlangan qiymat (`formatNumber`): `12 480`. Progress'da standart — foiz. */
  value?: ReactNode;
  /** O'zgarish, foizda. */
  delta?: number;
  betterWhen?: 'up' | 'down';
  /** Taqqoslash izohi: "vs last week", "8 days left". */
  comparison?: ReactNode;
  /** Oxirgi N qiymat — Default'da sparkline. */
  trend?: number[];
  /** Progress varianti uchun maqsad. */
  goal?: KpiGoal;
  /** Butun karta havola — batafsil grafikka o'tish (hover'da Elevation/1). */
  href?: string;
}

/** Figma "4.18 Chart · KPI card": dashboard yuqori qatoridagi asosiy raqam. */
export function KpiCard({
  variant = 'default',
  label,
  value,
  delta,
  betterWhen,
  comparison,
  trend,
  goal,
  href,
  className,
  ...rest
}: KpiCardProps) {
  const labelId = useId();
  const p = Math.max(0, Math.min(1, goal?.progress ?? 0));
  const shown = value ?? (variant === 'progress' ? formatPercent(p * 100, { decimals: 0 }) : null);
  const body = (
    <>
      <span className="bek-kpi-card__label" id={labelId}>
        {label}
      </span>
      <span className="bek-kpi-card__row">
        <span className="bek-kpi-card__value">{shown}</span>
        {delta != null && variant !== 'progress' && <Delta value={delta} betterWhen={betterWhen} />}
      </span>
      {variant === 'default' && trend && trend.length > 1 && (
        <Sparkline
          className="bek-kpi-card__spark"
          data={trend}
          width={208}
          label={`Trend over ${trend.length} periods`}
        />
      )}
      {variant === 'progress' && (
        <span className="bek-kpi-card__goal">
          <span
            className="bek-kpi-card__track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(p * 100)}
            aria-labelledby={labelId}
          >
            <span className="bek-kpi-card__fill" style={{ inlineSize: `${p * 100}%` }} />
          </span>
          {goal?.label != null && <span className="bek-kpi-card__goal-label">{goal.label}</span>}
        </span>
      )}
      {comparison != null && variant !== 'compact' && (
        <span className="bek-kpi-card__comparison">{comparison}</span>
      )}
    </>
  );
  const classes = cx(
    'bek-kpi-card',
    `bek-kpi-card--${variant}`,
    href && 'bek-kpi-card--link',
    className,
  );
  if (href)
    return (
      <a {...rest} href={href} className={cx(classes, 'bek-focus-ring')}>
        {body}
      </a>
    );
  return (
    <div {...rest} className={classes}>
      {body}
    </div>
  );
}
