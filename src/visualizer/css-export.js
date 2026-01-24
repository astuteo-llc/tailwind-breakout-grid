/**
 * Breakout Grid Visualizer - CSS Export
 * Generates standalone CSS from plugin configuration
 */

// Version injected at build time by Vite
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev';

export { VERSION as CSS_EXPORT_VERSION };

export function generateCSSExport(c) {
  // Extract breakout config with fallbacks
  const breakoutMin = c.breakoutMin || '1rem';
  const breakoutScale = c.breakoutScale || '5vw';

  return `/**
 * Breakout Grid - Standalone CSS
 * Version: ${VERSION}
 * Generated from Tailwind Breakout Grid Plugin
 * https://github.com/astuteo-llc/tailwind-breakout-grid
 *
 * NOTE: This CSS export feature is in beta and not fully tested.
 * Please verify output before using in production.
 */

/* ========================================
   CSS Custom Properties
   ======================================== */
:root {
  /* Base measurements */
  --base-gap: ${c.baseGap};
  --max-gap: ${c.maxGap};
  --content-min: ${c.contentMin};
  --content-max: ${c.contentMax};
  --content-base: ${c.contentBase};

  /* Computed values */
  --gap: clamp(var(--base-gap), ${c.gapScale?.default || '4vw'}, var(--max-gap));
  --computed-gap: max(var(--gap), calc((100vw - var(--content)) / 10));
  --content: min(clamp(var(--content-min), var(--content-base), var(--content-max)), 100% - var(--gap) * 2);
  --content-inset: min(clamp(var(--content-min), var(--content-base), var(--content-max)), calc(100% - var(--gap)));
  --content-half: calc(var(--content) / 2);

  /* Track widths */
  --full: minmax(var(--gap), 1fr);
  --feature: minmax(0, clamp(${c.featureMin}, ${c.featureScale}, ${c.featureMax})); /* min: ${c.featureMin}, scale: ${c.featureScale}, max: ${c.featureMax} */
  --popout: minmax(0, ${c.popoutWidth});
  --full-limit: ${c.fullLimit};

  /* Padding/margin utilities */
  --breakout-padding: clamp(${breakoutMin}, ${breakoutScale}, ${c.popoutWidth});
  --popout-to-content: clamp(${breakoutMin}, ${breakoutScale}, ${c.popoutWidth});
  --feature-to-content: calc(clamp(${c.featureMin}, ${c.featureScale}, ${c.featureMax}) + ${c.popoutWidth}); /* feature + popout widths */
}

/* Responsive gap scaling */
@media (min-width: 1024px) {
  :root {
    --gap: clamp(var(--base-gap), ${c.gapScale?.lg || c.gapScale?.default || '5vw'}, var(--max-gap));
  }
}

@media (min-width: 1280px) {
  :root {
    --gap: clamp(var(--base-gap), ${c.gapScale?.xl || c.gapScale?.lg || '6vw'}, var(--max-gap));
  }
}

/* ========================================
   Grid Container - Main
   ======================================== */
.grid-cols-breakout {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-half) [center-start center-end] var(--content-half) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

/* Default column for direct children */
.grid-cols-breakout > * { grid-column: ${c.defaultCol || 'content'}; }

/* Subgrid for nested alignment */
.grid-cols-breakout-subgrid {
  display: grid;
  grid-template-columns: subgrid;
}

/* ========================================
   Grid Container - Left Aligned Variants
   ======================================== */
.grid-cols-feature-left {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end full-end];
}

.grid-cols-popout-left {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end full-end];
}

.grid-cols-content-left {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end full-end];
}

/* ========================================
   Grid Container - Right Aligned Variants
   ======================================== */
.grid-cols-feature-right {
  display: grid;
  grid-template-columns:
    [full-start feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

.grid-cols-popout-right {
  display: grid;
  grid-template-columns:
    [full-start popout-start] var(--popout)
    [content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

.grid-cols-content-right {
  display: grid;
  grid-template-columns:
    [full-start content-start] var(--content-inset) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

/* ========================================
   Breakout Modifiers (for nested grids)
   ======================================== */
.grid-cols-breakout.breakout-to-content {
  grid-template-columns: [full-start feature-start popout-start content-start center-start] minmax(0, 1fr) [center-end content-end popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-popout {
  grid-template-columns: [full-start feature-start popout-start] var(--popout) [content-start center-start] minmax(0, 1fr) [center-end content-end] var(--popout) [popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-feature {
  grid-template-columns: [full-start feature-start] var(--feature) [popout-start] var(--popout) [content-start center-start] minmax(0, 1fr) [center-end content-end] var(--popout) [popout-end] var(--feature) [feature-end full-end];
}

/* None - disables grid for sidebar layouts; nested content blocks/components with col-* classes are ignored */
.breakout-none { display: block; }
.breakout-none-flex { display: flex; }
.breakout-none-grid { display: grid; }

/* ========================================
   Column Utilities - Basic
   ======================================== */
.col-full { grid-column: full; }
.col-feature { grid-column: feature; }
.col-popout { grid-column: popout; }
.col-content { grid-column: content; }
.col-center { grid-column: center; }

/* Backward compatibility: col-narrow maps to content */
.col-narrow { grid-column: content; }

/* ========================================
   Column Utilities - Start/End
   ======================================== */
.col-start-full { grid-column-start: full-start; }
.col-start-feature { grid-column-start: feature-start; }
.col-start-popout { grid-column-start: popout-start; }
.col-start-content { grid-column-start: content-start; }
.col-start-center { grid-column-start: center-start; }

/* Backward compatibility */
.col-start-narrow { grid-column-start: content-start; }

.col-end-full { grid-column-end: full-end; }
.col-end-feature { grid-column-end: feature-end; }
.col-end-popout { grid-column-end: popout-end; }
.col-end-content { grid-column-end: content-end; }
.col-end-center { grid-column-end: center-end; }

/* Backward compatibility */
.col-end-narrow { grid-column-end: content-end; }

/* ========================================
   Column Utilities - Left/Right Spans
   ======================================== */
.col-feature-left { grid-column: full-start / feature-end; }
.col-feature-right { grid-column: feature-start / full-end; }
.col-popout-left { grid-column: full-start / popout-end; }
.col-popout-right { grid-column: popout-start / full-end; }
.col-content-left { grid-column: full-start / content-end; }
.col-content-right { grid-column: content-start / full-end; }
.col-center-left { grid-column: full-start / center-end; }
.col-center-right { grid-column: center-start / full-end; }

/* Backward compatibility */
.col-narrow-left { grid-column: full-start / content-end; }
.col-narrow-right { grid-column: content-start / full-end; }

/* ========================================
   Column Utilities - Advanced Spans
   ======================================== */
/* Feature to other columns */
.col-feature-to-popout { grid-column: feature-start / popout-end; }
.col-feature-to-content { grid-column: feature-start / content-end; }
.col-feature-to-center { grid-column: feature-start / center-end; }

/* Popout to other columns */
.col-popout-to-content { grid-column: popout-start / content-end; }
.col-popout-to-center { grid-column: popout-start / center-end; }
.col-popout-to-feature { grid-column: popout-start / feature-end; }

/* Content to other columns */
.col-content-to-center { grid-column: content-start / center-end; }
.col-content-to-popout { grid-column: content-start / popout-end; }
.col-content-to-feature { grid-column: content-start / feature-end; }

/* Full limit */
.col-full-limit {
  grid-column: full;
  width: 100%;
  max-width: var(--full-limit);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* ========================================
   Padding Utilities - Breakout
   ======================================== */
.p-breakout { padding: var(--breakout-padding); }
.px-breakout { padding-left: var(--breakout-padding); padding-right: var(--breakout-padding); }
.py-breakout { padding-top: var(--breakout-padding); padding-bottom: var(--breakout-padding); }
.pl-breakout { padding-left: var(--breakout-padding); }
.pr-breakout { padding-right: var(--breakout-padding); }
.pt-breakout { padding-top: var(--breakout-padding); }
.pb-breakout { padding-bottom: var(--breakout-padding); }

/* ========================================
   Padding Utilities - Gap
   ======================================== */
.p-gap { padding: var(--gap); }
.px-gap { padding-left: var(--gap); padding-right: var(--gap); }
.py-gap { padding-top: var(--gap); padding-bottom: var(--gap); }
.pl-gap { padding-left: var(--gap); }
.pr-gap { padding-right: var(--gap); }
.pt-gap { padding-top: var(--gap); }
.pb-gap { padding-bottom: var(--gap); }

/* ========================================
   Padding Utilities - Full Gap (computed)
   ======================================== */
.p-full-gap { padding: var(--computed-gap); }
.px-full-gap { padding-left: var(--computed-gap); padding-right: var(--computed-gap); }
.py-full-gap { padding-top: var(--computed-gap); padding-bottom: var(--computed-gap); }
.pl-full-gap { padding-left: var(--computed-gap); }
.pr-full-gap { padding-right: var(--computed-gap); }
.pt-full-gap { padding-top: var(--computed-gap); }
.pb-full-gap { padding-bottom: var(--computed-gap); }

/* ========================================
   Padding Utilities - Popout
   ======================================== */
.p-popout { padding: var(--popout); }
.px-popout { padding-left: var(--popout); padding-right: var(--popout); }
.py-popout { padding-top: var(--popout); padding-bottom: var(--popout); }
.pl-popout { padding-left: var(--popout); }
.pr-popout { padding-right: var(--popout); }
.pt-popout { padding-top: var(--popout); }
.pb-popout { padding-bottom: var(--popout); }

/* ========================================
   Padding Utilities - Alignment
   ======================================== */
.p-popout-to-content { padding: var(--popout-to-content); }
.px-popout-to-content { padding-left: var(--popout-to-content); padding-right: var(--popout-to-content); }
.py-popout-to-content { padding-top: var(--popout-to-content); padding-bottom: var(--popout-to-content); }
.pt-popout-to-content { padding-top: var(--popout-to-content); }
.pr-popout-to-content { padding-right: var(--popout-to-content); }
.pb-popout-to-content { padding-bottom: var(--popout-to-content); }
.pl-popout-to-content { padding-left: var(--popout-to-content); }

.p-feature-to-content { padding: var(--feature-to-content); }
.px-feature-to-content { padding-left: var(--feature-to-content); padding-right: var(--feature-to-content); }
.py-feature-to-content { padding-top: var(--feature-to-content); padding-bottom: var(--feature-to-content); }
.pt-feature-to-content { padding-top: var(--feature-to-content); }
.pr-feature-to-content { padding-right: var(--feature-to-content); }
.pb-feature-to-content { padding-bottom: var(--feature-to-content); }
.pl-feature-to-content { padding-left: var(--feature-to-content); }

/* ========================================
   Margin Utilities - Breakout
   ======================================== */
.m-breakout { margin: var(--breakout-padding); }
.mx-breakout { margin-left: var(--breakout-padding); margin-right: var(--breakout-padding); }
.my-breakout { margin-top: var(--breakout-padding); margin-bottom: var(--breakout-padding); }
.ml-breakout { margin-left: var(--breakout-padding); }
.mr-breakout { margin-right: var(--breakout-padding); }
.mt-breakout { margin-top: var(--breakout-padding); }
.mb-breakout { margin-bottom: var(--breakout-padding); }

/* Negative margins */
.-m-breakout { margin: calc(var(--breakout-padding) * -1); }
.-mx-breakout { margin-left: calc(var(--breakout-padding) * -1); margin-right: calc(var(--breakout-padding) * -1); }
.-my-breakout { margin-top: calc(var(--breakout-padding) * -1); margin-bottom: calc(var(--breakout-padding) * -1); }
.-ml-breakout { margin-left: calc(var(--breakout-padding) * -1); }
.-mr-breakout { margin-right: calc(var(--breakout-padding) * -1); }
.-mt-breakout { margin-top: calc(var(--breakout-padding) * -1); }
.-mb-breakout { margin-bottom: calc(var(--breakout-padding) * -1); }

/* ========================================
   Margin Utilities - Gap
   ======================================== */
.m-gap { margin: var(--gap); }
.mx-gap { margin-left: var(--gap); margin-right: var(--gap); }
.my-gap { margin-top: var(--gap); margin-bottom: var(--gap); }
.ml-gap { margin-left: var(--gap); }
.mr-gap { margin-right: var(--gap); }
.mt-gap { margin-top: var(--gap); }
.mb-gap { margin-bottom: var(--gap); }

/* Negative margins */
.-m-gap { margin: calc(var(--gap) * -1); }
.-mx-gap { margin-left: calc(var(--gap) * -1); margin-right: calc(var(--gap) * -1); }
.-my-gap { margin-top: calc(var(--gap) * -1); margin-bottom: calc(var(--gap) * -1); }
.-ml-gap { margin-left: calc(var(--gap) * -1); }
.-mr-gap { margin-right: calc(var(--gap) * -1); }
.-mt-gap { margin-top: calc(var(--gap) * -1); }
.-mb-gap { margin-bottom: calc(var(--gap) * -1); }

/* ========================================
   Margin Utilities - Full Gap (computed)
   ======================================== */
.m-full-gap { margin: var(--computed-gap); }
.mx-full-gap { margin-left: var(--computed-gap); margin-right: var(--computed-gap); }
.my-full-gap { margin-top: var(--computed-gap); margin-bottom: var(--computed-gap); }
.ml-full-gap { margin-left: var(--computed-gap); }
.mr-full-gap { margin-right: var(--computed-gap); }
.mt-full-gap { margin-top: var(--computed-gap); }
.mb-full-gap { margin-bottom: var(--computed-gap); }

/* Negative margins */
.-m-full-gap { margin: calc(var(--computed-gap) * -1); }
.-mx-full-gap { margin-left: calc(var(--computed-gap) * -1); margin-right: calc(var(--computed-gap) * -1); }
.-my-full-gap { margin-top: calc(var(--computed-gap) * -1); margin-bottom: calc(var(--computed-gap) * -1); }
.-ml-full-gap { margin-left: calc(var(--computed-gap) * -1); }
.-mr-full-gap { margin-right: calc(var(--computed-gap) * -1); }
.-mt-full-gap { margin-top: calc(var(--computed-gap) * -1); }
.-mb-full-gap { margin-bottom: calc(var(--computed-gap) * -1); }

/* ========================================
   Margin Utilities - Popout
   ======================================== */
.m-popout { margin: var(--popout); }
.mx-popout { margin-left: var(--popout); margin-right: var(--popout); }
.my-popout { margin-top: var(--popout); margin-bottom: var(--popout); }
.ml-popout { margin-left: var(--popout); }
.mr-popout { margin-right: var(--popout); }
.mt-popout { margin-top: var(--popout); }
.mb-popout { margin-bottom: var(--popout); }

/* Negative margins */
.-m-popout { margin: calc(var(--popout) * -1); }
.-mx-popout { margin-left: calc(var(--popout) * -1); margin-right: calc(var(--popout) * -1); }
.-my-popout { margin-top: calc(var(--popout) * -1); margin-bottom: calc(var(--popout) * -1); }
.-ml-popout { margin-left: calc(var(--popout) * -1); }
.-mr-popout { margin-right: calc(var(--popout) * -1); }
.-mt-popout { margin-top: calc(var(--popout) * -1); }
.-mb-popout { margin-bottom: calc(var(--popout) * -1); }
`;
}
