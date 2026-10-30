'use client';

import { useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent } from 'react';
import { Button, cx } from '@bek-ui/react';
import { scalePoint } from 'd3-scale';
import { curveMonotoneX, line } from 'd3-shape';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2, valueScale } from '../../core/geometry.js';
import { AxisBottom, AxisLeft, DataTable, GridRows } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type DrawTheLineVariant = 'draw' | 'reveal';

export interface DrawPoint {
  /** Vaqt (yil, oy) — x qadami; taxmin shu qadamlarga yopishadi. */
  x: number | string;
  y: number;
}

export interface DrawTheLineProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Butun qator — boshi ko'rsatiladi, qolgani taxmindan keyin ochiladi. */
  data: DrawPoint[];
  /** Ma'lum qismning oxirgi x qiymati (kamida 3 nuqta); taxmin zonasi shundan boshlanadi. */
  revealFrom: number | string;
  /** `draw` — o'quvchi chizadi; `reveal` — javob darhol ochiq (hisobot, statik namuna). */
  variant?: DrawTheLineVariant;
  /** Boshlang'ich taxmin — `revealFrom` dan keyingi har qadam uchun qiymat. */
  defaultGuess?: number[];
  /** Ochilganda — taxmin nuqtalari (Skip bo'lsa bo'sh massiv). */
  onReveal?: (guess: DrawPoint[]) => void;
  /** Y shkalasi — taxmindan keyin qayta masshtablanmaydi. Standart: [0, max × 1,15] (nice). */
  yDomain?: [number, number];
  /** Y o'qi bo'linmalari. */
  ticks?: number;
  formatValue?: (value: number) => string;
  formatX?: (x: number | string) => string;
  /** Ko'rsatma chip ("Draw your guess →"). */
  hint?: string;
  actualLabel?: string;
  guessLabel?: string;
  revealLabel?: string;
  skipLabel?: string;
  /** Chip'dagi taxmin yorlig'i: "Actual 52k · you: 40k". */
  youLabel?: string;
  width?: number;
  /** Plot balandligi — `scale/200`. */
  height?: number;
  /** Qisqa xulosa: "O'quvchilar soni 2019–2026, 2022 dan keyin taxmin qiling". */
  label: string;
}

const AXIS_W = 28;
const AXIS_H = 24;
const TOP = 8;
const RIGHT = 8;
const STEPS = 20; // ↑/↓ qadami — shkala oralig'ining 1/20

/**
 * Figma "4.18 Chart · Draw the line": qatorning boshi ko'rsatiladi, o'quvchi davomini taxmin
 * zonasida (`dataviz/track`) chizadi, so'ng haqiqiy chiziq ochiladi va farq chip'da yoziladi.
 * Sichqoncha/sensor bilan chizish; klaviatura: ←/→ — x, ↑/↓ — qiymat, Enter — ochish; Skip.
 */
