import type { CSSProperties, SVGAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { r2 } from '../../core/geometry.js';
import { PartFrame, type ChartPartFrameProps } from '../chart-axis/PartFrame.js';

export type ChartPointVariant = 'default' | 'active' | 'anomaly';

export interface ChartPointProps
  extends ChartPartFrameProps,
    Omit<SVGAttributes<SVGGElement>, 'x' | 'y' | 'color'> {
  /** Markaz koordinatalari (chart SVG ichida). Mustaqil ko'rinishda standart — 24 × 24 markazi. */
  x?: number;
  y?: number;
  /**
   * `default` — nuqta (zich chiziqda yashiriladi), `active` — hover / fokus / oxirgi qiymat (halo bilan),
   * `anomaly` — model topgan chetga chiqish (`dataviz/anomaly`).
   */
  variant?: ChartPointVariant;
  /** Seriya rangi (CSS qiymati, `seriesColor(i)`). Standart — `dataviz/categorical/01`. Anomaly'da e'tiborsiz. */
  color?: string;
  /** Hover matni (`<title>`): "12 Oct, Revenue 4 820 mln"; anomaly'da sababi ham. */
  title?: string;
}

/** `chart/point/size` 8 → r 4; `chart/point/size-active` 12 → r 6; halo 20 → r 10 (scale/4 padding). */
const R = { default: 4, active: 6, halo: 10 } as const;
/** Mustaqil ko'rinish — doc: "Hit area is at least 24 × 24". */
const PREVIEW = 24;

/**
 * Figma "4.18 Chart · Data point": chiziq / scatter'dagi bitta qiymat. SVG `<g>` bo'lagi — chart `<svg>` ichida
 * `x`/`y` bilan. Fokuslanadigan emas: klaviatura navigatsiyasini chart (role="img" dan tashqarida) beradi.
 */
export function ChartPoint({
  x = PREVIEW / 2,
  y = PREVIEW / 2,
  variant = 'default',
  color,
  title,
  standalone,
  label,
  className,
  style,
  ...rest
}: ChartPointProps) {
  const halo = variant !== 'default';
  const vars = color ? ({ ...style, '--bek-chart-point-color': color } as CSSProperties) : style;
  return (
    <PartFrame
      standalone={standalone}
      label={label ?? title}
      fallbackLabel={variant === 'anomaly' ? 'Anomaly point' : 'Data point'}
      name="data-point"
      width={PREVIEW}
      height={PREVIEW}
    >
      <g
        {...rest}
        className={cx('bek-data-point', `bek-data-point--${variant}`, className)}
        style={vars}
        transform={`translate(${r2(x)} ${r2(y)})`}
      >
        {title && <title>{title}</title>}
        {halo && <circle className="bek-data-point__halo" r={R.halo} />}
        <circle className="bek-data-point__dot" r={halo ? R.active : R.default} />
      </g>
    </PartFrame>
  );
}
