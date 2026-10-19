'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { DEFAULT_WIDTH } from './geometry.js';

export interface ChartContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Konteyner eniga moslashgan chart: `(width) => <LineChart width={width} … />`. */
  children: (width: number) => ReactNode;
  /** Server render va birinchi chizish uchun en (Figma `scale/480`). */
  initialWidth?: number;
}

/**
 * Ota konteyner enini o'lchaydi (ResizeObserver) va chartga beradi — chart har qurilmada
 * cho'zilmasdan qayta chiziladi (Figma CMP-11: geometriya cho'zilmaydi).
 */
export function ChartContainer({
  children,
  initialWidth = DEFAULT_WIDTH,
  className,
  ...rest
}: ChartContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.floor(entry.contentRect.width);
      if (next > 0) setWidth(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      {...rest}
      ref={ref}
      className={className ? `bek-chart-container ${className}` : 'bek-chart-container'}
    >
      {children(width)}
    </div>
  );
}
