import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { r2 } from '../../core/geometry.js';
import {
  DIAGRAM_NODE_GAP,
  DIAGRAM_NODE_WIDTH,
  DiagramNode,
  diagramNodeSize,
} from '../diagram-node/index.js';
import { DiagramConnector } from '../diagram-connector/index.js';
import type { DiagramDirection, DiagramPoint } from '../diagram-connector/index.js';

export type SwimlaneShape = 'terminal' | 'process' | 'decision';

export interface SwimlaneStep {
  id: string;
  /** Yo'lak nomi yoki indeksi (`lanes` massivida). */
  lane: string | number;
  /** Oqimdagi o'rni: 0, 1, 2 … (Horizontal — ustun, Vertical — qator). */
  column: number;
  label: string;
  /** Boshlanish/tugash — `terminal`, qaror — `decision`, qolgani — `process` (standart). */
  shape?: SwimlaneShape;
}

export interface SwimlaneEdge {
  from: string;
  to: string;
  /** Qaror tarmog'i yorlig'i ("Yes", "No"). */
  label?: string;
  /** Ixtiyoriy / asinxron yo'l — uzuq chiziq. */
  dashed?: boolean;
}

export interface SwimlaneProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Ishtirokchilar: odam, tizim, AI agent (2–6 ta). */
  lanes: string[];
  /** Qadamlar (≤ 12). */
  steps: SwimlaneStep[];
  edges: SwimlaneEdge[];
  /** `horizontal` — yo'laklar qator (web, print), `vertical` — ustun (tor ekran). */
  direction?: DiagramDirection;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
  /** Minimal canvas eni: Horizontal `scale/900`, Vertical `scale/720`. */
  width?: number;
}

/** Ichki chekka `scale/8`, yo'lak nomi ustuni / qatori, yo'lak va qator qadamlari. */
const PAD = 8;
const LANE_HEAD = 112;
const HEAD_ROW = 40;
const LANE = 96;
const ROW = 96;
const PITCH = DIAGRAM_NODE_WIDTH + DIAGRAM_NODE_GAP;
const HALF_W = DIAGRAM_NODE_WIDTH / 2;

interface Placed extends SwimlaneStep {
  x: number;
  y: number;
  laneIndex: number;
  halfH: number;
}

export interface SwimlaneLayout {
  width: number;
  height: number;
  /** Yo'lak chegaralari (ajratgich chiziqlar uchun) — Horizontal y, Vertical x. */
  dividers: number[];
  steps: Placed[];
}

function laneIndexOf(lanes: string[], lane: string | number): number {
  const i = typeof lane === 'number' ? lane : lanes.indexOf(lane);
  if (i < 0 || i >= lanes.length) throw new Error(`Swimlane: noma'lum yo'lak "${String(lane)}"`);
  return i;
}

/** Qadamlarni yo'lak × ustun to'riga joylaydi (piksel koordinatalari). */
export function swimlaneLayout(
  lanes: string[],
  steps: SwimlaneStep[],
  direction: DiagramDirection = 'horizontal',
  minWidth = direction === 'horizontal' ? 900 : 720,
): SwimlaneLayout {
  const cols = Math.max(1, ...steps.map((s) => s.column + 1));
  if (direction === 'horizontal') {
    const width = Math.max(minWidth, LANE_HEAD + PAD * 2 + cols * PITCH);
    const pitch = (width - LANE_HEAD - PAD * 2) / cols;
    return {
      width,
      height: PAD * 2 + lanes.length * LANE,
      dividers: lanes.slice(1).map((_, i) => PAD + (i + 1) * LANE),
      steps: steps.map((s) => {
        const laneIndex = laneIndexOf(lanes, s.lane);
        return {
          ...s,
          laneIndex,
          x: r2(LANE_HEAD + PAD + (s.column + 0.5) * pitch),
          y: r2(PAD + (laneIndex + 0.5) * LANE),
          halfH: diagramNodeSize(s.shape === 'decision' ? 'decision' : 'process').height / 2,
        };
      }),
    };
  }
  const width = Math.max(minWidth, PAD * 2 + lanes.length * PITCH);
  const laneW = (width - PAD * 2) / lanes.length;
  return {
    width,
    height: HEAD_ROW + PAD * 2 + cols * ROW,
    dividers: lanes.slice(1).map((_, i) => r2(PAD + (i + 1) * laneW)),
    steps: steps.map((s) => {
      const laneIndex = laneIndexOf(lanes, s.lane);
      return {
        ...s,
        laneIndex,
        x: r2(PAD + (laneIndex + 0.5) * laneW),
        y: r2(HEAD_ROW + PAD + (s.column + 0.5) * ROW),
        halfH: diagramNodeSize(s.shape === 'decision' ? 'decision' : 'process').height / 2,
      };
    }),
  };
}

