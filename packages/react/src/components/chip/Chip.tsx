import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { CloseGlyph } from '../../icons/index.js';

interface ChipBase {
  /** Balandlik: s 32 (zich qatorlar) · m 40 (touch). */
  size?: 's' | 'm';
  icon?: ReactNode;
  /** Yorliqdan keyingi son (filtr natijalari soni). */
  count?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export interface FilterChipProps
  extends ChipBase,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled'> {
  variant?: 'filter';
  /** Tanlangan filtr — `fill/inverse`, `aria-pressed`. */
  selected?: boolean;
}

export interface InputChipProps extends ChipBase {
  variant: 'input';
  /** × bosilganda (Delete / Backspace ham). */
  onRemove?: () => void;
  removeLabel?: string;
}

export type ChipProps = FilterChipProps | InputChipProps;

/** Figma "3.13 Chip": Filter — bosib yoqiladi/o'chiriladi; Input — foydalanuvchi qo'shgan qiymat, × bilan olib tashlanadi. */
export function Chip(props: ChipProps) {
  const { size = 's', icon, count, disabled, children, className } = props;
  const classes = cx(
    'bek-chip',
    `bek-chip--${size}`,
    `bek-chip--${props.variant ?? 'filter'}`,
    disabled && 'bek-chip--disabled',
    className,
  );
  const content = (
    <>
      {icon && (
        <span className="bek-chip__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="bek-chip__label">{children}</span>
      {count !== undefined && <span className="bek-chip__count">{count}</span>}
    </>
  );

  if (props.variant === 'input') {
    const { onRemove, removeLabel = 'Remove' } = props;
    return (
      <span className={classes}>
        {content}
        <button
          type="button"
          className="bek-chip__remove bek-focus-ring"
          aria-label={typeof children === 'string' ? `${removeLabel} ${children}` : removeLabel}
          disabled={disabled}
          onClick={onRemove}
          onKeyDown={(e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') onRemove?.();
          }}
        >
          <CloseGlyph />
        </button>
      </span>
    );
  }

  const {
    variant: _variant,
    selected = false,
    size: _size,
    icon: _icon,
    count: _count,
    children: _children,
    className: _className,
    ...button
  } = props;
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      {...button}
      className={cx(classes, 'bek-focus-ring')}
    >
      {content}
    </button>
  );
}
