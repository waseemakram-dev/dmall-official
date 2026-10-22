'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/** Declarative viewport motion for decorative elements; content remains visible without JS. */
export default function DecorationMotion({ children, className, mode = 'reveal', x = 0, y = 0, delay = 0, ...props }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const visible = useInView(ref, { amount: mode === 'reveal' ? .8 : .15 });
  const loop = mode === 'tilt' || mode === 'clock';
  const hidden = loop ? { rotate: mode === 'clock' ? 0 : 5 } : { opacity: 0, x, y };
  const shown = loop ? { rotate: [mode === 'clock' ? 0 : 5, mode === 'clock' ? -15 : -12] } : { opacity: 1, x: 0, y: 0 };
  const transition = reduced ? { duration: 0 } : loop
    ? { type: 'spring', duration: mode === 'clock' ? .2 : 1, bounce: mode === 'clock' ? .85 : .25, repeat: Infinity, repeatType: 'mirror', repeatDelay: mode === 'clock' ? .2 : .4 }
    : { type: 'spring', stiffness: 200, damping: 30, mass: 1, delay };

  return <motion.div ref={ref} className={className} initial={false}
    animate={mode === 'none' ? undefined : reduced ? (loop ? { rotate: 0 } : { opacity: 1, x: 0, y: 0 }) : visible ? shown : hidden}
    transition={transition} {...props}>{children}</motion.div>;
}
