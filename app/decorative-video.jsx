'use client';

import { useEffect, useRef } from 'react';
import { inView } from 'motion';
import { useLoadedAssets } from './asset-loader';

/** Play decorative videos only while visible, respecting reduced motion. */
export default function DecorativeVideo({ src, className, style, active, ...props }) {
  const ref = useRef(null);
  const assets = useLoadedAssets();
  const source = assets.videos[src] || src;
  useEffect(() => {
    if (!assets.ready) return;
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
  }, [source, active, assets.ready]);

  return <video ref={ref} src={assets.ready ? source : undefined} className={className} style={style}
    muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} {...props} />;
}
