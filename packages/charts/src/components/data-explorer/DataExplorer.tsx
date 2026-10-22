'use client';

import { useState, type ReactNode, type TableHTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { formatNumber, formatPercent } from '../../core/format.js';
import { Delta } from '../delta/Delta.js';
import { Sparkline, sparklineTrend } from '../sparkline/Sparkline.js';

export type DataExplorerVariant = 'default' | 'compact';
/** Ixtiyoriy ustunlar: `trend` (Sparkline) va `share` (ulush chizig'i). */
export type DataExplorerColumn = 'trend' | 'share';
export type DataExplorerSortKey = 'name' | 'value' | 'share' | 'delta';
export type DataExplorerSortDirection = 'asc' | 'desc';

export interface DataExplorerRow {
  /** Barqaror kalit; berilmasa `name`. */
  id?: string;
  name: string;
  /** Trend qatori (masalan 12 oy) — Sparkline. */
  series?: number[];
  /** Asosiy qiymat — o'ngga tekislangan, tabular raqamlar. */
  value: number;
  /** Ulush, 0…1 (`0.92` → chiziq 92%). */
  share?: number;
  /** O'zgarish, foizda (`12.4` → `+12,4%`) — `Delta`. */
  delta?: number;
}

export interface DataExplorerLabels {
  name: ReactNode;
  trend: ReactNode;
  value: ReactNode;
  share: ReactNode;
  delta: ReactNode;
  /** Sparkline `aria-label` so'zlari. */
  up: string;
  down: string;
  neutral: string;
}

export interface DataExplorerProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  rows: DataExplorerRow[];
  /** `default` — barcha ustunlar, `compact` — trend va ulushsiz (mobil). */
  variant?: DataExplorerVariant;
  /** Default variantdagi ixtiyoriy ustunlar. Standart: `['trend', 'share']`. */
  columns?: DataExplorerColumn[];
  /** Boshqariladigan saralash; berilmasa ichki holat (`defaultSortBy`). */
  sortBy?: DataExplorerSortKey;
  sortDirection?: DataExplorerSortDirection;
  defaultSortBy?: DataExplorerSortKey;
  defaultSortDirection?: DataExplorerSortDirection;
  onSortChange?: (sortBy: DataExplorerSortKey, direction: DataExplorerSortDirection) => void;
  /** Sarlavha matnlari (uz: "Kurs", "Trend, 12 oy", "O'quvchilar", "Ulush"). */
  labels?: Partial<DataExplorerLabels>;
  /** Qiymat formati. Standart uz-UZ: `48 200`. */
  formatValue?: (value: number) => string;
  /** Delta rangi: `up` yaxshi (standart) yoki `down`. */
  betterWhen?: 'up' | 'down';
  /** Qator bosilganda (batafsil). Nom tugmaga aylanadi. */
  onRowClick?: (row: DataExplorerRow) => void;
  /** Qator yo'q bo'lganda (filtrlarni tiklash taklifi bilan). */
  empty?: ReactNode;
  /** Jadval sarlavhasi (`caption`, ko'rinmas): "Kurslar: o'quvchilar va o'zgarish". */
  label: string;
}

const DEFAULT_LABELS: DataExplorerLabels = {
  name: 'Course',
  trend: 'Trend, 12 mo',
  value: 'Learners',
  share: 'Share',
  delta: 'Δ',
  up: 'up',
  down: 'down',
  neutral: 'flat',
};

const SPARK_W = 80; // Figma: Chart/Sparkline at 80 px
const SPARK_H = 20;

function compare(a: DataExplorerRow, b: DataExplorerRow, key: DataExplorerSortKey): number {
  if (key === 'name') return a.name.localeCompare(b.name);
  const va = a[key] ?? Number.NEGATIVE_INFINITY;
  const vb = b[key] ?? Number.NEGATIVE_INFINITY;
  return va - vb;
}

/**
 * Figma "4.18 Chart · Data explorer": saralanadigan jadval ichida kichik chartlar — har qatorda
 * `Sparkline`, ulush chizig'i (`dataviz/categorical/01` · `dataviz/track`) va `Delta`. Haqiqiy
 * `<table>` semantikasi: `th scope`, `aria-sort`, sarlavha tugmasi (bosish / Enter).
 */
