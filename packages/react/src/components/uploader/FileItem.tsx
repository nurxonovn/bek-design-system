'use client';

import type { LiHTMLAttributes, ReactNode } from 'react';
import { CloseGlyph, FileGlyph } from '../../icons/index.js';
import { StatusGlyph } from '../../icons/status.js';
import { cx } from '../../utils/cx.js';
import { Button } from '../button/Button.js';
import { ProgressBar } from '../progress/ProgressBar.js';
import { formatFileSize, type UploadStatus } from './use-file-picker.js';

export interface FileItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** Figma "Name": fayl nomi, bitta qatorda qisqartiriladi. */
  name: string;
  /** Figma "Status": `uploading` — Progress bar S · `done` · `error` — status/danger/soft, sabab va Retry. */
  status?: UploadStatus;
  /** Hajm, baytda — Meta qatori ("2.4 MB", yuklanayotganda "2.4 MB · 64%"). */
  fileSize?: number;
  /** 0–100, `uploading` holatida. */
  progress?: number;
  /** Meta qatorini to'liq almashtiradi. `error` holatida — xato sababi. */
  meta?: ReactNode;
  /** Figma "Type icon" (_Icon 24): fayl turiga mos ikonka. Standart — file-01. */
  icon?: ReactNode;
  /** Remove (Button Flat, Icon only, M). Berilmasa tugma chiqmaydi. */
  onRemove?: () => void;
  removeLabel?: string;
  /** Retry havolasi (faqat `error`). */
  onRetry?: () => void;
  retryLabel?: ReactNode;
}

/**
 * Figma "3.17 Uploader → File item": Uploader · File yoki Drop zone ichidagi bitta fayl. `<li>` —
 * ro'yxat (`<ul>`) ichida ishlating; mustaqil ro'yxat qatori emas.
 */
export function FileItem({
  name,
  status = 'done',
  fileSize,
  progress = 0,
  meta,
  icon,
  onRemove,
  removeLabel = 'Remove',
  onRetry,
  retryLabel = 'Retry',
  className,
  ...rest
}: FileItemProps) {
  const size = fileSize === undefined ? null : formatFileSize(fileSize);
  const percent = `${Math.round(Math.min(Math.max(progress, 0), 100))}%`;
  const autoMeta = status === 'uploading' ? [size, percent].filter(Boolean).join(' · ') : size;
  const metaText = meta ?? autoMeta;
  const glyph =
    status === 'error' ? <StatusGlyph tone="danger" variant="stroke" /> : (icon ?? <FileGlyph />);

  return (
    <li {...rest} className={cx('bek-file-item', `bek-file-item--${status}`, className)}>
      <span className="bek-file-item__icon" aria-hidden="true">
        {glyph}
      </span>
      <div className="bek-file-item__body">
        <span className="bek-file-item__name" title={name}>
          {name}
        </span>
        {metaText && <span className="bek-file-item__meta">{metaText}</span>}
        {status === 'uploading' && (
          <ProgressBar
            className="bek-file-item__progress"
            size="s"
            status="accent"
            value={progress}
            aria-label={name}
          />
        )}
        {status === 'error' && onRetry && (
          <button
            type="button"
            className="bek-link bek-link--accent bek-link--s bek-focus-ring bek-uploader__link bek-file-item__retry"
            onClick={onRetry}
          >
            {retryLabel}
          </button>
        )}
      </div>
      {onRemove && (
        <Button
          variant="flat"
          size="m"
          iconOnly
          startIcon={<CloseGlyph />}
          className="bek-file-item__remove"
          onClick={onRemove}
        >
          {`${removeLabel} ${name}`}
        </Button>
      )}
    </li>
  );
}
