'use client';

import {
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '@bek-ui/react';
import { seriesColor } from '../../core/color.js';
import { formatPercent } from '../../core/format.js';
import { r2 } from '../../core/geometry.js';
import { DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';
import { ChartTooltip } from '../chart-tooltip/ChartTooltip.js';
import { DAY_MS, GANTT_MONTHS, dayTime, formatDay, monthStart, monthTicks } from './dates.js';
import type { GanttDate } from './dates.js';

export type { GanttDate } from './dates.js';

export type GanttVariant = 'default' | 'progress';

export interface GanttTask {
  /** Bog'liqliklar uchun kalit (`dependsOn`); berilmasa `name`. */
  id?: string;
  name: string;
  /** Jamoa — rang (`dataviz/categorical`) va legend shu bo'yicha. */
  team?: string;
  start: GanttDate;
  /** Tugash kuni (shu kun ham ichida). */
  end: GanttDate;
  /** Bajarilgan ulush, 0…1 (`0.7` → 70%). Progress variantida chiziladi. */
  progress?: number;
  /** Oldin tugashi kerak bo'lgan vazifalar (`id` yoki `name`) — finish → start chizig'i. */
  dependsOn?: string[];
}

export interface GanttMilestone {
  name: string;
  date: GanttDate;
  /** Qaysi vazifa qatorida (romb); berilmasa — oxirgi qator. */
  task?: string;
}

export interface GanttTeam {
  name: string;
  /** Standart — `seriesColor(i)`. */
  color?: string;
}

export interface GanttLabels {
  task: string;
  team: string;
  start: string;
  end: string;
  progress: string;
  today: string;
  milestones: string;
  /** Legend: "Today · milestone". */
  todayLegend: string;
  dependsOn: string;
  overdue: string;
  /** 12 ta qisqa oy nomi (`Jan`…`Dec`); o'zbekcha: `Yan`, `Fev`, … */
  months: readonly string[];
}

export interface GanttProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 3–20 vazifa, boshlanish sanasi bo'yicha yoki faza/jamoa bo'yicha guruhlangan tartibda. */
  tasks: GanttTask[];
  milestones?: GanttMilestone[];
  /** Bugun — punktir `dataviz/target` chizig'i va chip. Jadvalni o'qish uchun doim bering. */
  today?: GanttDate;
  /** `default` — reja, `progress` — reja 0.28 shaffoflikda, bajarilgani to'liq rangda, % bar tashqarisida. */
  variant?: GanttVariant;
  /** Jamoalar tartibi va rangi (legend). Berilmasa — vazifalardagi tartib bilan. */
  teams?: GanttTeam[];
  /** Legend ko'rsatish. Standart: true. */
  legend?: boolean;
  /** Matnlar (uz/ru uchun almashtiring). */
  labels?: Partial<GanttLabels>;
  /** Sana formati (tooltip, jadval, chip). Standart: `4 Dec`. */
  formatDate?: (time: number) => string;
  /** Vazifa bosilganda yoki Enter / Space (vazifa paneli). */
  onTaskClick?: (task: GanttTask, index: number) => void;
  /** Ekran o'quvchi uchun qisqa xulosa: "Reliz rejasi: 6 vazifa, 4 dekabr holatiga". */
  label: string;
}

const DEFAULT_LABELS: GanttLabels = {
  task: 'Task',
  team: 'Team',
  start: 'Start',
  end: 'End',
  progress: 'Progress',
  today: 'Today',
  milestones: 'Milestones',
  todayLegend: 'Today · milestone',
  dependsOn: 'Depends on',
  overdue: 'overdue',
  months: GANTT_MONTHS,
};

/** Qator qadami (bar 16 + oraliq 10) va bar balandligi — Figma 4.18 Gantt. */
const ROW_PITCH = 26;
const BAR_H = 16;

interface Placed {
  task: GanttTask;
  key: string;
  start: number;
  end: number;
  /** Plot ulushi, %. */
  x: number;
  w: number;
  color: string;
  progress: number | null;
  overdue: boolean;
}

const pct = (v: number) => `${r2(v)}%`;

/**
 * Figma "4.18 Chart · Gantt": har vazifa — bitta qator, bar = boshlanish → tugash, rang = jamoa;
 * romb — milestone, punktir chiziq — bugun. HTML/CSS joylashuv (foizlarda): RTL'da vaqt o'qi
 * o'ngdan chapga avtomatik. Barlar — `listbox` variantlari: Tab bilan kiriladi, ↑ / ↓ / Home / End.
 */
export function Gantt({
  tasks,
  milestones = [],
  today,
  variant = 'default',
  teams,
  legend = true,
  labels: labelsProp,
  formatDate,
  onTaskClick,
  label,
  className,
  ...rest
}: GanttProps) {
  const t = { ...DEFAULT_LABELS, ...labelsProp };
  const fmt = formatDate ?? ((time: number) => formatDay(time, t.months));
  const [focus, setFocus] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const teamList: GanttTeam[] =
    teams ??
    [...new Set(tasks.map((k) => k.team).filter((x): x is string => !!x))].map((name) => ({
      name,
    }));
  const colorOf = (team?: string) => {
    const i = teamList.findIndex((tm) => tm.name === team);
    return i < 0 ? seriesColor(0) : (teamList[i].color ?? seriesColor(i));
  };

  const todayT = today != null ? dayTime(today) : Number.NaN;
  const hasToday = Number.isFinite(todayT);
  const times = [
    ...tasks.flatMap((k) => [dayTime(k.start), dayTime(k.end) + DAY_MS]),
    ...milestones.map((m) => dayTime(m.date)),
    ...(hasToday ? [todayT] : []),
  ].filter(Number.isFinite);
  const lo = times.length ? monthStart(Math.min(...times)) : 0;
  const hi = times.length ? monthStart(Math.max(...times), 1) : DAY_MS;
  const span = Math.max(DAY_MS, hi - lo);
  const xOf = (time: number) => ((time - lo) / span) * 100;

  const placed: Placed[] = tasks.map((task, i) => {
    const s = dayTime(task.start);
    const e = Math.max(s, dayTime(task.end)) + DAY_MS;
    const progress =
      task.progress == null || !Number.isFinite(task.progress)
        ? null
        : Math.max(0, Math.min(1, task.progress));
    return {
      task,
      key: task.id ?? task.name ?? String(i),
      start: s,
      end: e,
      x: xOf(s),
      w: Math.max(0, xOf(e) - xOf(s)),
      color: colorOf(task.team),
      progress,
      overdue: hasToday && e <= todayT && progress != null && progress < 1,
    };
  });
  const indexOf = new Map(placed.map((p, i) => [p.key, i]));
  const rowsH = Math.max(1, tasks.length) * ROW_PITCH - (ROW_PITCH - BAR_H);
  const ticks = monthTicks(lo, hi);
  const showProgress = variant === 'progress';

  const dateRange = (p: Placed) => `${fmt(p.start)} – ${fmt(p.end - DAY_MS)}`;
  const depNames = (p: Placed) =>
    (p.task.dependsOn ?? [])
      .map((d) => placed[indexOf.get(d) ?? -1]?.task.name)
      .filter((n): n is string => !!n);
  const optionLabel = (p: Placed) =>
    [
      p.task.name,
      p.task.team,
      dateRange(p),
      p.progress != null ? formatPercent(p.progress * 100, { decimals: 0 }) : null,
      p.overdue ? t.overdue : null,
      depNames(p).length ? `${t.dependsOn}: ${depNames(p).join(', ')}` : null,
    ]
      .filter(Boolean)
      .join(' · ');

  // Bog'liqliklar: oldingi vazifa oxiridan keyingisi boshigacha zinapoya chiziq (0…1000 × px).
  const links = placed.flatMap((p, j) =>
    (p.task.dependsOn ?? []).flatMap((dep) => {
      const i = indexOf.get(dep);
      if (i == null || i === j) return [];
      const a = placed[i];
      const x1 = (a.x + a.w) * 10;
      const x2 = p.x * 10;
      const y1 = i * ROW_PITCH + BAR_H / 2;
      const y2 = j * ROW_PITCH + BAR_H / 2;
      const d =
        x2 >= x1
          ? `M${r2(x1)},${y1}H${r2((x1 + x2) / 2)}V${y2}H${r2(x2)}`
          : // Ustma-ust tushgan vazifa: oldingi bar oxiridan keyingisining chetiga tik chiziq.
            `M${r2(Math.min(x1, (p.x + p.w) * 10))},${i < j ? y1 + BAR_H / 2 : y1 - BAR_H / 2}V${i < j ? y2 - BAR_H / 2 : y2 + BAR_H / 2}`;
      return [{ key: `${a.key}>${p.key}`, d }];
    }),
  );

  const milestoneRow = (m: GanttMilestone) => {
    const i = m.task != null ? indexOf.get(m.task) : undefined;
    return i ?? Math.max(0, tasks.length - 1);
  };

  // Progress %: bar oxiri yonida milestone bo'lsa, yozuv rombdan keyin (Figma: QA & launch · 0%).
  const afterMilestone = (p: Placed, row: number): number | null => {
    const end = p.x + p.w;
    const near = milestones
      .filter((m) => milestoneRow(m) === row)
      .map((m) => xOf(dayTime(m.date)))
      .filter((x) => x >= end - 1 && x - end < 6);
    return near.length ? Math.max(...near) : null;
  };

  const move = (next: number) => {
    const n = Math.max(0, Math.min(tasks.length - 1, next));
    setFocus(n);
    setActive(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!tasks.length) return;
    if (e.key === 'ArrowDown') move(focus + 1);
    else if (e.key === 'ArrowUp') move(focus - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(tasks.length - 1);
    else if ((e.key === 'Enter' || e.key === ' ') && onTaskClick) onTaskClick(tasks[focus], focus);
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const tip = active != null ? placed[active] : null;
  const tipEnd = tip ? tip.x + tip.w / 2 > 60 : false;

  return (
    <figure {...rest} className={cx('bek-chart', 'bek-gantt', `bek-gantt--${variant}`, className)}>
      <div className="bek-gantt__plot">
        <div className="bek-gantt__overlay" aria-hidden="true">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="bek-gantt__gridline"
              style={{ insetInlineStart: pct(xOf(tick)) }}
            />
          ))}
          {hasToday && (
            <svg
              className="bek-gantt__today"
              style={{ insetInlineStart: pct(xOf(todayT)) }}
              width={1}
              height="100%"
              focusable="false"
            >
              <line x1={0.5} x2={0.5} y1={0} y2="100%" strokeDasharray="4 3" />
            </svg>
          )}
        </div>
        <div className="bek-gantt__months" aria-hidden="true">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="bek-gantt__month"
              style={{ insetInlineStart: pct(xOf(tick)) }}
            >
              {t.months[new Date(tick).getUTCMonth()]}
            </span>
          ))}
        </div>
        {links.length > 0 && (
          <svg
            className="bek-gantt__links"
            viewBox={`0 0 1000 ${rowsH}`}
            preserveAspectRatio="none"
            style={{ blockSize: rowsH }}
            aria-hidden="true"
            focusable="false"
          >
            {links.map((l) => (
              <path key={l.key} className="bek-gantt__link" d={l.d} />
            ))}
          </svg>
        )}
        <div
          className="bek-gantt__rows"
          role="listbox"
          aria-label={label}
          aria-orientation="vertical"
          onKeyDown={onKey}
        >
          {placed.map((p, i) => {
            const done = showProgress ? (p.progress ?? 0) : 1;
            const style = {
              insetInlineStart: pct(p.x),
              inlineSize: pct(p.w),
              '--bek-gantt-color': p.color,
            } as CSSProperties;
            return (
              <div key={p.key} className="bek-gantt__row">
                <span className="bek-gantt__task" aria-hidden="true">
                  {p.task.name}
                </span>
                <div className="bek-gantt__track">
                  <div
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={i === focus}
                    aria-label={optionLabel(p)}
                    tabIndex={i === focus ? 0 : -1}
                    className={cx(
                      'bek-gantt__bar',
                      'bek-focus-ring',
                      p.overdue && 'bek-gantt__bar--overdue',
                      onTaskClick && 'bek-gantt__bar--clickable',
                    )}
                    style={style}
                    onFocus={() => {
                      setFocus(i);
                      setActive(i);
                    }}
                    onBlur={() => setActive(null)}
                    onPointerEnter={() => setActive(i)}
                    onPointerLeave={() => setActive(null)}
                    onClick={onTaskClick ? () => onTaskClick(p.task, i) : undefined}
                  >
                    {showProgress && <span className="bek-gantt__planned" />}
                    {done > 0 && (
                      <span className="bek-gantt__done" style={{ inlineSize: pct(done * 100) }} />
                    )}
                  </div>
                  {showProgress && (
                    <span
                      className={cx(
                        'bek-gantt__percent',
                        afterMilestone(p, i) != null && 'bek-gantt__percent--after-milestone',
                      )}
                      style={{ insetInlineStart: pct(afterMilestone(p, i) ?? p.x + p.w) }}
                      aria-hidden="true"
                    >
                      {formatPercent((p.progress ?? 0) * 100, { decimals: 0 })}
                    </span>
                  )}
                  {milestones
                    .filter((m) => milestoneRow(m) === i)
                    .map((m) => (
                      <span
                        key={m.name}
                        className="bek-gantt__milestone"
                        style={{ insetInlineStart: pct(xOf(dayTime(m.date))) }}
                        aria-hidden="true"
                        title={`${m.name} · ${fmt(dayTime(m.date))}`}
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
        {hasToday && (
          <div className="bek-gantt__chip-row" aria-hidden="true">
            <span className="bek-gantt__chip" style={{ insetInlineStart: pct(xOf(todayT)) }}>
              {`${t.today} · ${fmt(todayT)}`}
            </span>
          </div>
        )}
        {tip && (
          <ChartTooltip
            aria-hidden="true"
            className={cx('bek-gantt__tooltip', tipEnd && 'bek-gantt__tooltip--end')}
            style={
              {
                '--bek-gantt-row': active,
                // Trek ulushi (0…1): CSS uni label ustunidan keyin hisoblaydi.
                '--bek-gantt-x': r2(tipEnd ? 1 - (tip.x + tip.w) / 100 : tip.x / 100),
              } as CSSProperties
            }
            title={tip.task.name}
            rows={[
              {
                label: tip.task.team ?? t.task,
                value: dateRange(tip),
                color: tip.color,
              },
              ...(tip.progress != null
                ? [
                    {
                      label: t.progress,
                      value: formatPercent(tip.progress * 100, { decimals: 0 }),
                      color: tip.color,
                    },
                  ]
                : []),
              ...(depNames(tip).length
                ? [{ label: t.dependsOn, value: depNames(tip).join(', '), dashed: true }]
                : []),
            ]}
          />
        )}
      </div>
      {legend && (teamList.length > 0 || hasToday || milestones.length > 0) && (
        <ChartLegend
          items={[
            ...teamList.map((tm, i) => ({
              label: tm.name,
              color: tm.color ?? seriesColor(i),
              variant: 'square' as const,
            })),
            ...(hasToday || milestones.length
              ? [{ label: t.todayLegend, variant: 'dashed' as const }]
              : []),
          ]}
        />
      )}
      <DataTable
        caption={label}
        columns={[t.task, t.team, t.start, t.end, t.progress]}
        rows={placed.map((p) => [
          p.task.name,
          p.task.team ?? '—',
          fmt(p.start),
          fmt(p.end - DAY_MS),
          p.progress != null ? formatPercent(p.progress * 100, { decimals: 0 }) : '—',
        ])}
      />
      {(hasToday || milestones.length > 0) && (
        <p className="bek-chart__sr">
          {[
            hasToday ? `${t.today}: ${fmt(todayT)}.` : '',
            milestones.length
              ? `${t.milestones}: ${milestones.map((m) => `${m.name} — ${fmt(dayTime(m.date))}`).join(', ')}.`
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        </p>
      )}
    </figure>
  );
}
