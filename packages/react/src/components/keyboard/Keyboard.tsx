import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';
import { BackspaceGlyph } from '../../icons/index.js';

export type KeyboardPlatform = 'ios' | 'android';
export type KeyboardType = 'alphabet' | 'numeric';

export interface KeyboardProps extends HTMLAttributes<HTMLDivElement> {
  platform?: KeyboardPlatform;
  /** alphabet — QWERTY (matn, qidiruv, ism); numeric — raqamli klaviatura (telefon, kod, summa: `inputmode="numeric"`). */
  type?: KeyboardType;
  /** iOS Alphabet'da taklif qatori. */
  suggestions?: string[];
  /** Return tugmasi yozuvi — Search · Go · Next · Done. */
  returnLabel?: string;
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const NUMERIC: [string, string][] = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
];

/**
 * Figma "10.3 Keyboard": ekran maketlari uchun tizim klaviaturasi (iOS 27 / Material 3 Gboard, BEK tokenlarida).
 * Haqiqiysini OS chizadi — bu faqat ko'rinadigan maydonni tekshirish uchun mock; interaktiv emas.
 */
export function Keyboard({
  platform = 'ios',
  type = 'alphabet',
  suggestions = ['“Design”', 'Designs', 'Designed'],
  returnLabel = 'return',
  className,
  ...rest
}: KeyboardProps) {
  const ios = platform === 'ios';
  return (
    <div
      aria-hidden="true"
      className={cx(
        'bek-keyboard',
        `bek-keyboard--${platform}`,
        `bek-keyboard--${type}`,
        className,
      )}
      {...rest}
    >
      {type === 'alphabet' ? (
        <>
          {ios && (
            <div className="bek-keyboard__suggestions">
              {suggestions.map((s, i) => (
                <span key={`${i}-${s}`} className="bek-keyboard__suggestion">
                  {s}
                </span>
              ))}
            </div>
          )}
          {ROWS.map((row, i) => (
            <div key={row} className="bek-keyboard__row">
              {i === 2 && (
                <span className="bek-keyboard__key bek-keyboard__key--function bek-keyboard__key--wide">
                  ⇧
                </span>
              )}
              {[...row].map((k) => (
                <span key={k} className="bek-keyboard__key">
                  {k}
                </span>
              ))}
              {i === 2 && (
                <span className="bek-keyboard__key bek-keyboard__key--function bek-keyboard__key--wide">
                  <BackspaceGlyph />
                </span>
              )}
            </div>
          ))}
          <div className="bek-keyboard__row">
            <span className="bek-keyboard__key bek-keyboard__key--function bek-keyboard__key--wide">
              {ios ? '123' : '?123'}
            </span>
            {!ios && <span className="bek-keyboard__key bek-keyboard__key--function">,</span>}
            <span className="bek-keyboard__key bek-keyboard__key--space">{ios ? 'space' : ''}</span>
            {!ios && <span className="bek-keyboard__key bek-keyboard__key--function">.</span>}
            <span className="bek-keyboard__key bek-keyboard__key--function bek-keyboard__key--wide bek-keyboard__key--return">
              {ios ? returnLabel : '↵'}
            </span>
          </div>
        </>
      ) : (
        <div className="bek-keyboard__pad">
          {NUMERIC.map(([digit, letters]) => (
            <span key={digit} className="bek-keyboard__key bek-keyboard__key--digit">
              {digit}
              <small>{letters}</small>
            </span>
          ))}
          <span className="bek-keyboard__key bek-keyboard__key--digit bek-keyboard__key--empty">
            {ios ? '' : '*'}
          </span>
          <span className="bek-keyboard__key bek-keyboard__key--digit">0</span>
          <span className="bek-keyboard__key bek-keyboard__key--digit bek-keyboard__key--function">
            <BackspaceGlyph />
          </span>
        </div>
      )}
      <div className="bek-keyboard__safe-area" />
    </div>
  );
}
