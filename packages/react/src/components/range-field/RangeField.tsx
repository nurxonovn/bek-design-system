import { useId } from 'react';
import { cx } from '../../utils/cx.js';
import { Fieldset, type FieldsetProps } from '../fieldset/Fieldset.js';
import { TextField, type TextFieldProps } from '../text-field/TextField.js';

/** From/To maydoni — Text field L Filled; o'lcham, variant, xato va yordamchi matn guruhdan keladi. */
export type RangeFieldInputProps = Omit<
  TextFieldProps,
  'size' | 'variant' | 'error' | 'supportingText'
>;

export interface RangeFieldProps
  extends Omit<FieldsetProps, 'children' | 'status' | 'layout' | 'defaultValue' | 'onChange'> {
  /** "From" maydoni. `label` standarti — "From". */
  from?: RangeFieldInputProps;
  /** "To" maydoni. `label` standarti — "To". */
  to?: RangeFieldInputProps;
  /** Figma "Message": helper · error. Error ikkala maydonni Error holatiga o'tkazadi, xabar bitta — juftlik ostida. */
  status?: 'helper' | 'error';
}

/**
 * Figma "3.20 Field groups → Range field": bitta label ostida ikki Text field (From · To), birga tekshiriladi
 * va bitta umumiy xabarga ega (narx, sana, yosh). Anatomiyasi Fieldset (3.19) bilan bir xil.
 */
export function RangeField({
  from,
  to,
  status = 'helper',
  message,
  disabled,
  className,
  ...rest
}: RangeFieldProps) {
  const messageId = `bek-range-msg-${useId().replace(/:/g, '')}`;
  const error = status === 'error' && Boolean(message);

  const field = (input: RangeFieldInputProps | undefined, fallbackLabel: string) => {
    // `supportingText` tipda yo'q, lekin JS'dan kelsa ham ikkinchi xabar chizilmaydi — xabar guruhda bitta.
    const {
      label,
      supportingText: _supportingText,
      'aria-describedby': describedBy,
      ...inputRest
    } = (input ?? {}) as TextFieldProps;
    return (
      <TextField
        {...inputRest}
        label={label ?? fallbackLabel}
        aria-describedby={cx(message ? messageId : undefined, describedBy) || undefined}
        disabled={disabled || inputRest.disabled}
        size="l"
        variant="filled"
        error={error}
      />
    );
  };

  return (
    <Fieldset
      {...rest}
      message={message}
      messageId={messageId}
      disabled={disabled}
      status={status}
      className={cx('bek-range-field', className)}
    >
      <div className="bek-range-field__row">
        {field(from, 'From')}
        {field(to, 'To')}
      </div>
    </Fieldset>
  );
}
