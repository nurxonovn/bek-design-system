'use client';

import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';
import { useControlGroupDensity } from '../control-group/context.js';

/** Balandlik (field/height/*): xs 32 · s 36 · m 44 · l 56 px. */
export type ScrubFieldSize = 'xs' | 's' | 'm' | 'l';

export interface ScrubFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Figma "Label": qisqa nom, bir qatorda (sig'masa "…" bilan qisqaradi). */
  label: ReactNode;
  /** Boshqariladigan qiymat. */
  value?: number;
  /** Boshqarilmaydigan boshlang'ich qiymat (standart — `min`). */
  defaultValue?: number;
  /** Har o'zgarishda (sudrash, ↑↓, kiritib Enter/blur) yangi son bilan chaqiriladi. */
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Kasr xonalari soni; standart — `step` dagi xonalar (0.05 → 2). */
  precision?: number;
  /** Figma "Unit" / "Show unit": qiymatdan keyingi birlik — px, %, ms, ×. */
  unit?: ReactNode;
  /** Figma "Show track": (value − min) / (max − min) kenglikdagi neytral yo'lak va handle. */
  showTrack?: boolean;
  /** Standart: `m`; ControlGroup ichida — guruh zichligidan (compact → `xs`). */
  size?: ScrubFieldSize;
  disabled?: boolean;
  /** Forma maydoni nomi — qiymat matn ko'rinishida yuboriladi. */
  name?: string;
}

/** Sudrash boshlanishi uchun minimal siljish (px) — undan kami bosish, ya'ni kiritish rejimi. */
const DRAG_THRESHOLD = 3;

