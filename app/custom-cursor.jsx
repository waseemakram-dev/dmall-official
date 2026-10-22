'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursor=useRef(null);
  useEffect(()=>{
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    const html=document.documentElement;
    const node=cursor.current;
    const hide=()=>{node.style.opacity='0';html.removeAttribute('data-custom-cursor');};
    const move=event=>{
      if(!fine.matches||event.pointerType!=='mouse'){hide();return;}
      node.style.transform=`translate3d(${event.clientX-3.5}px,${event.clientY-.5}px,0)`;
      node.style.opacity='1';
      html.setAttribute('data-custom-cursor','true');
    };
    const key=event=>{if(event.key==='Tab')hide();};
    window.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('pointerleave',hide);
    window.addEventListener('blur',hide);
    window.addEventListener('keydown',key);
    fine.addEventListener('change',hide);
    return ()=>{
      hide();window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',hide);
      window.removeEventListener('blur',hide);window.removeEventListener('keydown',key);fine.removeEventListener('change',hide);
    };
  },[]);
  return <div ref={cursor} className="reference-cursor" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 25.896 25.896" overflow="visible"><defs><linearGradient id="reference-cursor-purple" x1="0.49751243781094523" x2="0.5024875621890548" y1="0" y2="1"><stop offset="0" stopColor="#40B9DB"/><stop offset="1" stopColor="#1b6579"/></linearGradient></defs><path d="M 3.604 0.158 C 1.465 -0.593 -0.593 1.465 0.158 3.604 L 7.346 24.088 C 8.162 26.414 11.41 26.523 12.382 24.258 L 15.946 15.946 L 24.258 12.382 C 26.523 11.41 26.414 8.162 24.088 7.346 Z" fill="url(#reference-cursor-purple)"/></svg></div>;
}
