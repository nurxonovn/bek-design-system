'use client';

import { useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph, ChevronRightGlyph } from '../../icons/index.js';

export interface BaseOption {
  value: string;
  label: ReactNode;
  /** 48 px doira ichidagi rasm (img yoki boshqa element). */
  image?: ReactNode;
}

export interface BaseSelectorProps {
  options: BaseOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** `solid` — sirt ustida; `overlay` — mahsulot rasmi ustida. */
  variant?: 'solid' | 'overlay';
  /** Variantlar yuklanayotganda skeleton. */
  loading?: boolean;
  /** Rasm doirasini ko'rsatish. */
  showImage?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  'aria-label'?: string;
  className?: string;
}

/** Figma "3.11 Base selector": qisqa ro'yxatni (xamir, o'lcham, qovurish) ‹ › bilan birma-bir aylantirish. */
export function BaseSelector({
  options,
  value,
  defaultValue,
  onChange,
  variant = 'solid',
  loading = false,
  showImage = true,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  'aria-label': ariaLabel,
  className,
}: BaseSelectorProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === current),
  );
  const option = options[index];
  const arrows = options.length > 1;
  const go = (delta: number) => {
    const next = options[index + delta];
    if (!next) return;
    setInner(next.value);
    onChange?.(next.value);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={cx('bek-base-selector', `bek-base-selector--${variant}`, className)}
    >
      {arrows && (
        <button
          type="button"
          className="bek-base-selector__arrow bek-focus-ring"
          aria-label={previousLabel}
          disabled={loading || index === 0}
          onClick={() => go(-1)}
        >
          <ChevronLeftGlyph />
        </button>
      )}
      <div className="bek-base-selector__option" aria-live="polite">
        {showImage && <span className="bek-base-selector__image">{!loading && option?.image}</span>}
        {loading ? (
          <span className="bek-base-selector__skeleton" />
        ) : (
          <span className="bek-base-selector__label">{option?.label}</span>
        )}
      </div>
      {arrows && (
        <button
          type="button"
          className="bek-base-selector__arrow bek-focus-ring"
          aria-label={nextLabel}
          disabled={loading || index === options.length - 1}
          onClick={() => go(1)}
        >
          <ChevronRightGlyph />
        </button>
      )}
    </div>
  );
}
