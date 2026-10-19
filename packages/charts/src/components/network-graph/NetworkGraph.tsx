import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { scaleSqrt } from 'd3-scale';
import { seriesColor } from '../../core/color.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type NetworkGraphVariant = 'default' | 'focus';

export interface NetworkNode {
  id: string;
  label?: string;
  /** Guruh — rang va legend. */
  group?: string;
  /** Hajm (aylanma, mijozlar soni); berilmasa — bog'lanishlar soni (degree). */
  size?: number;
  /** Tayyor joylashuv (ixtiyoriy birlikda) — berilsa simulyatsiya ishlamaydi. */
  x?: number;
  y?: number;
}

export interface NetworkLink {
  source: string;
  target: string;
}

export interface NetworkGraphProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Ko'pi bilan ~40 tugun. */
  nodes: NetworkNode[];
  links: NetworkLink[];
  /** `default` — butun graf, `focus` — tanlangan tugun va qo'shnilari, qolgani 25%. */
  variant?: NetworkGraphVariant;
  /** Focus tuguni `id`si; berilmasa (Focus'da) — eng ko'p bog'langan tugun. */
  focus?: string;
  /** Guruhlar tartibi (rang va legend); standart — `nodes` dagi uchrash tartibi. */
  groups?: string[];
  /** Kuchlar simulyatsiyasi qadamlari (deterministik). Standart 300. */
  iterations?: number;
  /** Shu radiusdan katta tugunlarga doim yozuv (kichiklari faqat Focus'da). */
  labelMinRadius?: number;
  width?: number;
  height?: number;
  label: string;
}

const PAD_X = 40; // chap/o'ng: yon tomondagi yozuvlar uchun joy
const PAD_Y = 20; // yuqori/past: yozuv balandligi + halqa
const LABEL_H = 14; // Caption/M qator balandligi (taxminiy)
const CHAR_W = 6.4; // Caption/M bitta belgining o'rtacha eni (taxminiy)
const LABEL_GAP = 4;
const R_RANGE: [number, number] = [3, 10];

interface Laid {
  node: NetworkNode;
  x: number;
  y: number;
  r: number;
  degree: number;
}

type SimNode = SimulationNodeDatum & { id: string; r: number };

/** Kuchlar simulyatsiyasi — sinxron, `iterations` qadam; d3-force LCG tufayli natija har safar bir xil. */
function simulate(nodes: NetworkNode[], links: NetworkLink[], radii: number[], iterations: number) {
  const sim: SimNode[] = nodes.map((n, i) => ({ id: n.id, r: radii[i] }));
  const ids = new Set(nodes.map((n) => n.id));
  const simLinks: SimulationLinkDatum<SimNode>[] = links
    .filter((l) => ids.has(l.source) && ids.has(l.target))
    .map((l) => ({ source: l.source, target: l.target }));
  forceSimulation(sim)
    .force(
      'link',
      forceLink<SimNode, SimulationLinkDatum<SimNode>>(simLinks)
        .id((d) => d.id)
        .distance(72),
    )
    .force('charge', forceManyBody<SimNode>().strength(-320))
    // Plot keng (480 × 200): vertikal siqish — graf eniga yoyiladi, yozuvlar ustma-ust tushmaydi.
    .force('flatten', forceY<SimNode>(0).strength(0.3))
    .force('center', forceCenter(0, 0))
    .force(
      'collide',
      forceCollide<SimNode>((d) => d.r + 20),
    )
    .stop()
    .tick(iterations);
  return sim.map((s) => [s.x ?? 0, s.y ?? 0] as [number, number]);
}

/** Koordinatalarni bir xil masshtab bilan (cho'zmasdan) plot markaziga joylash. */
function fit(points: [number, number][], width: number, height: number): [number, number][] {
  if (!points.length) return [];
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys),
  ];
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const k = Math.min((width - PAD_X * 2) / spanX, (height - PAD_Y * 2) / spanY);
  const ox = width / 2 - ((minX + maxX) / 2) * k;
  const oy = height / 2 - ((minY + maxY) / 2) * k;
  return points.map(([px, py]) => [ox + px * k, oy + py * k]);
}

