'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import styles from './continuous-carousel.module.css';

const wrap = (index, count) => ((index % count) + count) % count;

/** A repeated track advances in either direction and normalizes only after motion finishes. */
export default function ContinuousCarousel({ items, renderItem, label, threeAcross = false, autoplay = false, arrows = false, maxCardWidth = Infinity, className = '' }) {
  const viewport = useRef(null), track = useRef(null);
  const engine = useRef({ position: items.length, offset: 0, step: 0, queue: [], animation: null });
  const [position, setPosition] = useState(items.length);
  const [perView, setPerView] = useState(threeAcross ? 3 : 1);
  const [paused, setPaused] = useState(false);
  const pointer = useRef(null);
  const dragged = useRef(false);
  const visible = useInView(viewport, { amount: .2 });
  const reduced = useReducedMotion();
  const count = items.length;

  const advance = useCallback(() => {
    const state = engine.current;
    if (state.animation || !state.step || !state.queue.length) return;
    const direction = state.queue.shift();
    state.position += direction;
    setPosition(state.position);
    const destination = -state.step * state.position;
    const finish = () => {
      const animation = state.animation;
      state.position = count + wrap(state.position, count);
      state.offset = -state.step * state.position;
      track.current.style.transform = `translateX(${state.offset}px)`;
      state.animation = null;
      animation?.cancel();
      setPosition(state.position);
      advance();
    };
    if (reduced) { finish(); return; }
    state.animation = track.current.animate([
      { transform: `translateX(${state.offset}px)` },
      { transform: `translateX(${destination}px)` },
    ], { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    state.animation.onfinish = finish;
  }, [count, reduced]);

  const move = useCallback(direction => {
    engine.current.queue.push(direction);
    advance();
  }, [advance]);

  useEffect(() => {
    const measure = () => {
      const state = engine.current;
      state.queue = [];
      if (state.animation) state.animation.onfinish?.();
      const across = threeAcross && innerWidth >= 810 ? 3 : 1;
      const width = viewport.current.getBoundingClientRect().width;
      if (!width) return;
      const cardWidth = Math.min(maxCardWidth, (width - 24 * (across - 1)) / across);
      track.current.style.setProperty('--slide-size', `${cardWidth}px`);
      state.step = cardWidth + 24;
      state.offset = -state.step * state.position;
      track.current.style.transform = `translateX(${state.offset}px)`;
      setPerView(across);
    };
    const resize = new ResizeObserver(measure);
    resize.observe(viewport.current);
    measure();
    return () => { resize.disconnect(); engine.current.animation?.cancel(); engine.current.queue = []; };
  }, [threeAcross, maxCardWidth]);

  useEffect(() => {
    if (!autoplay || !visible || paused || reduced) return;
    const timer = setInterval(() => move(1), 1800);
    return () => clearInterval(timer);
  }, [autoplay, visible, paused, reduced, move]);

  const active = wrap(position, count);
  return <div ref={viewport} className={`${styles.viewport} ${arrows ? styles.withArrows : ''} ${className}`} role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0}
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
    <div ref={track} className={styles.track}
      onPointerDown={event => { dragged.current = false; if (event.button === 0) pointer.current = event.clientX; }}
      onPointerUp={event => { if (pointer.current === null) return; const delta = event.clientX - pointer.current; pointer.current = null; if (Math.abs(delta) > 40) { dragged.current = true; event.preventDefault(); move(delta < 0 ? 1 : -1); } }}
      onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }}
      onPointerCancel={() => { pointer.current = null; }} onDragStart={event => event.preventDefault()}>
      {Array.from({ length: count * 3 }, (_, physical) => {
        const index = physical % count, shown = physical >= position && physical < position + perView;
        return <div key={physical} className={styles.slide} role="group" aria-label={`${index + 1} of ${count}`} aria-hidden={!shown} inert={!shown}>
          {renderItem(items[index], index, visible)}
        </div>;
      })}
    </div>
    {arrows && <div className={styles.arrows}><button type="button" aria-label="Previous" onClick={() => move(-1)}><Arrow back /></button><button type="button" aria-label="Next" onClick={() => move(1)}><Arrow /></button></div>}
    {threeAcross && <div className={styles.dots} aria-label="Choose a review">{items.map((item, index) => <button key={index} type="button" aria-label={`Scroll to page ${index + 1}`} aria-current={index === active}
      onClick={() => { const distance = wrap(index - active, count); for (let step = 0; step < distance; step++) move(1); }} />)}</div>}
  </div>;
}

function Arrow({ back = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={back ? 'm14 5-7 7 7 7' : 'm9 5 7 7-7 7'} /></svg>;
}
