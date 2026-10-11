'use client';

import { Children, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph, ChevronRightGlyph } from '../../icons/index.js';
import { Button } from '../button/Button.js';

/** Figma ".Carousel/Indicator → Type". */
export type CarouselIndicator = 'dots' | 'fraction' | 'progress' | 'thumbnails';

export interface CarouselProps {
  /** Har bir bola — bitta slayd (rasm, karta, onboarding qadami). */
  children: ReactNode;
  /** Figma "Controls": `arrows` — strelka + indikator; `dots` (Figma "Dots only") — faqat indikator; `none`. */
  controls?: 'arrows' | 'dots' | 'none';
  /** Boshqaruv slayd ustida (`inside`) yoki ostida (`below`). */
  placement?: 'inside' | 'below';
  /** Keyingi slaydning chetini ko'rsatish. */
  peek?: boolean;
  /** Nuqtalar rasm ustida — oq variant. */
  onMedia?: boolean;
  /** Indikator turi: `dots` (nuqtalar) · `fraction` ("1 / 5") · `progress` (chiziq) · `thumbnails`. */
  indicator?: CarouselIndicator;
  /** `thumbnails` uchun: har bir slaydning kichik rasmi (slaydlar tartibida). */
  thumbnails?: ReactNode[];
  /** `thumbnails` joylashuvi: slayd ostida (`horizontal`) yoki yonida (`vertical`). */
  orientation?: 'horizontal' | 'vertical';
  /** Kichik rasm o'lchami: s 56 · m 64 px. */
  thumbSize?: 's' | 'm';
  /** Ekran o'quvchi uchun nom ("Aksiyalar"). */
  'aria-label': string;
  previousLabel?: string;
  nextLabel?: string;
  /** "Slayd 2 / 5" kabi matn. */
  slideLabel?: (index: number, total: number) => string;
  className?: string;
}

/** Figma "4.11 Carousel": scroll-snap asosidagi slaydlar — touch'da surish, klaviaturada Tab/strelka,
 *  indikator (nuqtalar · kasr · progress · kichik rasmlar) va strelkalar bilan. */
export function Carousel({
  children,
  controls = 'arrows',
  placement = 'inside',
  peek = false,
  onMedia = false,
  indicator = 'dots',
  thumbnails,
  orientation = 'horizontal',
  thumbSize = 's',
  'aria-label': ariaLabel,
  previousLabel = 'Previous slide',
  nextLabel = 'Next slide',
  slideLabel = (i, n) => `${i + 1} / ${n}`,
  className,
}: CarouselProps) {
  const slides = Children.toArray(children);
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = slides.length;
  const vertical = indicator === 'thumbnails' && orientation === 'vertical';

  const goTo = (index: number) => {
    const el = viewport.current;
    const target = el?.children[index] as HTMLElement | undefined;
    if (!el || !target) return;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };
  const onScroll = () => {
    const el = viewport.current;
    if (!el || !el.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth || el.clientWidth;
    setActive(Math.min(total - 1, Math.round(Math.abs(el.scrollLeft) / step)));
  };

  const showIndicator = controls !== 'none' && total > 1;
  let indicatorNode: ReactNode = null;
  if (showIndicator && indicator === 'dots') {
    indicatorNode = (
      <div className={cx('bek-carousel__dots', onMedia && 'bek-carousel__dots--on-media')}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            aria-label={slideLabel(i, total)}
            aria-current={i === active || undefined}
            className={cx('bek-carousel__dot', i === active && 'is-active')}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    );
  } else if (showIndicator && indicator === 'fraction') {
    indicatorNode = (
      <span className="bek-carousel__fraction" aria-live="polite">
        {slideLabel(active, total)}
      </span>
    );
  } else if (showIndicator && indicator === 'progress') {
    indicatorNode = (
      <div
        role="progressbar"
        aria-label={slideLabel(active, total)}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={active + 1}
        className="bek-carousel__progress"
      >
        <span
          className="bek-carousel__progress-bar"
          style={{ width: `${((active + 1) / total) * 100}%` }}
        />
      </div>
    );
  } else if (showIndicator && indicator === 'thumbnails') {
    indicatorNode = (
      <div className={cx('bek-carousel__thumbs', `bek-carousel__thumbs--${orientation}`)}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={slideLabel(i, total)}
            aria-current={i === active || undefined}
            className={cx(
              'bek-carousel__thumb',
              `bek-carousel__thumb--${thumbSize}`,
              i === active && 'is-active',
            )}
            onClick={() => goTo(i)}
          >
            {thumbnails?.[i]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cx(
        'bek-carousel',
        `bek-carousel--${placement}`,
        `bek-carousel--${indicator}`,
        vertical && 'bek-carousel--vertical',
        peek && 'bek-carousel--peek',
        className,
      )}
    >
      <div className="bek-carousel__frame">
        <div ref={viewport} className="bek-carousel__viewport" onScroll={onScroll}>
          {slides.map((slide, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel(i, total)}
              className="bek-carousel__slide"
            >
              {slide}
            </div>
          ))}
        </div>
        {controls === 'arrows' && total > 1 && (
          <>
            <Button
              variant="raised"
              size="l"
              iconOnly
              startIcon={<ChevronLeftGlyph />}
              className="bek-carousel__arrow bek-carousel__arrow--prev"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
            >
              {previousLabel}
            </Button>
            <Button
              variant="raised"
              size="l"
              iconOnly
              startIcon={<ChevronRightGlyph />}
              className="bek-carousel__arrow bek-carousel__arrow--next"
              disabled={active === total - 1}
              onClick={() => goTo(active + 1)}
            >
              {nextLabel}
            </Button>
          </>
        )}
      </div>
      {indicatorNode}
    </section>
  );
}
