'use client';

import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { Button, cx } from '@bek-ui/react';
import { scaleLinear, scalePoint } from 'd3-scale';
import { curveMonotoneX, line } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2, valueScale } from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';
import { PauseGlyph, PlayGlyph, ReplayGlyph } from './glyphs.js';

export type RaceChartVariant = 'bar' | 'line';

export interface RaceValue {
  name: string;
  value: number;
}

export interface RaceFrame {
  /** Davr (yil, oy) — burchakda katta yoziladi. */
  period: string | number;
  values: RaceValue[];
}

export interface RaceChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Har kadr — bitta davr. 5–12 ta obyekt; rang obyekt birinchi uchragan tartibda, butun poyga davomida. */
  frames: RaceFrame[];
  /** `bar` — ustunlar qayta saralanadi; `line` — chiziqlar joriy davrgacha o'sadi. */
  variant?: RaceChartVariant;
  /** Avtomatik boshlash. Standart `false` — dashboard'da o'zi o'ynamaydi (Figma qoidasi). */
  autoplay?: boolean;
  /** Joriy kadr (boshqarilsa). */
  frame?: number;
  /** Boshqarilmaydigan rejimda boshlang'ich kadr. */
  defaultFrame?: number;
  onFrameChange?: (frame: number) => void;
  /** Bir kadr davomiyligi, ms. */
  interval?: number;
  /** Ko'rinadigan obyektlar soni: Bar — 12 gacha, Line — 5 gacha (standart). */
  top?: number;
  /** Obyekt → rang (standart `seriesColor(i)`). */
  colors?: Record<string, string>;
  formatValue?: (value: number) => string;
  /** Play tugmasi nomi (ekran o'quvchi). */
  playLabel?: string;
  /** Progress slider nomi. */
  progressLabel?: string;
  width?: number;
  /** Plot balandligi — `scale/200`; boshqaruv qatori alohida. */
  height?: number;
  /** Qisqa xulosa: "UX/UI 2019–2026 yillarda yetakchi". */
  label: string;
}

const NAME_W = 88; // Figma: ustun x = 88
const VALUE_W = 72; // qiymat yozuvi + davr uchun joy
const ROW = 25; // qator qadami
const BAR_H = 18; // ustun qalinligi
const LABEL_GAP = 6; // qiymat ustundan keyin
const AXIS_W = 28; // Line: y yozuvlari
const AXIS_H = 24; // Line: x yozuvlari
const END_W = 80; // Line: oxirgi yorliqlar ustuni
const LABEL_STEP = 16; // yorliqlar ustma-ust tushmasligi uchun
const DEFAULT_INTERVAL = 1200;

/**
 * Figma "4.18 Chart · Race": vaqt bo'yicha reyting animatsiyasi. Play / Pause, progress'ni sudrash,
 * ←/→ — bir kadr, Home/End — chetga. `prefers-reduced-motion` da tween yo'q — kadrlar qadam bilan.
 */