export function DataExplorer({
  rows,
  variant = 'default',
  columns = ['trend', 'share'],
  sortBy: sortByProp,
  sortDirection: sortDirectionProp,
  defaultSortBy = 'value',
  defaultSortDirection = 'desc',
  onSortChange,
  labels: labelsProp,
  formatValue = (v) => formatNumber(v),
  betterWhen = 'up',
  onRowClick,
  empty,
  label,
  className,
  ...rest
}: DataExplorerProps) {
  const t = { ...DEFAULT_LABELS, ...labelsProp };
  const [inner, setInner] = useState({ by: defaultSortBy, dir: defaultSortDirection });
  const by = sortByProp ?? inner.by;
  const dir = sortDirectionProp ?? inner.dir;
  const showTrend = variant === 'default' && columns.includes('trend');
  const showShare = variant === 'default' && columns.includes('share');
  const colCount = 3 + Number(showTrend) + Number(showShare);

  const sorted = [...rows].sort((a, b) => compare(a, b, by) * (dir === 'asc' ? 1 : -1));

  const sortTo = (key: DataExplorerSortKey) => {
    const next: DataExplorerSortDirection =
      key === by ? (dir === 'desc' ? 'asc' : 'desc') : key === 'name' ? 'asc' : 'desc';
    setInner({ by: key, dir: next });
    onSortChange?.(key, next);
  };

  const head = (key: DataExplorerSortKey, text: ReactNode, cls: string) => {
    const activeCol = key === by;
    return (
      <th
        scope="col"
        className={cx('bek-data-explorer__th', cls)}
        aria-sort={activeCol ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
      >
        <button
          type="button"
          className="bek-data-explorer__sort bek-focus-ring"
          onClick={() => sortTo(key)}
        >
          {text}
          {activeCol && (
            <span className="bek-data-explorer__arrow" aria-hidden="true">
              {dir === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </button>
      </th>
    );
  };

  const trendWord = (series: number[]) => {
    const tr = sparklineTrend(series);
    return tr === 'up' ? t.up : tr === 'down' ? t.down : t.neutral;
  };

  return (
    <table
      {...rest}
      className={cx(
        'bek-data-explorer',
        `bek-data-explorer--${variant}`,
        onRowClick && 'bek-data-explorer--clickable',
        className,
      )}
    >
      <caption className="bek-chart__sr">{label}</caption>
      <thead>
        <tr className="bek-data-explorer__head">
          {head('name', t.name, 'bek-data-explorer__name')}
          {showTrend && (
            <th scope="col" className="bek-data-explorer__th bek-data-explorer__trend">
              {t.trend}
            </th>
          )}
          {head('value', t.value, 'bek-data-explorer__value')}
          {showShare && head('share', t.share, 'bek-data-explorer__share')}
          {head('delta', t.delta, 'bek-data-explorer__delta')}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 && empty != null && (
          <tr className="bek-data-explorer__row">
            <td className="bek-data-explorer__empty" colSpan={colCount}>
              {empty}
            </td>
          </tr>
        )}
        {sorted.map((row) => {
          const share = row.share == null ? null : Math.max(0, Math.min(1, row.share));
          return (
            <tr key={row.id ?? row.name} className="bek-data-explorer__row">
              <th scope="row" className="bek-data-explorer__name">
                {onRowClick ? (
                  <button
                    type="button"
                    className="bek-data-explorer__open bek-focus-ring"
                    onClick={() => onRowClick(row)}
                  >
                    {row.name}
                  </button>
                ) : (
                  row.name
                )}
              </th>
              {showTrend && (
                <td className="bek-data-explorer__trend">
                  {row.series && row.series.length > 1 ? (
                    <Sparkline
                      className="bek-data-explorer__spark"
                      data={row.series}
                      width={SPARK_W}
                      height={SPARK_H}
                      label={`${row.name}: ${trendWord(row.series)}`}
                    />
                  ) : (
                    '—'
                  )}
                </td>
              )}
              <td className="bek-data-explorer__value">{formatValue(row.value)}</td>
              {showShare && (
                <td className="bek-data-explorer__share">
                  {share == null ? (
                    '—'
                  ) : (
                    <>
                      <span className="bek-data-explorer__bar" aria-hidden="true">
                        <span
                          className="bek-data-explorer__fill"
                          style={{ inlineSize: `${Math.round(share * 1000) / 10}%` }}
                        />
                      </span>
                      <span className="bek-chart__sr">
                        {formatPercent(share * 100, { decimals: 0 })}
                      </span>
                    </>
                  )}
                </td>
              )}
              <td className="bek-data-explorer__delta">
                {row.delta == null ? '—' : <Delta value={row.delta} betterWhen={betterWhen} />}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
