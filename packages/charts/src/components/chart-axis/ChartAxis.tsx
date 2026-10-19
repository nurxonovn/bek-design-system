import { cx } from '@bek/react';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_TICKS, DEFAULT_WIDTH } from '../../core/geometry.js';
import { AxisBottom, AxisLeft, type TickScale } from '../../core/svg.js';
import { PartFrame, type ChartPartFrameProps } from './PartFrame.js';

export type ChartAxisVariant = 'y' | 'x';

export interface ChartAxisLabel {
  /** Yozuv markazining x koordinatasi (plot ichida). */
  x: number;
  /** Ko'rinadigan matn: `Jan`, `12 Oct`. Mobile'da qisqartiring. */
  label: string;
  key?: string;
}

interface AxisBase extends ChartPartFrameProps {
  className?: string;
  /** Mustaqil ko'rinish o'lchami (Figma: Y 32 × 200, X 480 × 16). */
  width?: number;
  height?: number;
}

export interface ChartAxisYProps extends AxisBase {
  /** `y` — qiymat o'qi: o'ngdan tekislangan, `chart/axis/tick-count` ta yozuv. */
  variant?: 'y';
  /** d3 linear shkala (yoki `ticks()` bor har qanday shkala). */
  scale: TickScale;
  /** Plot chap cheti — yozuvlar undan `chart/axis/label-gap` (8) chapda. */
  x: number;
  /** Bo'linmalar: Mobile 4 · Tablet 5 · Web 6. */
  ticks?: number;
  /** Standart: uz-UZ, qisqa (`4,8 mln`). */
  format?: (value: number) => string;
}

export interface ChartAxisXProps extends AxisBase {
  /** `x` — kategoriya / vaqt o'qi: markazlangan, birinchi va oxirgi yozuv doim ko'rinadi. */
  variant: 'x';
  labels: ChartAxisLabel[];
  /** Yozuvlar qatorining yuqori cheti (odatda plot pastki cheti + 8). */
  y: number;
  /** Yozuvlar orasidagi eng kichik bo'shliq; sig'masa har ikkinchisi tushib qoladi (aylantirilmaydi). */
  minGap?: number;
}

export type ChartAxisProps = ChartAxisYProps | ChartAxisXProps;

/** Caption/S (11 px) belgi eni taxmini — tor ekranda yozuvlarni siyraklashtirish uchun. */
const CHAR_W = 6.2;

/**
 * X yozuvlarini siyraklashtiradi: bir-birini bossa — tashlab ketiladi, lekin birinchi va oxirgi doim qoladi
 * (Figma: "never rotate labels — shorten or skip instead").
 */
export function thinAxisLabels(labels: ChartAxisLabel[], minGap = 8): ChartAxisLabel[] {
  if (labels.length <= 2) return labels;
  const half = (l: ChartAxisLabel) => (l.label.length * CHAR_W) / 2;
  const fits = (a: ChartAxisLabel, b: ChartAxisLabel) =>
    Math.abs(b.x - a.x) >= half(a) + half(b) + minGap;
  const kept: ChartAxisLabel[] = [labels[0]];
  for (const l of labels.slice(1, -1)) if (fits(kept[kept.length - 1], l)) kept.push(l);
  const last = labels[labels.length - 1];
  while (kept.length > 1 && !fits(kept[kept.length - 1], last)) kept.pop();
  return [...kept, last];
}

/**
 * Figma "4.18 Chart · Axis": Y (qiymat) va X (kategoriya / vaqt) o'qi yozuvlari — Caption/S · `dataviz/label`.
 * Chart `<svg>` ichiga `<g>` bo'lagi sifatida qo'yiladi; `standalone` — o'z SVG'ida.
 */
export function ChartAxis(props: ChartAxisProps) {
  const { standalone, label, className } = props;
  if (props.variant === 'x') {
    const { labels, y, minGap, width = DEFAULT_WIDTH, height = 16 } = props;
    return (
      <PartFrame
        standalone={standalone}
        label={label}
        fallbackLabel="X axis"
        name="chart-axis"
        width={width}
        height={height}
      >
        <g className={cx('bek-chart-axis', 'bek-chart-axis--x', className)}>
          <AxisBottom
            y={y}
            labels={thinAxisLabels(labels, minGap).map((l, i) => ({
              key: l.key ?? `${i}-${l.label}`,
              x: l.x,
              label: l.label,
            }))}
          />
        </g>
      </PartFrame>
    );
  }
  const {
    scale,
    x,
    ticks = DEFAULT_TICKS,
    format = (v: number) => formatNumber(v, { compact: true }),
    width = 40,
    height = DEFAULT_HEIGHT,
  } = props;
  return (
    <PartFrame
      standalone={standalone}
      label={label}
      fallbackLabel="Y axis"
      name="chart-axis"
      width={width}
      height={height}
    >
      <g className={cx('bek-chart-axis', 'bek-chart-axis--y', className)}>
        <AxisLeft scale={scale} x={x} ticks={ticks} format={format} />
      </g>
    </PartFrame>
  );
}
