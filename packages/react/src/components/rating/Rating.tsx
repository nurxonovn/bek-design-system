import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { StarGlyph } from '../../icons/index.js';

export interface RatingProps extends HTMLAttributes<HTMLSpanElement> {
  /** 0–5, 0.5 qadam bilan yaxlitlanadi. */
  value: number;
  /** `stars` — beshta yulduz; `compact` — bitta yulduz + ball. */
  variant?: 'stars' | 'compact';
  /** Yulduz: s 16 · m 20 · l 24 px. */
  size?: 's' | 'm' | 'l';
  /** Ball matni; `true` — `value` locale bo'yicha. */
  showScore?: boolean;
  /** Sharhlar soni ("(1 245 sharh)"). */
  count?: ReactNode;
  locale?: string;
}

/** Figma "4.10 Rating": faqat o'qish uchun reyting. Tab to'xtashi emas (1.6 Accessibility). */
export function Rating({
  value,
  variant = 'stars',
  size = 'm',
  showScore = true,
  count,
  locale,
  className,
  ...rest
}: RatingProps) {
  const rounded = Math.round(Math.min(Math.max(value, 0), 5) * 2) / 2;
  const score = value.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const stars =
    variant === 'compact'
      ? [<StarGlyph key="c" amount={1} className="bek-rating__star" />]
      : [0, 1, 2, 3, 4].map((i) => {
          /** Figma ".Rating/Star → Fill": full · half · empty. */
          const fill = rounded >= i + 1 ? 'full' : rounded >= i + 0.5 ? 'half' : 'empty';
          return (
            <StarGlyph
              key={i}
              amount={fill === 'full' ? 1 : fill === 'half' ? 0.5 : 0}
              className={cx('bek-rating__star', `bek-rating__star--${fill}`)}
            />
          );
        });
  return (
    <span
      role="img"
      aria-label={`${score} / 5`}
      className={cx('bek-rating', `bek-rating--${size}`, `bek-rating--${variant}`, className)}
      {...rest}
    >
      <span className="bek-rating__stars">{stars}</span>
      {showScore && <span className="bek-rating__score">{score}</span>}
      {count && <span className="bek-rating__count">{count}</span>}
    </span>
  );
}
