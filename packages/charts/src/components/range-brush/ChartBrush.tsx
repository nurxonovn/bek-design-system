'use client';

import {
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { cx } from '@bek/react';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { extent } from 'd3-array';
import { DEFAULT_WIDTH, r2 } from '../../core/geometry.js';

export interface ChartBrushRange {
  startIndex: number;
  endIndex: number;
}

export interface ChartBrushProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Butun qator — umumiy ko'rinish chizig'i (`dataviz/label`). */
  data: number[];
  /** Boshqariladigan oyna: ko'rinadigan oraliq indekslari (ikkalasi ham kiradi). */
  startIndex?: number;
  endIndex?: number;
  /** Boshqarilmaydigan rejimda boshlang'ich oyna; ikki marta bosish shu holatga qaytaradi. Standart: butun qator. */
  defaultStartIndex?: number;
  defaultEndIndex?: number;
  /** Oyna o'zgarganda (sudrash, klaviatura) — asosiy chartni shu oraliqqa yangilang. */
  onChange?: (range: ChartBrushRange) => void;
  /** Eng kichik oyna (indekslar farqi). Moliyaviy ma'lumotda butun davr (7 kun) bering. */
  minSpan?: number;
  /** En (px) — Figma `scale/480`; responsiv uchun `ChartContainer`. Balandlik `scale/56`. */
  width?: number;
  /** Slider qiymat matni: `(i) => dates[i]` → "From 1 Jul", "To 31 Aug". */
  formatIndex?: (index: number) => string;
  /** Guruh nomi (ekran o'quvchi). */
  label?: string;
}

const PAD = 8; // overview chizig'i trek chetidan
const HEIGHT = 56; // scale/56

type Drag = { mode: 'pan' | 'start' | 'end'; x0: number; s0: number; e0: number };

/** Oynani [0, last] ichida, `minSpan` dan kichik bo'lmagan holda cheklaydi. */
export function clampBrushRange(
  start: number,
  end: number,
  last: number,
  minSpan = 1,
  mode: 'pan' | 'start' | 'end' = 'pan',
): ChartBrushRange {
  const span = Math.min(Math.max(minSpan, 0), last);
  let s = Math.round(start);
  let e = Math.round(end);
  if (mode === 'pan') {
    const w = Math.max(span, e - s);
    s = Math.max(0, Math.min(last - w, s));
    return { startIndex: s, endIndex: s + w };
  }
  if (mode === 'start') {
    e = Math.max(span, Math.min(last, e));
    s = Math.max(0, Math.min(e - span, s));
  } else {
    s = Math.max(0, Math.min(last - span, s));
    e = Math.min(last, Math.max(s + span, e));
  }
  return { startIndex: s, endIndex: e };
}

/**
 * Figma "4.18 Chart · Range brush": uzun vaqt qatori ostidagi umumiy ko'rinish — oynani sudrab suring,
 * tutqichni sudrab kattalashtiring. Klaviatura: tutqichda ←/→ — oynani suradi, Shift+←/→ — o'lchamini
 * o'zgartiradi, Home/End — chetga. Ikki marta bosish — boshlang'ich holat.
 */
