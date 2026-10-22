function Arrow({ direction }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" focusable="false">
    {direction === '→' ? <path d="M4 12h15m-6-6 6 6-6 6" /> : <path d="m5 19 14-14M7 5h12v12" />}
  </svg>;
}

export default function AnimatedLink({ children, className = '', arrow = '↗', ...props }) {
  return <a className={`${className} dmall-animated-link`} {...props}>
    <span className="dmall-motion-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
    <span className="dmall-motion-arrow" aria-hidden="true"><span><Arrow direction={arrow} /></span><span><Arrow direction={arrow} /></span></span>
  </a>;
}
