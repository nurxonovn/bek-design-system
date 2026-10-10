import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph } from '../../icons/index.js';
import { Button } from '../button/Button.js';

export type AppBarVariant = 'title' | 'search' | 'brand';

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * `title` — orqaga + sarlavha + amallar · `search` — orqaga + qidiruv maydoni (`children`) ·
   * `brand` — logo (`leading`) + qidiruv + amallar.
   */
  variant?: AppBarVariant;
  /** S — 56 px (mobil) · M — 64 px (planshet, web). */
  size?: 's' | 'm';
  /** Kontent ostidan o'tganda — Glass/Regular (glass/tint + Elevation/1; blur `@bek/tokens/materials.css` bilan). */
  scrolled?: boolean;
  /** Berilsa — orqaga tugmasi. */
  onBack?: () => void;
  backLabel?: string;
  /** Boshida (orqaga tugmasi o'rniga): logo. */
  leading?: ReactNode;
  /** Sarlavha — Title/M (S) · Title/L (M). */
  title?: ReactNode;
  /** Sarlavha o'rnidagi mazmun (qidiruv maydoni). */
  children?: ReactNode;
  /** O'ngdagi 1–3 ta icon-only tugma (Figma `Show count` — tugma ustidagi Badge). */
  actions?: ReactNode;
}

/**
 * Figma "6.5 App bar": ekran yuqorisidagi panel. Variant = Title | Search | Brand × Size S | M.
 * Sticky, z/sticky; yon padding layout/page-margin. Scrolled=Off — chegarasiz; ajralish faqat
 * kontent ostidan o'tganda (Glass/Regular + Elevation/1).
 */
export function AppBar({
  variant = 'title',
  size = 's',
  scrolled = false,
  onBack,
  backLabel = 'Back',
  leading,
  title,
  children,
  actions,
  className,
  ...rest
}: AppBarProps) {
  return (
    <header
      {...rest}
      className={cx(
        'bek-app-bar',
        `bek-app-bar--${size}`,
        `bek-app-bar--${variant}`,
        scrolled && 'bek-app-bar--scrolled bek-glass-regular',
        className,
      )}
    >
      {onBack && (
        <Button
          variant="flat"
          size="l"
          iconOnly
          startIcon={<ChevronLeftGlyph />}
          onClick={onBack}
          className="bek-app-bar__back"
        >
          {backLabel}
        </Button>
      )}
      {leading}
      <div className="bek-app-bar__main">
        {title && variant === 'title' && <h1 className="bek-app-bar__title">{title}</h1>}
        {title && variant !== 'title' && <h1 className="bek-visually-hidden">{title}</h1>}
        {children}
      </div>
      {actions && <div className="bek-app-bar__actions">{actions}</div>}
    </header>
  );
}
