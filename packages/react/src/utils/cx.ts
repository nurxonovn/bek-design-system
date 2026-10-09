import { clsx, type ClassValue } from 'clsx';

/** Class nomlarini birlashtiradi (shartli klasslar uchun). */
export function cx(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
