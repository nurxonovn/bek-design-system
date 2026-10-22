'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { formatNumber } from '../../core/format.js';
import { Delta } from '../delta/Delta.js';
import { ANNOUNCE_INTERVAL, useThrottledAnnouncement, type LivePoliteness } from './announce.js';

/** `'uz'` — uz-UZ guruhlash (`12 480`), yoki o'z formatlovchingiz. */
export type NumberTickerFormat = 'uz' | ((value: number) => string);

export interface NumberTickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Joriy qiymat. O'zgarganda faqat o'zgargan raqamlar aylanadi (300 ms). */
  value: number;
  /** Standart `'uz'`: `formatNumber(value)` → `12 480`. */
  format?: NumberTickerFormat;
  /** Nima sanalayotgani — Caption/M · `text/secondary`: "Active learners right now". */
  label?: ReactNode;
  /** O'zgarish, foizda — `Delta` (`+12,4%`). */
  delta?: number;
  betterWhen?: 'up' | 'down';
  /** Taqqoslash izohi — Caption/M · `text/tertiary`: "vs. same time yesterday". */
  context?: ReactNode;
  /** `aria-live` darajasi. Standart `polite`; `off` — e'lon yo'q (qiymat baribir matnda o'qiladi). */
  live?: LivePoliteness;
  /** E'lonlar orasidagi minimal vaqt, ms. Standart 60 000 (daqiqada ko'pi bilan bir marta). */
  announceInterval?: number;
}

interface Roll {
  from: string;
  up: boolean;
  n: number;
}

const isDigit = (c: string | undefined) => c != null && c >= '0' && c <= '9';

/**
 * Figma "4.18 Chart · Number ticker" (Ticker): jonli hisoblagich — tabular raqamlar, faqat o'zgargan
 * raqam aylanadi (eskisi chiqib ketadi, yangisi kiradi; `prefers-reduced-motion` da aylanmasdan
 * almashadi). Yakuniy qiymat har doim ko'rinmas matnda; o'zgarishlar `aria-live` bilan cheklab e'lon qilinadi.
 */
export function NumberTicker({
  value,
  format = 'uz',
  label,
  delta,
  betterWhen,
  context,
  live = 'polite',
  announceInterval = ANNOUNCE_INTERVAL,
  className,
  ...rest
}: NumberTickerProps) {
  const text = format === 'uz' ? formatNumber(value) : format(value);
  const [prev, setPrev] = useState({ text, value });
  const [roll, setRoll] = useState<Roll | null>(null);
  // Hosila holat (render vaqtida): oldingi matn bilan solishtirib, aylanadigan raqamlarni belgilash.
  if (prev.text !== text) {
    setRoll({ from: prev.text, up: value >= prev.value, n: (roll?.n ?? 0) + 1 });
    setPrev({ text, value });
  }
  const announced = useThrottledAnnouncement(
    typeof label === 'string' ? `${label}: ${text}` : text,
    announceInterval,
    live !== 'off',
  );

  const chars = [...text];
  const from = roll ? [...roll.from] : [];
  const offset = from.length - chars.length;

  return (
    <div {...rest} className={cx('bek-number-ticker', 'bek-number-ticker--ticker', className)}>
      {label != null && <p className="bek-number-ticker__label">{label}</p>}
      <p className="bek-number-ticker__value">
        <span className="bek-number-ticker__digits" aria-hidden="true">
          {chars.map((c, i) => {
            const old = from[i + offset];
            if (!roll || !isDigit(c) || !isDigit(old) || old === c)
              return (
                <span key={i} className="bek-number-ticker__char">
                  {c}
                </span>
              );
            return (
              <span key={`${roll.n}-${i}`} className="bek-number-ticker__slot">
                <span
                  className={cx(
                    'bek-number-ticker__reel',
                    roll.up ? 'bek-number-ticker__reel--up' : 'bek-number-ticker__reel--down',
                  )}
                >
                  {roll.up ? (
                    <>
                      <span className="bek-number-ticker__old">{old}</span>
                      <span className="bek-number-ticker__new">{c}</span>
                    </>
                  ) : (
                    <>
                      <span className="bek-number-ticker__new">{c}</span>
                      <span className="bek-number-ticker__old">{old}</span>
                    </>
                  )}
                </span>
              </span>
            );
          })}
        </span>
        <span className="bek-chart__sr">{text}</span>
      </p>
      {(delta != null || context != null) && (
        <div className="bek-number-ticker__meta">
          {delta != null && <Delta value={delta} betterWhen={betterWhen} />}
          {context != null && <span className="bek-number-ticker__context">{context}</span>}
        </div>
      )}
      {live !== 'off' && (
        <span className="bek-chart__sr" aria-live={live} aria-atomic="true">
          {announced}
        </span>
      )}
    </div>
  );
}
