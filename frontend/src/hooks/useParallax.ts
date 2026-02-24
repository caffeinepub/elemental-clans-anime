import { useEffect, useRef } from 'react';

/**
 * Applies a CSS translateY parallax effect to the referenced element.
 * On mobile/touch devices the effect is disabled for performance.
 *
 * @param speed  Fraction of scroll offset applied to the element (0.5 = half speed).
 */
export function useParallax(speed: number = 0.45) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch/mobile devices
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Also skip if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (el) {
            const offset = window.scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}
