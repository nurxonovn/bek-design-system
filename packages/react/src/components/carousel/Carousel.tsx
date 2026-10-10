'use client';

import { Children, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph, ChevronRightGlyph } from '../../icons/index.js';
import { Button } from '../button/Button.js';

export interface CarouselProps {
  /** Har bir bola — bitta slayd (rasm, karta, onboarding qadami). */
  children: ReactNode;
  /** `arrows` — strelka + nuqtalar; `dots` — faqat nuqtalar; `none`. */
  controls?: 'arrows' | 'dots' | 'none';
  /** Boshqaruv slayd ustida (`inside`) yoki ostida (`below`). */
  placement?: 'inside' | 'below';
  /** Keyingi slaydning chetini ko'rsatish. */
  peek?: boolean;
  /** Nuqtalar rasm ustida — oq variant. */
  onMedia?: boolean;
  /** Ekran o'quvchi uchun nom ("Aksiyalar"). */
  'aria-label': string;
  previousLabel?: string;
  nextLabel?: string;
  /** "Slayd 2 / 5" kabi matn. */
  slideLabel?: (index: number, total: number) => string;
  className?: string;
}

/** Figma "4.11 Carousel": scroll-snap asosidagi slaydlar — touch'da surish, klaviaturada Tab/strelka,
 *  nuqtalar va strelkalar bilan. */
export function Carousel({
  children,
  controls = 'arrows',
  placement = 'inside',
  peek = false,
  onMedia = false,
  'aria-label': ariaLabel,
  previousLabel = 'Previous slide',
  nextLabel = 'Next slide',
  slideLabel = (i, n) => `${i + 1} / ${n}`,
  className,
}: CarouselProps) {
  const slides = Children.toArray(children);
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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
    setActive(Math.min(slides.length - 1, Math.round(Math.abs(el.scrollLeft) / step)));
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cx(
        'bek-carousel',
        `bek-carousel--${placement}`,
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
              aria-label={slideLabel(i, slides.length)}
              className="bek-carousel__slide"
            >
              {slide}
            </div>
          ))}
        </div>
        {controls === 'arrows' && slides.length > 1 && (
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
              disabled={active === slides.length - 1}
              onClick={() => goTo(active + 1)}
            >
              {nextLabel}
            </Button>
          </>
        )}
      </div>
      {controls !== 'none' && slides.length > 1 && (
        <div className={cx('bek-carousel__dots', onMedia && 'bek-carousel__dots--on-media')}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-label={slideLabel(i, slides.length)}
              aria-current={i === active || undefined}
              className={cx('bek-carousel__dot', i === active && 'is-active')}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
