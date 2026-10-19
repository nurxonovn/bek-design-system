import type { HTMLAttributes, ReactNode } from 'react';
import { cx, Skeleton } from '@bek/react';
import { SparklesGlyph } from './SparklesGlyph.js';

export type ChartInsightVariant = 'inline' | 'callout';

export interface ChartInsightProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `inline` — chart ostida bir qator, `callout` — plotdagi joyga ishora qiluvchi karta (Elevation/2). */
  variant?: ChartInsightVariant;
  /** Model yozgan jumla (Figma `Text`): avval topilma, keyin sabab; ko'pi bilan 2 qator. */
  text: ReactNode;
  /** Callout sarlavhasi. Standart: "AI insight". */
  title?: ReactNode;
  /** Ekran o'quvchi prefiksi (Figma A11y: "AI insight:"). */
  srPrefix?: string;
  /** Generating holati — model javob berguncha matn o'rnida 1 qatorli Skeleton. */
  loading?: boolean;
}

/**
 * Figma "4.18 Chart · AI insight": chart haqida AI yozgan jumla — doim sparkles belgisi va `dataviz/ai/*`
 * ranglari bilan, foydalanuvchi model chiqishini ma'lumotdan ajrata olsin.
 */
export function ChartInsight({
  variant = 'inline',
  text,
  title = 'AI insight',
  srPrefix = 'AI insight:',
  loading = false,
  className,
  ...rest
}: ChartInsightProps) {
  const body = loading ? (
    <Skeleton className="bek-ai-insight__skeleton" shape="text" lines={1} />
  ) : (
    <p className="bek-ai-insight__text">
      {variant === 'inline' && <span className="bek-visually-hidden">{`${srPrefix} `}</span>}
      {text}
    </p>
  );
  return (
    <div
      {...rest}
      role="note"
      aria-busy={loading || undefined}
      className={cx('bek-ai-insight', `bek-ai-insight--${variant}`, className)}
    >
      <SparklesGlyph className="bek-ai-insight__icon" />
      {variant === 'callout' ? (
        <div className="bek-ai-insight__content">
          <p className="bek-ai-insight__title">{title}</p>
          {body}
        </div>
      ) : (
        body
      )}
    </div>
  );
}
