import type { SVGAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { PartFrame, type ChartPartFrameProps } from '../chart-axis/PartFrame.js';
import { ChartTag, TAG_H, tagWidth } from '../annotation/ChartTag.js';
import { ChartPoint } from '../data-point/ChartPoint.js';

export type ChartCrosshairVariant = 'vertical' | 'both';

export interface ChartCrosshairProps
  extends ChartPartFrameProps,
    Omit<SVGAttributes<SVGGElement>, 'x' | 'y' | 'color'> {
  /** `vertical` — vaqt qatorlari (faqat vertikal chiziq), `both` — scatter / bubble (X va Y). */
  variant?: ChartCrosshairVariant;
  /** Eng yaqin nuqtaga "yopishgan" koordinatalar — oraliq qiymat ko'rsatilmaydi (`crosshairNearest`). */
  x: number;
  y: number;
  /** X tegi (sana / kategoriya): `12 Oct`. Berilmasa teg chiqmaydi. */
  xLabel?: string;
  /** Y tegi (qiymat, faqat `both`): `4 820`. */
  yLabel?: string;
  /** Nuqta seriya rangi (`seriesColor(i)`). */
  color?: string;
  /** Plot chegaralari — standart Figma plot 0…480 × 0…200. */
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

/**
 * Ko'rsatkichga eng yaqin nuqta indeksi (Figma: "Always snap to data, never show values between points").
 * `xs` — nuqtalarning x koordinatalari (o'sish tartibida bo'lishi shart emas).
 */
export function crosshairNearest(xs: number[], px: number): number {
  let best = -1;
  let dist = Infinity;
  xs.forEach((x, i) => {
    const d = Math.abs(x - px);
    if (d < dist) {
      dist = d;
      best = i;
    }
  });
  return best;
}

/**
 * Figma "4.18 Chart · Crosshair": ko'rsatkich ortidan yuruvchi chiziq + Data point Active + o'q teglari.
 * Faqat ko'rinish — pointer / klaviatura holatini chart beradi (role="img" SVG'dan tashqaridagi qatlamda),
 * qiymatni `aria-live` + Chart/Tooltip aytadi.
 */
export function ChartCrosshair({
  variant = 'vertical',
  x,
  y,
  xLabel,
  yLabel,
  color,
  top = 0,
  bottom = DEFAULT_HEIGHT,
  left = 0,
  right = DEFAULT_WIDTH,
  standalone,
  label,
  className,
  ...rest
}: ChartCrosshairProps) {
  const both = variant === 'both';
  return (
    <PartFrame
      standalone={standalone}
      label={label ?? [xLabel, yLabel].filter(Boolean).join(', ')}
      fallbackLabel="Crosshair"
      name="crosshair"
      width={right}
      height={bottom}
    >
      <g
        {...rest}
        className={cx('bek-crosshair', `bek-crosshair--${variant}`, className)}
        aria-hidden="true"
      >
        <line className="bek-crosshair__rule" x1={r2(x)} x2={r2(x)} y1={top} y2={bottom} />
        {both && (
          <line className="bek-crosshair__rule" x1={left} x2={right} y1={r2(y)} y2={r2(y)} />
        )}
        <ChartPoint x={x} y={y} variant="active" color={color} />
        {xLabel && (
          <ChartTag
            block="bek-crosshair"
            x={x}
            y={bottom - TAG_H}
            text={xLabel}
            min={left}
            max={right}
          />
        )}
        {both && yLabel && (
          <ChartTag
            block="bek-crosshair"
            x={left + tagWidth(yLabel) / 2}
            y={y - TAG_H / 2}
            text={yLabel}
            min={left}
            max={right}
          />
        )}
      </g>
    </PartFrame>
  );
}
