import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { hierarchy, pack } from 'd3-hierarchy';
import { seriesColor } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type CirclePackingVariant = 'flat' | 'nested';

export interface CirclePackingNode {
  name: string;
  /** Barg qiymati (doira maydoni). Guruhda — bolalar yig'indisi. */
  value?: number;
  /** Ikkinchi daraja: guruh → elementlar. */
  children?: CirclePackingNode[];
}

export interface CirclePackingProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Ildiz: `{ name: 'Usage', children: [{ name: 'Payments', children: [...] }, …] }`. */
  data: CirclePackingNode;
  /** `flat` — elementlar guruh rangida (legend bilan), `nested` — guruh ota doira ichida. */
  variant?: CirclePackingVariant;
  width?: number;
  /** Chizma markazdagi kvadratda (`min(width, height)`), cho'zilmaydi. */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const EDGE = 8; // scale/8 — ota yozuvi chipi doira chetidan chiqadi, unga joy
const PAD_FLAT = 2; // doiralar orasi
const PAD_NESTED = 4; // ota ichidagi bo'shliq
const CHAR_W = 6; // Caption/S bitta belgining o'rtacha eni (taxminiy)
const CHIP_PAD_X = 4; // scale/4
const CHIP_H = 18; // Caption/S qatori + scale/2 × 2
const TEXT_H = 14;

interface Circle {
  key: string;
  name: string;
  group: string;
  groupIndex: number;
  value: number;
  groupTotal: number;
  depth: number;
  x: number;
  y: number;
  r: number;
}

const sumOf = (n: CirclePackingNode): number =>
  n.children?.length ? n.children.reduce((a, c) => a + sumOf(c), 0) : Math.max(0, n.value ?? 0);

/** Yozuv doira ichiga to'liq sig'adimi (to'rtburchak burchaklari doira ichida). */
const fits = (r: number, w: number, h: number) => (w / 2) ** 2 + (h / 2) ** 2 <= (r - 2) ** 2;

/**
 * Figma "4.18 Chart · Circle packing": qiymat doira **maydoni** bilan (radius emas), doiralar
 * ustma-ust tushmasdan joylashadi. Flat — guruh rangi, Nested — guruh ota doira ichida
 * (`dataviz/sequential` 100 / 300). Geometriya markazdagi kvadratda, cho'zilmaydi (CMP-11).
 */
export function CirclePacking({
  data,
  variant = 'flat',
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: CirclePackingProps) {
  const nested = variant === 'nested';
  const groups = (data.children ?? []).filter((g) => sumOf(g) > 0);
  const groupTotals = groups.map((g) => sumOf(g));
  const total = groupTotals.reduce((a, v) => a + v, 0);

  // Flat: barglar bitta darajada (guruh nomi saqlanadi); Nested: ildiz → guruh → element.
  // `gi` — guruh indeksi: bir xil nomli guruh/elementlar kalit va rangda to'qnashmaydi.
  type Datum = CirclePackingNode & { group?: string; gi?: number };
  const items: Datum[] = nested
    ? groups.map((g, gi) => ({ ...g, group: g.name, gi }))
    : groups.flatMap((g, gi) =>
        g.children?.length
          ? g.children.map((c) => ({ name: c.name, value: sumOf(c), group: g.name, gi }))
          : [{ name: g.name, value: sumOf(g), group: g.name, gi }],
      );
  const root = hierarchy<Datum>({ name: data.name, children: items })
    .sum((d) => (d.children?.length ? 0 : Math.max(0, d.value ?? 0)))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const side = Math.max(0, Math.min(width, height) - (nested ? EDGE * 2 : 0));
  const laid = pack<Datum>()
    .size([side, side])
    .padding(nested ? PAD_NESTED : PAD_FLAT)(root);
  const ox = (width - side) / 2;
  const oy = (height - side) / 2;

  const circles: Circle[] = laid.descendants().flatMap((n, idx) => {
    if (n.depth === 0 || (n.value ?? 0) <= 0) return [];
    const group = n.ancestors().find((a) => a.depth === 1) ?? n;
    const gi = n.data.gi ?? group.data.gi ?? 0;
    return [
      {
        key: `${idx}:${n
          .ancestors()
          .map((a) => a.data.name)
          .join('/')}`,
        name: n.data.name,
        group: n.data.group ?? group.data.name,
        groupIndex: gi,
        value: n.value ?? 0,
        groupTotal: groupTotals[gi] ?? 0,
        depth: n.depth,
        x: ox + n.x,
        y: oy + n.y,
        r: n.r,
      },
    ];
  });
  const parents = nested ? circles.filter((c) => c.depth === 1) : [];
  const leaves = nested ? circles.filter((c) => c.depth === 2) : circles;
  const widthOf = (text: string) => text.length * CHAR_W;
  const share = (c: Circle) =>
    formatPercent(c.groupTotal ? (c.value / c.groupTotal) * 100 : 0, { decimals: 0 });

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-circle-packing', `bek-circle-packing--${variant}`, className)}
    >
      <div className="bek-circle-packing__plot" style={{ inlineSize: width, blockSize: height }}>
        <ChartSvg width={width} height={height} label={label}>
          {parents.map((c) => (
            <circle
              key={c.key}
              className="bek-chart__mark bek-circle-packing__circle bek-circle-packing__circle--parent"
              cx={r2(c.x)}
              cy={r2(c.y)}
              r={r2(c.r)}
            >
              <title>{`${c.name}: ${formatValue(c.value)} (${formatPercent(total ? (c.value / total) * 100 : 0, { decimals: 0 })})`}</title>
            </circle>
          ))}
          {leaves.map((c) => (
            <g key={c.key} className="bek-chart__mark bek-circle-packing__item">
              <circle
                className={cx(
                  'bek-circle-packing__circle',
                  nested && 'bek-circle-packing__circle--child',
                )}
                cx={r2(c.x)}
                cy={r2(c.y)}
                r={r2(c.r)}
                style={nested ? undefined : { fill: seriesColor(c.groupIndex) }}
              />
              {/* Nested: element `dataviz/sequential/300` da — text/primary to'g'ridan-to'g'ri (CMP-07). */}
              {nested && fits(c.r, widthOf(c.name), TEXT_H) && (
                <text
                  className="bek-circle-packing__text"
                  x={r2(c.x)}
                  y={r2(c.y)}
                  dy="0.32em"
                  textAnchor="middle"
                  aria-hidden="true"
                >
                  {c.name}
                </text>
              )}
              <title>{`${c.group === c.name ? c.name : `${c.group} · ${c.name}`}: ${formatValue(c.value)} (${share(c)})`}</title>
            </g>
          ))}
        </ChartSvg>
        <div className="bek-circle-packing__labels" aria-hidden="true">
          {(nested ? parents : leaves)
            .filter((c) => nested || fits(c.r, widthOf(c.name) + CHIP_PAD_X * 2, CHIP_H))
            .map((c) => (
              <span
                key={c.key}
                className={cx(
                  'bek-circle-packing__chip',
                  nested && 'bek-circle-packing__chip--parent',
                )}
                style={{ left: r2(c.x), top: r2(nested ? c.y - c.r : c.y) }}
              >
                {c.name}
              </span>
            ))}
        </div>
      </div>
      {!nested && groups.length > 1 && (
        <ChartLegend items={groups.map((g, i) => ({ label: g.name, color: seriesColor(i) }))} />
      )}
      <DataTable
        caption={label}
        columns={['Group', 'Item', 'Value', 'Share of group']}
        rows={leaves.map((c) => [c.group, c.name, formatValue(c.value), share(c)])}
      />
    </figure>
  );
}
