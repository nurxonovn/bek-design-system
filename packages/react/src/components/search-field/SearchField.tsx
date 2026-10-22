'use client';

import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';
import { ClearGlyph, FilterGlyph, MicGlyph, SearchGlyph } from '../../icons/index.js';
import { Spinner, type SpinnerSize } from '../spinner/Spinner.js';

export type SearchFieldVariant = 'filled' | 'elevated' | 'on-media';
export type SearchFieldSize = 's' | 'm' | 'l';

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  /** `filled` — fill/soft (ro'yxat, ekran) · `elevated` — surface/card + Elevation/1 (tusli sarlavha) ·
   * `on-media` — fill/on-media + Glass/Small (faqat rasm/gradient ustida). */
  variant?: SearchFieldVariant;
  /** Balandlik `field/height/*`: s 36 · m 44 · l 56. */
  size?: SearchFieldSize;
  /** Figma "Show scope" — qidiruv qayerda ishlashi (masalan, "All"). Inputga `aria-describedby` bilan bog'lanadi. */
  scope?: ReactNode;
  /** Figma "Show voice" — mikrofon tugmasi (mic-01). Berilmasa, tugma chiqmaydi. */
  onVoice?: () => void;
  voiceLabel?: string;
  /** Figma "Show shortcut" — klaviatura yorlig'i (`⌘K`, faqat web). Inputga `aria-keyshortcuts` yoziladi;
   * tugmalar bog'lanishini ilova o'zi qiladi. */
  shortcut?: string;
  /** Figma "Show filter" — Facet panelini ochuvchi tugma. Berilmasa, tugma chiqmaydi. */
  onFilter?: () => void;
  filterLabel?: string;
  /** Tozalash (×) bosilganda; `value` boshqarilsa — shu yerda bo'shating. */
  onClear?: () => void;
  clearLabel?: string;
  /** Figma "Show cancel" — "Cancel" (mobil, qidiruvni yopadi); focus paytida ko'rinadi. */
  onCancel?: () => void;
  cancelLabel?: string;
  /** Natijalar yuklanmoqda — tozalash o'rnida `_Spinner`. */
  loading?: boolean;
  loadingLabel?: string;
  /** Tashqi o'ram klassi. */
  className?: string;
}

const SPINNER_SIZE: Record<SearchFieldSize, SpinnerSize> = { s: 16, m: 20, l: 24 };

const KEY_NAMES: Record<string, string> = {
  '⌘': 'Meta',
  '⌃': 'Control',
  '⌥': 'Alt',
  '⇧': 'Shift',
  cmd: 'Meta',
  ctrl: 'Control',
  alt: 'Alt',
  shift: 'Shift',
};

/** `⌘K` / `Ctrl+K` → `Meta+K` / `Control+K` (ARIA `aria-keyshortcuts` formati). */
function toKeyShortcuts(label: string): string {
  const parts = label
    .split(/\s*\+\s*|(?<=[⌘⌃⌥⇧])/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.map((part) => KEY_NAMES[part.toLowerCase()] ?? part.toUpperCase()).join('+');
}

/** Figma "3.12 Search bar → Search field": ro'yxat, katalog va butun ilova uchun pill qidiruv maydoni. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    value,
    defaultValue,
    onChange,
    variant = 'filled',
    size = 'm',
    scope,
    onVoice,
    voiceLabel = 'Voice search',
    shortcut,
    onFilter,
    filterLabel = 'Filters',
    onClear,
    clearLabel = 'Clear',
    onCancel,
    cancelLabel = 'Cancel',
    loading = false,
    loadingLabel = 'Loading',
    placeholder = 'Search',
    disabled,
    dir,
    className,
    'aria-describedby': describedBy,
    'aria-keyshortcuts': keyShortcuts,
    ...rest
  },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);
  const scopeId = useId();
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
  const describedByIds = cx(scope != null && scopeId, describedBy) || undefined;

  return (
    <div
      role="search"
      dir={dir}
      aria-busy={loading || undefined}
      className={cx(
        'bek-search-field',
        `bek-search-field--${variant}`,
        `bek-search-field--${size}`,
        disabled && 'bek-search-field--disabled',
        className,
      )}
      onFocus={() => setFocused(true)}
      onBlur={leave}
    >
      <div className={cx('bek-search-field__field', variant === 'on-media' && 'bek-glass-small')}>
        <SearchGlyph className="bek-search-field__icon" />
        {scope != null && (
          <span id={scopeId} className="bek-search-field__scope">
            {scope}
          </span>
        )}
        <input
          ref={input}
          type="search"
          className="bek-search-field__input"
          placeholder={placeholder}
          value={current}
          disabled={disabled}
          aria-describedby={describedByIds}
          aria-keyshortcuts={keyShortcuts ?? (shortcut ? toKeyShortcuts(shortcut) : undefined)}
          onChange={handleChange}
          {...rest}
        />
        {loading ? (
          <Spinner
            size={SPINNER_SIZE[size]}
            label={loadingLabel}
            className="bek-search-field__spinner"
          />
        ) : (
          current &&
          !disabled && (
            <button
              type="button"
              className="bek-search-field__action bek-search-field__clear bek-focus-ring"
              aria-label={clearLabel}
              onClick={clear}
            >
              <ClearGlyph />
            </button>
          )
        )}
        {onVoice && (
          <button
            type="button"
            className="bek-search-field__action bek-focus-ring"
            aria-label={voiceLabel}
            disabled={disabled}
            onClick={onVoice}
          >
            <MicGlyph />
          </button>
        )}
        {shortcut && (
          <kbd className="bek-search-field__shortcut" aria-hidden="true">
            {shortcut}
          </kbd>
        )}
        {onFilter && (
          <button
            type="button"
            className="bek-search-field__action bek-focus-ring"
            aria-label={filterLabel}
            disabled={disabled}
            onClick={onFilter}
          >
            <FilterGlyph />
          </button>
        )}
      </div>
      {onCancel && focused && (
        <button
          type="button"
          className="bek-search-field__cancel bek-focus-ring"
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

export interface SearchBarProps extends Omit<SearchFieldProps, 'size'> {
  /** Eski o'lchamlar: m 36 (→ SearchField `s`) · l 44 (→ SearchField `m`). */
  size?: 'm' | 'l';
}

const LEGACY_SIZE: Record<NonNullable<SearchBarProps['size']>, SearchFieldSize> = {
  m: 's',
  l: 'm',
};

/** @deprecated use SearchField — `size` m → `s` (36), l → `m` (44). */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { size = 'm', ...rest },
  ref,
) {
  return <SearchField ref={ref} size={LEGACY_SIZE[size]} {...rest} />;
});
