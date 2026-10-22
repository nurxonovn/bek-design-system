import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma "Orientation": qaysi o'q bo'yicha scroll. `vertical` (standart) · `horizontal` — jadval,
   * kod bloki, karusel ichida (sahifaning o'zida emas) · `both`.
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Figma "Size": `m` — track 12, thumb 8 (doimiy scroll) · `s` — track 8, thumb 4 (overlay, ixcham). */
  size?: 'm' | 's';
}

/**
 * Figma "4.8 Scrollbar": brauzerning o'z scroll'i, BEK tokenlari bilan (`.bek-scrollbar`). Kontent
 * sig'masa scrollbar doim ko'rinadi; thumb 32 px dan qisqarmaydi. Klaviatura uchun fokuslanadi
 * (strelkalar, PageUp/PageDown); `aria-label` berilsa `role="region"` bo'ladi.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', size = 'm', tabIndex = 0, className, children, ...rest },
  ref,
) {
  const labelled = Boolean(rest['aria-label'] || rest['aria-labelledby']);
  return (
    <div
      ref={ref}
      role={labelled ? 'region' : undefined}
      tabIndex={tabIndex}
      {...rest}
      className={cx(
        'bek-scrollbar',
        size === 's' && 'bek-scrollbar--s',
        'bek-scroll-area',
        `bek-scroll-area--${orientation}`,
        'bek-focus-ring',
        className,
      )}
    >
      {children}
    </div>
  );
});
