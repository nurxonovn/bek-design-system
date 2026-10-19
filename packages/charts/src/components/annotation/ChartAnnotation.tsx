import type { SVGAttributes } from 'react';
import { cx } from '@bek/react';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { PartFrame, type ChartPartFrameProps } from '../chart-axis/PartFrame.js';
import { ChartPoint } from '../data-point/ChartPoint.js';
import { ChartTag, TAG_H } from './ChartTag.js';

export type ChartAnnotationVariant = 'marker' | 'point' | 'range';

export interface ChartAnnotationProps
  extends ChartPartFrameProps,
    Omit<SVGAttributes<SVGGElement>, 'x' | 'y' | 'x2' | 'color'> {
  /** `marker` — X o'qidagi voqea (uzuq chiziq + teg), `point` — bitta qiymat, `range` — davr (soya). */
  variant?: ChartAnnotationVariant;
  /** Teg matni — ≤ 24 belgi (uzunrog'i `…` bilan qisqaradi; to'liq matn `note` ga). */
  text: string;
  /** To'liq izoh — hover'da `<title>`: "Tariff +8% from 1 May". */
  note?: string;
  /** Voqea x koordinatasi; `range` da davr boshi. */
  x: number;
  /** `range` — davr oxiri. */
  x2?: number;
  /** `point` — qiymat y koordinatasi. */
  y?: number;
  /** `point` nuqtasi seriya rangi (`seriesColor(i)`). */
  color?: string;
  /** Plot chegaralari — standart Figma plot 0…480 × 0…200 (`chart/height/md`). */
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

/** Figma: "Tag text ≤ 24 characters". */
export const ANNOTATION_MAX_CHARS = 24;
const GAP = 4; // scale/4 — teg va chiziq orasida
const STEM = 16; // scale/16 — point tegining oyog'i
const HALO_R = 10; // Chart/Data point Active halo

const clip = (s: string) =>
  s.length > ANNOTATION_MAX_CHARS ? `${s.slice(0, ANNOTATION_MAX_CHARS - 1)}…` : s;

/**
 * Figma "4.18 Chart · Annotation": ma'lumotdagi lahzani tushuntiradi. Chart `<svg>` ichiga `<g>` bo'lagi;
 * bir chartda ko'pi bilan 3 ta, oxirgi qiymatni yopmasin. Matn chart `label` xulosasida ham aytilsin.
 */
export function ChartAnnotation({
  variant = 'marker',
  text,
  note,
  x,
  x2,
  y,
  color,
  top = 0,
  bottom = DEFAULT_HEIGHT,
  left = 0,
  right = DEFAULT_WIDTH,
  standalone,
  label,
  className,
  ...rest
}: ChartAnnotationProps) {
  const tag = clip(text);
  const bound = { min: left, max: right };
  let body;
  if (variant === 'range') {
    const a = Math.min(x, x2 ?? x);
    const b = Math.max(x, x2 ?? x);
    body = (
      <>
        <rect
          className="bek-annotation__band"
          x={r2(a)}
          y={top}
          width={r2(b - a)}
          height={r2(bottom - top)}
        />
        <ChartTag block="bek-annotation" x={(a + b) / 2} y={top + 8} text={tag} {...bound} />
      </>
    );
  } else if (variant === 'point') {
    const py = y ?? (top + bottom) / 2;
    const stemTop = py - HALO_R - STEM;
    body = (
      <>
        <line
          className="bek-annotation__stem"
          x1={r2(x)}
          x2={r2(x)}
          y1={r2(stemTop)}
          y2={r2(py - HALO_R)}
        />
        <ChartTag block="bek-annotation" x={x} y={stemTop - TAG_H} text={tag} {...bound} />
        <ChartPoint x={x} y={py} variant="active" color={color} />
      </>
    );
  } else {
    body = (
      <>
        <ChartTag block="bek-annotation" x={x} y={top} text={tag} {...bound} />
        <line
          className="bek-annotation__rule"
          x1={r2(x)}
          x2={r2(x)}
          y1={top + TAG_H + GAP}
          y2={bottom}
        />
      </>
    );
  }
  return (
    <PartFrame
      standalone={standalone}
      label={label ?? `Annotation: ${note ?? text}`}
      fallbackLabel="Annotation"
      name="annotation"
      width={right}
      height={bottom}
    >
      <g {...rest} className={cx('bek-annotation', `bek-annotation--${variant}`, className)}>
        <title>{note ? `${text}: ${note}` : text}</title>
        {body}
      </g>
    </PartFrame>
  );
}
