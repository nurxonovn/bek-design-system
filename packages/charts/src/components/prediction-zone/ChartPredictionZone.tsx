import type { SVGAttributes } from 'react';
import { cx } from '@bek/react';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { PartFrame, estimateTextWidth, type ChartPartFrameProps } from '../chart-axis/PartFrame.js';
import { SparklesGlyph } from '../ai-insight/SparklesGlyph.js';

export interface ChartPredictionZoneProps
  extends ChartPartFrameProps,
    Omit<SVGAttributes<SVGGElement>, 'from' | 'to'> {
  /** Zona boshi — oxirgi kuzatilgan nuqtaning x koordinatasi (Figma: "Starts exactly at the last observed point"). */
  from: number;
  /** Zona oxiri — o'q oxiri. Standart: 480. */
  to?: number;
  /** Zona yozuvi. Standart: "Forecast". */
  text?: string;
  /** Model haqida (hover `<title>`): "bek-forecast-v2 · 4 months". */
  note?: string;
  /** Plot yuqori / pastki cheti — standart 0…200 (`chart/height/md`). */
  top?: number;
  bottom?: number;
}

const PAD = 8; // scale/8 — yozuv zona burchagidan
const ICON = 16;
const GAP = 4; // scale/4 — belgi va matn orasida

/**
 * Figma "4.18 Chart · Prediction zone": X o'qining model chiqishi bo'lgan qismi — `dataviz/grid` soya, chap
 * cheti uzuq `dataviz/ai/accent`, pastki-o'ngda sparkles + "Forecast". Uzuq prognoz chizig'i va
 * `dataviz/uncertainty/*` diapazoni bilan birga chiziladi (Chart/Forecast). Chart `<svg>` ichida `<g>`.
 */
export function ChartPredictionZone({
  from,
  to = DEFAULT_WIDTH,
  text = 'Forecast',
  note,
  top = 0,
  bottom = DEFAULT_HEIGHT,
  standalone,
  label,
  className,
  ...rest
}: ChartPredictionZoneProps) {
  const a = Math.min(from, to);
  const b = Math.max(from, to);
  const textW = estimateTextWidth(text);
  const textX = b - PAD;
  const baseline = bottom - PAD;
  return (
    <PartFrame
      standalone={standalone}
      label={label ?? text}
      fallbackLabel="Forecast"
      name="prediction-zone"
      width={b}
      height={bottom}
    >
      <g {...rest} className={cx('bek-prediction-zone', className)}>
        <title>{note ? `${text}: ${note}` : text}</title>
        <rect
          className="bek-prediction-zone__zone"
          x={r2(a)}
          y={top}
          width={r2(b - a)}
          height={r2(bottom - top)}
        />
        <line className="bek-prediction-zone__edge" x1={r2(a)} x2={r2(a)} y1={top} y2={bottom} />
        <g className="bek-prediction-zone__label">
          <SparklesGlyph
            className="bek-prediction-zone__icon"
            x={r2(textX - textW - GAP - ICON)}
            y={baseline - ICON}
          />
          <text
            className="bek-prediction-zone__text"
            x={textX}
            y={baseline - ICON / 2}
            dy="0.35em"
            textAnchor="end"
          >
            {text}
          </text>
        </g>
      </g>
    </PartFrame>
  );
}
