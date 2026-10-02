import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) return;

    el.classList.add('reveal-hidden');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);

    const timer = setTimeout(() => {
      el.classList.add('is-revealed');
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return ref;
}

export function useRevealStagger<T extends HTMLElement = HTMLElement>(count: number) {
  const refs = useRef<(T | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const observers: IntersectionObserver[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    refs.current.forEach((el, index) => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) return;

      el.style.transitionDelay = `${index * 80}ms`;
      el.classList.add('reveal-hidden');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' }
      );

      observer.observe(el);
      observers.push(observer);

      const timer = setTimeout(() => {
        el.classList.add('is-revealed');
      }, 2000 + index * 80);
      timers.push(timer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      timers.forEach((t) => clearTimeout(t));
    };
  }, [count]);

  return refs;
}
