import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { scaleLinear } from 'd3-scale';
import { seriesColor } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { AxisLeft, ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type MarimekkoChartVariant = 'default' | 'labeled';

export interface MarimekkoDatum {
  /** Ustun (segment): "Toshkent". */
  column: string;
  /** Kategoriya (ustun ichidagi bo'lak): "Cards". */
  category: string;
  value: number;
}

export interface MarimekkoChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Uzun shakl: har (ustun × kategoriya) uchun bitta yozuv. 2–6 ustun × 2–5 kategoriya. */
  data: MarimekkoDatum[];
  /** `default` — yozuvsiz, `labeled` — katakda % chip va ustun ulushi. */
  variant?: MarimekkoChartVariant;
  /** Kategoriyalar tartibi (pastdan yuqoriga, rang). Standart — umumiy qiymat bo'yicha kamayish. */
  categories?: string[];
  width?: number;
  /** Butun SVG balandligi (plot + ustun yozuvlari), `scale/200`. */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const GAP = 2; // kataklar va ustunlar orasi (Figma "2 px gap")
const AXIS_W = 32; // 0 / 50 / 100% yozuvlari uchun joy
const TOP = 6; // "100%" yozuvining yarmi
const LABEL_GAP = 8; // chart/axis/label-gap
const LINE = 14; // Caption/S qatori
const CHIP_MIN_W = 40; // Figma "Small cell": 40 × 22 dan kichik katakda chip yo'q
const CHIP_MIN_H = 22;

interface Cell {
  key: string;
  column: string;
  category: string;
  value: number;
  colShare: number;
  totalShare: number;
  colorIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Column {
  name: string;
  total: number;
  x: number;
  w: number;
}

const sumBy = <T,>(items: T[], f: (t: T) => number) => items.reduce((a, t) => a + f(t), 0);

/**
 * Figma "4.18 Chart · Marimekko": ikki yo'nalishli ulush — ustun eni = segmentning jamidagi ulushi,
 * ustun ichidagi bo'linish = kategoriyalar. Ustunlar kattasidan (chapda), kategoriyalar har ustunda
 * bir xil tartibda, eng kattasi pastda. Yozuv rangli katakka emas — `surface/card` chip ichida.
 */
export function MarimekkoChart({
  data,
  variant = 'default',
  categories: categoryOrder,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: MarimekkoChartProps) {
  const rows = data.filter((d) => Number.isFinite(d.value) && d.value > 0);
  const total = sumBy(rows, (d) => d.value);
  const catTotals = new Map<string, number>();
  for (const d of rows) catTotals.set(d.category, (catTotals.get(d.category) ?? 0) + d.value);
  const categories =
    categoryOrder ??
    [...catTotals.keys()].sort((a, b) => (catTotals.get(b) ?? 0) - (catTotals.get(a) ?? 0));
  const colTotals = new Map<string, number>();
  for (const d of rows) colTotals.set(d.column, (colTotals.get(d.column) ?? 0) + d.value);
  const names = [...colTotals.keys()].sort(
    (a, b) => (colTotals.get(b) ?? 0) - (colTotals.get(a) ?? 0),
  );

  const labeled = variant === 'labeled';
  const bottom = LABEL_GAP + LINE * (labeled ? 2 : 1);
  const plotX = AXIS_W;
  const plotW = Math.max(0, width - AXIS_W);
  const plotY = TOP;
  const plotH = Math.max(0, height - TOP - bottom);
  const y = scaleLinear()
    .domain([0, 1])
    .range([plotY + plotH, plotY]);

  const usableW = Math.max(0, plotW - GAP * Math.max(0, names.length - 1));
  let cursor = plotX;
  const columns: Column[] = names.map((name) => {
    const t = colTotals.get(name) ?? 0;
    const w = total ? (t / total) * usableW : 0;
    const col = { name, total: t, x: cursor, w };
    cursor += w + GAP;
    return col;
  });

  const cells: Cell[] = columns.flatMap((col) => {
    const parts = categories
      .map((cat) => ({
        cat,
        value: sumBy(
          rows.filter((d) => d.column === col.name && d.category === cat),
          (d) => d.value,
        ),
      }))
      .filter((p) => p.value > 0);
    const usableH = Math.max(0, plotH - GAP * Math.max(0, parts.length - 1));
    let base = plotY + plotH;
    return parts.map((p) => {
      const h = col.total ? (p.value / col.total) * usableH : 0;
      base -= h;
      const cell: Cell = {
        key: `${col.name}/${p.cat}`,
        column: col.name,
        category: p.cat,
        value: p.value,
        colShare: col.total ? p.value / col.total : 0,
        totalShare: total ? p.value / total : 0,
        colorIndex: categories.indexOf(p.cat),
        x: col.x,
        y: base,
        w: col.w,
        h,
      };
      base -= GAP;
      return cell;
    });
  });

  const pct = (share: number) => formatPercent(share * 100, { decimals: 0 });

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-marimekko-chart',
        `bek-marimekko-chart--${variant}`,
        className,
      )}
    >
      <div className="bek-marimekko-chart__plot" style={{ inlineSize: width, blockSize: height }}>
        <ChartSvg width={width} height={height} label={label}>
          <AxisLeft scale={y} x={plotX} ticks={2} format={(v) => pct(v)} />
          <g className="bek-marimekko-chart__cells">
            {cells.map((c) => (
              <rect
                key={c.key}
                className="bek-chart__mark bek-marimekko-chart__cell"
                x={r2(c.x)}
                y={r2(c.y)}
                width={r2(Math.max(0, c.w))}
                height={r2(Math.max(0, c.h))}
                style={{ fill: seriesColor(c.colorIndex) }}
              >
                <title>{`${c.column} · ${c.category}: ${formatValue(c.value)} (${pct(c.colShare)} of column, ${pct(c.totalShare)} of total)`}</title>
              </rect>
            ))}
          </g>
          <g className="bek-marimekko-chart__columns" aria-hidden="true">
            {columns.map((col) => (
              <text
                key={col.name}
                className="bek-chart__tick bek-marimekko-chart__column"
                x={r2(col.x + col.w / 2)}
                y={plotY + plotH + LABEL_GAP}
                dy="0.71em"
                textAnchor="middle"
              >
                {col.name}
                {labeled && (
                  <tspan className="bek-marimekko-chart__share" x={r2(col.x + col.w / 2)} dy={LINE}>
                    {pct(total ? col.total / total : 0)}
                  </tspan>
                )}
              </text>
            ))}
          </g>
        </ChartSvg>
        {labeled && (
          <div className="bek-marimekko-chart__labels" aria-hidden="true">
            {cells
              .filter((c) => c.w >= CHIP_MIN_W && c.h >= CHIP_MIN_H)
              .map((c) => (
                <span
                  key={c.key}
                  className="bek-marimekko-chart__chip"
                  style={{ left: r2(c.x + c.w / 2), top: r2(c.y + c.h / 2) }}
                >
                  {pct(c.colShare)}
                </span>
              ))}
          </div>
        )}
      </div>
      <ChartLegend
        items={categories.map((cat, i) => ({
          label: cat,
          color: seriesColor(i),
          variant: 'square',
        }))}
      />
      <DataTable
        caption={label}
        columns={['Column', 'Category', 'Value', 'Share of column', 'Share of total']}
        rows={cells.map((c) => [
          c.column,
          c.category,
          formatValue(c.value),
          pct(c.colShare),
          pct(c.totalShare),
        ])}
      />
    </figure>
  );
}
