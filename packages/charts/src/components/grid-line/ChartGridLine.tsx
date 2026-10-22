import type { SVGAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { PartFrame, type ChartPartFrameProps } from '../chart-axis/PartFrame.js';

export type ChartGridLineVariant = 'solid' | 'baseline' | 'target';

export interface ChartGridLineProps
  extends ChartPartFrameProps,
    Omit<SVGAttributes<SVGGElement>, 'y' | 'x1' | 'x2'> {
  /**
   * `solid` — har Y bo'linmasi uchun grid (`dataviz/grid`), `baseline` — 0 chizig'i (`dataviz/axis`),
   * `target` — reja / maqsad, uzuq chiziq (`dataviz/target`).
   */
  variant?: ChartGridLineVariant;
  /** Chiziqning y koordinatasi (`scale(value)`). Mustaqil ko'rinishda standart — o'rtasi. */
  y?: number;
  /** Plot chap va o'ng cheti. Standart: 0 … 480 (`scale/480`). */
  x1?: number;
  x2?: number;
  /** Target qiymati matnda (Figma: "A Target line always has a label"): `Plan 85`. Chiziq ustida, o'ngda. */
  valueLabel?: string;
}

/**
 * Figma "4.18 Chart · Grid line": gorizontal yo'naltiruvchi chiziq — ma'lumot ortida, bezak (aria-hidden).
 * Chart `<svg>` ichida `<g>` sifatida; plot belgilaridan oldin chizing.
 */
export function ChartGridLine({
  variant = 'solid',
  y,
  x1 = 0,
  x2 = DEFAULT_WIDTH,
  valueLabel,
  standalone,
  label,
  className,
  ...rest
}: ChartGridLineProps) {
  const height = valueLabel ? 32 : 16;
  const yy = r2(y ?? height - 8);
  const line =
    variant === 'solid'
      ? 'bek-chart__gridline'
      : variant === 'baseline'
        ? 'bek-chart__baseline'
        : 'bek-grid-line__target';
  return (
    <PartFrame
      standalone={standalone}
      label={label ?? valueLabel}
      fallbackLabel={`${variant} grid line`}
      name="grid-line"
      width={x2}
      height={height}
    >
      <g
        {...rest}
        className={cx('bek-grid-line', `bek-grid-line--${variant}`, className)}
        aria-hidden="true"
      >
        <line className={line} x1={x1} x2={x2} y1={yy} y2={yy} />
        {valueLabel && (
          <text className="bek-chart__tick bek-grid-line__label" x={x2} y={yy - 4} textAnchor="end">
            {valueLabel}
          </text>
        )}
      </g>
    </PartFrame>
  );
}
