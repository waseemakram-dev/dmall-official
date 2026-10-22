'use client';

import { useEffect } from 'react';
import { animate, inView } from 'motion';

/** Restore viewport entrances without relying on generated Framer class names. */
export default function SectionMotion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const controls = new Set();
    let cleanups = [];
    const stop = () => {
      cleanups.forEach(cleanup => cleanup());
      cleanups = [];
      controls.forEach(control => control.complete());
      controls.clear();
    };
    const start = () => {
      stop();
      if (reduced.matches) return;
      document.querySelectorAll('[data-motion-reveal],.editorial-service-panel,.dmall-case-copy,.dmall-case-showcase,.dmall-results-heading,.editorial-services-header').forEach(node => {
        const reveal = () => {
          const siblings = node.parentElement ? [...node.parentElement.children] : [];
          const stagger = node.hasAttribute('data-motion-card') || node.classList.contains('editorial-service-panel');
          const control = animate(node, { opacity: [0, 1], y: [20, 0], filter: ['blur(3px)', 'blur(0px)'] }, {
            duration: .65, delay: stagger ? siblings.indexOf(node) % 3 * .08 : 0, ease: [.22, 1, .36, 1],
          });
          controls.add(control);
          Promise.resolve(control).then(() => controls.delete(control));
        };
        cleanups.push(inView(node, reveal, { amount: .12 }));
      });
    };
    start();
    reduced.addEventListener('change', start);
    return () => { stop(); reduced.removeEventListener('change', start); };
  }, []);
  return null;
}