interface LabelSpot {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const overlaps = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/**
 * Yozuvlar to'qnashuvi: har yozuv uchun o'ng · chap · tepa · past sinab ko'riladi; avval qo'yilgan
 * yozuvlar, tugunlar va plot chegarasi bilan kesishmaydigan birinchisi tanlanadi. Joy topilmasa —
 * yozuv yashiriladi (nom `<title>` va jadvalda qoladi). Tartib: fokus, keyin kattasidan.
 */
function placeLabels(
  items: { id: string; x: number; y: number; r: number; text: string; priority: number }[],
  nodes: { x: number; y: number; r: number }[],
  width: number,
  height: number,
): Map<string, LabelSpot> {
  const placed: Box[] = [];
  const out = new Map<string, LabelSpot>();
  const bounds: Box = { x0: 0, y0: 0, x1: width, y1: height };
  const order = [...items].sort((a, b) => b.priority - a.priority);
  for (const it of order) {
    const w = it.text.length * CHAR_W;
    const off = it.r + LABEL_GAP;
    const spots: (LabelSpot & { box: Box })[] = [
      {
        x: it.x + off,
        y: it.y,
        anchor: 'start',
        box: { x0: it.x + off, y0: it.y - LABEL_H / 2, x1: it.x + off + w, y1: it.y + LABEL_H / 2 },
      },
      {
        x: it.x - off,
        y: it.y,
        anchor: 'end',
        box: { x0: it.x - off - w, y0: it.y - LABEL_H / 2, x1: it.x - off, y1: it.y + LABEL_H / 2 },
      },
      {
        x: it.x,
        y: it.y - off - LABEL_H / 2,
        anchor: 'middle',
        box: { x0: it.x - w / 2, y0: it.y - off - LABEL_H, x1: it.x + w / 2, y1: it.y - off },
      },
      {
        x: it.x,
        y: it.y + off + LABEL_H / 2,
        anchor: 'middle',
        box: { x0: it.x - w / 2, y0: it.y + off, x1: it.x + w / 2, y1: it.y + off + LABEL_H },
      },
    ];
    const hit = spots.find(
      (sp) =>
        sp.box.x0 >= bounds.x0 &&
        sp.box.x1 <= bounds.x1 &&
        sp.box.y0 >= bounds.y0 &&
        sp.box.y1 <= bounds.y1 &&
        placed.every((b) => !overlaps(sp.box, b)) &&
        nodes.every(
          (n) => !overlaps(sp.box, { x0: n.x - n.r, y0: n.y - n.r, x1: n.x + n.r, y1: n.y + n.r }),
        ),
    );
    if (!hit) continue;
    placed.push(hit.box);
    out.set(it.id, { x: hit.x, y: hit.y, anchor: hit.anchor });
  }
  return out;
}

/**
 * Figma "4.18 Chart · Network graph": entitetlar orasidagi bog'lanishlar. Tugun o'lchami — degree
 * yoki hajm, rang — guruh, bog'lanish — `dataviz/axis`. Geometriya cho'zilmaydi.
 */
export function NetworkGraph({
  nodes,
  links,
  variant = 'default',
  focus,
  groups: groupOrder,
  iterations = 300,
  labelMinRadius = 5,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  ...rest
}: NetworkGraphProps) {
  const groups = groupOrder ?? [...new Set(nodes.map((n) => n.group ?? ''))];
  const colorOf = (n: NetworkNode) => seriesColor(Math.max(0, groups.indexOf(n.group ?? '')));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const valid = links.filter((l) => byId.has(l.source) && byId.has(l.target));
  const degree = new Map(nodes.map((n) => [n.id, 0]));
  for (const l of valid) {
    degree.set(l.source, (degree.get(l.source) ?? 0) + 1);
    degree.set(l.target, (degree.get(l.target) ?? 0) + 1);
  }
  const weightOf = (n: NetworkNode) => n.size ?? degree.get(n.id) ?? 0;
  const weights = nodes.map(weightOf);
  const rScale = scaleSqrt()
    .domain([Math.min(0, ...weights), Math.max(1, ...weights)])
    .range(R_RANGE);
  const radii = weights.map((w) => rScale(w));
  const preset = nodes.length > 0 && nodes.every((n) => n.x != null && n.y != null);
  const raw = preset
    ? nodes.map((n) => [n.x ?? 0, n.y ?? 0] as [number, number])
    : simulate(nodes, valid, radii, iterations);
  const pos = fit(raw, width, height);
  const laid: Laid[] = nodes.map((node, i) => ({
    node,
    x: pos[i][0],
    y: pos[i][1],
    r: radii[i],
    degree: degree.get(node.id) ?? 0,
  }));
  const at = new Map(laid.map((l) => [l.node.id, l]));

  const focusId =
    variant === 'focus'
      ? (focus ?? [...laid].sort((a, b) => b.degree - a.degree)[0]?.node.id)
      : undefined;
  const neighbours = new Set<string>(focusId ? [focusId] : []);
  if (focusId)
    for (const l of valid) {
      if (l.source === focusId) neighbours.add(l.target);
      if (l.target === focusId) neighbours.add(l.source);
    }
  const isOn = (id: string) => !focusId || neighbours.has(id);
  const focusNode = focusId ? byId.get(focusId) : undefined;
  const spots = placeLabels(
    laid
      .filter((l) => (focusId ? isOn(l.node.id) : l.r >= labelMinRadius))
      .map((l) => ({
        id: l.node.id,
        x: l.x,
        y: l.y,
        r: l.r,
        text: l.node.label ?? l.node.id,
        priority: (l.node.id === focusId ? 100 : 0) + l.r,
      })),
    laid,
    width,
    height,
  );

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-network-graph', `bek-network-graph--${variant}`, className)}
    >
      {groups.length > 1 && (
        <ChartLegend items={groups.map((g, i) => ({ label: g || '—', color: seriesColor(i) }))} />
      )}
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-network-graph__links" aria-hidden="true">
          {valid.map((l, i) => {
            const a = at.get(l.source) as Laid;
            const b = at.get(l.target) as Laid;
            const active = !!focusId && (l.source === focusId || l.target === focusId);
            return (
              <line
                key={i}
                className={cx(
                  'bek-network-graph__link',
                  active && 'bek-network-graph__link--active',
                  focusId && !active && 'bek-network-graph__link--dim',
                )}
                style={active && focusNode ? { stroke: colorOf(focusNode) } : undefined}
                x1={r2(a.x)}
                y1={r2(a.y)}
                x2={r2(b.x)}
                y2={r2(b.y)}
              />
            );
          })}
        </g>
        <g className="bek-network-graph__nodes">
          {laid.map((l) => {
            const on = isOn(l.node.id);
            const spot = spots.get(l.node.id);
            return (
              <g
                key={l.node.id}
                className={cx(
                  'bek-chart__mark bek-network-graph__node',
                  !on && 'bek-network-graph__node--dim',
                  l.node.id === focusId && 'bek-network-graph__node--focus',
                )}
              >
                <circle cx={r2(l.x)} cy={r2(l.y)} r={r2(l.r)} style={{ fill: colorOf(l.node) }} />
                {spot && (
                  <text
                    className="bek-network-graph__label"
                    x={r2(spot.x)}
                    y={r2(spot.y)}
                    dy="0.32em"
                    textAnchor={spot.anchor}
                  >
                    {l.node.label ?? l.node.id}
                  </text>
                )}
                <title>{`${l.node.label ?? l.node.id}${l.node.group ? ` · ${l.node.group}` : ''}: ${l.degree}`}</title>
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Node', 'Group', 'Connections']}
        rows={nodes.map((n) => [
          n.label ?? n.id,
          n.group ?? '',
          valid
            .filter((l) => l.source === n.id || l.target === n.id)
            .map((l) => {
              const other = byId.get(l.source === n.id ? l.target : l.source);
              return other?.label ?? other?.id ?? '';
            })
            .join(', '),
        ])}
      />
    </figure>
  );
}