/**
 * Bog'lanish uchlari: oqim bo'yicha keyingi qadamga — oqim o'qidagi chetlar (elbow), bir ustundagi
 * qadamga — yo'lak o'qidagi chetlar (to'g'ri chiziq).
 */
export function swimlanePorts(
  a: Placed,
  b: Placed,
  direction: DiagramDirection,
): { from: DiagramPoint; to: DiagramPoint } {
  const sameFlow = a.column === b.column;
  const alongX = direction === 'horizontal' ? !sameFlow : sameFlow;
  if (alongX) {
    const s = Math.sign(b.x - a.x) || 1;
    return { from: { x: a.x + s * HALF_W, y: a.y }, to: { x: b.x - s * HALF_W, y: b.y } };
  }
  const s = Math.sign(b.y - a.y) || 1;
  return { from: { x: a.x, y: a.y + s * a.halfH }, to: { x: b.x, y: b.y - s * b.halfH } };
}

const nodeStyle = (s: Placed): CSSProperties => ({
  left: r2(s.x - HALF_W),
  top: r2(s.y - s.halfH),
});

/**
 * Figma "4.19 Diagram · Swimlane": har yo'lak — ishtirokchi (odam, tizim, AI agent), qadamlar
 * `DiagramNode`, bog'lanishlar ortogonal `DiagramConnector` (Yes / No pill bilan).
 */
export function Swimlane({
  lanes,
  steps,
  edges,
  direction = 'horizontal',
  label,
  width,
  className,
  ...rest
}: SwimlaneProps) {
  const g = swimlaneLayout(lanes, steps, direction, width);
  const byId = new Map(g.steps.map((s) => [s.id, s]));
  const horizontal = direction === 'horizontal';
  return (
    <figure
      // Keng kanvas gorizontal skroll qiladi — klaviaturadan ham (WCAG 2.1.1, axe scrollable-region-focusable).
      tabIndex={0}
      {...rest}
      className={cx(
        'bek-diagram',
        'bek-swimlane',
        `bek-swimlane--${direction}`,
        'bek-focus-ring',
        className,
      )}
    >
      <div
        className="bek-swimlane__canvas"
        role="img"
        aria-label={label}
        style={{ width: g.width, height: g.height }}
      >
        {lanes.map((name, i) => (
          <span
            key={i}
            className="bek-swimlane__lane-name"
            style={
              horizontal
                ? { top: r2(PAD + i * LANE), height: LANE, width: LANE_HEAD }
                : {
                    left: r2(PAD + (i * (g.width - PAD * 2)) / lanes.length),
                    width: r2((g.width - PAD * 2) / lanes.length),
                    height: HEAD_ROW,
                  }
            }
          >
            {name}
          </span>
        ))}
        <svg
          className="bek-swimlane__edges"
          width={g.width}
          height={g.height}
          viewBox={`0 0 ${g.width} ${g.height}`}
          aria-hidden="true"
          focusable="false"
        >
          {g.dividers.map((d) =>
            horizontal ? (
              <line
                key={d}
                className="bek-swimlane__divider"
                x1={PAD}
                x2={g.width - PAD}
                y1={d}
                y2={d}
              />
            ) : (
              <line
                key={d}
                className="bek-swimlane__divider"
                x1={d}
                x2={d}
                y1={PAD}
                y2={g.height - PAD}
              />
            ),
          )}
          {edges.map((e, k) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b)
              throw new Error(`Swimlane: bog'lanishda noma'lum qadam ${e.from} → ${e.to}`);
            const { from, to } = swimlanePorts(a, b, direction);
            return (
              <DiagramConnector
                key={k}
                from={from}
                to={to}
                variant={e.label ? 'labeled' : e.dashed ? 'dashed' : 'elbow'}
                route="elbow"
                direction={
                  a.column === b.column ? (horizontal ? 'vertical' : 'horizontal') : direction
                }
                label={e.label}
              />
            );
          })}
        </svg>
        {g.steps.map((s) => (
          <DiagramNode
            key={s.id}
            className="bek-swimlane__step"
            variant={s.shape ?? 'process'}
            label={s.label}
            style={nodeStyle(s)}
          />
        ))}
      </div>
      <ol className="bek-chart__sr">
        {lanes.map((name, i) => (
          <li key={`l${i}`}>
            {name}:{' '}
            {g.steps
              .filter((s) => s.laneIndex === i)
              .map((s) => s.label)
              .join(', ') || '—'}
          </li>
        ))}
        {edges.map((e, k) => (
          <li key={`e${k}`}>
            {byId.get(e.from)?.label} → {byId.get(e.to)?.label}
            {e.label ? ` (${e.label})` : ''}
          </li>
        ))}
      </ol>
    </figure>
  );
}
