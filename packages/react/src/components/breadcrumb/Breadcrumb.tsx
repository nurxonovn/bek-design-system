import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph, ChevronRightGlyph } from '../../icons/index.js';

export interface BreadcrumbStep {
  label: ReactNode;
  /** Oxirgi qadam (joriy sahifa) uchun berilmaydi. */
  href?: string;
  /** Faqat birinchi qadam uchun (uy ikonkasi). */
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export type BreadcrumbLayout = 'full' | 'collapsed' | 'back';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Ildizdan joriy sahifagacha; oxirgisi — joriy sahifa. */
  items: BreadcrumbStep[];
  /** `s` — Body/S · `m` — Body/M. */
  size?: 's' | 'm';
  /** `full` — web · `collapsed` — planshet ("…") · `back` — mobil (ota sahifaga bitta havola). */
  layout?: BreadcrumbLayout;
  /** "…" bosilganda — yashirin qadamlar menyusini oching (Dropdown menu). */
  onOverflowClick?: (hidden: BreadcrumbStep[], event: MouseEvent<HTMLButtonElement>) => void;
  overflowLabel?: string;
  'aria-label'?: string;
}

function Separator() {
  return (
    <span className="bek-breadcrumb__separator" aria-hidden="true">
      <ChevronRightGlyph />
    </span>
  );
}

function StepLink({ step, children }: { step: BreadcrumbStep; children?: ReactNode }) {
  return (
    <a href={step.href} onClick={step.onClick} className="bek-breadcrumb__link bek-focus-ring">
      {step.icon && (
        <span className="bek-breadcrumb__icon" aria-hidden="true">
          {step.icon}
        </span>
      )}
      {children ?? step.label}
    </a>
  );
}

/** Figma "6.3 Breadcrumb": sahifaning ierarxiyadagi o'rni. */
export function Breadcrumb({
  items,
  size = 's',
  layout = 'full',
  onOverflowClick,
  overflowLabel = 'Show hidden pages',
  'aria-label': ariaLabel = 'Breadcrumb',
  className,
  ...rest
}: BreadcrumbProps) {
  const cls = cx(
    'bek-breadcrumb',
    `bek-breadcrumb--${size}`,
    `bek-breadcrumb--${layout}`,
    className,
  );

  if (layout === 'back') {
    const parent = items[items.length - 2] ?? items[0];
    return (
      <nav {...rest} aria-label={ariaLabel} className={cls}>
        <a
          href={parent?.href}
          onClick={parent?.onClick}
          className="bek-breadcrumb__link bek-focus-ring"
        >
          <span className="bek-breadcrumb__icon" aria-hidden="true">
            <ChevronLeftGlyph />
          </span>
          {parent?.label}
        </a>
      </nav>
    );
  }

  const last = items.length - 1;
  const hidden = layout === 'collapsed' && items.length > 2 ? items.slice(1, last) : [];
  const visible = hidden.length ? [items[0], items[last]] : items;

  return (
    <nav {...rest} aria-label={ariaLabel} className={cls}>
      <ol className="bek-breadcrumb__list">
        {visible.map((step, i) => {
          const isCurrent = step === items[last];
          return (
            <li key={i} className="bek-breadcrumb__item">
              {i > 0 && <Separator />}
              {i === 1 && hidden.length > 0 && (
                <>
                  <button
                    type="button"
                    className="bek-breadcrumb__overflow bek-focus-ring"
                    aria-label={overflowLabel}
                    onClick={(event) => onOverflowClick?.(hidden, event)}
                  >
                    …
                  </button>
                  <Separator />
                </>
              )}
              {isCurrent ? (
                <span className="bek-breadcrumb__current" aria-current="page">
                  {step.label}
                </span>
              ) : (
                <StepLink step={step} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
