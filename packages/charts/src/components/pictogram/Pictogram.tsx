import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { formatPercent } from '../../core/format.js';
import { DataTable } from '../../core/svg.js';
import { LegendItem } from '../legend-item/LegendItem.js';
import { PersonGlyph } from './glyphs.js';

export type PictogramVariant = 'default' | 'compare';

export interface PictogramRow {
  /** Guruh yoki davr: "2020". */
  label: string;
  /** Ulush 0…1. */
  value: number;
  /** Javoblar soni (tooltip). */
  n?: number;
}

export interface PictogramProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `default` — bitta ulush va sarlavha; `compare` — har guruh/davr uchun qator. */
  variant?: PictogramVariant;
  /** Default: ulush 0…1 (0.3 = 30%). */
  value?: number;
  /** Compare: qatorlar. */
  rows?: PictogramRow[];
  /** Ikonkalar soni — 10, 20 yoki 100 (tez sanalsin). Standart: Default 20, Compare 10. */
  total?: number;
  /** Birlik: "students" — legend va ekran o'quvchi matnida. */
  unit?: string;
  /** Sarlavha (Headline/L); standart — kasr: 0.3 → "3 in 10", 0.25 → "1 in 4". */
  headline?: ReactNode;
  /** Sarlavha ostidagi izoh (Caption/M · text/secondary). */
  caption?: ReactNode;
  /** Birlik legendi; standart "1 icon = 5% of students". Doim ko'rsatiladi. */
  unitLabel?: string;
  /** Bitta shakl (`person`) yoki o'z SVG ikonkangiz (`currentColor` bilan). */
  icon?: 'person' | ReactNode;
  /** Birinchi ko'rinishda to'lib chiqish animatsiyasi (reduced motion'da yo'q). */
  animate?: boolean;
  /** Ekran o'quvchi matni; standart — "3 in 10 students". */
  label?: string;
}

const DENOMINATORS = [2, 3, 4, 5, 10, 20, 100];

/** 0.3 → "3 in 10", 0.25 → "1 in 4"; kasr topilmasa foiz ("37%"). */
export function pictogramFraction(value: number): string {
  const v = Math.max(0, Math.min(1, value));
  if (v === 0) return '0 in 10';
  for (const d of DENOMINATORS) {
    const num = v * d;
    if (Math.abs(num - Math.round(num)) < 1e-6) return `${Math.round(num)} in ${d}`;
  }
  return formatPercent(v * 100, { decimals: 0 });
}

const pct = (v: number) => formatPercent(Math.max(0, Math.min(1, v)) * 100, { decimals: 0 });

/**
 * Figma "4.18 Chart · Pictogram": isotype — son takrorlanuvchi ikonkalar bilan ("3 in 10" his
 * qilinadi, hisoblanmaydi). Ikonkalar konteynerga o'raladi, cho'zilmaydi; yoqilgani
 * `dataviz/categorical/01`, qolgani `dataviz/track`; oxirgisi kasrga qirqiladi.
 */
export function Pictogram({
  variant,
  value = 0,
  rows = [],
  total,
  unit = '',
  headline,
  caption,
  unitLabel,
  icon = 'person',
  animate = false,
  label,
  className,
  ...rest
}: PictogramProps) {
  const kind: PictogramVariant = variant ?? (rows.length ? 'compare' : 'default');
  const count = Math.max(1, Math.round(total ?? (kind === 'compare' ? 10 : 20)));
  const per = 100 / count;
  const legend =
    unitLabel ??
    `1 icon = ${formatPercent(per, { decimals: Number.isInteger(per) ? 0 : 1 })}${unit ? ` of ${unit}` : ''}`;
  const glyph = icon === 'person' ? <PersonGlyph /> : icon;

  const icons = (share: number, name: string) => {
    const filled = Math.max(0, Math.min(1, share)) * count;
    return (
      <div className="bek-pictogram__icons" role="img" aria-label={name}>
        {Array.from({ length: count }, (_, i) => {
          const f = Math.max(0, Math.min(1, filled - i));
          const style = {
            '--bek-pictogram-i': i,
            '--bek-pictogram-fill': `${Math.round(f * 1000) / 10}%`,
          } as CSSProperties;
          return (
            <span
              key={i}
              aria-hidden="true"
              className={cx(
                'bek-pictogram__icon',
                f >= 1 && 'bek-pictogram__icon--on',
                f > 0 && f < 1 && 'bek-pictogram__icon--partial',
              )}
              style={style}
            >
              <span className="bek-pictogram__glyph bek-pictogram__glyph--off">{glyph}</span>
              {f > 0 && (
                <span className="bek-pictogram__glyph bek-pictogram__glyph--on">{glyph}</span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  const head = headline ?? pictogramFraction(value);
  const fallback =
    kind === 'compare'
      ? rows.map((r) => `${r.label}: ${pct(r.value)}`).join(', ')
      : `${typeof head === 'string' ? head : pct(value)}${unit ? ` ${unit}` : ''}`;
  const summary = label ?? fallback;

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-pictogram',
        `bek-pictogram--${kind}`,
        animate && 'bek-pictogram--animate',
        className,
      )}
    >
      {kind === 'compare' ? (
        <div className="bek-pictogram__rows">
          {rows.map((r) => (
            <div
              key={r.label}
              className="bek-pictogram__row"
              title={`${r.label}: ${pct(r.value)}${r.n != null ? ` · n = ${r.n}` : ''}`}
            >
              <span className="bek-pictogram__group">{r.label}</span>
              {icons(r.value, `${r.label}: ${pct(r.value)}${unit ? ` ${unit}` : ''}`)}
              <span className="bek-pictogram__value">{pct(r.value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bek-pictogram__body">
          <div className="bek-pictogram__headline">
            <span className="bek-pictogram__number">{head}</span>
            {caption != null && <span className="bek-pictogram__caption">{caption}</span>}
          </div>
          {icons(value, summary)}
        </div>
      )}
      <div className="bek-pictogram__legend">
        <LegendItem variant="square" color="var(--bek-dataviz-categorical-01)">
          {legend}
        </LegendItem>
      </div>
      {kind === 'compare' && (
        <DataTable
          caption={summary}
          columns={['Group', 'Share']}
          rows={rows.map((r) => [r.label, pct(r.value)])}
        />
      )}
    </figure>
  );
}
