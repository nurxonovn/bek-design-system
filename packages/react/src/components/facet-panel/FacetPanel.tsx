'use client';

import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';
import { Button } from '../button/Button.js';
import { Checkbox } from '../checkbox/Checkbox.js';

/** Figma "Device": Web — popover (chapda facet ro'yxati) · Mobile — bottom sheet kontenti. */
export type FacetPanelDevice = 'web' | 'mobile';

export interface FacetOption {
  value: string;
  label: ReactNode;
  /** Natijalar soni ("661") — Caption/M text/tertiary. */
  count?: ReactNode;
  disabled?: boolean;
}

export interface Facet {
  id: string;
  /** "Type", "Industry" — Web'da chap ro'yxatda, guruh sarlavhasida (legend) katta harflarda. */
  label: ReactNode;
  options: FacetOption[];
}

/** Facet `id` → tanlangan `value` lar. */
export type FacetValue = Record<string, string[]>;

export interface FacetPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'defaultValue'> {
  device?: FacetPanelDevice;
  facets: Facet[];
  value?: FacetValue;
  defaultValue?: FacetValue;
  onChange?: (value: FacetValue) => void;
  /** Web: chapda tanlangan facet (boshqariladigan). */
  activeFacet?: string;
  defaultActiveFacet?: string;
  onActiveFacetChange?: (id: string) => void;
  /** Sarlavha (Label/L). */
  title?: ReactNode;
  /** "Clear all" (Flat tugma) — hamma tanlovni tozalaydi, keyin `onClearAll`. */
  onClearAll?: () => void;
  clearAllLabel?: ReactNode;
  /** Web pastki qator: "2 filters · 1,089 results" (Caption/M text/secondary). */
  summary?: ReactNode;
  /** Asosiy tugma: Web "Show results" (Action L) · Mobile "Show 1,089 results" (Action XL, to'liq kenglik). */
  resultsLabel?: ReactNode;
  onShowResults?: () => void;
  /** Web: facet yonidagi son uchun ekran o'quvchi matni. */
  selectedCountLabel?: (count: number) => string;
}

const EMPTY: FacetValue = {};

/**
 * Figma "3.12 Search bar → Facet panel": katalog qidiruvining filtrlari — SearchField'ning Filter
 * tugmasidan ochiladi. Har facet — `fieldset` + `legend`, variantlar — `Checkbox` (M) va son.
 */
export function FacetPanel({
  device = 'web',
  facets,
  value,
  defaultValue,
  onChange,
  activeFacet,
  defaultActiveFacet,
  onActiveFacetChange,
  title = 'Filters',
  onClearAll,
  clearAllLabel = 'Clear all',
  summary,
  resultsLabel = 'Show results',
  onShowResults,
  selectedCountLabel = (count) => `${count} selected`,
  className,
  ...rest
}: FacetPanelProps) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const [inner, setInner] = useState<FacetValue>(defaultValue ?? EMPTY);
  const [innerActive, setInnerActive] = useState(defaultActiveFacet ?? facets[0]?.id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = value ?? inner;
  const active = activeFacet ?? innerActive;
  const web = device === 'web';

  const commit = (next: FacetValue) => {
    setInner(next);
    onChange?.(next);
  };
  const toggle = (facetId: string, optionValue: string, checked: boolean) => {
    const selected = current[facetId] ?? [];
    const nextSelected = checked
      ? [...selected.filter((v) => v !== optionValue), optionValue]
      : selected.filter((v) => v !== optionValue);
    commit({ ...current, [facetId]: nextSelected });
  };
  const clearAll = () => {
    commit(EMPTY);
    onClearAll?.();
  };
  const activate = (id: string) => {
    setInnerActive(id);
    onActiveFacetChange?.(id);
  };
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = facets.length - 1;
    const next =
      event.key === 'ArrowDown'
        ? (index + 1) % facets.length
        : event.key === 'ArrowUp'
          ? (index - 1 + facets.length) % facets.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1;
    const facet = facets[next];
    if (!facet) return;
    event.preventDefault();
    activate(facet.id);
    tabs.current[next]?.focus();
  };

  const group = (facet: Facet, facetIndex: number) => (
    <fieldset key={facet.id} className="bek-facet-panel__group">
      <legend className="bek-facet-panel__group-label">{facet.label}</legend>
      <div className="bek-facet-panel__options">
        {facet.options.map((option, optionIndex) => {
          const countId = `${baseId}-count-${facetIndex}-${optionIndex}`;
          return (
            <div key={option.value} className="bek-facet-panel__option">
              <Checkbox
                size="m"
                checked={(current[facet.id] ?? []).includes(option.value)}
                disabled={option.disabled}
                aria-describedby={option.count != null ? countId : undefined}
                onChange={(event) => toggle(facet.id, option.value, event.target.checked)}
              >
                {option.label}
              </Checkbox>
              {option.count != null && (
                <span id={countId} className="bek-facet-panel__count">
                  {option.count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <section
      aria-labelledby={titleId}
      {...rest}
      className={cx('bek-facet-panel', `bek-facet-panel--${device}`, className)}
    >
      {!web && <span className="bek-facet-panel__handle" aria-hidden="true" />}
      <div className="bek-facet-panel__header">
        <h2 id={titleId} className="bek-facet-panel__title">
          {title}
        </h2>
        <Button variant="flat" size="m" onClick={clearAll}>
          {clearAllLabel}
        </Button>
      </div>
      {web ? (
        <div className="bek-facet-panel__body">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-labelledby={titleId}
            className="bek-facet-panel__facets"
          >
            {facets.map((facet, index) => {
              const count = (current[facet.id] ?? []).length;
              const selected = facet.id === active;
              return (
                <button
                  key={facet.id}
                  ref={(el) => {
                    tabs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${index}`}
                  tabIndex={selected ? 0 : -1}
                  className={cx(
                    'bek-facet-panel__facet',
                    'bek-focus-ring',
                    selected && 'bek-facet-panel__facet--selected',
                  )}
                  onClick={() => activate(facet.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span className="bek-facet-panel__facet-label">{facet.label}</span>
                  {count > 0 && (
                    <span className="bek-facet-panel__facet-count">
                      <span aria-hidden="true">{count}</span>
                      <span className="bek-visually-hidden">{selectedCountLabel(count)}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {facets.map((facet, index) => (
            <div
              key={facet.id}
              role="tabpanel"
              id={`${baseId}-panel-${index}`}
              aria-labelledby={`${baseId}-tab-${index}`}
              hidden={facet.id !== active}
              className="bek-facet-panel__panel bek-scrollbar"
            >
              {group(facet, index)}
            </div>
          ))}
        </div>
      ) : (
        <div className="bek-facet-panel__body bek-scrollbar">{facets.map(group)}</div>
      )}
      <div className="bek-facet-panel__footer">
        {web && summary != null && <span className="bek-facet-panel__summary">{summary}</span>}
        <Button
          variant="action"
          size={web ? 'l' : 'xl'}
          className="bek-facet-panel__submit"
          onClick={onShowResults}
        >
          {resultsLabel}
        </Button>
      </div>
    </section>
  );
}
