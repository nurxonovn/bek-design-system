import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph, CloseGlyph, MenuGlyph } from '../../icons/index.js';
import { Button } from '../button/Button.js';

export type TopNavigationType = 'standard' | 'large-title' | 'search';
export type TopNavigationLeading = 'back' | 'close' | 'menu' | 'none';

export interface TopNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** `standard` — markazda sarlavha · `large-title` — pastda Headline/L · `search` — qidiruv maydoni. */
  type?: TopNavigationType;
  /** Chapdagi tugma. */
  leading?: TopNavigationLeading;
  onLeadingClick?: () => void;
  /** Chap tugma nomi (standart: Back / Close / Menu). */
  leadingLabel?: string;
  title?: ReactNode;
  /** `search` turida — qidiruv maydoni (masalan, SearchField). */
  children?: ReactNode;
  /** O'ngdagi 1–2 ta icon-only tugma yoki avatar. */
  actions?: ReactNode;
  /** `transparent` — rasm ustida: tugmalar fill/on-media, matn text/on-color. */
  background?: 'solid' | 'transparent';
}

const LEADING = {
  back: { icon: <ChevronLeftGlyph />, label: 'Back' },
  close: { icon: <CloseGlyph />, label: 'Close' },
  menu: { icon: <MenuGlyph />, label: 'Menu' },
} as const;

/**
 * Figma "6.6 Top navigation": mobil/planshet ekran yuqorisidagi panel — Back/Close, markazdagi
 * sarlavha va 2 tagacha amal. Web uchun — AppHeader (6.2).
 */
export function TopNavigation({
  type = 'standard',
  leading = 'back',
  onLeadingClick,
  leadingLabel,
  title,
  children,
  actions,
  background = 'solid',
  className,
  ...rest
}: TopNavigationProps) {
  const lead = leading !== 'none' ? LEADING[leading] : null;
  return (
    <header
      {...rest}
      className={cx('bek-top-nav', `bek-top-nav--${type}`, `bek-top-nav--${background}`, className)}
    >
      <div className="bek-top-nav__bar">
        <div className="bek-top-nav__leading">
          {lead && (
            <Button
              variant="flat"
              size="xl"
              iconOnly
              startIcon={lead.icon}
              onClick={onLeadingClick}
              className="bek-top-nav__leading-button"
            >
              {leadingLabel ?? lead.label}
            </Button>
          )}
        </div>
        {type === 'search' ? (
          <div className="bek-top-nav__search">{children}</div>
        ) : (
          type === 'standard' && title && <h1 className="bek-top-nav__title">{title}</h1>
        )}
        <div className="bek-top-nav__trailing">{actions}</div>
      </div>
      {type === 'large-title' && title && <h1 className="bek-top-nav__large-title">{title}</h1>}
    </header>
  );
}