export function RaceChart({
  frames,
  variant = 'bar',
  autoplay = false,
  frame,
  defaultFrame = 0,
  onFrameChange,
  interval = DEFAULT_INTERVAL,
  top,
  colors,
  formatValue = (v) => formatNumber(v, { compact: true }),
  playLabel = 'Play',
  progressLabel = 'Period',
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  ...rest
}: RaceChartProps) {
  const last = Math.max(0, frames.length - 1);
  const clamp = (i: number) => Math.max(0, Math.min(last, Math.round(i)));
  const [inner, setInner] = useState(() => clamp(defaultFrame));
  const [playing, setPlaying] = useState(autoplay && frames.length > 1);
  const index = clamp(frame ?? inner);

  const go = (i: number) => {
    const next = clamp(i);
    if (frame === undefined) setInner(next);
    onFrameChange?.(next);
  };
  const state = useRef({ index, go });
  state.current = { index, go };

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      const next = state.current.index + 1;
      if (next > last) {
        setPlaying(false);
        return;
      }
      state.current.go(next);
      if (next >= last) setPlaying(false);
    }, interval);
    return () => clearInterval(id);
  }, [playing, interval, last]);

  // Obyektlar — birinchi uchragan tartibda; rang butun poyga davomida o'zgarmaydi.
  const names: string[] = [];
  for (const f of frames) for (const v of f.values) if (!names.includes(v.name)) names.push(v.name);
  const colorOf = (name: string) => colors?.[name] ?? seriesColor(names.indexOf(name));
  const current = frames[index];
  const valueOf = (f: RaceFrame | undefined, name: string) =>
    f?.values.find((v) => v.name === name)?.value;
  const order = [...(current?.values ?? [])].sort((a, b) => b.value - a.value);
  const leader = order[0];

  const togglePlay = () => {
    if (playing) setPlaying(false);
    else {
      if (index >= last) go(0);
      setPlaying(frames.length > 1);
    }
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowUp: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    setPlaying(false);
    go(map[e.key]);
  };
  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    if (e.type === 'pointermove' && e.buttons !== 1) return;
    if (e.type === 'pointerdown') e.currentTarget.setPointerCapture?.(e.pointerId);
    const box = e.currentTarget.getBoundingClientRect();
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const t = Math.max(0, Math.min(1, (e.clientX - box.left) / (box.width || 1)));
    setPlaying(false);
    go((rtl ? 1 - t : t) * last);
  };

  const glyph = playing ? (
    <PauseGlyph />
  ) : index >= last && last > 0 ? (
    <ReplayGlyph />
  ) : (
    <PlayGlyph />
  );
  const pct = last ? (index / last) * 100 : 100;

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-race-chart',
        `bek-race-chart--${variant}`,
        playing && 'bek-race-chart--playing',
        className,
      )}
    >
      {variant === 'line' ? (
        <RaceLines
          frames={frames}
          index={index}
          names={names}
          top={top ?? 5}
          colorOf={colorOf}
          valueOf={valueOf}
          formatValue={formatValue}
          width={width}
          height={height}
          label={label}
        />
      ) : (
        <ChartSvg width={width} height={height} label={label}>
          <RaceBars
            order={order}
            names={names}
            top={top ?? 12}
            colorOf={colorOf}
            formatValue={formatValue}
            width={width}
            height={height}
          />
          <text
            className="bek-race-chart__period"
            x={width - 4}
            y={height - 6}
            textAnchor="end"
            aria-hidden="true"
          >
            {current?.period ?? ''}
          </text>
        </ChartSvg>
      )}
      <div className="bek-race-chart__controls">
        <Button
          variant="normal"
          size="m"
          iconOnly
          pressed={playing}
          startIcon={glyph}
          onClick={togglePlay}
          disabled={frames.length < 2}
        >
          {playLabel}
        </Button>
        <span className="bek-race-chart__bound">{frames[0]?.period ?? ''}</span>
        <div
          className="bek-race-chart__progress bek-focus-ring"
          role="slider"
          tabIndex={0}
          aria-label={progressLabel}
          aria-valuemin={0}
          aria-valuemax={last}
          aria-valuenow={index}
          aria-valuetext={String(current?.period ?? '')}
          onKeyDown={onKey}
          onPointerDown={scrub}
          onPointerMove={scrub}
        >
          <span className="bek-race-chart__track">
            <span className="bek-race-chart__played" style={{ inlineSize: `${r2(pct)}%` }} />
          </span>
        </div>
        <span className="bek-race-chart__bound">{frames[last]?.period ?? ''}</span>
      </div>
      <span className="bek-chart__sr" role="status">
        {leader ? `${current.period}: ${leader.name} ${formatValue(leader.value)}` : ''}
      </span>
      <DataTable
        caption={label}
        columns={['Period', ...names]}
        rows={frames.map((f) => [
          String(f.period),
          ...names.map((n) => {
            const v = valueOf(f, n);
            return v == null ? '—' : formatValue(v);
          }),
        ])}
      />
    </figure>
  );
}

interface RaceBarsProps {
  order: RaceValue[];
  names: string[];
  top: number;
  colorOf: (name: string) => string;
  formatValue: (v: number) => string;
  width: number;
  height: number;
}

