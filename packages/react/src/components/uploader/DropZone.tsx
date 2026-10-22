'use client';

import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { UploadGlyph } from '../../icons/index.js';
import { cx } from '../../utils/cx.js';
import { FileList, LiveRegion } from './parts.js';
import { useFilePicker, type FilePickerOptions, type UploaderFile } from './use-file-picker.js';

export interface DropZoneProps
  extends FilePickerOptions,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'title'> {
  /** Figma "Hint": format va hajm chegarasi — doim ko'rinadi, browse tugmasiga `aria-describedby`. */
  hint?: ReactNode;
  /** "Drag files here or" — browse havolasidan oldingi matn. */
  title?: ReactNode;
  /** Klaviatura va sichqoncha uchun asosiy yo'l: fayl tanlash oynasini ochadi. */
  browseLabel?: ReactNode;
  /** Figma "State=Drag over" sarlavhasi. */
  dropLabel?: ReactNode;
  /** Zona ikonkasi (_Icon 32, standart upload-01). */
  icon?: ReactNode;
  name?: string;
  listLabel?: string;
  removeLabel?: string;
  retryLabel?: ReactNode;
}

/**
 * Figma "3.17 Uploader → Uploader · Drop zone": Web uchun drag-and-drop maydoni va browse havolasi.
 * Sudrab tashlash ixtiyoriy — browse tugmasi doim bor (klaviatura muqobili). Uzuq chiziqli chegara —
 * 1.7 Border qoidasining hujjatlangan istisnosi.
 */
export function DropZone({
  hint = 'PDF, JPG or PNG · up to 10 MB',
  title = 'Drag files here or',
  browseLabel = 'browse',
  dropLabel = 'Drop files to upload',
  icon,
  name,
  listLabel,
  removeLabel,
  retryLabel,
  accept,
  maxSize,
  multiple = false,
  disabled = false,
  files,
  onFilesAdded,
  onRemove,
  onRetry,
  messages,
  className,
  'aria-describedby': describedBy,
  ...rest
}: DropZoneProps) {
  const browseRef = useRef<HTMLButtonElement>(null);
  const picker = useFilePicker({
    accept,
    maxSize,
    multiple,
    disabled,
    files,
    onFilesAdded,
    onRemove,
    onRetry,
    messages,
  });
  const hintId = `bek-drop-zone-hint-${picker.baseId}`;
  const error = picker.items.some((f) => f.status === 'error');
  const loading = picker.items.some((f) => f.status === 'uploading');
  const handleRemove = (item: UploaderFile) => {
    picker.remove(item);
    browseRef.current?.focus();
  };

  return (
    <div
      {...rest}
      {...picker.dropProps}
      className={cx(
        'bek-uploader',
        'bek-drop-zone',
        picker.dragOver && 'bek-drop-zone--drag-over',
        error && !picker.dragOver && 'bek-drop-zone--error',
        disabled && 'bek-uploader--disabled',
        className,
      )}
      aria-busy={loading || undefined}
    >
      <input
        {...picker.inputProps}
        name={name}
        aria-label={typeof browseLabel === 'string' ? browseLabel : undefined}
      />
      <div className="bek-drop-zone__content">
        <span className="bek-drop-zone__icon" aria-hidden="true">
          {icon ?? <UploadGlyph />}
        </span>
        <p className="bek-drop-zone__title">
          {picker.dragOver ? (
            dropLabel
          ) : (
            <>
              {title}{' '}
              <button
                ref={browseRef}
                type="button"
                className="bek-link bek-link--accent bek-link--m bek-focus-ring bek-uploader__link"
                disabled={disabled}
                aria-describedby={cx(hint ? hintId : undefined, describedBy) || undefined}
                onClick={picker.open}
              >
                {browseLabel}
              </button>
            </>
          )}
        </p>
        {hint && (
          <p className="bek-drop-zone__hint" id={hintId}>
            {hint}
          </p>
        )}
      </div>
      <FileList
        items={picker.items}
        label={listLabel}
        removeLabel={removeLabel}
        retryLabel={retryLabel}
        onRemove={handleRemove}
        onRetry={picker.retry}
      />
      <LiveRegion announcement={picker.announcement} />
    </div>
  );
}
