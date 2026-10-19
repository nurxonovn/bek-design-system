import type { ReactNode } from 'react';
import { r2 } from './geometry.js';

/** O'q yozuvi uchun minimal shkala interfeysi (d3 linear / band / point mos keladi). */
export interface TickScale {
  (value: number): number;
  ticks(count?: number): number[];
}

export interface AxisLeftProps {
  scale: TickScale;
  /** Plot chap cheti (yozuvlar shu nuqtadan chapga, `chart/axis/label-gap` = 8). */
  x: number;
  ticks: number;
  format: (v: number) => string;
}

/** Y o'qi yozuvlari — Caption/S · dataviz/label, o'ng tomondan tekislangan. */
export function AxisLeft({ scale, x, ticks, format }: AxisLeftProps) {
  return (
    <g className="bek-chart__axis bek-chart__axis--y" aria-hidden="true">
      {scale.ticks(ticks).map((t) => (
        <text
          key={t}
          className="bek-chart__tick"
          x={x - 8}
          y={r2(scale(t))}
          dy="0.32em"
          textAnchor="end"
        >
          {format(t)}
        </text>
      ))}
    </g>
  );
}

export interface GridRowsProps {
  scale: TickScale;
  ticks: number;
  x1: number;
  x2: number;
  /** 0 chizig'i `dataviz/axis` (asos), qolganlari `dataviz/grid`. */
  baseline?: number;
}

/** Gorizontal grid — `dataviz/grid`, `chart/grid/stroke`; asos chizig'i `dataviz/axis`. */
export function GridRows({ scale, ticks, x1, x2, baseline }: GridRowsProps) {
  return (
    <g className="bek-chart__grid" aria-hidden="true">
      {scale.ticks(ticks).map((t) => (
        <line
          key={t}
          className={t === baseline ? 'bek-chart__baseline' : 'bek-chart__gridline'}
          x1={x1}
          x2={x2}
          y1={r2(scale(t))}
          y2={r2(scale(t))}
        />
      ))}
    </g>
  );
}

export interface AxisBottomProps {
  labels: { key: string; x: number; label: string }[];
  y: number;
}

/** X o'qi yozuvlari — Caption/S · dataviz/label, markazlangan. */
export function AxisBottom({ labels, y }: AxisBottomProps) {
  return (
    <g className="bek-chart__axis bek-chart__axis--x" aria-hidden="true">
      {labels.map((l) => (
        <text
          key={l.key}
          className="bek-chart__tick"
          x={r2(l.x)}
          y={y}
          dy="0.71em"
          textAnchor="middle"
        >
          {l.label}
        </text>
      ))}
    </g>
  );
}

export interface ChartSvgProps {
  width: number;
  height: number;
  /** Ekran o'quvchi uchun qisqa xulosa ("Daromad 6 oyda 24% o'sdi"). */
  label: string;
  className?: string;
  children: ReactNode;
}

/** `role="img"` SVG — har chartning ildiz chizmasi. */
export function ChartSvg({ width, height, label, className, children }: ChartSvgProps) {
  return (
    <svg
      className={className ? `bek-chart__svg ${className}` : 'bek-chart__svg'}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

export interface DataTableProps {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}

/** Ko'rinmas jadval — ekran o'quvchi uchun ma'lumot nusxasi (Figma Spec: "data table fallback"). */
export function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    <table className="bek-chart__sr">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) =>
              j === 0 ? (
                <th key={j} scope="row">
                  {c}
                </th>
              ) : (
                <td key={j}>{c}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
