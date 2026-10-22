'use client';

import { useEffect, useRef } from 'react';
import { inView } from 'motion';

/** Play decorative videos only while visible, respecting reduced motion. */
export default function DecorativeVideo({ src, className, style, active, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = active ?? false;
    const sync = () => {
      if (visible && !reduced.matches) video.play().catch(() => {});
      else video.pause();
    };
    const stop = active === undefined ? inView(video, () => {
      visible = true;
      sync();
      return () => { visible = false; sync(); };
    }, { amount: .15 }) : () => {};
    sync();
    reduced.addEventListener('change', sync);
    return () => { stop(); video.pause(); reduced.removeEventListener('change', sync); };
  }, [src, active]);

  return <video ref={ref} src={src} className={className} style={style}
    muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} {...props} />;
}
