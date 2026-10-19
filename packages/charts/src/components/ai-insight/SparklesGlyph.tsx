/** To'rt qirrali yulduz (botiq tomonlar) — `cx, cy` markaz, `r` radius. */
const star = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`;

export interface SparklesGlyphProps {
  className?: string;
  /** SVG ichida joylash uchun (Prediction zone): yuqori-chap burchak. */
  x?: number;
  y?: number;
  /** Eni va bo'yi — Figma `_Icon 16`. */
  size?: number;
}

/**
 * AI belgisi (Figma `_Icon` sparkles, 16): model chiqishini ma'lumotdan ajratadi. Rang — `currentColor`,
 * bezak (`aria-hidden`); ma'noni matn ("AI insight", "Forecast") aytadi.
 */
export function SparklesGlyph({ className, x, y, size = 16 }: SparklesGlyphProps) {
  return (
    <svg
      className={className}
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d={star(10, 6, 5)} fill="currentColor" />
      <path d={star(5, 12, 4)} fill="currentColor" />
    </svg>
  );
}
