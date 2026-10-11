'use client';

import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react';

export interface DialogBehaviour {
  open: boolean;
  onClose: () => void;
  /** `false` — Esc va scrim yopmaydi (Alert dialog). */
  dismissible?: boolean;
}

/** Native `<dialog>` ni `open` bilan sinxronlaydi: showModal (fokus tuzog'i, inert fon, Esc). */
export function useDialog({ open, onClose, dismissible = true }: DialogBehaviour) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return {
    ref,
    onCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      if (dismissible) onClose();
    },
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      if (dismissible && event.target === event.currentTarget) onClose();
    },
  };
}
