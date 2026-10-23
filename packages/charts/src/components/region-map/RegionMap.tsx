'use client';

import { useId, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '@bek-ui/react';
import { scaleQuantize, scaleSqrt } from 'd3-scale';
import type { SequentialLevel } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { DataTable } from '../../core/svg.js';
import { ChartTooltip } from '../chart-tooltip/ChartTooltip.js';
import { LegendItem } from '../legend-item/LegendItem.js';
import {
  ARAL_SEA,
  findRegion,
  GEO,
  GEO_HEIGHT,
  GEO_WIDTH,
  HEX_HEIGHT,
  HEX_TILE_H,
  HEX_TILE_W,
  HEX_WIDTH,
  NEIGHBOURS,
  type UzRegionId,
} from './geo.js';

export type RegionMapVariant = 'choropleth' | 'bubble' | 'hex';

export interface RegionDatum {
  /** ISO 3166-2:UZ kodi (`UZ-TK`) yoki svg-maps slug'i (`tashkent-city`, `karakalpakstan`). */
  region: UzRegionId | (string & {});
  /** Qiymat; `null` — ma'lumot yo'q (`dataviz/track` + shtrix). */
  value: number | null;
}

export interface RegionMapProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> {
  data: RegionDatum[];
  /** `choropleth` — ulush/stavka rangda; `bubble` — son doira yuzida; `hex` — teng plitkalar. */
  variant?: RegionMapVariant;
  /** Ko'rsatkich nomi: jadval ustuni, tooltip va Bubble legend ("Circle area = population, mln"). */
  metric?: string;
  formatValue?: (value: number) => string;
  /**
   * Chip bilan belgilanadigan 1–3 asosiy hudud. Standart: Choropleth — eng yuqori va eng past,
   * Bubble — eng katta ikkitasi, Hex — yo'q (plitkada kod bor).
   */
  chips?: string[];
  /** Tanlangan hudud (boshqarilsa); qolganlari 0,4 ga xiralashadi. */
  selected?: string | null;
  onSelectChange?: (region: UzRegionId | null) => void;
  /** Yuklanmoqda: xarita konturi `dataviz/track` da (Skeleton), interaksiya yo'q. */
  loading?: boolean;
  /** Ma'lumot yo'q hudud yozuvi (tooltip). */
  noDataLabel?: string;
  width?: number;
  /** Plot balandligi — `scale/200`; xarita markazda, cho'zilmaydi. */
  height?: number;
  /** Qisqa xulosa: "Highest: Toshkent sh. 82%, lowest: Qoraqalpog‘iston 33%". */
  label: string;
}

/** Choropleth — 6 sinf; Hex — matn ko'tara oladigan 4 daraja (CMP-07). */
const CHOROPLETH_LEVELS: SequentialLevel[] = [200, 300, 400, 500, 600, 700];
const HEX_LEVELS: (200 | 300 | 600 | 700)[] = [200, 300, 600, 700];
const BUBBLE_MAX_R = 16; // Figma: eng katta doira 32 px
const HEX_RADIUS = 3; // Figma: plitka burchagi r 3
const TIP_GAP = 12;
const TIP_W = 200; // scale/200
const CHIP_GAP = 14; // chip markazi hudud yorlig'idan yuqorida

type Dir = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';
const DIRS: Record<Dir, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

/** Yumaloq burchakli olti burchak (uchli tepa) — Figma Hex plitkasi. */
function hexPath(x: number, y: number): string {
  const w = HEX_TILE_W;
  const h = HEX_TILE_H;
  const pts: [number, number][] = [
    [x + w / 2, y],
    [x + w, y + h / 4],
    [x + w, y + (h * 3) / 4],
    [x + w / 2, y + h],
    [x, y + (h * 3) / 4],
    [x, y + h / 4],
  ];
  const toward = (a: [number, number], b: [number, number]): [number, number] => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    return [a[0] + (dx / len) * HEX_RADIUS, a[1] + (dy / len) * HEX_RADIUS];
  };
  return (
    pts
      .map((p, i) => {
        const prev = pts[(i + pts.length - 1) % pts.length];
        const next = pts[(i + 1) % pts.length];
        const a = toward(p, prev);
        const b = toward(p, next);
        return `${i ? 'L' : 'M'}${r2(a[0])},${r2(a[1])}Q${r2(p[0])},${r2(p[1])} ${r2(b[0])},${r2(b[1])}`;
      })
      .join('') + 'Z'
  );
}

