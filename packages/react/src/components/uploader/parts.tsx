'use client';

import type { ReactNode } from 'react';
import { FileItem } from './FileItem.js';
import type { UploaderFile } from './use-file-picker.js';

/** `aria-live` hudud: har yangi e'lon yangi `key` bilan — bir xil matn ham qayta o'qiladi. */
export function LiveRegion({ announcement }: { announcement: { text: string; n: number } }) {
  return (
    <span role="status" className="bek-visually-hidden">
      {announcement.text && <span key={announcement.n}>{announcement.text}</span>}
    </span>
  );
}

export interface FileListProps {
  items: UploaderFile[];
  label?: string;
  removeLabel?: string;
  retryLabel?: ReactNode;
  onRemove: (item: UploaderFile) => void;
  onRetry?: (item: UploaderFile) => void;
}

/** Tanlangan fayllar ro'yxati (File item'lar, gap scale/8). */
export function FileList({
  items,
  label,
  removeLabel,
  retryLabel,
  onRemove,
  onRetry,
}: FileListProps) {
  if (items.length === 0) return null;
  return (
    <ul className="bek-uploader__files" aria-label={label}>
      {items.map((item) => (
        <FileItem
          key={item.id}
          name={item.name}
          status={item.status}
          fileSize={item.size}
          progress={item.progress}
          meta={item.status === 'error' ? item.error : undefined}
          removeLabel={removeLabel}
          retryLabel={retryLabel}
          onRemove={() => onRemove(item)}
          onRetry={onRetry && item.status === 'error' ? () => onRetry(item) : undefined}
        />
      ))}
    </ul>
  );
}
