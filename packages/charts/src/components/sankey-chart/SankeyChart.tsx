import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { sankey, sankeyLinkHorizontal, type SankeyLink, type SankeyNode } from 'd3-sankey';
import { seriesColor } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type SankeyChartVariant = 'default';

export interface SankeyNodeDatum {
  id: string;
  label: string;
  /** Standart — `seriesColor(i)`; 3-ustundagi bitta manbali tugun manbasi rangini oladi. */
  color?: string;
}

export interface SankeyLinkDatum {
  /** Manba tugun `id`. */
  source: string;
  /** Maqsad tugun `id`. */
  target: string;
  value: number;
}

export interface SankeyChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Figma `Variant` — bitta: `default`. */
  variant?: SankeyChartVariant;
  /** Ko'pi bilan 12 tugun, 3 ustun; kichik oqimlarni "Other" ga yig'ing. */
  nodes: SankeyNodeDatum[];
  links: SankeyLinkDatum[];
  width?: number;
  /** `chart/height/md`: 200 / 240 / 320. */
  height?: number;
  /** Tugunlar orasidagi vertikal oraliq. */
  nodePadding?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

type Node = SankeyNode<SankeyNodeDatum, Record<string, never>>;
type Link = SankeyLink<SankeyNodeDatum, Record<string, never>>;

const NODE_W = 12; // scale/12 — tugun eni
const LABEL_GAP = 8;

/**
 * Figma "4.18 Chart · Sankey": miqdorning bosqichlar orasidagi oqimi (daromad → xarajat → toifalar).
 * Tugun — 12 px kategorik ustun; bog'lanish — manba rangi, qatlam shaffofligi 28% (CSS `opacity`).
 */
export function SankeyChart({
  variant = 'default',
  nodes,
  links,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  nodePadding = 8,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: SankeyChartProps) {
  const ids = new Set(nodes.map((n) => n.id));
  const graph = sankey<SankeyNodeDatum, Record<string, never>>()
    .nodeId((d) => d.id)
    .nodeWidth(NODE_W)
    .nodePadding(nodePadding)
    .extent([
      [0, 2],
      [width, height - 2],
    ])({
    nodes: nodes.map((n) => ({ ...n })),
    links: links
      .filter((l) => ids.has(l.source) && ids.has(l.target) && l.value > 0)
      .map((l) => ({ ...l })) as unknown as Link[],
  });
  const all = graph.nodes as Node[];
  const lastDepth = Math.max(0, ...all.map((n) => n.depth ?? 0));
  const total = all.filter((n) => n.depth === 0).reduce((a, n) => a + (n.value ?? 0), 0);
  const share = (v: number) => formatPercent(total ? (v / total) * 100 : 0, { decimals: 0 });

  // Rang: o'z rangi → 3-ustunda yagona manbadan meros → keyingi kategorik rang.
  const colors = new Map<string, string>();
  let next = 0;
  for (const n of [...all].sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0))) {
    const incoming = (n.targetLinks ?? []) as Link[];
    const only = incoming.length === 1 ? (incoming[0].source as Node) : null;
    colors.set(
      n.id,
      n.color ??
        (only && (n.depth ?? 0) >= 2
          ? (colors.get(only.id) ?? seriesColor(next++))
          : seriesColor(next++)),
    );
  }
  const path = sankeyLinkHorizontal<SankeyNodeDatum, Record<string, never>>();
  const nameOf = (n: unknown) => (n as Node).label;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-sankey-chart', `bek-sankey-chart--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-sankey-chart__links">
          {(graph.links as Link[]).map((l, i) => (
            <path
              key={i}
              className="bek-sankey-chart__link"
              d={path(l) ?? ''}
              style={{
                stroke: colors.get((l.source as Node).id),
                strokeWidth: r2(Math.max(1, l.width ?? 1)),
              }}
            >
              <title>{`${nameOf(l.source)} → ${nameOf(l.target)}: ${formatValue(l.value)}`}</title>
            </path>
          ))}
        </g>
        <g className="bek-sankey-chart__nodes">
          {all.map((n) => {
            const x0 = n.x0 ?? 0;
            const x1 = n.x1 ?? 0;
            const y0 = n.y0 ?? 0;
            const y1 = n.y1 ?? 0;
            const end = (n.depth ?? 0) === lastDepth && lastDepth > 0;
            return (
              <g key={n.id} className="bek-sankey-chart__node">
                <rect
                  className="bek-sankey-chart__bar"
                  x={r2(x0)}
                  y={r2(y0)}
                  width={r2(x1 - x0)}
                  height={r2(Math.max(1, y1 - y0))}
                  style={{ fill: colors.get(n.id) }}
                >
                  <title>{`${n.label}: ${formatValue(n.value ?? 0)} (${share(n.value ?? 0)})`}</title>
                </rect>
                <text
                  className="bek-sankey-chart__label"
                  x={r2(end ? x0 - LABEL_GAP : x1 + LABEL_GAP)}
                  y={r2((y0 + y1) / 2)}
                  dy="0.32em"
                  textAnchor={end ? 'end' : 'start'}
                  aria-hidden="true"
                >
                  {n.label}
                  <tspan className="bek-sankey-chart__share" dx={4}>
                    {share(n.value ?? 0)}
                  </tspan>
                </text>
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Source', 'Target', 'Value']}
        rows={(graph.links as Link[]).map((l) => [
          nameOf(l.source),
          nameOf(l.target),
          formatValue(l.value),
        ])}
      />
    </figure>
  );
}
