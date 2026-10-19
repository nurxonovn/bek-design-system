import type { ReactElement } from 'react';
import { cx } from '@bek/react';
import { ChartSvg } from '../../core/svg.js';

/** Chart qismlari uchun umumiy prop'lar: SVG `<g>` bo'lagi yoki mustaqil ko'rinish. */
export interface ChartPartFrameProps {
  /**
   * `true` — qism o'z `<figure>` + `role="img"` SVG'ida chiziladi (hujjat, katalog, alohida belgi).
   * Standart — `<g>` bo'lagi: chart `<svg>` ichiga joylanadi.
   */
  standalone?: boolean;
  /** Mustaqil ko'rinishda ekran o'quvchi uchun qisqa tavsif (`role="img"` + `aria-label`). */
  label?: string;
}

interface FrameProps {
  standalone?: boolean;
  label?: string;
  fallbackLabel: string;
  /** Mustaqil ko'rinish `<figure>` klassi: `bek-<papka>-preview`. */
  name: string;
  width: number;
  height: number;
  children: ReactElement;
}

/** Qism `standalone` bo'lsa — `figure.bek-chart` + `ChartSvg`, aks holda `<g>` o'zgarishsiz qaytadi. */
export function PartFrame({
  standalone,
  label,
  fallbackLabel,
  name,
  width,
  height,
  children,
}: FrameProps) {
  if (!standalone) return children;
  return (
    <figure className={cx('bek-chart', `bek-${name}-preview`)}>
      <ChartSvg width={width} height={height} label={label ?? fallbackLabel}>
        {children}
      </ChartSvg>
    </figure>
  );
}

/** Label/S (12 px Medium) matni enining taxmini — SSR'da o'lchab bo'lmaydi; teg kengligi shundan. */
export function estimateTextWidth(text: string, perChar = 6.8): number {
  return Math.ceil(text.length * perChar);
}
