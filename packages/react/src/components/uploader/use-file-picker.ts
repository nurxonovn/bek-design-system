'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from 'react';

/** Figma "File item → Status" (kichik harfda). */
export type UploadStatus = 'uploading' | 'done' | 'error';

/** Ro'yxatdagi bitta fayl. `files` prop'i orqali boshqariladi yoki komponent o'zi yig'adi. */
export interface UploaderFile {
  /** Barqaror kalit (React `key`, e'lonlar). */
  id: string;
  name: string;
  /** Hajm, baytda — "2.4 MB" ko'rinishida Meta qatoriga yoziladi. */
  size?: number;
  status?: UploadStatus;
  /** 0–100, `uploading` holatida. */
  progress?: number;
  /** Xato sababi ("File is over 10 MB") — `error` holatida Meta o'rnida. */
  error?: ReactNode;
  /** Brauzer fayli (komponent o'zi yig'ganda to'ldiriladi). */
  file?: File;
}

export type FileRejectionReason = 'file-too-large' | 'file-invalid-type' | 'too-many-files';

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

/** `aria-live` e'lonlari va rad etish sabablari matni (lokalizatsiya uchun almashtiring). */
export interface UploaderMessages {
  added: (count: number) => string;
  removed: (name: string) => string;
  uploaded: (name: string) => string;
  failed: (name: string) => string;
  tooLarge: (maxSize: number) => string;
  invalidType: () => string;
  tooMany: () => string;
}

export const defaultUploaderMessages: UploaderMessages = {
  added: (count) => (count === 1 ? '1 file added' : `${count} files added`),
  removed: (name) => `${name} removed`,
  uploaded: (name) => `${name} uploaded`,
  failed: (name) => `${name}: upload failed`,
  tooLarge: (maxSize) => `Upload failed — file is over ${formatFileSize(maxSize)}`,
  invalidType: () => 'Upload failed — this file type is not accepted',
  tooMany: () => 'Upload failed — only one file can be added',
};

const UNITS = ['B', 'KB', 'MB', 'GB'] as const;
const KILO = 1024;

/** 2516582 → "2.4 MB". 10 dan kichik qiymat bir kasr bilan, kattasi butun. */
export function formatFileSize(bytes: number): string {
  let value = Math.max(bytes, 0);
  let unit = 0;
  while (value >= KILO && unit < UNITS.length - 1) {
    value /= KILO;
    unit += 1;
  }
  const text = unit === 0 || value >= 10 ? String(Math.round(value)) : value.toFixed(1);
  return `${text} ${UNITS[unit]}`;
}

/** `accept` atributi qoidasi bo'yicha tekshiruv: `.pdf`, `image/*`, `application/pdf`. */
export function matchesAccept(file: { name: string; type: string }, accept?: string): boolean {
  if (!accept?.trim()) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith('.')) return name.endsWith(token);
      if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}

export interface FileRules {
  accept?: string;
  /** Eng katta hajm, baytda. */
  maxSize?: number;
  multiple?: boolean;
}

