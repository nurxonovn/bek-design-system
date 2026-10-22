'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';
import { Checkbox } from '../checkbox/Checkbox.js';
import { Radio } from '../radio/Radio.js';
import { Switch } from '../switch/Switch.js';

/** Figma "Control": radio — ko'pdan bittasi; checkbox — ko'pdan istalgancha; switch — har karta alohida yoqiladi. */
export type SelectorCardControl = 'radio' | 'checkbox' | 'switch';

/** Figma "Media": icon — 40 px accent/soft doira; image-start — 64 px rasm; image-top — 140 px balandlikdagi rasm tepada. */
export type SelectorCardMedia = 'none' | 'icon' | 'image-start' | 'image-top';

/** Figma "Selector group → Orientation". */
export type SelectorGroupOrientation = 'vertical' | 'horizontal';

interface SelectorGroupContextValue {
  name?: string;
  error?: boolean;
}

const SelectorGroupContext = createContext<SelectorGroupContextValue>({});

export interface SelectorCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'title'> {
  /** Figma "Title" — Title/S · text/primary. Input'ning nomi (`aria-labelledby`). */
  title: ReactNode;
  /** Figma "Show description" + "Description" — Body/S · text/secondary, bir qator izoh. */
  description?: ReactNode;
  /** Figma "Show meta" + "Meta" — Label/M: narx yoki muddat. */
  meta?: ReactNode;
  /** Figma "Control" — indikator va tanlov modeli. Standart `radio`. */
  control?: SelectorCardControl;
  /** Figma "Media". Berilmasa `icon` → `'icon'`, `image` → `'image-start'`, aks holda `'none'`. */
  media?: SelectorCardMedia;
  /** `media="icon"` uchun ikonka (20 px, text/accent). */
  icon?: ReactNode;
  /** `media="image-start" | "image-top"` uchun rasm (`<img alt="">` — matn sarlavhada). */
  image?: ReactNode;
  /** Figma "State=Error": border/danger 2 px va `aria-invalid`. Xabar — Fieldset'da. */
  error?: boolean;
  /** Ildiz `<div>` klassi (qolgan atributlar input'ga uzatiladi). */
  className?: string;
  /** Ildiz `<div>` uslubi. */
  style?: CSSProperties;
}

const resolveMedia = (
  media: SelectorCardMedia | undefined,
  icon: ReactNode,
  image: ReactNode,
): SelectorCardMedia => media ?? (icon ? 'icon' : image ? 'image-start' : 'none');

/**
 * Figma "3.16 Selector card": izohli katta tanlov — tarif, yetkazib berish, to'lov turi. Butun karta
 * bosiladi (indikator label'i karta ustiga cho'ziladi); indikator — Radio · Checkbox · Switch (M).
 * Holatlar CSS'dan: hover, `:checked` → accent/soft, `:focus-visible` → fokus halqasi, disabled.
 */
export const SelectorCard = forwardRef<HTMLInputElement, SelectorCardProps>(function SelectorCard(
  {
    title,
    description,
    meta,
    control = 'radio',
    media,
    icon,
    image,
    error,
    disabled = false,
    name,
    className,
    style,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const group = useContext(SelectorGroupContext);
  const id = useId().replace(/:/g, '');
  const titleId = `bek-selector-card-title-${id}`;
  const descriptionId = description ? `bek-selector-card-desc-${id}` : undefined;
  const metaId = meta ? `bek-selector-card-meta-${id}` : undefined;
  const kind = resolveMedia(media, icon, image);
  const invalid = error ?? group.error ?? false;
  const Indicator = control === 'checkbox' ? Checkbox : control === 'switch' ? Switch : Radio;

  return (
    <div
      className={cx(
        'bek-selector-card',
        `bek-selector-card--${control}`,
        `bek-selector-card--${kind}`,
        invalid && 'bek-selector-card--error',
        disabled && 'bek-selector-card--disabled',
        className,
      )}
      style={style}
    >
      {kind !== 'none' && (
        <span className="bek-selector-card__media" aria-hidden="true">
          {kind === 'icon' ? icon : image}
        </span>
      )}
      <span className="bek-selector-card__body">
        <span className="bek-selector-card__content">
          <span className="bek-selector-card__title" id={titleId}>
            {title}
          </span>
          {description && (
            <span className="bek-selector-card__description" id={descriptionId}>
              {description}
            </span>
          )}
          {meta && (
            <span className="bek-selector-card__meta" id={metaId}>
              {meta}
            </span>
          )}
        </span>
        <Indicator
          ref={ref}
          size="m"
          className="bek-selector-card__indicator"
          name={name ?? group.name}
          disabled={disabled}
          aria-labelledby={titleId}
          aria-describedby={
            [describedBy, descriptionId, metaId].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={invalid || undefined}
          {...rest}
        />
      </span>
    </div>
  );
});

export interface SelectorGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma "Orientation": vertical — Mobile va Tablet; horizontal — Web, har karta ≥ 240 px bo'lsa. */
  orientation?: SelectorGroupOrientation;
  /** Ichidagi kartalarga umumiy `name` (radio guruhi). */
  name?: string;
  /** Hamma kartalar Error holatida (xabar Fieldset'da, `status="error"`). */
  error?: boolean;
  children: ReactNode;
}

/**
 * Figma "Selector group": bitta savolga javob beradigan 2–4 karta, gap scale/12. Label va xato
 * xabari uchun Fieldset (3.19) ichiga qo'ying; Fieldset'siz bo'lsa `role="radiogroup"` va
 * `aria-label` bering.
 */
export function SelectorGroup({
  orientation = 'vertical',
  name,
  error,
  className,
  children,
  ...rest
}: SelectorGroupProps) {
  return (
    <SelectorGroupContext.Provider value={{ name, error }}>
      <div
        className={cx('bek-selector-group', `bek-selector-group--${orientation}`, className)}
        {...rest}
      >
        {children}
      </div>
    </SelectorGroupContext.Provider>
  );
}
