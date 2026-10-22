import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { textCellLevel } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type CalendarHeatmapVariant = 'year' | 'month';

export interface CalendarDay {
  /** ISO sana: `2026-10-12`. */
  date: string;
  value: number;
}

export interface CalendarHeatmapProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `year` — 53 × 7 (GitHub uslubi), `month` — kalendar to'ri, kataklarda sana. */
  variant?: CalendarHeatmapVariant;
  data: CalendarDay[];
  /** Yil; standart — ma'lumotdagi eng so'nggi sana yili. */
  year?: number;
  /** Month: oy (1–12); standart — eng so'nggi sana oyi. */
  month?: number;
  /**
   * Darajalar chegaralari `[0, 5, 15, 30]`: 0 → `dataviz/track`, (0, 5] → 1-daraja … > 30 → 4-daraja.
   * Standart — eng katta qiymatning 0 · ¼ · ½ · ¾ qismi.
   */
  bins?: number[];
  /** O'lchov birligi (tooltip va jadval): "payments". */
  unit?: string;
  /** Oy nomlari (12 ta); standart — Jan…Dec. */
  monthLabels?: string[];
  /** Hafta kunlari (7 ta, dushanbadan); standart — Mon…Sun. */
  weekdayLabels?: string[];
  /** Year to'ri eni; kichik ekranda to'r gorizontal aylanadi, hafta kunlari joyida qoladi. */
  width?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY = 86_400_000;
const GAP = 2; // scale/2 — Year kataklari orasi
const LABEL_W = 32; // hafta kunlari ustuni
const HEAD = 20; // oy / hafta kuni yozuvlari qatori
const WEEKS = 53;
const MONTH_GAP = 4; // scale/4 — Month kataklari orasi
const MONTH_H = 200; // scale/200 — Month to'ri balandligi (shakl buzilmaydi)
const YEAR_LEVELS = [200, 300, 500, 700] as const; // Figma: rangsiz matn, 500 ham bor
const ZERO = 'track';

const parse = (iso: string): number => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1);
};
/** Dushanbadan boshlanadigan hafta kuni: 0 = Mon … 6 = Sun (uz-UZ). */
const weekday = (t: number) => (new Date(t).getUTCDay() + 6) % 7;

function levelIndex(value: number, bins: number[]): number {
  if (!(value > bins[0])) return 0;
  let k = 1;
  for (let i = 1; i < bins.length && k < 4; i++) if (value > bins[i]) k = i + 1;
  return Math.min(k, 4);
}

/** Matnli katak (Month) darajasi — CMP-07: faqat 200 · 300 · 600 · 700. */
const textLevel = (k: number) => textCellLevel([0, 0.2, 0.5, 0.8][k - 1] ?? 0);

/**
 * Figma "4.18 Chart · Calendar heatmap": kunlik faollik yil (Year) yoki oy (Month) bo'yicha.
 * Rang — `dataviz/sequential` darajasi, nol — `dataviz/track`; Less → More shkalasi doim ko'rinadi.
 */