const decimalsOf = (n: number): number => {
  const s = String(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
};

/** Shift — ×10 qadam, Alt — ×0.1 qadam (Figma Usage). */
const modifier = (e: { shiftKey: boolean; altKey: boolean }): number =>
  e.shiftKey ? 10 : e.altKey ? 0.1 : 1;

interface DragState {
  pointerId: number;
  x: number;
  start: number;
  width: number;
  rtl: boolean;
  moved: boolean;
  mult: number;
}

/**
 * Figma "3.21 Scrub field" — maydon bo'ylab gorizontal sudrab o'zgartiriladigan son (sozlamalar paneli,
 * muharrir, tool UI). Sudrash — qiymat (pointer capture, ew-resize); bosish yoki Tab — kiritish rejimi
 * (Enter/blur saqlaydi, Esc bekor qiladi); ↑↓ — qadam, PageUp/PageDown — ×10, Home/End — min/max.
 * Native `<input role="spinbutton">` aria-valuenow/min/max bilan.
 */
export const ScrubField = forwardRef<HTMLInputElement, ScrubFieldProps>(function ScrubField(
  {
    label,
    value,
    defaultValue,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    precision,
    unit,
    showTrack = true,
    size,
    disabled = false,
    name,
    className,
    ...rest
  },
  ref,
) {
  const density = useControlGroupDensity();
  const resolvedSize: ScrubFieldSize = size ?? (density === 'compact' ? 'xs' : 'm');
  const inputId = `bek-scrub-${useId().replace(/:/g, '')}`;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  const valueRef = useRef(current);
  valueRef.current = current;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [dragging, setDragging] = useState(false);
  const drag = useRef<DragState | null>(null);

  const digits = precision ?? decimalsOf(step);
  const format = (n: number, extra = 0) => n.toFixed(digits + extra);
  const clamp = (n: number) => Math.min(Math.max(n, min), max);

  /** Qiymatni chegaralab, yaxlitlab o'rnatadi; yangi qiymatni qaytaradi. */
  const commit = (next: number, extra = 0): number => {
    const v = Number(clamp(next).toFixed(digits + extra));
    if (Number.isNaN(v) || v === valueRef.current) return valueRef.current;
    valueRef.current = v;
    setInner(v);
    onChange?.(v);
    if (editing) setDraft(format(v, extra));
    return v;
  };

  const parseDraft = (): number | null => {
    const n = Number.parseFloat(draft.replace(',', '.').replace(/[^\d.+-]/g, ''));
    return Number.isFinite(n) ? n : null;
  };

  const stepBy = (delta: number, extra = 0) => {
    const base = parseDraft() ?? valueRef.current;
    setDraft(format(commit(base + delta, extra), extra));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const mult = modifier(e);
    const extra = mult < 1 ? 1 : 0;
    const keys: Record<string, () => void> = {
      ArrowUp: () => stepBy(step * mult, extra),
      ArrowDown: () => stepBy(-step * mult, extra),
      PageUp: () => stepBy(step * 10),
      PageDown: () => stepBy(-step * 10),
      Home: () => Number.isFinite(min) && setDraft(format(commit(min))),
      End: () => Number.isFinite(max) && setDraft(format(commit(max))),
      Enter: () => {
        const parsed = parseDraft();
        setDraft(format(parsed === null ? valueRef.current : commit(parsed)));
        e.currentTarget.select();
      },
      Escape: () => {
        setDraft(format(valueRef.current));
        e.currentTarget.select();
      },
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  const onFocus = () => {
    setEditing(true);
    setDraft(format(valueRef.current));
    inputRef.current?.select();
  };

  const onBlur = () => {
    const parsed = parseDraft();
    if (parsed !== null) commit(parsed);
    setEditing(false);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    if (editing && e.target === inputRef.current) return; // kiritish rejimida — kursorni joylashtirish
    e.preventDefault();
    const root = e.currentTarget;
    drag.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      start: valueRef.current,
      width: root.getBoundingClientRect().width,
      rtl: getComputedStyle(root).direction === 'rtl',
      moved: false,
      mult: modifier(e),
    };
    root.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const mult = modifier(e);
    if (mult !== d.mult) {
      // Modifikator o'zgarsa — joriy nuqtadan qayta hisoblash (qiymat sakramaydi).
      d.mult = mult;
      d.x = e.clientX;
      d.start = valueRef.current;
    }
    const dx = (e.clientX - d.x) * (d.rtl ? -1 : 1);
    if (!d.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
    }
    const range = max - min;
    // Maydonning to'liq kengligi ≈ butun oraliq; kamida 1 px = 1 qadam.
    const pxPerStep =
      Number.isFinite(range) && range > 0 ? Math.max(1, d.width / (range / step)) : 4;
    commit(d.start + Math.round(dx / pxPerStep) * step * mult, mult < 1 ? 1 : 0);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture?.(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    if (!d.moved && !cancelled) inputRef.current?.focus(); // bosish → kiritish rejimi
  };

  const range = max - min;
  const ratio =
    Number.isFinite(range) && range > 0 ? Math.min(Math.max((current - min) / range, 0), 1) : 0;
  const display = editing ? draft : format(current);
  const valueText = `${format(current)}${typeof unit === 'string' ? ` ${unit}` : ''}`;

  return (
    <div
      className={cx(
        'bek-scrub-field',
        `bek-scrub-field--${resolvedSize}`,
        dragging && 'bek-scrub-field--dragging',
        editing && 'bek-scrub-field--editing',
        disabled && 'bek-scrub-field--disabled',
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endDrag(e, false)}
      onPointerCancel={(e) => endDrag(e, true)}
      {...rest}
    >
      {showTrack && (
        <span
          className="bek-scrub-field__track"
          style={{ inlineSize: `${ratio * 100}%` }}
          aria-hidden="true"
        >
          <span className="bek-scrub-field__handle" />
        </span>
      )}
      {/* Fokusni pointerup boshqaradi — sudrashdan keyin label bosilishi kiritish rejimini ochmasin. */}
      <label
        className="bek-scrub-field__label"
        htmlFor={inputId}
        onClick={(e) => e.preventDefault()}
      >
        {label}
      </label>
      <span className="bek-scrub-field__value">
        <input
          ref={inputRef}
          id={inputId}
          className="bek-scrub-field__input"
          type="text"
          inputMode="decimal"
          role="spinbutton"
          autoComplete="off"
          spellCheck={false}
          name={name}
          disabled={disabled}
          value={display}
          size={Math.max(display.length, 1)}
          aria-valuenow={current}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuetext={valueText}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {unit != null && unit !== false && (
          <span className="bek-scrub-field__unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
});
