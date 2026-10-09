import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { FlashGlyph } from '../../icons/index.js';
import { SegmentedControl, type SegmentedOption } from '../segmented-control/SegmentedControl.js';

export interface TimeSlotOption {
  value: string;
  /** "12:00–12:30" yoki "25–35 min". */
  time: ReactNode;
  /** "Bepul", "+5 000 soʻm". */
  note?: ReactNode;
  /** Eng tez variant — chaqmoq ikonka va warning rangli izoh. */
  express?: boolean;
  disabled?: boolean;
}

export interface TimeSlotPickerProps {
  title?: ReactNode;
  /** Kun tanlovi (Bugun · Ertaga · Juma 9). */
  days?: SegmentedOption[];
  day?: string;
  defaultDay?: string;
  onDayChange?: (day: string) => void;
  slots: TimeSlotOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Ro'yxat ostidagi izoh. */
  note?: ReactNode;
  'aria-label'?: string;
  className?: string;
}

/** Figma "3.15 Time slot picker": yetkazish yoki band qilish oynasini tanlash.
 *  Kun — SegmentedControl, oynalar — radio kartalar (mobil'da qatorda 3 ta). */
export function TimeSlotPicker({
  title,
  days,
  day,
  defaultDay,
  onDayChange,
  slots,
  value,
  defaultValue,
  onChange,
  note,
  'aria-label': ariaLabel,
  className,
}: TimeSlotPickerProps) {
  const name = `bek-slot-${useId().replace(/:/g, '')}`;
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;

  return (
    <div className={cx('bek-time-slots', className)}>
      {title && <div className="bek-time-slots__title">{title}</div>}
      {days && days.length > 0 && (
        <SegmentedControl
          options={days}
          value={day}
          defaultValue={defaultDay}
          onChange={onDayChange}
          size="l"
          aria-label={typeof title === 'string' ? title : undefined}
        />
      )}
      <div role="radiogroup" aria-label={ariaLabel} className="bek-time-slots__grid">
        {slots.map((slot) => (
          <label
            key={slot.value}
            className={cx(
              'bek-time-slot',
              slot.express && 'bek-time-slot--express',
              slot.disabled && 'bek-time-slot--disabled',
            )}
          >
            <input
              type="radio"
              className="bek-time-slot__input"
              name={name}
              value={slot.value}
              checked={current === slot.value}
              disabled={slot.disabled}
              onChange={() => {
                setInner(slot.value);
                onChange?.(slot.value);
              }}
            />
            <span className="bek-time-slot__time">
              {slot.express && <FlashGlyph className="bek-time-slot__flash" />}
              {slot.time}
            </span>
            {slot.note && <span className="bek-time-slot__note">{slot.note}</span>}
          </label>
        ))}
      </div>
      {note && <div className="bek-time-slots__note">{note}</div>}
    </div>
  );
}
