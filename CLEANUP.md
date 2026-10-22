# Gradual React cleanup

This is a behavior-preserving migration of the current Dmall design, not a redesign.

## First batch

- FAQ: content objects, real buttons, React state and Motion height transitions. Hidden answer links are inert until their answer opens. `faq.module.css` owns layout, type and breakpoints.
- About Dmall: server-rendered JSX and `instructor.module.css`. The obsolete video effect was removed because this section uses the Dmall logo panel.
- Training preview: JSX, structured copy, local CSS and declarative heading/tilt motion.
- Problem / Solution: shared `ServicesOverview` with content arrays, the existing video assets, original tall-card positions and local CSS.
- Section labels: one reusable component with its own CSS module; no Framer classes.
- Pricing / Case studies: already clean JSX; their unused HTML JSON files were removed.
- Video visibility and reduced-motion playback live in `DecorativeVideo` instead of separate copies of the same effect.

Seven obsolete HTML JSON files (68,065 bytes) were deleted. Retired selectors were removed individually from shared rules, preserving selectors used by remaining sections. This reduced `reference.css` from 182,400 to 167,876 bytes. Obsolete FAQ, package and about-panel overrides were removed from global CSS. The business-content refresh script no longer contains the retired FAQ, pricing, case-study or instructor rewrite branches.

## Remaining migration

1. Blog/services links, audience and freedom bento sections.
2. Review and curriculum carousels, retaining their existing loop behavior.
3. Hero and navigation, including decorative SVGs and notification ticker.
4. Closing testimonial ticker and responsive footer.
5. Remove the final legacy HTML JSON files and `reference.css` once their last consumers are migrated; consolidate base resets, typography and shared tokens.

The remaining legacy files stay in place while their sections still use them. Content-only files such as `dmall-content.json` are intentional data, not HTML markup.

## Review boundary

No build, automated test or post-change browser check was run for this batch, at the user's request. The user is reviewing visual continuity. Avoid claiming pixel equality before that review.

## Layout and animation restoration

The later clean Hero/Navbar and carousel components had changed several source dimensions and effects. Restored these in the React components and CSS modules, without returning to injected HTML:

- Hero: 72/60/48px heading scale, 20/16px description, 164/160/120px top spacing, original lower spacing, 592/388px video, 68/52px column gaps and the 12-second notification loop with an exact repeated-track offset.
- Hero and navigation: original rolling text hover, button padding/type, delayed entrances, letter blur reveal, non-sticky navigation and responsive content widths.
- Curriculum: visible neighboring modules, 420px cards with 24px gaps, 28px padding, original video ratio and text scale, manual continuous loop, and playback for every module while the carousel is visible.
- Reviews: bounded viewport for three desktop cards, original responsive section spacing, heading badge positioning and entrance animation hook.
- Other sections: reconnect viewport reveals through semantic data attributes and restore the reference heading/card font scale across desktop, tablet and mobile.

No build, automated tests or browser verification was run for this restoration, following the user's request. Visual parity remains subject to their review.

## Service illustrations

The six unrelated videos in “Ready to grow online?” and “Build with Dmall” are now code-rendered storefront, campaign and learning illustrations. Their content entries select a named visual instead of a video URL. Motion pauses offscreen and respects reduced motion. Each visual fits its available space independently of the card text; mobile cards grow with their content to avoid overlap. No build or browser verification was run, following the existing review boundary.
