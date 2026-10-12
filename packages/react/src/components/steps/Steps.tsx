import {
  Children,
  cloneElement,
  isValidElement,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';
import { StatusGlyph, type StatusTone } from '../../icons/status.js';

/** Figma "Orientation": vertical — batafsil kuzatuv; horizontal — 3–5 qisqa qadam. */
export type StepsOrientation = 'vertical' | 'horizontal';
/** Figma "Status". `current` — bir vaqtda faqat bitta. */
export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';
/** Figma "Marker": dot 8 · number 24 · icon 24. */
export type StepMarker = 'dot' | 'number' | 'icon';

/** Ekran o'quvchi uchun holat matni (`.bek-visually-hidden`). */
export type StepStatusLabels = Record<StepStatus, string>;

const DEFAULT_STATUS_LABELS: StepStatusLabels = {
  complete: 'Completed',
  current: 'Current',
  upcoming: 'Not started',
  error: 'Error',
};

/** Figma "Marker icon": check · info · alert — holatga qarab (BEK Icons, Stroke). */
const STATUS_ICON: Record<StepStatus, StatusTone> = {
  complete: 'success',
  current: 'info',
  upcoming: 'info',
  error: 'danger',
};

export interface StepsItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** Figma "Status". Default — `complete` (Figma bilan bir xil). */
  status?: StepStatus;
  /** Figma "Marker". Odatda `Steps` dan keladi; bu yerda berilsa — ustun. */
  marker?: StepMarker;
  /** Odatda `Steps` dan keladi. Alohida ishlatilganda — `vertical`. */
  orientation?: StepsOrientation;
  /** Label/L (vertical) · Label/M (horizontal). */
  title: ReactNode;
  /** Figma "Show description" (vertical): Body/S text/secondary. */
  description?: ReactNode;
  /** Figma "Show caption" (horizontal): Caption/M text/tertiary — sana, vaqt. */
  caption?: ReactNode;
  /** Figma "Show meta" (vertical): Caption/L text/tertiary — vaqt, narx, davomiylik. */
  meta?: ReactNode;
  /** Figma "Show action" (vertical): odatda `<Button variant="normal" size="m">`. */
  action?: ReactNode;
  /** Number marker matni. `Steps` ichida default — tartib raqami (1, 2, 3 …). */
  number?: ReactNode;
  /** Icon marker ikonkasi (16 px). Default — holatga qarab check · info · alert. */
  icon?: ReactNode;
  /** Figma "Line before". `Steps` ichida birinchi qadamda avtomatik o'chadi. */
  lineBefore?: boolean;
  /** Figma "Line after". `Steps` ichida oxirgi qadamda avtomatik o'chadi. */
  lineAfter?: boolean;
  /** Ekran o'quvchi uchun holat matni. Default — `Steps statusLabels` yoki inglizcha. */
  statusLabel?: string;
}

/**
 * Figma "4.17 Steps → Steps · Vertical item / Horizontal item": jarayonning bitta qadami.
 * Marker va chiziqlar dekorativ (`aria-hidden`); holat ekran o'quvchiga matn bilan aytiladi,
 * joriy qadam — `aria-current="step"`.
 */
export function StepsItem({
  status = 'complete',
  marker = 'dot',
  orientation = 'vertical',
  title,
  description,
  caption,
  meta,
  action,
  number,
  icon,
  lineBefore = true,
  lineAfter = true,
  statusLabel,
  className,
  ...rest
}: StepsItemProps) {
  const vertical = orientation === 'vertical';
  const label = statusLabel ?? DEFAULT_STATUS_LABELS[status];
  return (
    <li
      className={cx(
        'bek-steps__item',
        `bek-steps__item--${orientation}`,
        `bek-steps__item--${status}`,
        `bek-steps__item--${marker}`,
        !lineBefore && 'bek-steps__item--no-line-before',
        !lineAfter && 'bek-steps__item--no-line-after',
        className,
      )}
      aria-current={status === 'current' ? 'step' : undefined}
      {...rest}
    >
      <span className="bek-steps__rail" aria-hidden="true">
        <span className="bek-steps__line bek-steps__line--before" />
        <span className="bek-steps__marker">
          {marker === 'dot' ? (
            <span className="bek-steps__dot" />
          ) : (
            <span className="bek-steps__circle">
              {marker === 'number'
                ? number
                : (icon ?? <StatusGlyph tone={STATUS_ICON[status]} variant="stroke" />)}
            </span>
          )}
        </span>
        <span className="bek-steps__line bek-steps__line--after" />
      </span>
      <div className="bek-steps__content">
        <div className="bek-steps__title">
          <span className="bek-visually-hidden">{label}: </span>
          {title}
        </div>
        {vertical && description && <div className="bek-steps__description">{description}</div>}
        {!vertical && caption && <div className="bek-steps__caption">{caption}</div>}
        {vertical && action && <div className="bek-steps__action">{action}</div>}
      </div>
      {vertical && meta && <div className="bek-steps__meta">{meta}</div>}
    </li>
  );
}

export interface StepsProps extends OlHTMLAttributes<HTMLOListElement> {
  /** Figma "Orientation". */
  orientation?: StepsOrientation;
  /** Barcha qadamlar uchun marker (qadamning o'z `marker` i ustun). Figma default — `dot`. */
  marker?: StepMarker;
  /** Holat matnlari (lokalizatsiya): `{ complete: 'Bajarildi', … }`. */
  statusLabels?: Partial<StepStatusLabels>;
  /** `StepsItem` lar. Figma "Count" (3 · 4 · 5) — prop emas, qadamlar soni. */
  children: ReactNode;
}

/**
 * Figma "4.17 Steps": jarayonda foydalanuvchi qayerda — buyurtma kuzatuvi, ariza bosqichlari,
 * onboarding, uzun formalar. `<ol>`; birinchi qadamda "line before", oxirgisida "line after"
 * avtomatik o'chadi, Number marker tartib raqamini oladi.
 */
export function Steps({
  orientation = 'vertical',
  marker,
  statusLabels,
  className,
  children,
  ...rest
}: StepsProps) {
  // StepsItem (yoki prop'larni StepsItem'ga uzatuvchi o'ram) — matn/null tugunlari tashlanadi.
  const items = Children.toArray(children).filter((c): c is ReactElement<StepsItemProps> =>
    isValidElement(c),
  );
  const last = items.length - 1;
  return (
    <ol className={cx('bek-steps', `bek-steps--${orientation}`, className)} {...rest}>
      {items.map((item, i) => {
        const p = item.props;
        const status = p.status ?? 'complete';
        return cloneElement(item, {
          orientation: p.orientation ?? orientation,
          marker: p.marker ?? marker,
          number: p.number ?? i + 1,
          lineBefore: p.lineBefore ?? i > 0,
          lineAfter: p.lineAfter ?? i < last,
          statusLabel: p.statusLabel ?? statusLabels?.[status],
        });
      })}
    </ol>
  );
}
