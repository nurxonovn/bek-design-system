import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export type SkeletonShape = 'text' | 'title' | 'circle' | 'rect' | 'list-row' | 'card';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Haqiqiy maketga mos shakl. */
  shape?: SkeletonShape;
  /** `text` uchun qatorlar soni (oxirgisi qisqa). */
  lines?: number;
}

const Bone = ({ className }: { className?: string }) => (
  <span className={cx('bek-skeleton__bone', className)} />
);

/**
 * Figma "5.7 Loading → Skeleton": ma'lumot yuklanguncha joy egallovchi. Ekran o'quvchidan
 * yashirin — yuklanayotgan blokka `aria-busy="true"` bering. Spinner bilan aralashtirilmaydi.
 */
export function Skeleton({ shape = 'text', lines = 3, className, ...rest }: SkeletonProps) {
  let bones;
  switch (shape) {
    case 'text':
      bones = Array.from({ length: Math.max(1, lines) }, (_, i) => <Bone key={i} />);
      break;
    case 'list-row':
      bones = (
        <>
          <Bone className="bek-skeleton__avatar" />
          <span className="bek-skeleton__lines">
            <Bone />
            <Bone />
          </span>
          <Bone className="bek-skeleton__trailing" />
        </>
      );
      break;
    case 'card':
      bones = (
        <>
          <Bone className="bek-skeleton__media" />
          <Bone />
          <Bone />
          <span className="bek-skeleton__footer">
            <Bone />
            <Bone className="bek-skeleton__button" />
          </span>
        </>
      );
      break;
    default:
      bones = <Bone />;
  }
  return (
    <div
      aria-hidden="true"
      {...rest}
      className={cx('bek-skeleton', `bek-skeleton--${shape}`, className)}
    >
      {bones}
    </div>
  );
}