/**
 * Figma "4.18 Chart · Map": O'zbekistonning 14 hududi bo'yicha statistika. Choropleth — sinflangan
 * `dataviz/sequential`; Bubble — neytral yer va doira yuzi; Hex — teng plitkalar (Toshkent sh. ham
 * ko'rinadi). Har hudud fokuslanadi: Tab — reyting tartibida, strelkalar — qo'shniga, Enter — tanlash.
 */
export function RegionMap({
  data,
  variant = 'choropleth',
  metric,
  formatValue = (v) => formatNumber(v, { compact: true }),
  chips,
  selected,
  onSelectChange,
  loading = false,
  noDataLabel = 'No data',
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  ...rest
}: RegionMapProps) {
  const uid = useId();
  const hatchId = `bek-region-map-hatch-${uid.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [hover, setHover] = useState<UzRegionId | null>(null);
  const [focus, setFocus] = useState<UzRegionId | null>(null);
  const [innerSel, setInnerSel] = useState<UzRegionId | null>(null);
  const nodes = useRef(new Map<UzRegionId, SVGElement>());

  const values = new Map<UzRegionId, number>();
  for (const d of data) {
    const g = findRegion(d.region);
    if (g && d.value != null && Number.isFinite(d.value)) values.set(g.id, d.value);
  }
  const selKey = selected !== undefined ? selected : innerSel;
  const sel = selKey ? (findRegion(selKey)?.id ?? null) : null;
  const select = (id: UzRegionId | null) => {
    if (selected === undefined) setInnerSel(id);
    onSelectChange?.(id);
  };

  // Reyting: qiymat kamayishi bo'yicha, ma'lumotsizlar oxirida (Tab tartibi ham shu).
  const ranked = [...GEO].sort((a, b) => {
    const va = values.get(a.id);
    const vb = values.get(b.id);
    if (va == null || vb == null) return va == null ? (vb == null ? 0 : 1) : -1;
    return vb - va;
  });
  const rankOf = new Map(ranked.map((g, i) => [g.id, i + 1] as const));
  const known = ranked.filter((g) => values.has(g.id));
  const all = [...values.values()];
  const lo = all.length ? Math.min(...all) : 0;
  const hi = all.length ? Math.max(...all) : 1;

  const hex = variant === 'hex';
  const bubble = variant === 'bubble';
  const classes = scaleQuantize<number>()
    .domain([lo, hi > lo ? hi : lo + 1])
    .range(hex ? HEX_LEVELS : CHOROPLETH_LEVELS);
  const levelOf = (id: UzRegionId) => {
    const v = values.get(id);
    return v == null ? null : (classes(v) as SequentialLevel);
  };
  const radius = scaleSqrt()
    .domain([0, Math.max(hi, 0) || 1])
    .range([0, BUBBLE_MAX_R]);

  // Xarita ramkasi markazda, bir xil masshtab (CMP-11 — cho'zilmaydi).
  const k = Math.min(width / GEO_WIDTH, (height - 2) / GEO_HEIGHT);
  const frameW = (hex ? HEX_WIDTH : GEO_WIDTH) * k;
  const frameH = (hex ? HEX_HEIGHT : GEO_HEIGHT) * k;
  const ox = (width - frameW) / 2;
  const oy = (height - frameH) / 2;
  const centre = (id: UzRegionId): [number, number] => {
    const g = GEO.find((r) => r.id === id)!;
    const [x, y] = hex ? [g.hex[0] + HEX_TILE_W / 2, g.hex[1] + HEX_TILE_H / 2] : g.anchor;
    return [ox + x * k, oy + y * k];
  };

  const nameOf = (id: UzRegionId) => GEO.find((g) => g.id === id)!.name;
  const valueText = (id: UzRegionId) => {
    const v = values.get(id);
    return v == null ? noDataLabel : formatValue(v);
  };
  const aria = (id: UzRegionId) => {
    const v = values.get(id);
    return v == null
      ? `${nameOf(id)}: ${noDataLabel}`
      : `${nameOf(id)}: ${formatValue(v)}, rank ${rankOf.get(id)} of ${known.length}`;
  };

  const moveFocus = (from: UzRegionId, dir: Dir) => {
    const [dx, dy] = DIRS[dir];
    const [x0, y0] = centre(from);
    let best: UzRegionId | null = null;
    let bestCos = 0.3; // ~72° dan katta og'ish — bu yo'nalishda qo'shni yo'q
    for (const n of NEIGHBOURS[from]) {
      const [x1, y1] = centre(n);
      const len = Math.hypot(x1 - x0, y1 - y0) || 1;
      const cos = ((x1 - x0) * dx + (y1 - y0) * dy) / len;
      if (cos > bestCos) {
        bestCos = cos;
        best = n;
      }
    }
    if (best) nodes.current.get(best)?.focus();
  };
  const onKey = (id: UzRegionId) => (e: KeyboardEvent<SVGElement>) => {
    if (e.key in DIRS) moveFocus(id, e.key as Dir);
    else if (e.key === 'Enter' || e.key === ' ') select(sel === id ? null : id);
    else if (e.key === 'Escape') select(null);
    else return;
    e.preventDefault();
  };
  const interactive = (id: UzRegionId) =>
    loading
      ? {}
      : {
          ref: (el: SVGElement | null) => {
            if (el) nodes.current.set(id, el);
            else nodes.current.delete(id);
          },
          role: 'button',
          tabIndex: 0,
          'aria-label': aria(id),
          'aria-pressed': sel === id,
          onKeyDown: onKey(id),
          onFocus: () => setFocus(id),
          onBlur: () => setFocus((f) => (f === id ? null : f)),
          onPointerEnter: () => setHover(id),
          onPointerLeave: () => setHover((h) => (h === id ? null : h)),
          onClick: () => select(sel === id ? null : id),
        };

  // Rang — daraja klassi (`__l200` … `__l700`, region-map.css); ma'lumotsiz — shtrix naqsh.
  const levelClass = (id: UzRegionId) => {
    const level = loading || bubble ? null : levelOf(id);
    return level == null ? null : `bek-region-map__l${level}`;
  };
  const hatched = (id: UzRegionId) =>
    !loading && !bubble && !values.has(id) ? { fill: `url(#${hatchId})` } : undefined;
  const regionClass = (id: UzRegionId) =>
    cx('bek-region-map__region', levelClass(id), sel === id && 'bek-region-map__region--selected');

  // Chip'lar: berilgan yoki standart (Choropleth — max va min, Bubble — eng katta 2 ta).
  const chipIds = (
    chips
      ? chips.map((c) => findRegion(c)?.id).filter((c): c is UzRegionId => c != null)
      : hex || !known.length
        ? []
        : bubble
          ? known.slice(0, 2).map((g) => g.id)
          : [known[0].id, known[known.length - 1].id]
  ).filter((id, i, a) => values.has(id) && a.indexOf(id) === i);

  const active = loading ? null : (hover ?? focus);
  const tip = active ? centre(active) : null;
  const tipLeft = tip
    ? tip[0] + TIP_GAP + TIP_W > width
      ? Math.max(0, tip[0] - TIP_GAP - TIP_W)
      : tip[0] + TIP_GAP
    : 0;
  const activeGeo = active ? GEO.find((g) => g.id === active)! : null;

  const levels = hex ? HEX_LEVELS : CHOROPLETH_LEVELS;
  const transform = `translate(${r2(ox)} ${r2(oy)}) scale(${r2(k)})`;

  return (
    <figure
      {...rest}
      aria-busy={loading || undefined}
      className={cx(
        'bek-chart',
        'bek-region-map',
        `bek-region-map--${variant}`,
        sel && 'bek-region-map--has-selection',
        loading && 'bek-region-map--loading',
        className,
      )}
    >
      <div className="bek-region-map__stage">
        <svg
          className="bek-chart__svg bek-region-map__svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={label}
        >
          <defs>
            <pattern
              id={hatchId}
              width={4}
              height={4}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect className="bek-region-map__hatch-bg" width={4} height={4} />
              <line className="bek-region-map__hatch" x1={0} y1={0} x2={0} y2={4} />
            </pattern>
          </defs>
          {hex ? (
            <g transform={transform}>
              {ranked.map((g) => {
                const [x, y] = g.hex;
                return (
                  <g key={g.id} className={regionClass(g.id)} {...interactive(g.id)}>
                    <path
                      className="bek-region-map__tile"
                      d={hexPath(x, y)}
                      style={hatched(g.id)}
                    />
                    <text
                      className="bek-region-map__code"
                      x={r2(x + HEX_TILE_W / 2)}
                      y={r2(y + HEX_TILE_H / 2)}
                      dy="0.32em"
                      textAnchor="middle"
                      aria-hidden="true"
                    >
                      {g.code}
                    </text>
                  </g>
                );
              })}
              {activeGeo && (
                <path
                  className={cx(
                    'bek-region-map__outline',
                    active === focus && 'bek-region-map__outline--focus',
                  )}
                  d={hexPath(activeGeo.hex[0], activeGeo.hex[1])}
                  aria-hidden="true"
                />
              )}
            </g>
          ) : (
            <g transform={transform}>
              <path className="bek-region-map__water" d={ARAL_SEA} aria-hidden="true" />
              {ranked.map((g) => (
                <path
                  key={g.id}
                  className={regionClass(g.id)}
                  d={g.d}
                  style={hatched(g.id)}
                  {...interactive(g.id)}
                />
              ))}
              {bubble &&
                !loading &&
                [...known]
                  .sort((a, b) => (values.get(b.id) ?? 0) - (values.get(a.id) ?? 0))
                  .map((g) => (
                    <circle
                      key={g.id}
                      className={cx(
                        'bek-region-map__bubble',
                        sel === g.id && 'bek-region-map__bubble--selected',
                      )}
                      cx={g.anchor[0]}
                      cy={g.anchor[1]}
                      r={r2(radius(Math.max(0, values.get(g.id) ?? 0)))}
                      aria-hidden="true"
                      onPointerEnter={() => setHover(g.id)}
                      onPointerLeave={() => setHover((h) => (h === g.id ? null : h))}
                      onClick={() => select(sel === g.id ? null : g.id)}
                    />
                  ))}
              {activeGeo && (
                <path
                  className={cx(
                    'bek-region-map__outline',
                    active === focus && 'bek-region-map__outline--focus',
                  )}
                  d={activeGeo.d}
                  aria-hidden="true"
                />
              )}
            </g>
          )}
        </svg>
        {!loading &&
          chipIds.map((id) => {
            const [x, y] = centre(id);
            const lift = bubble ? radius(values.get(id) ?? 0) * k + CHIP_GAP / 2 : CHIP_GAP;
            return (
              <span
                key={id}
                className="bek-region-map__chip"
                aria-hidden="true"
                style={{
                  insetInlineStart: `${(x / width) * 100}%`,
                  insetBlockStart: `${(Math.max(0, y - lift) / height) * 100}%`,
                }}
              >
                {`${nameOf(id)} · ${valueText(id)}`}
              </span>
            );
          })}
        {active && tip && (
          <ChartTooltip
            className="bek-region-map__tooltip"
            style={{
              insetInlineStart: tipLeft,
              insetBlockStart: Math.max(0, Math.min(height - 96, tip[1] - 24)),
            }}
            title={nameOf(active)}
            rows={[
              { label: metric ?? 'Value', value: valueText(active) },
              ...(values.has(active)
                ? [{ label: 'Rank', value: `${rankOf.get(active)} of ${known.length}` }]
                : []),
            ]}
          />
        )}
      </div>
      {bubble ? (
        <div className="bek-region-map__legend">
          <LegendItem variant="dot" color="var(--bek-dataviz-categorical-01)">
            {`Circle area = ${metric ?? 'value'}`}
          </LegendItem>
        </div>
      ) : (
        <div className="bek-region-map__scale">
          <span className="bek-region-map__bound">{all.length ? formatValue(lo) : ''}</span>
          {levels.map((l) => (
            <span
              key={l}
              className={`bek-region-map__step bek-region-map__l${l}`}
              aria-hidden="true"
            />
          ))}
          <span className="bek-region-map__bound">{all.length ? formatValue(hi) : ''}</span>
        </div>
      )}
      <DataTable
        caption={label}
        columns={['Region', 'Rank', metric ?? 'Value']}
        rows={ranked.map((g) => [
          g.name,
          values.has(g.id) ? String(rankOf.get(g.id)) : '—',
          valueText(g.id),
        ])}
      />
    </figure>
  );
}
