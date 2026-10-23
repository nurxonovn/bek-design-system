// Gantt sanalari: hammasi "kalendar kuni" sifatida UTC yarim tunga keltiriladi — `2026-10-28` satri,
// `new Date(2026, 9, 28)` va vaqtli ISO bir xil kunni beradi, SSR va brauzerda bir xil natija.

/** Sana: `'2026-10-28'`, `Date` yoki millisekund. */
export type GanttDate = string | number | Date;

export const DAY_MS = 86_400_000;

/** Inglizcha qisqa oy nomlari (Figma: Oct · Nov · Dec). O'zbekcha uchun `labels.months` bering. */
export const GANTT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Sanani kun boshidagi UTC vaqtga keltiradi; noto'g'ri qiymat — `NaN`. */
export function dayTime(value: GanttDate): number {
  if (typeof value === 'string') {
    const m = ISO_DAY.exec(value);
    if (m) return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const d = value instanceof Date ? value : new Date(value);
  const t = d.getTime();
  if (!Number.isFinite(t)) return Number.NaN;
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Oy boshi (UTC). `offset` — necha oy keyin. */
export function monthStart(time: number, offset = 0): number {
  const d = new Date(time);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + offset, 1);
}

/** `[from, to)` oralig'idagi har oy boshi. */
export function monthTicks(from: number, to: number): number[] {
  const out: number[] = [];
  for (let t = monthStart(from); t < to; t = monthStart(t, 1)) out.push(t);
  return out;
}

/** `4 Dec` — kun va qisqa oy nomi. */
export function formatDay(time: number, months: readonly string[] = GANTT_MONTHS): string {
  const d = new Date(time);
  return `${d.getUTCDate()} ${months[d.getUTCMonth()] ?? ''}`.trim();
}
