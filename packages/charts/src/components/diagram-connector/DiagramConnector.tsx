import type { SVGAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { r2 } from '../../core/geometry.js';

export type DiagramConnectorVariant = 'straight' | 'dashed' | 'elbow' | 'labeled';
/** Oqim o'qi: `horizontal` — chapdan o'ngga, `vertical` — yuqoridan pastga. */
export type DiagramDirection = 'horizontal' | 'vertical';

export interface DiagramPoint {
  x: number;
  y: number;
}

/** Strelka uchi: uzunligi 8, eni 10 (Figma "Arrow head 8 × 10"). */
export const DIAGRAM_ARROW_LENGTH = 8;
const ARROW_HALF = 5;
/** Label pill: Caption/M (16) + padding 2 → 20 balandlik, yon padding `scale/6`. */
const PILL_HEIGHT = 20;
const PILL_PAD = 6;
/** Caption/M belgisining o'rtacha eni — SVG matnini o'lchab bo'lmaydi (SSR), pill eni shu bilan taxminlanadi. */
const CHAR_WIDTH = 6.6;

/**
 * Ortogonal (Elbow) yo'l nuqtalari: `horizontal` — gorizontal → vertikal → gorizontal (burilish
 * o'rtada), `vertical` — vertikal → gorizontal → vertikal. Bir o'qda bo'lsa — to'g'ri chiziq.
 */
export function orthogonalPoints(
  from: DiagramPoint,
  to: DiagramPoint,
  direction: DiagramDirection = 'horizontal',
): DiagramPoint[] {
  if (from.x === to.x || from.y === to.y) return [from, to];
  if (direction === 'horizontal') {
    const mx = (from.x + to.x) / 2;
    return [from, { x: mx, y: from.y }, { x: mx, y: to.y }, to];
  }
  const my = (from.y + to.y) / 2;
  return [from, { x: from.x, y: my }, { x: to.x, y: my }, to];
}

/**
 * Ortogonal yo'l — SVG `d` qatori: `orthogonalPath({x:0,y:0}, {x:120,y:48})` →
 * `M0,0H60V48H120`. Mind map, Swimlane va Org chart shu yordamchi bilan ulanadi.
 */
export function orthogonalPath(
  from: DiagramPoint,
  to: DiagramPoint,
  direction: DiagramDirection = 'horizontal',
): string {
  return toPath(orthogonalPoints(from, to, direction));
}

function toPath(points: DiagramPoint[]): string {
  return points
    .map((p, i) => {
      if (i === 0) return `M${r2(p.x)},${r2(p.y)}`;
      const prev = points[i - 1];
      if (prev.y === p.y) return `H${r2(p.x)}`;
      if (prev.x === p.x) return `V${r2(p.y)}`;
      return `L${r2(p.x)},${r2(p.y)}`;
    })
    .join('');
}

/** Oxirgi segmentni strelka asosigacha qisqartiradi — chiziq uchdan chiqib turmaydi. */
function trimEnd(points: DiagramPoint[], by: number): DiagramPoint[] {
  const a = points[points.length - 2];
  const b = points[points.length - 1];
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len === 0) return points;
  const k = Math.max(0, len - by) / len;
  return [...points.slice(0, -1), { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }];
}

function arrowHead(points: DiagramPoint[]): string {
  const a = points[points.length - 2];
  const b = points[points.length - 1];
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const bx = b.x - ux * DIAGRAM_ARROW_LENGTH;
  const by = b.y - uy * DIAGRAM_ARROW_LENGTH;
  return (
    `M${r2(b.x)},${r2(b.y)}` +
    `L${r2(bx - uy * ARROW_HALF)},${r2(by + ux * ARROW_HALF)}` +
    `L${r2(bx + uy * ARROW_HALF)},${r2(by - ux * ARROW_HALF)}Z`
  );
}

/** Label joyi — yo'lning o'rta segmenti markazi (Elbow'da burilishlar orasida). */
function midpoint(points: DiagramPoint[]): DiagramPoint {
  const i = Math.floor((points.length - 1) / 2);
  const a = points[i];
  const b = points[i + 1];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export interface DiagramConnectorProps extends Omit<SVGAttributes<SVGGElement>, 'from' | 'to'> {
  /** Boshlanish nuqtasi (manba tugun cheti), SVG koordinatalarida. */
  from: DiagramPoint;
  /** Tugash nuqtasi — strelka uchi shu nuqtada (maqsad tugun cheti). */
  to: DiagramPoint;
  /**
   * `straight` — asosiy oqim, `dashed` — ixtiyoriy / async yo'l, `elbow` — ortogonal burilish,
   * `labeled` — qaror tarmog'i (Yes / No) yorlig'i bilan.
   */
  variant?: DiagramConnectorVariant;
  /** Shart yorlig'i ("Yes", "No") — chiziq o'rtasidagi `bg/sheet` pill. `labeled` uchun majburiy ma'noda. */
  label?: string;
  /**
   * Yo'nalish: `straight` — to'g'ri chiziq, `elbow` — ortogonal. Standart variantdan:
   * `elbow` → elbow, qolganlari → straight. Masalan, uzuq ortogonal: `variant="dashed" route="elbow"`.
   */
  route?: 'straight' | 'elbow';
  /** Elbow burilish o'qi (diagramma oqimi). Standart `horizontal`. */
  direction?: DiagramDirection;
  /** Walkthrough'dagi joriy yo'l — `accent/default` (Figma "Active path"). */
  active?: boolean;
}

/**
 * Figma "4.19 Diagram · Connector": ikki tugun orasidagi strelka. SVG `<g>` qaytaradi — diagramma
 * `<svg>` (masalan `ChartSvg`) ichida chiziladi; tugunlar (`DiagramNode`) HTML qatlamida ustida turadi.
 */
export function DiagramConnector({
  from,
  to,
  variant = 'straight',
  label,
  route,
  direction = 'horizontal',
  active = false,
  className,
  ...rest
}: DiagramConnectorProps) {
  const elbow = (route ?? (variant === 'elbow' ? 'elbow' : 'straight')) === 'elbow';
  const points = elbow ? orthogonalPoints(from, to, direction) : [from, to];
  const mid = midpoint(points);
  const pillWidth = label ? label.length * CHAR_WIDTH + PILL_PAD * 2 : 0;
  return (
    <g
      {...rest}
      className={cx(
        'bek-diagram',
        'bek-diagram-connector',
        `bek-diagram-connector--${variant}`,
        active && 'bek-diagram-connector--active',
        className,
      )}
    >
      <path
        className="bek-diagram-connector__line"
        d={toPath(trimEnd(points, DIAGRAM_ARROW_LENGTH))}
      />
      <path className="bek-diagram-connector__head" d={arrowHead(points)} />
      {label && (
        <g className="bek-diagram-connector__label">
          <rect
            x={r2(mid.x - pillWidth / 2)}
            y={r2(mid.y - PILL_HEIGHT / 2)}
            width={r2(pillWidth)}
            height={PILL_HEIGHT}
            rx={PILL_HEIGHT / 2}
          />
          <text x={r2(mid.x)} y={r2(mid.y)} dy="0.35em" textAnchor="middle">
            {label}
          </text>
        </g>
      )}
    </g>
  );
}
