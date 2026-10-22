'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { CloseGlyph, ImageAddGlyph, ImageGlyph, VideoGlyph } from '../../icons/index.js';
import { StatusGlyph } from '../../icons/status.js';
import { cx } from '../../utils/cx.js';
import { Badge } from '../badge/Badge.js';
import { Button } from '../button/Button.js';
import { Spinner } from '../spinner/Spinner.js';
import { LiveRegion } from './parts.js';
import { useFilePicker, type FilePickerOptions, type UploadStatus } from './use-file-picker.js';

export interface MediaUploaderProps
  extends Omit<FilePickerOptions, 'files' | 'onRemove' | 'onRetry'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Figma "Kind": `photo` · `video` (Video — Duration badge). */
  kind?: 'photo' | 'video';
  /** Figma "Size": s 80 · m 104 · l 128 (scale/*). Eng kichigi ham target/min 44 dan katta. */
  size?: 's' | 'm' | 'l';
  /** Figma "Show label": bo'sh tile'dagi matn. O'chirilsa matn ekran o'quvchiga qoladi. */
  showLabel?: boolean;
  /** "Add photo" / "Add video". */
  label?: string;
  /** Rasm (video uchun — poster) manzili. Berilsa tile Filled holatida. */
  src?: string;
  alt?: string;
  /** `uploading` — bg/overlay + spinner + foiz · `done` · `error` — status/danger/soft, bosilsa Retry. */
  status?: UploadStatus;
  /** 0–100, `uploading` holatida. */
  progress?: number;
  /** Figma "Cover badge": birinchi rasm — Badge "Main" (faqat Filled). Matn bersangiz shu yoziladi. */
  coverBadge?: boolean | ReactNode;
  /** Video davomiyligi ("0:24") — Duration badge. */
  duration?: ReactNode;
  /** Remove (Button Raised, Icon only, M) — Filled holatida. */
  onRemove?: () => void;
  /** Error tile bosilganda. Berilmasa fayl tanlash oynasi qayta ochiladi. */
  onRetry?: () => void;
  removeLabel?: string;
  retryLabel?: string;
  uploadingLabel?: string;
  name?: string;
}

const PLACEHOLDER = { photo: ImageGlyph, video: VideoGlyph } as const;
const ADD = { photo: ImageAddGlyph, video: VideoGlyph } as const;

/**
 * Figma "3.17 Uploader → Uploader · Media": bitta rasm yoki video tile'i. Butun tile — bosiladigan
 * nishon; label va xato matni Fieldset'da, tile ichida emas.
 */
export function MediaUploader({
  kind = 'photo',
  size = 's',
  showLabel = true,
  label = kind === 'video' ? 'Add video' : 'Add photo',
  src,
  alt = '',
  status,
  progress = 0,
  coverBadge = false,
  duration,
  onRemove,
  onRetry,
  removeLabel = kind === 'video' ? 'Remove video' : 'Remove photo',
  retryLabel = 'Retry',
  uploadingLabel = 'Uploading',
  name,
  accept = kind === 'video' ? 'video/*' : 'image/*',
  maxSize,
  multiple = false,
  disabled = false,
  onFilesAdded,
  messages,
  className,
  ...rest
}: MediaUploaderProps) {
  const picker = useFilePicker({
    accept,
    maxSize,
    multiple,
    disabled,
    files: [],
    onFilesAdded,
    messages,
  });
  const percent = Math.round(Math.min(Math.max(progress, 0), 100));
  const filled = Boolean(src) || status === 'done';
  const Placeholder = PLACEHOLDER[kind];
  const Add = ADD[kind];
  const cover = coverBadge === true ? 'Main' : coverBadge || null;

  const picture = (
    <span className="bek-media-uploader__image" aria-hidden={alt ? undefined : true}>
      {src ? <img src={src} alt={alt} /> : status !== 'uploading' && <Placeholder />}
    </span>
  );

  let tile: ReactNode;
  if (status === 'uploading') {
    tile = (
      <div className="bek-media-uploader__tile">
        {picture}
        <div
          className="bek-media-uploader__overlay"
          role="progressbar"
          aria-label={uploadingLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <Spinner size={24} label={null} />
          <span className="bek-media-uploader__percent" aria-hidden="true">
            {percent}%
          </span>
        </div>
      </div>
    );
  } else if (status === 'error') {
    tile = (
      <button
        type="button"
        className="bek-media-uploader__tile bek-media-uploader__action bek-focus-ring"
        disabled={disabled}
        onClick={onRetry ?? picker.open}
      >
        <span className="bek-media-uploader__icon" aria-hidden="true">
          <StatusGlyph tone="danger" variant="stroke" />
        </span>
        <span className="bek-media-uploader__label">{retryLabel}</span>
      </button>
    );
  } else if (filled) {
    tile = (
      <div className="bek-media-uploader__tile">
        {picture}
        {onRemove && (
          <Button
            variant="raised"
            size="m"
            iconOnly
            startIcon={<CloseGlyph />}
            className="bek-media-uploader__remove"
            disabled={disabled}
            onClick={onRemove}
          >
            {alt ? `${removeLabel}: ${alt}` : removeLabel}
          </Button>
        )}
        {cover && (
          <Badge variant="filled" color="neutral" size="s" className="bek-media-uploader__cover">
            {cover}
          </Badge>
        )}
        {kind === 'video' && duration && (
          <Badge variant="filled" color="neutral" size="s" className="bek-media-uploader__duration">
            {duration}
          </Badge>
        )}
      </div>
    );
  } else {
    tile = (
      <button
        type="button"
        className="bek-media-uploader__tile bek-media-uploader__action bek-focus-ring"
        disabled={disabled}
        aria-label={showLabel ? undefined : label}
        onClick={picker.open}
      >
        <span className="bek-media-uploader__icon" aria-hidden="true">
          <Add />
        </span>
        {showLabel && <span className="bek-media-uploader__label">{label}</span>}
      </button>
    );
  }

  return (
    <div
      {...rest}
      className={cx(
        'bek-uploader',
        'bek-media-uploader',
        `bek-media-uploader--${kind}`,
        `bek-media-uploader--${size}`,
        status === 'error' && 'bek-media-uploader--error',
        filled && status !== 'uploading' && status !== 'error' && 'bek-media-uploader--filled',
        disabled && 'bek-uploader--disabled',
        className,
      )}
    >
      <input {...picker.inputProps} name={name} aria-label={label} />
      {tile}
      <LiveRegion announcement={picker.announcement} />
    </div>
  );
}