/** Bar: har obyekt o'z qatorida; reyting o'zgarsa qator `transform` bilan suriladi (tween). */
function RaceBars({ order, names, top, colorOf, formatValue, width, height }: RaceBarsProps) {
  const shown = Math.max(1, Math.min(top, 12, names.length));
  const step = Math.min(ROW, (height - 8) / shown);
  const barH = Math.min(BAR_H, Math.max(4, step - 7));
  const max = Math.max(0, ...order.map((v) => v.value)) || 1;
  const x = scaleLinear()
    .domain([0, max])
    .range([0, Math.max(0, width - NAME_W - VALUE_W)]);
  const rank = new Map(order.map((v, i) => [v.name, i] as const));
  return (
    <g className="bek-race-chart__bars">
      {names.map((name) => {
        const r = rank.get(name);
        const visible = r != null && r < shown;
        const v = r != null ? order[r].value : 0;
        const w = r2(x(Math.max(0, v)));
        return (
          <g
            key={name}
            className={cx('bek-race-chart__row', !visible && 'bek-race-chart__row--out')}
            style={{ transform: `translateY(${r2(4 + (visible ? r : shown) * step)}px)` }}
            aria-hidden={!visible || undefined}
          >
            <text className="bek-race-chart__name" x={0} y={r2(barH / 2)} dy="0.32em">
              {name}
            </text>
            <rect
              className="bek-race-chart__bar"
              x={NAME_W}
              y={0}
              width={w}
              height={barH}
              style={{ width: w, fill: colorOf(name) }}
            >
              <title>{`${name}: ${formatValue(v)}`}</title>
            </rect>
            <text
              className="bek-race-chart__value"
              x={0}
              y={r2(barH / 2)}
              dy="0.32em"
              style={{ transform: `translateX(${r2(NAME_W + w + LABEL_GAP)}px)` }}
            >
              {formatValue(v)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

interface RaceLinesProps {
  frames: RaceFrame[];
  index: number;
  names: string[];
  top: number;
  colorOf: (name: string) => string;
  valueOf: (f: RaceFrame | undefined, name: string) => number | undefined;
  formatValue: (v: number) => string;
  width: number;
  height: number;
  label: string;
}

/** Line: chiziqlar joriy davrgacha o'sadi, oxirida nuqta va "Nom qiymat" yorlig'i. */
function RaceLines({
  frames,
  index,
  names,
  top,
  colorOf,
  valueOf,
  formatValue,
  width,
  height,
  label,
}: RaceLinesProps) {
  const plotBottom = height - AXIS_H;
  const x = scalePoint<number>()
    .domain(frames.map((_, i) => i))
    .range([AXIS_W, width - END_W]);
  const all = frames.flatMap((f) => f.values.map((v) => v.value));
  const y = valueScale(all, [plotBottom, 8], { ticks: 2 });
  const current = frames[index];
  const leaders = [...(current?.values ?? [])]
    .sort((a, b) => b.value - a.value)
    .slice(0, Math.max(1, top))
    .map((v) => v.name);
  const path = (name: string) =>
    line<number>()
      .defined((i) => valueOf(frames[i], name) != null)
      .x((i) => r2(x(i) ?? 0))
      .y((i) => r2(y(valueOf(frames[i], name) ?? 0)))
      .curve(curveMonotoneX)(frames.slice(0, index + 1).map((_, i) => i)) ?? '';

  // Oxirgi yorliqlar: y bo'yicha saralab, ustma-ust tushmasin.
  const ends = leaders
    .map((name) => ({ name, value: valueOf(current, name) ?? 0 }))
    .map((e) => ({ ...e, cy: y(e.value) }))
    .sort((a, b) => a.cy - b.cy);
  let prev = -Infinity;
  const labelled = ends.map((e) => {
    const ly = Math.max(e.cy, prev + LABEL_STEP);
    prev = ly;
    return { ...e, ly };
  });
  const nowX = x(index) ?? AXIS_W;
  const every = Math.max(1, Math.ceil(frames.length / 8));

  return (
    <ChartSvg width={width} height={height} label={label}>
      <GridRows scale={y} ticks={2} x1={AXIS_W} x2={width - END_W} />
      <AxisLeft scale={y} x={AXIS_W} ticks={2} format={formatValue} />
      <AxisBottom
        y={plotBottom + 6}
        labels={frames
          .map((f, i) => ({ key: `${i}`, x: x(i) ?? 0, label: String(f.period) }))
          .filter((_, i) => i % every === 0 || i === frames.length - 1)}
      />
      <line
        className="bek-race-chart__now"
        x1={r2(nowX)}
        x2={r2(nowX)}
        y1={8}
        y2={plotBottom}
        aria-hidden="true"
      />
      {leaders.map((name) => (
        <path
          key={name}
          className="bek-race-chart__line"
          d={path(name)}
          style={{ stroke: colorOf(name) }}
        />
      ))}
      {labelled.map((e) => (
        <g key={e.name} className="bek-race-chart__end">
          <circle
            className="bek-race-chart__dot"
            cx={r2(nowX)}
            cy={r2(e.cy)}
            r={4}
            style={{ fill: colorOf(e.name) }}
          />
          <text className="bek-race-chart__end-label" x={r2(nowX + 9)} y={r2(e.ly)} dy="0.32em">
            {`${e.name} ${formatValue(e.value)}`}
          </text>
        </g>
      ))}
    </ChartSvg>
  );
}
