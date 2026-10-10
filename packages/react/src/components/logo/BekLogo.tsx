'use client';

import { useId, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export type BekLogoVariant = 'horizontal' | 'vertical' | 'mark';
export type BekLogoSize = 's' | 'm' | 'l';
export type BekLogoColor = 'gradient' | 'solid' | 'mono' | 'reversed';

export interface BekLogoProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'children'> {
  /** Mahsulot nomi ("Academy", "E-Store"). Bo'sh yoki `null` — faqat masterbrand "BEK". */
  product?: string | null;
  /** `horizontal` — header; `vertical` — kvadratga yaqin joylar; `mark` — faqat belgi. */
  variant?: BekLogoVariant;
  /** Belgi o'lchami: s 24 · m 40 · l 64 px. Wordmark va mahsulot nomi u bilan birga o'zgaradi. */
  size?: BekLogoSize;
  /** `gradient` — asosiy; `solid` — bosma; `mono` — Light/Dark'ga moslashadi; `reversed` — rangli fon ustida. */
  color?: BekLogoColor;
}

/** Figma "2.2 Logo & Brand": to'rtta gulbarg — to'rt doira kesishmasi (64×64 grid). */
const MARK_PATH =
  'M31.9688 35.5557C37.8519 38.9589 42.7567 43.8641 46.1602 49.7471C42.7568 55.6302 37.8519 60.5351 31.9688 63.9385C26.0858 60.535 21.1805 55.6302 17.7773 49.7471C21.1806 43.8642 26.0859 38.959 31.9688 35.5557ZM14.1914 17.7773C20.0745 21.1805 24.9794 26.0859 28.3828 31.9688C24.9795 37.8519 20.0746 42.7568 14.1914 46.1602C8.30845 42.7567 3.40321 37.8519 0 31.9688C3.40331 26.0859 8.30854 21.1806 14.1914 17.7773ZM49.7471 17.7773C55.6302 21.1805 60.535 26.0858 63.9385 31.9688C60.5351 37.8519 55.6302 42.7568 49.7471 46.1602C43.8641 42.7567 38.9589 37.8519 35.5557 31.9688C38.959 26.0859 43.8642 21.1806 49.7471 17.7773ZM31.9688 0C37.8519 3.40321 42.7567 8.30845 46.1602 14.1914C42.7568 20.0746 37.8519 24.9795 31.9688 28.3828C26.0859 24.9794 21.1805 20.0745 17.7773 14.1914C21.1806 8.30854 26.0859 3.40331 31.9688 0Z';

/** BEK logotipi: belgi + "BEK" wordmark + ixtiyoriy mahsulot nomi. */
export function BekLogo({
  product = null,
  variant = 'horizontal',
  size = 's',
  color = 'gradient',
  className,
  ...rest
}: BekLogoProps) {
  const gradientId = `bek-logo-${useId().replace(/:/g, '')}`;
  const name = product?.trim() || null;
  const label = name ? `BEK ${name}` : 'BEK';

  return (
    <span
      role="img"
      aria-label={label}
      {...rest}
      className={cx(
        'bek-logo',
        `bek-logo--${variant}`,
        `bek-logo--${size}`,
        `bek-logo--${color}`,
        className,
      )}
    >
      <svg className="bek-logo__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        {color === 'gradient' && (
          <defs>
            {/* Figma: 135°, to'xtash nuqtalari belgining 1/6 va 5/6 qismida */}
            <linearGradient
              id={gradientId}
              x1="10.656"
              y1="10.656"
              x2="53.282"
              y2="53.282"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" className="bek-logo__stop-start" />
              <stop offset="1" className="bek-logo__stop-end" />
            </linearGradient>
          </defs>
        )}
        <path d={MARK_PATH} fill={color === 'gradient' ? `url(#${gradientId})` : 'currentColor'} />
      </svg>
      {variant !== 'mark' && (
        <span className="bek-logo__name" aria-hidden="true">
          <span className="bek-logo__wordmark">BEK</span>
          {name && <span className="bek-logo__product">{name}</span>}
        </span>
      )}
    </span>
  );
}
