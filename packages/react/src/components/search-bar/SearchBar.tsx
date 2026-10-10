'use client';

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx.js';
import { ClearGlyph, SearchGlyph } from '../../icons/index.js';

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  /** Tozalash (×) bosilganda; `value` boshqarilsa — shu yerda bo'shating. */
  onClear?: () => void;
  /** "Cancel" — focus paytida ko'rinadi. Berilmasa, tugma chiqmaydi. */
  onCancel?: () => void;
  cancelLabel?: string;
  clearLabel?: string;
  /** Balandlik: m 36 (zich UI) · l 44 (touch). */
  size?: 'm' | 'l';
  /** Tashqi o'ram klassi. */
  className?: string;
}

/** Figma "3.12 Search bar": ro'yxat va katalog uchun pill qidiruv maydoni. */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    value,
    defaultValue,
    onChange,
    onClear,
    onCancel,
    cancelLabel = 'Cancel',
    clearLabel = 'Clear',
    size = 'm',
    placeholder = 'Search',
    className,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);
  const [inner, setInner] = useState(defaultValue ?? '');
  const [focused, setFocused] = useState(false);
  const current = value ?? inner;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInner(event.target.value);
    onChange?.(event);
  };
  const clear = () => {
    setInner('');
    onClear?.();
    input.current?.focus();
  };
  const leave = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  };

  return (
    <div
      role="search"
      className={cx(
        'bek-search',
        `bek-search--${size}`,
        focused && 'bek-search--focused',
        className,
      )}
      onFocus={() => setFocused(true)}
      onBlur={leave}
    >
      <div className="bek-search__field">
        <SearchGlyph className="bek-search__icon" />
        <input
          ref={input}
          type="search"
          className="bek-search__input"
          placeholder={placeholder}
          value={current}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          {...rest}
        />
        {current && (
          <button
            type="button"
            className="bek-search__clear"
            aria-label={clearLabel}
            onClick={clear}
          >
            <ClearGlyph />
          </button>
        )}
      </div>
      {onCancel && focused && (
        <button
          type="button"
          className="bek-search__cancel bek-focus-ring"
          onClick={() => {
            setFocused(false);
            onCancel();
          }}
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
});
