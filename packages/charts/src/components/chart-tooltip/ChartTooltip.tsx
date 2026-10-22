import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek-ui/react';

export interface ChartTooltipRow {
  /** Seriya nomi. */
  label: ReactNode;
  /** Formatlangan qiymat (`formatNumber` bilan): `12 450 000`. */
  value: ReactNode;
  /** Marker rangi; standart — `dataviz/categorical/01`. */
  color?: string;
  /** Prognoz / reja qatori — chiziqcha marker (`dataviz/target`). */
  dashed?: boolean;
}

export interface ChartTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Sarlavha — x qiymati (sana, kategoriya). */
  title?: ReactNode;
  /** 1 qator — Single, 2+ — Multi; ko'pi bilan 6. */
  rows: ChartTooltipRow[];
}

/**
 * Figma "4.18 Chart · Tooltip": `surface/raised` + Elevation/2 kartochka. Joylashuvni chart beradi
 * (kursordan 12 px, chetda teskari tomonga); bu komponent faqat ko'rinish.
 */
export function ChartTooltip({ title, rows, className, ...rest }: ChartTooltipProps) {
  const variant = rows.length > 1 ? 'multi' : 'single';
  return (
    <div
      {...rest}
      role="tooltip"
      className={cx('bek-chart-tooltip', `bek-chart-tooltip--${variant}`, className)}
    >
      {title != null && <div className="bek-chart-tooltip__title">{title}</div>}
      <dl className="bek-chart-tooltip__rows">
        {rows.slice(0, 6).map((r, i) => (
          <div key={i} className="bek-chart-tooltip__row">
            <dt className="bek-chart-tooltip__label">
              <span
                className={cx(
                  'bek-chart-tooltip__marker',
                  r.dashed && 'bek-chart-tooltip__marker--dashed',
                )}
                style={r.color ? { background: r.color } : undefined}
                aria-hidden="true"
              />
              {r.label}
            </dt>
            <dd className="bek-chart-tooltip__value">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
