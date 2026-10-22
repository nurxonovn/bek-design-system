'use client';

import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { UploadGlyph } from '../../icons/index.js';
import { cx } from '../../utils/cx.js';
import { Button } from '../button/Button.js';
import { FileList, LiveRegion } from './parts.js';
import { useFilePicker, type FilePickerOptions, type UploaderFile } from './use-file-picker.js';

export interface FileUploaderProps
  extends FilePickerOptions,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Figma "Size": `m` — Button L (36) · `l` — Button XL (44). */
  size?: 'm' | 'l';
  /** Tugma matni (Figma: Button exposed). */
  label?: ReactNode;
  /** `multiple` va ro'yxat bo'sh emas — "Upload another". */
  anotherLabel?: ReactNode;
  /** Tugmadagi ikonka (standart upload-01). */
  icon?: ReactNode;
  /** `<input type="file" name>` — oddiy `<form>` yuborish uchun. */
  name?: string;
  /** Fayllar ro'yxatining ekran o'quvchi nomi. */
  listLabel?: string;
  removeLabel?: string;
  retryLabel?: ReactNode;
}

/**
 * Figma "3.17 Uploader → Uploader · File": fayl tanlash oynasini ochadigan tugma va tanlangan fayllar
 * ro'yxati. Mobile/Tablet'da hujjatlar uchun. Fieldset (3.19) ichida ishlating — label, format/hajm
 * chegarasi va xato o'sha yerda.
 */
export function FileUploader({
  size = 'm',
  label = 'Upload file',
  anotherLabel = 'Upload another',
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
}: FileUploaderProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
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
  const loading = picker.items.some((f) => f.status === 'uploading');
  const handleRemove = (item: UploaderFile) => {
    picker.remove(item);
    triggerRef.current?.focus();
  };

  return (
    <div
      {...rest}
      className={cx(
        'bek-uploader',
        'bek-file-uploader',
        `bek-file-uploader--${size}`,
        disabled && 'bek-uploader--disabled',
        className,
      )}
      aria-busy={loading || undefined}
    >
      <input
        {...picker.inputProps}
        name={name}
        aria-label={typeof label === 'string' ? label : undefined}
      />
      <Button
        ref={triggerRef}
        variant="normal"
        size={size === 'l' ? 'xl' : 'l'}
        startIcon={icon ?? <UploadGlyph />}
        disabled={disabled}
        aria-describedby={describedBy}
        onClick={picker.open}
        className="bek-file-uploader__button"
      >
        {multiple && picker.items.length > 0 ? anotherLabel : label}
      </Button>
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
