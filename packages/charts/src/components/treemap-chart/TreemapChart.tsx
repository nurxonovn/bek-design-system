import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';
import { seriesColor } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type TreemapChartVariant = 'default';

export interface TreemapNode {
  name: string;
  /** Barg qiymati (ichki tugunlarda — bolalar yig'indisi). */
  value?: number;
  /** Ikkinchi daraja (kategoriya → element). */
  children?: TreemapNode[];
  /** Guruh rangi (faqat yuqori darajada); standart — `seriesColor(i)`. */
  color?: string;
}

export interface TreemapChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Figma `Variant` — bitta: `default`. */
  variant?: TreemapChartVariant;
  /** Ildiz: `{ name: 'Budget', children: [...] }`. */
  data: TreemapNode;
  /** Eng katta N guruh, qolgani "Other" (`dataviz/neutral`) — Mobile'da 6. */
  limit?: number;
  /** "Other" guruhi nomi. */
  otherLabel?: string;
  width?: number;
  /** Figma `scale/240`; katta panelda `chart/height/lg` (280 / 320 / 400). */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const GAP = 2; // scale/2 — kataklar orasi
const MIN_W = 64; // scale/64 — yozuv sig'adigan eng kichik katak
const MIN_H = 40;
const INSET = 8; // chip katak burchagidan

const sumOf = (n: TreemapNode): number =>
  n.children?.length ? n.children.reduce((a, c) => a + sumOf(c), 0) : Math.max(0, n.value ?? 0);

/**
 * Figma "4.18 Chart · Treemap": ierarxik ulush maydon bilan (squarified, eng kattasi chap-yuqorida).
 * Yozuv faqat ≥ 64 × 40 katakda va rangli maydonga to'g'ridan-to'g'ri emas — `surface/card` chip ichida.
 */
export function TreemapChart({
  variant = 'default',
  data,
  limit,
  otherLabel = 'Other',
  width = DEFAULT_WIDTH,
  height = 240,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: TreemapChartProps) {
  const groups = [...(data.children ?? [])].sort((a, b) => sumOf(b) - sumOf(a));
  const kept =
    limit != null && groups.length > limit
      ? [
          ...groups.slice(0, Math.max(0, limit - 1)),
          {
            name: otherLabel,
            value: groups.slice(Math.max(0, limit - 1)).reduce((a, g) => a + sumOf(g), 0),
            color: 'var(--bek-dataviz-neutral)',
          },
        ]
      : groups;
  const colorOf = new Map(kept.map((g, i) => [g.name, g.color ?? seriesColor(i)]));
  const root = hierarchy<TreemapNode>({ name: data.name, children: kept })
    .sum((d) => (d.children?.length ? 0 : Math.max(0, d.value ?? 0)))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const layout = treemap<TreemapNode>()
    .tile(treemapSquarify)
    .size([width, height])
    .paddingInner(GAP)(root);
  const total = root.value ?? 0;
  const share = (v: number) => formatPercent(total ? (v / total) * 100 : 0, { decimals: 0 });
  const cells = layout.leaves().map((n) => {
    const group = n.ancestors().find((a) => a.depth === 1) ?? n;
    return {
      key: n
        .ancestors()
        .map((a) => a.data.name)
        .join('/'),
      name: n.data.name,
      group: group.data.name,
      value: n.value ?? 0,
      x: n.x0,
      y: n.y0,
      w: n.x1 - n.x0,
      h: n.y1 - n.y0,
      color: colorOf.get(group.data.name) ?? seriesColor(0),
    };
  });

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-treemap-chart', `bek-treemap-chart--${variant}`, className)}
    >
      <div className="bek-treemap-chart__plot" style={{ inlineSize: width, blockSize: height }}>
        <ChartSvg width={width} height={height} label={label}>
          {cells.map((c) => (
            <rect
              key={c.key}
              className="bek-chart__mark bek-treemap-chart__cell"
              x={r2(c.x)}
              y={r2(c.y)}
              width={r2(Math.max(0, c.w))}
              height={r2(Math.max(0, c.h))}
              style={{ fill: c.color }}
            >
              <title>{`${c.group === c.name ? c.name : `${c.group} · ${c.name}`}: ${share(c.value)} (${formatValue(c.value)})`}</title>
            </rect>
          ))}
        </ChartSvg>
        <div className="bek-treemap-chart__labels" aria-hidden="true">
          {cells
            .filter((c) => c.w >= MIN_W && c.h >= MIN_H)
            .map((c) => (
              <span
                key={c.key}
                className="bek-treemap-chart__chip"
                style={{
                  left: r2(c.x + INSET),
                  top: r2(c.y + INSET),
                  maxWidth: r2(c.w - INSET * 2),
                }}
              >
                <span className="bek-treemap-chart__name">{c.name}</span>
                <span className="bek-treemap-chart__share">{share(c.value)}</span>
              </span>
            ))}
        </div>
      </div>
      <DataTable
        caption={label}
        columns={['Group', 'Item', 'Value', 'Share']}
        rows={cells.map((c) => [c.group, c.name, formatValue(c.value), share(c.value)])}
      />
    </figure>
  );
}