export function ChartBrush({
  data,
  startIndex,
  endIndex,
  defaultStartIndex = 0,
  defaultEndIndex,
  onChange,
  minSpan = 1,
  width = DEFAULT_WIDTH,
  formatIndex = (i) => String(i + 1),
  label = 'Range',
  className,
  style,
  ...rest
}: ChartBrushProps) {
  const last = Math.max(0, data.length - 1);
  const initial = clampBrushRange(defaultStartIndex, defaultEndIndex ?? last, last, minSpan);
  const [inner, setInner] = useState<ChartBrushRange>(initial);
  const drag = useRef<Drag | null>(null);
  const range = clampBrushRange(
    startIndex ?? inner.startIndex,
    endIndex ?? inner.endIndex,
    last,
    minSpan,
  );

  const x = scaleLinear()
    .domain([0, Math.max(1, last)])
    .range([PAD, width - PAD]);
  const [lo = 0, hi = 1] = extent(data);
  const y = scaleLinear()
    .domain([lo, hi === lo ? lo + 1 : hi])
    .range([HEIGHT - PAD, PAD]);
  const overview =
    line<number>()
      .x((_, i) => r2(x(i)))
      .y((v) => r2(y(v)))(data) ?? '';
  const step = (width - PAD * 2) / Math.max(1, last);

  const commit = (s: number, e: number, mode: Drag['mode']) => {
    const next = clampBrushRange(s, e, last, minSpan, mode);
    if (next.startIndex === range.startIndex && next.endIndex === range.endIndex) return;
    if (startIndex === undefined || endIndex === undefined) setInner(next);
    onChange?.(next);
  };

  const begin = (mode: Drag['mode']) => (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { mode, x0: event.clientX, s0: range.startIndex, e0: range.endIndex };
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const delta = Math.round((event.clientX - d.x0) / step);
    if (d.mode === 'pan') commit(d.s0 + delta, d.e0 + delta, 'pan');
    else if (d.mode === 'start') commit(d.s0 + delta, d.e0, 'start');
    else commit(d.s0, d.e0 + delta, 'end');
  };
  const end = () => {
    drag.current = null;
  };

  const onKey = (handle: 'start' | 'end') => (event: KeyboardEvent<HTMLElement>) => {
    const { startIndex: s, endIndex: e } = range;
    const dir = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 1;
    if (/^Arrow(Left|Right|Up|Down)$/.test(event.key)) {
      if (event.shiftKey) {
        if (handle === 'start') commit(s + dir, e, 'start');
        else commit(s, e + dir, 'end');
      } else commit(s + dir, e + dir, 'pan');
    } else if (event.key === 'Home') {
      if (handle === 'start') commit(0, e, 'start');
      else commit(s, s + minSpan, 'end');
    } else if (event.key === 'End') {
      if (handle === 'start') commit(e - minSpan, e, 'start');
      else commit(s, last, 'end');
    } else return;
    event.preventDefault();
  };

  const reset = () => commit(initial.startIndex, initial.endIndex, 'start');

  const left = x(range.startIndex);
  const right = x(range.endIndex);
  const pos = (v: number): CSSProperties => ({ left: r2(v) });

  return (
    <div
      {...rest}
      role="group"
      aria-label={label}
      className={cx('bek-chart', 'bek-range-brush', className)}
      style={{ ...style, inlineSize: width }}
      dir="ltr"
    >
      <div className="bek-range-brush__track" onDoubleClick={reset}>
        <div
          className="bek-range-brush__window"
          style={{ ...pos(left), inlineSize: r2(right - left) }}
          onPointerDown={begin('pan')}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        <svg
          className="bek-range-brush__overview"
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          aria-hidden="true"
          focusable="false"
        >
          <path d={overview} />
        </svg>
        <div
          className="bek-range-brush__handle bek-range-brush__handle--start bek-focus-ring"
          style={pos(left)}
          role="slider"
          tabIndex={0}
          aria-label="Start"
          aria-valuemin={0}
          aria-valuemax={range.endIndex - minSpan}
          aria-valuenow={range.startIndex}
          aria-valuetext={`From ${formatIndex(range.startIndex)}`}
          onKeyDown={onKey('start')}
          onPointerDown={begin('start')}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        <div
          className="bek-range-brush__handle bek-range-brush__handle--end bek-focus-ring"
          style={pos(right)}
          role="slider"
          tabIndex={0}
          aria-label="End"
          aria-valuemin={range.startIndex + minSpan}
          aria-valuemax={last}
          aria-valuenow={range.endIndex}
          aria-valuetext={`To ${formatIndex(range.endIndex)}`}
          onKeyDown={onKey('end')}
          onPointerDown={begin('end')}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
      </div>
    </div>
  );
}
