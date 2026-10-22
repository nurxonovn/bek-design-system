import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph } from '../../icons/index.js';
import { Button } from '../button/Button.js';
import { SearchField, type SearchFieldProps } from '../search-field/SearchField.js';

export type AppBarVariant = 'title' | 'search' | 'brand';

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * `title` — orqaga + sarlavha + amallar · `search` — orqaga + qidiruv maydoni ·
   * `brand` — logo (`leading`) + qidiruv + amallar.
   */
  variant?: AppBarVariant;
  /** S — 56 px (mobil) · M — 64 px (planshet, web). */
  size?: 's' | 'm';
  /** Kontent ostidan o'tganda — surface/card + border/hairline (pastki 1 px) + Elevation/1. */
  scrolled?: boolean;
  /** Berilsa — orqaga tugmasi (Button Flat XL, 44 px). */
  onBack?: () => void;
  backLabel?: string;
  /** Boshida (orqaga tugmasi o'rniga): logo. */
  leading?: ReactNode;
  /** Sarlavha — Title/M (S) · Title/L (M). */
  title?: ReactNode;
  /**
   * `search` / `brand` variantida qidiruv maydoni — Figma "Search field" (3.12) instance'i:
   * `SearchField` Filled, o'lchami bar bilan (S → `s` 36 · M → `m` 44). `children` berilsa, u ustun.
   */
  search?: Omit<SearchFieldProps, 'size' | 'variant'>;
  /** Sarlavha o'rnidagi ixtiyoriy mazmun (o'z qidiruv maydoningiz va h.k.). */
  children?: ReactNode;
  /** O'ngdagi 1–3 ta amal: icon-only Button Flat XL, Badge hisoblagich, Avatar (Figma `Show action 1–3`, `Show count`). */
  actions?: ReactNode;
}

/**
 * Figma "6.5 App bar": ekran yuqorisidagi panel. Variant = Title | Search | Brand × Size S | M.
 * Sticky, z/sticky; yon padding layout/page-margin. Scrolled=Off — bg/base, chegarasiz va soyasiz;
 * ajralish faqat kontent ostidan o'tganda (surface/card + border/hairline + Elevation/1).
 */
export function AppBar({
  variant = 'title',
  size = 's',
  scrolled = false,
  onBack,
  backLabel = 'Back',
  leading,
  title,
  search,
  children,
  actions,
  className,
  ...rest
}: AppBarProps) {
  const field =
    children ??
    (variant !== 'title' && search ? (
      <SearchField {...search} variant="filled" size={size === 'm' ? 'm' : 's'} />
    ) : null);
  return (
    <header
      {...rest}
      className={cx(
        'bek-app-bar',
        `bek-app-bar--${size}`,
        `bek-app-bar--${variant}`,
        scrolled && 'bek-app-bar--scrolled',
        className,
      )}
    >
      {onBack && (
        <Button
          variant="flat"
          size="xl"
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
        {field}
      </div>
      {actions && <div className="bek-app-bar__actions">{actions}</div>}
    </header>
  );
}
