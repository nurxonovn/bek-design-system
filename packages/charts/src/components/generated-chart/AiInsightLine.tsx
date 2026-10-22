import type { ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { SparklesGlyph } from './glyphs.js';

export interface AiInsightLineProps {
  children: ReactNode;
  className?: string;
}

/**
 * AI guruhi ichki qismi — Figma "Chart/AI insight · Inline": chart ostidagi bitta AI xulosa qatori
 * (`dataviz/ai/soft` fon, `text/utility` matn, sparkles). Ekran o'quvchiga "AI insight:" bilan o'qiladi.
 * Uslubi generated-chart.css da (`.bek-ai-line`).
 */
export function AiInsightLine({ children, className }: AiInsightLineProps) {
  return (
    <p className={cx('bek-ai-line', className)}>
      <SparklesGlyph className="bek-ai-line__icon" />
      <span className="bek-chart__sr">AI insight: </span>
      <span className="bek-ai-line__text">{children}</span>
    </p>
  );
}
