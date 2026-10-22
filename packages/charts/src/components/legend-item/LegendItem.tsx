import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek-ui/react';

export type LegendMarker = 'dot' | 'square' | 'line' | 'dashed';

export interface LegendItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Marker shakli — seriya belgisi: `dot` (nuqta), `square` (maydon), `line`, `dashed` (prognoz / reja). */
  variant?: LegendMarker;
  /** Seriya rangi (CSS qiymati). Standart: `dataviz/categorical/01`; `dashed` uchun `dataviz/target`. */
  color?: string;
  /** Seriya yashirilgan: label `text/disabled`, marker 30%. */
  hidden?: boolean;
  /** Bosilganda seriyani o'chirib-yoqish. Berilmasa — oddiy (bosilmaydigan) yozuv. */
  onToggle?: () => void;
  /** Seriya nomi. */
  children: ReactNode;
}

/** Figma "4.18 Chart · Legend item": seriya markeri va nomi. `onToggle` bilan — toggle tugma. */
export function LegendItem({
  variant = 'dot',
  color,
  hidden = false,
  onToggle,
  className,
  children,
  style,
  ...rest
}: LegendItemProps) {
  const classes = cx(
    'bek-legend-item',
    `bek-legend-item--${variant}`,
    hidden && 'bek-legend-item--hidden',
    className,
  );
  const vars = color ? { ...style, '--bek-legend-color': color } : style;
  const content = (
    <>
      <span className="bek-legend-item__marker" aria-hidden="true" />
      <span className="bek-legend-item__label">{children}</span>
    </>
  );
  if (!onToggle)
    return (
      <span className={classes} style={vars}>
        {content}
      </span>
    );
  return (
    <button
      {...rest}
      type="button"
      className={cx(classes, 'bek-focus-ring')}
      style={vars}
      aria-pressed={!hidden}
      onClick={onToggle}
    >
      {content}
    </button>
  );
}

export interface ChartLegendItem {
  label: ReactNode;
  color?: string;
  variant?: LegendMarker;
  hidden?: boolean;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  /** Seriya bosilganda (indeks). Berilmasa legend statik. */
  onToggle?: (index: number) => void;
  'aria-label'?: string;
  className?: string;
}

/** Legend qatori — `chart/legend/gap` oraliq bilan o'raladi; ko'pi bilan 6 seriya, qolgani "Other". */
export function ChartLegend({
  items,
  onToggle,
  className,
  'aria-label': ariaLabel = 'Legend',
}: ChartLegendProps) {
  return (
    <ul className={cx('bek-chart-legend', className)} aria-label={ariaLabel}>
      {items.map((it, i) => (
        <li key={i}>
          <LegendItem
            variant={it.variant}
            color={it.color}
            hidden={it.hidden}
            onToggle={onToggle ? onToggle.bind(null, i) : undefined}
          >
            {it.label}
          </LegendItem>
        </li>
      ))}
    </ul>
  );
}