/** Tanlangan/tashlangan fayllarni `accept`, `maxSize`, `multiple` bo'yicha ajratadi. */
export function validateFiles(
  files: readonly File[],
  { accept, maxSize, multiple = false }: FileRules,
): { accepted: File[]; rejected: FileRejection[] } {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    if (!matchesAccept(file, accept)) rejected.push({ file, reason: 'file-invalid-type' });
    else if (maxSize !== undefined && file.size > maxSize)
      rejected.push({ file, reason: 'file-too-large' });
    else if (!multiple && accepted.length > 0) rejected.push({ file, reason: 'too-many-files' });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

export function rejectionMessage(
  reason: FileRejectionReason,
  messages: UploaderMessages,
  maxSize = 0,
): string {
  if (reason === 'file-too-large') return messages.tooLarge(maxSize);
  if (reason === 'file-invalid-type') return messages.invalidType();
  return messages.tooMany();
}

/** Uploader'larning umumiy prop'lari. */
export interface FilePickerOptions extends FileRules {
  disabled?: boolean;
  /** Boshqariladigan ro'yxat. Berilmasa komponent tanlangan fayllarni o'zi saqlaydi (`done`). */
  files?: UploaderFile[];
  /** Yangi fayllar: `accepted` — qoidaga mos, `rejected` — sababi bilan. */
  onFilesAdded?: (accepted: File[], rejected: FileRejection[]) => void;
  /** Remove tugmasi. Boshqarilmaydigan rejimda fayl ro'yxatdan o'zi olib tashlanadi. */
  onRemove?: (file: UploaderFile) => void;
  /** Retry havolasi (`error` holatidagi fayl). */
  onRetry?: (file: UploaderFile) => void;
  messages?: Partial<UploaderMessages>;
}

// Ichki <input type="file"> ro'yxati saqlangan fayllarga teng bo'lsin — oddiy <form> yuborishda ham
// to'g'ri fayllar ketadi. DataTransfer konstruktori yo'q eski brauzerda input o'z holicha qoladi.
function syncInput(input: HTMLInputElement | null, files: File[]) {
  if (!input || typeof DataTransfer === 'undefined') return;
  try {
    const transfer = new DataTransfer();
    for (const file of files) transfer.items.add(file);
    input.files = transfer.files;
  } catch {
    if (!files.length) input.value = '';
  }
}

const hasFiles = (event: DragEvent) =>
  Array.from(event.dataTransfer?.types ?? []).includes('Files');

/** Fayl tanlash, tekshirish, drag-and-drop va `aria-live` e'lonlari — Uploader qismlari uchun umumiy. */
export function useFilePicker({
  accept,
  maxSize,
  multiple = false,
  disabled = false,
  files,
  onFilesAdded,
  onRemove,
  onRetry,
  messages: messagesProp,
}: FilePickerOptions) {
  const messages = { ...defaultUploaderMessages, ...messagesProp };
  const baseId = useId().replace(/:/g, '');
  const inputRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);
  const dragDepth = useRef(0);
  const [ownFiles, setOwnFiles] = useState<UploaderFile[]>([]);
  const [announcement, setAnnouncement] = useState({ text: '', n: 0 });
  const [dragOver, setDragOver] = useState(false);
  const controlled = files !== undefined;
  const items = controlled ? files : ownFiles;

  const announce = useCallback(
    (text: string) => setAnnouncement((a) => ({ text, n: a.n + 1 })),
    [],
  );

  // Boshqariladigan ro'yxatda holat o'zgarishini e'lon qilish: uploading → done / error.
  const prevStatus = useRef(new Map<string, UploadStatus | undefined>());
  useEffect(() => {
    if (!controlled) return;
    const next = new Map<string, UploadStatus | undefined>();
    for (const f of files) {
      const before = prevStatus.current.get(f.id);
      if (prevStatus.current.has(f.id) && before !== f.status) {
        if (f.status === 'done') announce(messages.uploaded(f.name));
        if (f.status === 'error') announce(messages.failed(f.name));
      }
      next.set(f.id, f.status);
    }
    prevStatus.current = next;
  });

  const addFiles = (list: readonly File[]) => {
    if (disabled || list.length === 0) return;
    const { accepted, rejected } = validateFiles(list, { accept, maxSize, multiple });
    onFilesAdded?.(accepted, rejected);
    const notes = rejected.map(
      (r) => `${r.file.name}: ${rejectionMessage(r.reason, messages, maxSize)}`,
    );
    announce(
      [accepted.length ? messages.added(accepted.length) : '', ...notes].filter(Boolean).join('. '),
    );
    if (controlled) {
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    const make = (file: File, extra: Partial<UploaderFile>): UploaderFile => ({
      id: `${baseId}-${(counter.current += 1)}`,
      name: file.name,
      size: file.size,
      status: 'done',
      file,
      ...extra,
    });
    const added = [
      ...accepted.map((file) => make(file, {})),
      ...rejected.map((r) =>
        make(r.file, { status: 'error', error: rejectionMessage(r.reason, messages, maxSize) }),
      ),
    ];
    const kept = multiple ? [...ownFiles, ...added] : added;
    setOwnFiles(kept);
    syncInput(
      inputRef.current,
      kept.filter((f) => f.status !== 'error' && f.file).map((f) => f.file as File),
    );
  };

  const remove = (item: UploaderFile) => {
    onRemove?.(item);
    announce(messages.removed(item.name));
    if (controlled) return;
    const kept = ownFiles.filter((f) => f.id !== item.id);
    setOwnFiles(kept);
    syncInput(
      inputRef.current,
      kept.filter((f) => f.status !== 'error' && f.file).map((f) => f.file as File),
    );
  };

  const open = () => {
    if (!disabled) inputRef.current?.click();
  };

  const inputProps = {
    ref: inputRef,
    type: 'file' as const,
    accept,
    multiple,
    disabled,
    tabIndex: -1,
    'aria-hidden': true as const,
    className: 'bek-visually-hidden',
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      addFiles(Array.from(event.target.files ?? [])),
  };

  const dropProps = {
    onDragEnter: (event: DragEvent<HTMLElement>) => {
      if (disabled || !hasFiles(event)) return;
      event.preventDefault();
      dragDepth.current += 1;
      setDragOver(true);
    },
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (disabled || !hasFiles(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    },
    onDragLeave: () => {
      dragDepth.current = Math.max(dragDepth.current - 1, 0);
      if (dragDepth.current === 0) setDragOver(false);
    },
    onDrop: (event: DragEvent<HTMLElement>) => {
      if (disabled) return;
      event.preventDefault();
      dragDepth.current = 0;
      setDragOver(false);
      addFiles(Array.from(event.dataTransfer.files));
    },
  };

  return {
    items,
    inputProps,
    dropProps,
    dragOver,
    open,
    remove,
    retry: onRetry,
    announcement,
    messages,
    baseId,
  };
}