export function CalendarHeatmap({
  variant = 'year',
  data,
  year,
  month,
  bins,
  unit,
  monthLabels = MONTHS,
  weekdayLabels = WEEKDAYS,
  width = DEFAULT_WIDTH,
  formatValue = (v) => formatNumber(v),
  label,
  className,
  ...rest
}: CalendarHeatmapProps) {
  const values = new Map<number, number>();
  for (const d of data) values.set(parse(d.date), d.value);
  const latest = data.length ? Math.max(...values.keys()) : Date.UTC(2026, 0, 1);
  const y = year ?? new Date(latest).getUTCFullYear();
  const max = Math.max(0, ...data.map((d) => d.value));
  const thresholds = bins ?? [0, max / 4, max / 2, (max * 3) / 4];
  const describe = (t: number, v: number | undefined) => {
    const dt = new Date(t);
    const amount = v == null ? '—' : `${formatValue(v)}${unit ? ` ${unit}` : ''}`;
    return `${dt.getUTCDate()} ${monthLabels[dt.getUTCMonth()]}, ${amount}`;
  };

  const legendLevels =
    variant === 'month' ? [1, 2, 3, 4].map((k) => `${textLevel(k)}`) : YEAR_LEVELS.map(String);
  const legend = (
    <div className="bek-calendar-heatmap__scale" aria-hidden="true">
      <span>Less</span>
      {[ZERO, ...legendLevels].map((l) => (
        <span
          key={l}
          className={`bek-calendar-heatmap__swatch bek-calendar-heatmap__swatch--${l}`}
        />
      ))}
      <span>More</span>
    </div>
  );

  if (variant === 'month') {
    const m = (month ?? new Date(latest).getUTCMonth() + 1) - 1;
    const start = Date.UTC(y, m, 1);
    const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const offset = weekday(start);
    const colStep = (width + MONTH_GAP) / 7;
    const cellW = colStep - MONTH_GAP;
    const rowStep = (MONTH_H - HEAD) / 6;
    const cellH = rowStep - MONTH_GAP;
    const cells = Array.from({ length: days }, (_, i) => {
      const t = start + i * DAY;
      const slot = offset + i;
      const v = values.get(t);
      const k = levelIndex(v ?? 0, thresholds);
      return {
        t,
        v,
        day: i + 1,
        x: (slot % 7) * colStep,
        y: HEAD + Math.floor(slot / 7) * rowStep,
        level: k === 0 ? ZERO : `${textLevel(k)}`,
      };
    });
    return (
      <figure
        {...rest}
        className={cx(
          'bek-chart',
          'bek-calendar-heatmap',
          'bek-calendar-heatmap--month',
          className,
        )}
      >
        <ChartSvg width={width} height={MONTH_H} label={label}>
          <g aria-hidden="true">
            {weekdayLabels.map((w, i) => (
              <text key={w} className="bek-chart__tick" x={r2(i * colStep)} y={0} dy="0.71em">
                {w}
              </text>
            ))}
          </g>
          {cells.map((c) => (
            <g
              key={c.t}
              className={cx('bek-calendar-heatmap__day', `bek-calendar-heatmap__day--${c.level}`)}
            >
              <rect
                className="bek-calendar-heatmap__cell"
                x={r2(c.x)}
                y={r2(c.y)}
                width={r2(cellW)}
                height={r2(cellH)}
              />
              <text
                className="bek-calendar-heatmap__date"
                x={r2(c.x + 6)}
                y={r2(c.y + 4)}
                dy="0.71em"
              >
                {c.day}
              </text>
              <title>{describe(c.t, c.v)}</title>
            </g>
          ))}
        </ChartSvg>
        {legend}
        <DataTable
          caption={label}
          columns={['Date', 'Value']}
          rows={cells.map((c) => [
            describe(c.t, c.v).split(',')[0],
            c.v == null ? '—' : formatValue(c.v),
          ])}
        />
      </figure>
    );
  }

  const start = Date.UTC(y, 0, 1);
  const total = Math.round((Date.UTC(y + 1, 0, 1) - start) / DAY);
  const offset = weekday(start);
  const step = Math.max(8, Math.min(12, (width - LABEL_W) / WEEKS));
  const cell = step - GAP;
  const gridW = WEEKS * step;
  const gridH = HEAD + 7 * step;
  const cells = Array.from({ length: total }, (_, i) => {
    const t = start + i * DAY;
    const v = values.get(t);
    const k = levelIndex(v ?? 0, thresholds);
    return {
      t,
      v,
      x: Math.floor((offset + i) / 7) * step,
      y: HEAD + ((offset + i) % 7) * step,
      level: k === 0 ? ZERO : `${YEAR_LEVELS[k - 1]}`,
    };
  });
  const monthStarts = MONTHS.map((_, mi) => {
    const t = Date.UTC(y, mi, 1);
    return { key: mi, x: Math.floor((offset + Math.round((t - start) / DAY)) / 7) * step };
  });

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-calendar-heatmap', 'bek-calendar-heatmap--year', className)}
    >
      <div className="bek-calendar-heatmap__body">
        <svg
          className="bek-calendar-heatmap__weekdays"
          width={LABEL_W}
          height={gridH}
          aria-hidden="true"
        >
          {[0, 2, 4].map((d) => (
            <text
              key={d}
              className="bek-chart__tick"
              x={0}
              y={r2(HEAD + d * step + cell / 2)}
              dy="0.32em"
            >
              {weekdayLabels[d]}
            </text>
          ))}
        </svg>
        <div className="bek-calendar-heatmap__scroll">
          <ChartSvg width={gridW} height={gridH} label={label}>
            <g aria-hidden="true">
              {monthStarts.map((ms) => (
                <text key={ms.key} className="bek-chart__tick" x={r2(ms.x)} y={0} dy="0.71em">
                  {monthLabels[ms.key]}
                </text>
              ))}
            </g>
            {cells.map((c) => (
              <rect
                key={c.t}
                className={`bek-calendar-heatmap__cell bek-calendar-heatmap__day--${c.level}`}
                x={r2(c.x)}
                y={r2(c.y)}
                width={r2(cell)}
                height={r2(cell)}
              >
                <title>{describe(c.t, c.v)}</title>
              </rect>
            ))}
          </ChartSvg>
        </div>
      </div>
      {legend}
      <DataTable
        caption={label}
        columns={['Date', 'Value']}
        rows={cells
          .filter((c) => c.v != null)
          .map((c) => [describe(c.t, c.v).split(',')[0], formatValue(c.v as number)])}
      />
    </figure>
  );
}