export function DrawTheLine({
  data,
  revealFrom,
  variant = 'draw',
  defaultGuess,
  onReveal,
  yDomain,
  ticks = 3,
  formatValue = (v) => formatNumber(v, { compact: true }),
  formatX = (x) => String(x),
  hint = 'Draw your guess →',
  actualLabel = 'Actual',
  guessLabel = 'Your guess',
  revealLabel = 'Reveal',
  skipLabel = 'Skip',
  youLabel = 'you',
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  ...rest
}: DrawTheLineProps) {
  const n = data.length;
  const found = data.findIndex((d) => d.x === revealFrom);
  const known = Math.max(0, found < 0 ? Math.min(2, n - 1) : found); // oxirgi ma'lum indeks
  const [guess, setGuess] = useState<(number | null)[]>(() =>
    data.map((_, i) => (i > known ? (defaultGuess?.[i - known - 1] ?? null) : null)),
  );
  const [revealed, setRevealed] = useState(variant === 'reveal');
  const [pen, setPen] = useState<number | null>(null);

  const plotBottom = height - AXIS_H;
  const x = scalePoint<number>()
    .domain(data.map((_, i) => i))
    .range([AXIS_W, width - RIGHT]);
  const max = Math.max(0, ...data.map((d) => d.y));
  const y = valueScale(yDomain ?? [0, max * 1.15], [plotBottom, TOP], { ticks });
  const [d0, d1] = y.domain() as [number, number];
  const clampY = (v: number) => Math.max(d0, Math.min(d1, v));

  const knownValue = data[known]?.y ?? 0;
  const filled = (() => {
    let k = known;
    while (k + 1 < n && guess[k + 1] != null) k += 1;
    return k; // taxmin qilingan oxirgi uzluksiz indeks
  })();
  const complete = filled === n - 1 && n - 1 > known;

  /** i-qadamga qiymat; oraliqdagi bo'sh qadamlar chiziqli to'ldiriladi (uzluksiz taxmin). */
  const setAt = (i: number, v: number) => {
    if (revealed || i <= known || i >= n) return;
    setGuess((g) => {
      const next = [...g];
      next[i] = r2(clampY(v));
      let from = known;
      for (let j = known + 1; j < i; j += 1) if (next[j] != null) from = j;
      const fromV = from === known ? knownValue : (next[from] as number);
      for (let j = from + 1; j < i; j += 1)
        next[j] = r2(fromV + ((next[i] as number) - fromV) * ((j - from) / (i - from)));
      return next;
    });
    setPen(i);
  };

  const reveal = (skip: boolean) => {
    if (revealed) return;
    setRevealed(true);
    onReveal?.(
      skip
        ? []
        : data.flatMap((d, i) =>
            i > known && guess[i] != null ? [{ x: d.x, y: guess[i] as number }] : [],
          ),
    );
  };

  const toPlot = (e: PointerEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    const box = (svg ?? e.currentTarget).getBoundingClientRect();
    const px = ((e.clientX - box.left) / (box.width || 1)) * width;
    const py = ((e.clientY - box.top) / (box.height || 1)) * height;
    let best = known + 1;
    for (let i = known + 1; i < n; i += 1)
      if (Math.abs((x(i) ?? 0) - px) < Math.abs((x(best) ?? 0) - px)) best = i;
    setAt(best, y.invert(py));
  };
  const onPointerDown = (e: PointerEvent<SVGRectElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    toPlot(e);
  };
  const onPointerMove = (e: PointerEvent<SVGRectElement>) => {
    if (e.buttons === 1) toPlot(e);
  };

  const step = (d1 - d0) / STEPS;
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (revealed) return;
    const at = pen ?? known + 1;
    const current = guess[at] ?? guess[at - 1] ?? knownValue;
    if (e.key === 'ArrowRight') {
      const next = pen == null ? at : Math.min(n - 1, at + 1);
      setAt(next, guess[next] ?? current);
    } else if (e.key === 'ArrowLeft') setPen(Math.max(known + 1, at - 1));
    else if (e.key === 'ArrowUp') setAt(at, current + step);
    else if (e.key === 'ArrowDown') setAt(at, current - step);
    else if (e.key === 'Enter' && complete) reveal(false);
    else return;
    e.preventDefault();
  };

  const smooth = (idx: number[], val: (i: number) => number) =>
    line<number>()
      .x((i) => r2(x(i) ?? 0))
      .y((i) => r2(y(val(i))))
      .curve(curveMonotoneX)(idx) ?? '';
  const range = (a: number, b: number) =>
    Array.from({ length: Math.max(0, b - a + 1) }, (_, k) => a + k);
  const knownPath = smooth(range(0, known), (i) => data[i].y);
  const guessPath =
    filled > known
      ? smooth(range(known, filled), (i) => (i === known ? knownValue : (guess[i] as number)))
      : '';
  const actualPath = smooth(range(known, n - 1), (i) => data[i].y);
  const zoneX = x(known) ?? AXIS_W;
  const zoneW = Math.max(0, width - RIGHT - zoneX);
  const last = data[n - 1];
  const lastGuess = filled > known ? (guess[filled] as number) : null;
  const penAt = pen ?? (filled > known ? filled : null);

  const chip = revealed
    ? `${actualLabel} ${last ? formatValue(last.y) : ''}${complete && lastGuess != null ? ` · ${youLabel}: ${formatValue(lastGuess)}` : ''}`
    : filled > known
      ? null
      : hint;
  const readout =
    penAt != null && guess[penAt] != null
      ? `${formatX(data[penAt].x)}: ${formatValue(guess[penAt] as number)}`
      : hint;

  const every = Math.max(1, Math.ceil(n / 8));
  const svg = (
    <svg
      className="bek-chart__svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
    >
      <rect
        className="bek-draw-the-line__zone"
        x={r2(zoneX)}
        y={TOP}
        width={r2(zoneW)}
        height={plotBottom - TOP}
      />
      <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width - RIGHT} />
      <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
      <AxisBottom
        y={plotBottom + 6}
        labels={data
          .map((d, i) => ({ key: `${i}`, x: x(i) ?? 0, label: formatX(d.x) }))
          .filter((_, i) => i % every === 0 || i === n - 1)}
      />
      <path className="bek-draw-the-line__known" d={knownPath} />
      {guessPath && <path className="bek-draw-the-line__guess" d={guessPath} />}
      {revealed && <path className="bek-draw-the-line__actual" d={actualPath} pathLength={1} />}
      {!revealed && (
        <rect
          className="bek-draw-the-line__hit"
          x={r2(zoneX)}
          y={0}
          width={r2(zoneW)}
          height={plotBottom}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        />
      )}
      {lastGuess != null && (
        <circle
          className="bek-draw-the-line__pen"
          cx={r2(x(penAt ?? filled) ?? 0)}
          cy={r2(y(guess[penAt ?? filled] ?? lastGuess))}
          r={4}
        />
      )}
      {revealed && last && (
        <circle
          className="bek-draw-the-line__end"
          cx={r2(x(n - 1) ?? 0)}
          cy={r2(y(last.y))}
          r={4}
        />
      )}
    </svg>
  );

  const chipEl = chip ? (
    <span
      className="bek-draw-the-line__chip"
      aria-hidden="true"
      style={{
        insetInlineStart: `${((zoneX + zoneW / 2) / width) * 100}%`,
        insetBlockStart: `${((TOP + 18) / height) * 100}%`,
      }}
    >
      {chip}
    </span>
  ) : null;

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-draw-the-line',
        `bek-draw-the-line--${revealed ? 'reveal' : 'draw'}`,
        className,
      )}
    >
      {revealed ? (
        <div className="bek-draw-the-line__stage">
          {svg}
          {chipEl}
        </div>
      ) : (
        <div
          className="bek-draw-the-line__stage bek-focus-ring"
          role="slider"
          tabIndex={0}
          aria-label={guessLabel}
          aria-orientation="vertical"
          aria-valuemin={r2(d0)}
          aria-valuemax={r2(d1)}
          aria-valuenow={
            penAt != null && guess[penAt] != null ? (guess[penAt] as number) : r2(knownValue)
          }
          aria-valuetext={readout}
          onKeyDown={onKey}
        >
          {svg}
          {chipEl}
        </div>
      )}
      <div className="bek-draw-the-line__footer">
        <ChartLegend
          items={[
            { label: actualLabel, variant: 'line', color: 'var(--bek-dataviz-categorical-01)' },
            { label: guessLabel, variant: 'dashed', color: 'var(--bek-dataviz-categorical-02)' },
          ]}
        />
        {!revealed && (
          <div className="bek-draw-the-line__actions">
            <Button variant="flat-secondary" size="m" onClick={() => reveal(true)}>
              {skipLabel}
            </Button>
            <Button variant="normal" size="m" disabled={!complete} onClick={() => reveal(false)}>
              {revealLabel}
            </Button>
          </div>
        )}
      </div>
      <span className="bek-chart__sr" role="status">
        {revealed ? chip : ''}
      </span>
      <DataTable
        caption={label}
        columns={revealed ? ['X', actualLabel, guessLabel] : ['X', actualLabel]}
        rows={(revealed ? data : data.slice(0, known + 1)).map((d, i) =>
          revealed
            ? [
                formatX(d.x),
                formatValue(d.y),
                guess[i] != null ? formatValue(guess[i] as number) : '—',
              ]
            : [formatX(d.x), formatValue(d.y)],
        )}
      />
    </figure>
  );
}
