import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { StatusGlyph } from '../../icons/index.js';

export interface InfoWrapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `true` — fill/tertiary fon (kuchliroq ajratish). */
  emphasis?: boolean;
  /** Boshidagi 16 px ikonka. */
  /** Figma "Show leading icon" — boshidagi 16 px ikonka. */
  icon?: ReactNode;
  /** Ikki qatorli ko'rinish uchun sarlavha (Label/M, text/accent). */
  title?: ReactNode;
  /** Qisqa izoh matni. */
  children: ReactNode;
  /** Berilsa — oxirida "info" tugmasi chiqadi (batafsil ma'lumot). */
  onInfo?: () => void;
  infoLabel?: string;
}

/** Figma "5.5 Info wrap": forma yoki karta ichidagi kichik yordamchi izoh bloki. */
export function InfoWrap({
  emphasis = false,
  icon,
  title,
  children,
  onInfo,
  infoLabel = 'More info',
  className,
  ...rest
}: InfoWrapProps) {
  return (
    <div
      {...rest}
      className={cx('bek-info-wrap', emphasis && 'bek-info-wrap--emphasis', className)}
    >
      {icon && (
        <span className="bek-info-wrap__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="bek-info-wrap__body">
        {title && <p className="bek-info-wrap__title">{title}</p>}
        <p className="bek-info-wrap__text">{children}</p>
      </div>
      {onInfo && (
        <button
          type="button"
          className="bek-info-wrap__info bek-focus-ring"
          aria-label={infoLabel}
          onClick={onInfo}
        >
          <StatusGlyph tone="info" variant="stroke" />
        </button>
      )}
    </div>
  );
}
