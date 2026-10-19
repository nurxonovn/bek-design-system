'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@bek/react';
import { extent } from 'd3-array';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type ClusterMapVariant = 'default' | 'labeled';

export interface ClusterPoint {
  /** 2D proyeksiya koordinatalari (UMAP, t-SNE) — birliksiz. */
  x: number;
  y: number;
  /** `clusters[].id`. */
  cluster: string;
  /** Tooltip uchun element nomi: "Client 1042". */
  label?: string;
}

export interface ClusterInfo {
  id: string;
  /** Klaster nomi (AI bergan bo'lsa — tahrirlanadigan). */
  label: string;
  /** Klaster hajmi (jadval uchun); berilmasa nuqtalar soni. */
  size?: number;
  /** Standart — Figma palitrasi: categorical 01 · 02 · 03 · 06 · … */
  color?: string;
}

export interface ClusterMapProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  points: ClusterPoint[];
  clusters: ClusterInfo[];
  /** `default` — legend bilan; `labeled` — klaster ustida AI nomi (fill/inverse pill). */
  variant?: ClusterMapVariant;
  /** Nima va qanday proyeksiya qilindi: "UMAP of 12 features · AI-named clusters". */
  caption?: ReactNode;
  /** Fokusdagi klaster (boshqarilsa). Qolganlari 25%. */
  focused?: string | null;
  /** Legend bosilganda — fokusni almashtirish. Berilmasa ichki holat. */
  onFocusChange?: (id: string | null) => void;
  width?: number;
  /** Plot balandligi — `scale/200`, shakllar cho'zilmaydi (x va y bir xil masshtab). */
  height?: number;
  label: string;
}

/** Figma tartibi: Savers 01, Young spenders 02, Business 03, Travelers 06, keyin qolganlari. */
const PALETTE = [
  'var(--bek-chart-series-1, var(--bek-dataviz-categorical-01))',
  'var(--bek-chart-series-2, var(--bek-dataviz-categorical-02))',
  'var(--bek-chart-series-3, var(--bek-dataviz-categorical-03))',
  'var(--bek-chart-series-6, var(--bek-dataviz-categorical-06))',
  'var(--bek-chart-series-4, var(--bek-dataviz-categorical-04))',
  'var(--bek-chart-series-5, var(--bek-dataviz-categorical-05))',
  'var(--bek-chart-series-7, var(--bek-dataviz-categorical-07))',
  'var(--bek-chart-series-8, var(--bek-dataviz-categorical-08))',
];
const PAD = 16; // halqa (hull) uchun chekka
const POINT_R = 3; // Figma: r 3
const HULL_PAD = 12;

/**
 * Figma "4.18 Chart · Cluster map": 2D ga proyeksiya qilingan elementlar, rang = klaster, yumshoq
 * hull (10%). O'qlarda ma'no yo'q — tick qiymatlari chiqmaydi; izohda nima proyeksiya qilingani.
 */
export function ClusterMap({
  points,
  clusters,
  variant = 'default',
  caption,
  focused,
  onFocusChange,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  ...rest
}: ClusterMapProps) {
  const [inner, setInner] = useState<string | null>(null);
  const active = focused !== undefined ? focused : inner;
  const setActive = (id: string | null) => {
    if (focused === undefined) setInner(id);
    onFocusChange?.(id);
  };

  const [x0, x1] = extent(points, (p) => p.x) as [number, number];
  const [y0, y1] = extent(points, (p) => p.y) as [number, number];
  const dx = (x1 ?? 0) - (x0 ?? 0) || 1;
  const dy = (y1 ?? 0) - (y0 ?? 0) || 1;
  // Bir xil masshtab — shakllar haqiqiy, markazda.
  const k = Math.min((width - 2 * PAD) / dx, (height - 2 * PAD) / dy);
  const ox = (width - dx * k) / 2;
  const oy = (height - dy * k) / 2;
  const px = (v: number) => ox + (v - (x0 ?? 0)) * k;
  const py = (v: number) => height - oy - (v - (y0 ?? 0)) * k;

  const colorOf = (c: ClusterInfo, i: number) => c.color ?? PALETTE[i % PALETTE.length];
  const groups = clusters.map((c, i) => {
    const ps = points.filter((p) => p.cluster === c.id);
    const xs = ps.map((p) => px(p.x));
    const ys = ps.map((p) => py(p.y));
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return {
      ...c,
      color: colorOf(c, i),
      points: ps,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      rx: (maxX - minX) / 2 + HULL_PAD,
      ry: (maxY - minY) / 2 + HULL_PAD,
    };
  });
  const labeled = variant === 'labeled';

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-cluster-map',
        `bek-cluster-map--${variant}`,
        active != null && 'bek-cluster-map--focused',
        className,
      )}
    >
      {!labeled && (
        <ChartLegend
          aria-label="Clusters"
          items={groups.map((g) => ({
            label: g.label,
            color: g.color,
            variant: 'dot',
            hidden: active != null && active !== g.id,
          }))}
          onToggle={(i) => setActive(active === groups[i].id ? null : groups[i].id)}
        />
      )}
      <div className="bek-cluster-map__stage">
        <ChartSvg width={width} height={height} label={label}>
          {groups.map((g) =>
            g.points.length ? (
              <g
                key={g.id}
                className={cx(
                  'bek-cluster-map__cluster',
                  active === g.id && 'bek-cluster-map__cluster--active',
                )}
                style={{ color: g.color }}
              >
                <ellipse
                  className="bek-cluster-map__hull"
                  cx={r2(g.cx)}
                  cy={r2(g.cy)}
                  rx={r2(g.rx)}
                  ry={r2(g.ry)}
                />
                {g.points.map((p, j) => (
                  <circle
                    key={j}
                    className="bek-cluster-map__point"
                    cx={r2(px(p.x))}
                    cy={r2(py(p.y))}
                    r={POINT_R}
                  >
                    <title>{p.label ? `${p.label} · ${g.label}` : g.label}</title>
                  </circle>
                ))}
              </g>
            ) : null,
          )}
        </ChartSvg>
        {labeled &&
          groups.map((g) =>
            g.points.length ? (
              <span
                key={g.id}
                className="bek-cluster-map__tag"
                aria-hidden="true"
                style={{
                  insetInlineStart: `${(g.cx / width) * 100}%`,
                  insetBlockStart: `${(Math.max(0, g.cy - g.ry) / height) * 100}%`,
                }}
              >
                {g.label}
              </span>
            ) : null,
          )}
      </div>
      {caption != null && <figcaption className="bek-cluster-map__caption">{caption}</figcaption>}
      <DataTable
        caption={label}
        columns={['Cluster', 'Size', 'Examples']}
        rows={groups.map((g) => [
          g.label,
          formatNumber(g.size ?? g.points.length),
          g.points
            .slice(0, 3)
            .map((p) => p.label)
            .filter(Boolean)
            .join(', '),
        ])}
      />
    </figure>
  );
}
