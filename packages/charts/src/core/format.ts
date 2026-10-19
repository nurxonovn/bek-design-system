// uz-UZ raqam formati (Figma 4.18 Chart qoidasi): minglik — bo'shliq (12 400), kasr — vergul (4,8),
// manfiy — haqiqiy minus belgisi U+2212 (−3,1%). Brauzer Intl'iga bog'liq emas — SSR va testlarda bir xil.

/** Minglik ajratgich: bo'linmaydigan bo'shliq — raqam qatorga bo'linib ketmaydi. */
export const GROUP = ' ';
/** Haqiqiy minus belgisi (U+2212). */
export const MINUS = '−';

export interface FormatNumberOptions {
  /** Kasr xonalari. Standart: 0. */
  decimals?: number;
  /** `+` belgisini musbat qiymatga ham qo'yish (delta, o'zgarish). */
  signed?: boolean;
  /** Katta sonlarni qisqartirish: 4 820 000 → `4,8 mln`, 1,2 mlrd. */
  compact?: boolean;
}

const COMPACT: [number, string][] = [
  [1e12, 'trln'],
  [1e9, 'mlrd'],
  [1e6, 'mln'],
];

function group(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP);
}

/** `12400` → `12 400`; `-3.14, {decimals: 1}` → `−3,1`; `4820000, {compact: true}` → `4,8 mln`. */
export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
  if (!Number.isFinite(value)) return '—';
  const { signed = false, compact = false } = options;
  let decimals = options.decimals ?? 0;
  let abs = Math.abs(value);
  let suffix = '';
  if (compact) {
    // 999 960 000 → 1 mlrd (yaxlitlash keyingi birlikka o'tkazsa).
    const hit = COMPACT.find(([n]) => abs >= n * 0.9995);
    if (hit) {
      abs /= hit[0];
      suffix = `${GROUP}${hit[1]}`;
      if (options.decimals === undefined) decimals = abs < 10 ? 1 : 0;
    }
  }
  const fixed = abs.toFixed(decimals);
  const [i, d] = fixed.split('.');
  // Aniq `decimals` berilsa nollar saqlanadi (12,0%); avtomatik qisqartirishda `4,0 mln` → `4 mln`.
  const keepZeros = options.decimals !== undefined;
  const body = group(i) + (d && (keepZeros || Number(d) !== 0) ? `,${d}` : '');
  const isZero = Number(fixed) === 0;
  const sign = value < 0 && !isZero ? MINUS : signed && !isZero ? '+' : '';
  return `${sign}${body}${suffix}`;
}

/** Foiz: `12.4` → `12,4%`; `{signed: true}` bilan `+12,4%`, manfiyda `−3,1%`. */
export function formatPercent(value: number, options: FormatNumberOptions = {}): string {
  return `${formatNumber(value, { decimals: 1, ...options })}%`;
}
