import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph } from '../../icons/index.js';
import { Button } from '../button/Button.js';

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** S — 56 px (mobil) · M — 64 px (planshet, web). */
  size?: 's' | 'm';
  /** Kontent ostidan o'tganda — Glass/Regular (`@bek/tokens/materials.css`). */
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
  /** O'ngdagi 1–3 ta icon-only tugma. */
  actions?: ReactNode;
}

/**
 * Figma "6.5 App bar": ekran yuqorisidagi panel. Sticky, z/sticky; yon padding
 * layout/page-margin. Scrolled=Off — chegarasiz; ajralish faqat kontent ostidan o'tganda.
 */
export function AppBar({
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
        {title && <h1 className="bek-app-bar__title">{title}</h1>}
        {children}
      </div>
      {actions && <div className="bek-app-bar__actions">{actions}</div>}
    </header>
  );
}
