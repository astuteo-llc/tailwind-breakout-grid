/**
 * Breakout Grid Visualizer - Alpine.js Component
 *
 * A development tool for visualizing the breakout grid system.
 * Provides an overlay showing grid columns, labels, and measurements.
 *
 * Features:
 * - Toggle with keyboard shortcut (Ctrl/Cmd + G)
 * - Visual grid overlay with column labels
 * - Viewport width display
 * - Gap measurements
 * - Persistent state (localStorage)
 * - Click-to-identify grid areas
 *
 * @requires Alpine.js v3.x
 * @requires Tailwind breakout-grid plugin
 *
 * Usage:
 * 1. Include Alpine.js and this file in your page
 * 2. Add the component to your page: <div x-data="breakoutGridVisualizer"></div>
 * 3. Press Ctrl/Cmd + G to toggle the visualizer
 *
 * CraftCMS Usage:
 * {% if craft.app.config.general.devMode %}
 *   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
 *   <script src="/path/to/breakout-grid-visualizer.js"></script>
 * {% endif %}
 */

(function() {
  'use strict';

  // Register Alpine.js component
  document.addEventListener('alpine:init', () => {
    Alpine.data('breakoutGridVisualizer', () => ({
      // Constants
      version: 'v2.1',
      loremContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.`,

      // State
      isVisible: false,
      showLabels: true,
      showClassNames: true,
      showMeasurements: true,
      showGapPadding: false,
      showBreakoutPadding: false,
      showAdvanced: false,
      showLoremIpsum: false,
      showEditor: false,
      showDiagram: false,
      editMode: false,
      viewportWidth: window.innerWidth,
      selectedArea: null,
      hoveredArea: null,
      editValues: {},
      originalValues: {},
      copySuccess: false,
      editorPos: { x: 20, y: 100 },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      configCopied: false,
      // Column resize drag state
      resizingColumn: null,
      resizeStartX: 0,
      resizeStartValue: 0,

      // Grid areas configuration (matches plugin)
      gridAreas: [
        { name: 'full', label: 'Full', className: '.col-full', color: 'rgba(239, 68, 68, 0.25)', borderColor: 'rgb(239, 68, 68)' },
        { name: 'full-limit', label: 'Full Limit', className: '.col-full-limit', color: 'rgba(220, 38, 38, 0.25)', borderColor: 'rgb(220, 38, 38)' },
        { name: 'feature', label: 'Feature', className: '.col-feature', color: 'rgba(234, 179, 8, 0.25)', borderColor: 'rgb(234, 179, 8)' },
        { name: 'popout', label: 'Popout', className: '.col-popout', color: 'rgba(34, 197, 94, 0.25)', borderColor: 'rgb(34, 197, 94)' },
        { name: 'content', label: 'Content', className: '.col-content', color: 'rgba(59, 130, 246, 0.25)', borderColor: 'rgb(59, 130, 246)' },
        { name: 'narrow', label: 'Narrow', className: '.col-narrow', color: 'rgba(168, 85, 247, 0.25)', borderColor: 'rgb(168, 85, 247)' },
      ],

      // Full plugin config structure with defaults and CSS var mappings
      configOptions: {
        // Base measurements
        baseGap: { value: '1rem', desc: 'Minimum gap between columns. Use rem.', cssVar: '--config-base-gap', liveVar: '--base-gap' },
        maxGap: { value: '15rem', desc: 'Maximum gap cap for ultra-wide. Use rem.', cssVar: '--config-max-gap', liveVar: '--max-gap' },
        narrowMin: { value: '40rem', desc: 'Min width for readable text. Use rem.', cssVar: '--config-narrow-min', liveVar: '--narrow-min' },
        narrowMax: { value: '50rem', desc: 'Max before text gets hard to read. Use rem.', cssVar: '--config-narrow-max', liveVar: '--narrow-max' },
        narrowBase: { value: '52vw', desc: 'Preferred width for narrow sections. Use vw.', cssVar: '--config-narrow-base', liveVar: '--narrow-base' },
        // Track widths
        content: { value: '4vw', desc: 'Content rail width. Min 1 (grid needs it).', cssVar: '--config-content', liveVar: null },
        popoutWidth: { value: '4rem', desc: 'Popout extends beyond content. Use rem.', cssVar: '--config-popout', liveVar: null },
        featureWidth: { value: '12vw', desc: 'Feature extends for images/heroes. Use vw.', cssVar: '--config-feature', liveVar: null },
        fullLimit: { value: '115rem', desc: 'Max width for col-full-limit. Use rem.', cssVar: '--config-full-limit', liveVar: '--full-limit' },
        // Default column
        defaultCol: { value: 'content', desc: 'Default column when no col-* class', type: 'select', options: ['narrow', 'content', 'popout', 'feature', 'full'], cssVar: '--config-default-col' },
      },
      gapScaleOptions: {
        default: { value: '4vw', desc: 'Mobile/default gap scaling. Use vw.' },
        lg: { value: '5vw', desc: 'Large screens (1024px+). Use vw.' },
        xl: { value: '6vw', desc: 'Extra large (1280px+). Use vw.' },
      },
      // Breakout padding - by default uses var(--gap) for perfect grid alignment
      // Only configure if you need fixed responsive values for legacy integration
      breakoutPaddingOptions: {
        base: { value: 'var(--gap)', desc: 'Uses grid gap by default' },
      },

      // Initialize
      init() {
        // Load saved state
        const saved = localStorage.getItem('breakoutGridVisualizerVisible');
        if (saved !== null) {
          this.isVisible = saved === 'true';
        }

        // Keyboard shortcut: Ctrl/Cmd + G
        window.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            this.toggle();
          }
        });

        // Update viewport width on resize
        window.addEventListener('resize', () => {
          this.viewportWidth = window.innerWidth;
        });

        console.log('🎨 Breakout Grid Visualizer loaded. Press Ctrl/Cmd + G to toggle.');
      },

      // Toggle visibility
      toggle() {
        this.isVisible = !this.isVisible;
        localStorage.setItem('breakoutGridVisualizerVisible', this.isVisible);
      },

      // Get computed CSS variable value
      getCSSVariable(varName) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        return value || 'Not set';
      },

      // Load current values from CSS variables where available
      loadCurrentValues() {
        Object.keys(this.configOptions).forEach(key => {
          const opt = this.configOptions[key];
          if (opt.cssVar) {
            const computed = this.getCSSVariable(opt.cssVar);
            if (computed && computed !== 'Not set' && computed !== '') {
              this.editValues[key] = computed;
            } else {
              this.editValues[key] = opt.value;
            }
          } else {
            this.editValues[key] = opt.value;
          }
        });
        // Try to read gapScale from CSS (only default is directly readable)
        const gapDefault = this.getCSSVariable('--gap');
        Object.keys(this.gapScaleOptions).forEach(key => {
          this.editValues[`gapScale_${key}`] = this.gapScaleOptions[key].value;
        });
        // Read breakout padding from CSS (defaults to var(--gap))
        const bpBase = this.getCSSVariable('--breakout-padding');
        if (bpBase && bpBase !== 'Not set') {
          this.editValues['breakoutPadding_base'] = bpBase;
        } else {
          this.editValues['breakoutPadding_base'] = 'var(--gap)';
        }
      },

      // Generate export config object
      generateConfigExport() {
        const config = {};
        Object.keys(this.configOptions).forEach(key => {
          config[key] = this.editValues[key] || this.configOptions[key].value;
        });
        config.gapScale = {};
        Object.keys(this.gapScaleOptions).forEach(key => {
          config.gapScale[key] = this.editValues[`gapScale_${key}`] || this.gapScaleOptions[key].value;
        });
        // Note: breakoutPadding is auto-calculated from gap + featureWidth
        // Use px-to-feature, px-to-popout, or px-to-content for alignment
        return config;
      },

      // Copy config to clipboard
      copyConfig() {
        const config = this.generateConfigExport();
        const configStr = `breakoutGrid(${JSON.stringify(config, null, 2)})`;
        navigator.clipboard.writeText(configStr).then(() => {
          this.copySuccess = true;
          this.configCopied = true;
          setTimeout(() => this.copySuccess = false, 2000);
        });
      },

      // Generate and download standalone CSS file
      downloadCSS() {
        const c = this.generateConfigExport();
        const css = `/**
 * Breakout Grid - Standalone CSS
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
  --narrow-min: ${c.narrowMin};
  --narrow-max: ${c.narrowMax};
  --narrow-base: ${c.narrowBase};

  /* Computed values */
  --gap: clamp(var(--base-gap), ${c.gapScale?.default || '4vw'}, var(--max-gap));
  --narrow: min(clamp(var(--narrow-min), var(--narrow-base), var(--narrow-max)), 100% - var(--gap) * 2);
  --narrow-half: calc(var(--narrow) / 2);

  /* Track widths */
  --full: minmax(var(--gap), 1fr);
  --feature: minmax(0, ${c.featureWidth});
  --popout: minmax(0, ${c.popoutWidth});
  --content: minmax(0, ${c.content});
  --full-limit: ${c.fullLimit};

  /* Padding/margin utilities */
  --breakout-padding: clamp(1rem, 5vw, ${c.popoutWidth});
  --popout-to-content: clamp(1rem, 5vw, ${c.popoutWidth});
  --feature-to-content: calc(${c.featureWidth} + ${c.popoutWidth});
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
    [content-start] var(--content)
    [narrow-start center-start] minmax(0, var(--narrow-half))
    [center-end] minmax(0, var(--narrow-half)) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

/* Default column for direct children */
.grid-cols-breakout > * { grid-column: ${c.defaultCol || 'content'}; }

/* ========================================
   Grid Container - Left Aligned Variants
   ======================================== */
.grid-cols-feature-left {
  display: grid;
  grid-template-columns:
    [full-start feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start center-start] minmax(0, var(--narrow-half))
    [center-end] minmax(0, var(--narrow-half)) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

.grid-cols-popout-left {
  display: grid;
  grid-template-columns:
    [full-start feature-start popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start center-start] minmax(0, var(--narrow-half))
    [center-end] minmax(0, var(--narrow-half)) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

.grid-cols-content-left {
  display: grid;
  grid-template-columns:
    [full-start feature-start popout-start content-start] var(--content)
    [narrow-start center-start] minmax(0, var(--narrow-half))
    [center-end] minmax(0, var(--narrow-half)) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--full) [full-end];
}

/* ========================================
   Grid Container - Right Aligned Variants
   ======================================== */
.grid-cols-feature-right {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start center-start] minmax(0, var(--narrow-half))
    [center-end] minmax(0, var(--narrow-half)) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end full-end];
}

.grid-cols-popout-right {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start center-start] minmax(0, var(--narrow-half))
    [center-end] minmax(0, var(--narrow-half)) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end feature-end full-end];
}

.grid-cols-content-right {
  display: grid;
  grid-template-columns:
    [full-start] var(--full)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start center-start] minmax(0, var(--narrow-half))
    [center-end] minmax(0, var(--narrow-half)) [narrow-end]
    var(--content) [content-end popout-end feature-end full-end];
}

/* ========================================
   Breakout Modifiers (for nested grids)
   ======================================== */
.grid-cols-breakout.breakout-to-narrow {
  grid-template-columns: [full-start feature-start popout-start content-start narrow-start center-start] minmax(0, 1fr) [center-end narrow-end content-end popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-content {
  grid-template-columns: [full-start feature-start popout-start content-start] var(--content) [narrow-start center-start] minmax(0, 1fr) [center-end narrow-end] var(--content) [content-end popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-popout {
  grid-template-columns: [full-start feature-start popout-start] var(--popout) [content-start] var(--content) [narrow-start center-start] minmax(0, 1fr) [center-end narrow-end] var(--content) [content-end] var(--popout) [popout-end feature-end full-end];
}

.grid-cols-breakout.breakout-to-feature {
  grid-template-columns: [full-start feature-start] var(--feature) [popout-start] var(--popout) [content-start] var(--content) [narrow-start center-start] minmax(0, 1fr) [center-end narrow-end] var(--content) [content-end] var(--popout) [popout-end] var(--feature) [feature-end full-end];
}

/* ========================================
   Column Utilities - Basic
   ======================================== */
.col-full { grid-column: full; }
.col-feature { grid-column: feature; }
.col-popout { grid-column: popout; }
.col-content { grid-column: content; }
.col-narrow { grid-column: narrow; }
.col-center { grid-column: center; }

/* ========================================
   Column Utilities - Start/End
   ======================================== */
.col-start-full { grid-column-start: full-start; }
.col-start-feature { grid-column-start: feature-start; }
.col-start-popout { grid-column-start: popout-start; }
.col-start-content { grid-column-start: content-start; }
.col-start-narrow { grid-column-start: narrow-start; }
.col-start-center { grid-column-start: center-start; }

.col-end-full { grid-column-end: full-end; }
.col-end-feature { grid-column-end: feature-end; }
.col-end-popout { grid-column-end: popout-end; }
.col-end-content { grid-column-end: content-end; }
.col-end-narrow { grid-column-end: narrow-end; }
.col-end-center { grid-column-end: center-end; }

/* ========================================
   Column Utilities - Left/Right Spans
   ======================================== */
.col-feature-left { grid-column: full-start / feature-end; }
.col-feature-right { grid-column: feature-start / full-end; }
.col-popout-left { grid-column: full-start / popout-end; }
.col-popout-right { grid-column: popout-start / full-end; }
.col-content-left { grid-column: full-start / content-end; }
.col-content-right { grid-column: content-start / full-end; }
.col-narrow-left { grid-column: full-start / narrow-end; }
.col-narrow-right { grid-column: narrow-start / full-end; }
.col-center-left { grid-column: full-start / center-end; }
.col-center-right { grid-column: center-start / full-end; }

/* ========================================
   Column Utilities - Advanced Spans
   ======================================== */
/* Feature to other columns */
.col-feature-to-popout { grid-column: feature-start / popout-end; }
.col-feature-to-content { grid-column: feature-start / content-end; }
.col-feature-to-narrow { grid-column: feature-start / narrow-end; }
.col-feature-to-center { grid-column: feature-start / center-end; }

/* Popout to other columns */
.col-popout-to-content { grid-column: popout-start / content-end; }
.col-popout-to-narrow { grid-column: popout-start / narrow-end; }
.col-popout-to-center { grid-column: popout-start / center-end; }
.col-popout-to-feature { grid-column: popout-start / feature-end; }

/* Content to other columns */
.col-content-to-narrow { grid-column: content-start / narrow-end; }
.col-content-to-center { grid-column: content-start / center-end; }
.col-content-to-popout { grid-column: content-start / popout-end; }
.col-content-to-feature { grid-column: content-start / feature-end; }

/* Full limit */
.col-full-limit {
  grid-column: full;
  max-width: var(--full-limit);
  margin-left: auto;
  margin-right: auto;
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
   Padding Utilities - Alignment
   ======================================== */
.p-popout-to-content { padding: var(--popout-to-content); }
.px-popout-to-content { padding-left: var(--popout-to-content); padding-right: var(--popout-to-content); }
.pl-popout-to-content { padding-left: var(--popout-to-content); }
.pr-popout-to-content { padding-right: var(--popout-to-content); }

.p-feature-to-content { padding: var(--feature-to-content); }
.px-feature-to-content { padding-left: var(--feature-to-content); padding-right: var(--feature-to-content); }
.pl-feature-to-content { padding-left: var(--feature-to-content); }
.pr-feature-to-content { padding-right: var(--feature-to-content); }

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
`;

        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'breakout-grid.css';
        a.click();
        URL.revokeObjectURL(url);
      },

      // Parse CSS value into number and unit (e.g., "4rem" -> { num: 4, unit: "rem" })
      parseValue(val) {
        const match = String(val).match(/^([\d.]+)(.*)$/);
        if (match) {
          return { num: parseFloat(match[1]), unit: match[2] || 'rem' };
        }
        return { num: 0, unit: 'rem' };
      },

      // Get the numeric part of a config value
      getNumericValue(key) {
        const val = this.editValues[key] || this.configOptions[key].value;
        return this.parseValue(val).num;
      },

      // Get the unit part of a config value
      getUnit(key) {
        const val = this.editValues[key] || this.configOptions[key].value;
        return this.parseValue(val).unit;
      },

      // Update just the numeric part, keeping the unit
      updateNumericValue(key, num) {
        // Enforce minimums for certain fields
        if (key === 'content' && num < 1) num = 1;
        if (key === 'baseGap' && num < 0) num = 0;
        if (key === 'popoutWidth' && num < 0) num = 0;
        if (key === 'featureWidth' && num < 0) num = 0;
        const unit = this.getUnit(key);
        this.updateConfigValue(key, num + unit);
      },

      // Get numeric value for gapScale
      getGapScaleNumeric(key) {
        const val = this.editValues[`gapScale_${key}`] || this.gapScaleOptions[key].value;
        return this.parseValue(val).num;
      },

      // Get unit for gapScale
      getGapScaleUnit(key) {
        const val = this.editValues[`gapScale_${key}`] || this.gapScaleOptions[key].value;
        return this.parseValue(val).unit;
      },

      // Update gapScale numeric value
      updateGapScaleNumeric(key, num) {
        const unit = this.getGapScaleUnit(key);
        this.editValues[`gapScale_${key}`] = num + unit;
        this.configCopied = false; // Mark as unsaved
      },

      // Update a config value (and live CSS var if applicable)
      updateConfigValue(key, value) {
        this.editValues[key] = value;
        this.configCopied = false; // Mark as unsaved
        const opt = this.configOptions[key];
        if (opt && opt.liveVar) {
          document.documentElement.style.setProperty(opt.liveVar, value);
        }
        // Special handling for track widths (need minmax wrapper)
        if (key === 'popoutWidth') {
          document.documentElement.style.setProperty('--popout', `minmax(0, ${value})`);
          document.documentElement.style.setProperty('--breakout-padding', `clamp(1rem, 5vw, ${value})`);
          document.documentElement.style.setProperty('--popout-to-content', `clamp(1rem, 5vw, ${value})`);
        }
        if (key === 'featureWidth') {
          document.documentElement.style.setProperty('--feature', `minmax(0, ${value})`);
        }
        if (key === 'content') {
          document.documentElement.style.setProperty('--content', `minmax(0, ${value})`);
        }
      },

      // Select a grid area
      selectArea(areaName) {
        this.selectedArea = this.selectedArea === areaName ? null : areaName;
      },

      // Check if area is selected
      isSelected(areaName) {
        return this.selectedArea === areaName;
      },

      // Toggle edit mode
      toggleEditMode() {
        this.editMode = !this.editMode;
        if (this.editMode) {
          this.loadCurrentValues();
        } else {
          // Restore original CSS vars (remove overrides)
          Object.keys(this.configOptions).forEach(key => {
            const opt = this.configOptions[key];
            if (opt.liveVar) {
              document.documentElement.style.removeProperty(opt.liveVar);
            }
          });
          this.editValues = {};
        }
      },

      // Check if any values have been edited and not yet copied
      hasUnsavedEdits() {
        return Object.keys(this.editValues).length > 0 && !this.configCopied;
      },

      // Open floating editor
      openEditor() {
        this.showEditor = true;
        this.editMode = true;
        this.loadCurrentValues();
      },

      // Close floating editor
      closeEditor(force = false) {
        if (!force && this.hasUnsavedEdits()) {
          if (!confirm('You have unsaved config changes. Close without copying?')) {
            return;
          }
        }
        this.showEditor = false;
        this.editMode = false;
        // Restore original CSS vars
        Object.keys(this.configOptions).forEach(key => {
          const opt = this.configOptions[key];
          if (opt.liveVar) {
            document.documentElement.style.removeProperty(opt.liveVar);
          }
        });
        // Also restore track widths
        document.documentElement.style.removeProperty('--popout');
        document.documentElement.style.removeProperty('--feature');
        document.documentElement.style.removeProperty('--content');
        document.documentElement.style.removeProperty('--breakout-padding');
        document.documentElement.style.removeProperty('--popout-to-content');
        this.editValues = {};
      },

      // Drag handling for editor window
      startDrag(e) {
        this.isDragging = true;
        this.dragOffset = {
          x: e.clientX - this.editorPos.x,
          y: e.clientY - this.editorPos.y
        };
      },

      onDrag(e) {
        if (this.isDragging) {
          this.editorPos = {
            x: e.clientX - this.dragOffset.x,
            y: e.clientY - this.dragOffset.y
          };
        }
      },

      stopDrag() {
        this.isDragging = false;
      },

      // Column resize drag handling
      startColumnResize(e, columnType) {
        if (!this.editMode) return;
        e.preventDefault();
        e.stopPropagation();
        this.resizingColumn = columnType;
        this.resizeStartX = e.clientX;
        // Get current value
        const currentVal = this.editValues[columnType] || this.configOptions[columnType].value;
        this.resizeStartValue = this.parseValue(currentVal).num;
      },

      onColumnResize(e) {
        if (!this.resizingColumn) return;
        const deltaX = e.clientX - this.resizeStartX;
        const col = this.resizingColumn;
        const unit = this.getUnit(col);

        // Calculate pixels per unit
        let pxPerUnit;
        if (unit === 'vw') {
          pxPerUnit = window.innerWidth / 100;
        } else if (unit === 'rem') {
          pxPerUnit = parseFloat(getComputedStyle(document.documentElement).fontSize);
        } else {
          pxPerUnit = 1;
        }

        // For right-edge handles (narrowMax, narrowBase), dragging right increases value
        // For left-edge handles (narrowMin, others), dragging left increases value (inverted)
        const isRightHandle = col === 'narrowMax' || col === 'narrowBase';
        const delta = isRightHandle ? (deltaX / pxPerUnit) : (-deltaX / pxPerUnit);
        let newValue = this.resizeStartValue + delta;

        // Enforce minimums
        if (col === 'content' && newValue < 1) newValue = 1;
        if (newValue < 0) newValue = 0;

        // Round to 1 decimal
        newValue = Math.round(newValue * 10) / 10;

        this.updateConfigValue(col, newValue + unit);
      },

      stopColumnResize() {
        this.resizingColumn = null;
      },

      // Map column names to their config keys for resizing
      getResizeConfig(colName) {
        const map = {
          'full-limit': 'fullLimit',
          'feature': 'featureWidth',
          'popout': 'popoutWidth',
          'content': 'content'
          // narrow has its own integrated handles for min/max
        };
        return map[colName] || null;
      },

      // Template for the visualizer UI
      template: `
        <div x-show="isVisible"
             x-transition
             class="breakout-grid-visualizer"
             @mousemove.window="onColumnResize($event)"
             @mouseup.window="stopColumnResize()"
             style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;">

          <!-- Advanced Span Examples Overlay -->
          <div x-show="showAdvanced"
               class="grid-cols-breakout"
               style="position: absolute; inset: 0; height: 100%; pointer-events: auto; z-index: 5;">

            <!-- Left-anchored: full-start to feature-end -->
            <div style="grid-column: full-start / feature-end;
                        background: linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%);
                        border: 3px solid rgb(168, 85, 247);
                        margin: 1rem 0;
                        padding: 1rem;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        transition: background 0.2s ease;"
                 onmouseenter="this.style.background='linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(139, 92, 246, 0.6) 100%)'"
                 onmouseleave="this.style.background='linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'">
              <div style="background: rgb(139, 92, 246);
                          color: white;
                          padding: 0.75rem 1rem;
                          font-size: 0.75rem;
                          font-weight: 700;
                          text-align: left;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-left</div>
                <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → feature boundary</div>
              </div>
            </div>

            <!-- Right-anchored: feature-start to full-end -->
            <div style="grid-column: feature-start / full-end;
                        background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
                        border: 3px solid rgb(34, 197, 94);
                        margin: 1rem 0;
                        padding: 1rem;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        transition: background 0.2s ease;"
                 onmouseenter="this.style.background='linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(59, 130, 246, 0.6) 100%)'"
                 onmouseleave="this.style.background='linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)'">
              <div style="background: rgb(34, 197, 94);
                          color: white;
                          padding: 0.75rem 1rem;
                          font-size: 0.75rem;
                          font-weight: 700;
                          text-align: right;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-right</div>
                <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Feature boundary → right edge</div>
              </div>
            </div>

            <!-- To center point: full-start to center-end -->
            <div style="grid-column: full-start / center-end;
                        background: linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%);
                        border: 3px solid rgb(234, 179, 8);
                        margin: 1rem 0;
                        padding: 1rem;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        transition: background 0.2s ease;"
                 onmouseenter="this.style.background='linear-gradient(135deg, rgba(251, 146, 60, 0.6) 0%, rgba(234, 179, 8, 0.6) 100%)'"
                 onmouseleave="this.style.background='linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%)'">
              <div style="background: rgb(234, 179, 8);
                          color: white;
                          padding: 0.75rem 1rem;
                          font-size: 0.75rem;
                          font-weight: 700;
                          text-align: right;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-center-left</div>
                <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → center point</div>
              </div>
            </div>

            <!-- Nested grid example: breakout-to-feature inside col-feature -->
            <div style="grid-column: feature;
                        border: 3px dashed rgb(59, 130, 246);
                        margin: 1rem 0;
                        background: rgba(59, 130, 246, 0.05);
                        transition: background 0.2s ease;
                        padding: 0.5rem;"
                 onmouseenter="this.style.background='rgba(59, 130, 246, 0.3)'"
                 onmouseleave="this.style.background='rgba(59, 130, 246, 0.05)'">
              <div style="font-size: 0.625rem; font-family: monospace; color: rgb(30, 64, 175); margin-bottom: 0.5rem; padding: 0.25rem;">
                Parent: .col-feature container
              </div>
              <div class="grid-cols-breakout breakout-to-feature"
                   style="background: rgba(59, 130, 246, 0.1);">
                <div style="grid-column: feature;
                            background: rgba(59, 130, 246, 0.3);
                            padding: 0.5rem;
                            font-size: 0.625rem;
                            font-family: monospace;
                            color: rgb(30, 64, 175);">
                  .col-feature → fills container
                </div>
                <div style="grid-column: content;
                            background: rgb(59, 130, 246);
                            color: white;
                            padding: 0.75rem 1rem;
                            font-size: 0.75rem;
                            font-weight: 700;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <div style="font-family: monospace; margin-bottom: 0.5rem;">.col-content → has margins</div>
                  <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">breakout-to-feature collapses outer tracks</div>
                  <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature"&gt;
  &lt;div class="grid-cols-breakout breakout-to-feature"&gt;
    &lt;div class="col-feature"&gt;Fills container&lt;/div&gt;
    &lt;p class="col-content"&gt;Has margins&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>
                </div>
              </div>
            </div>

            <!-- Subgrid example: child aligns to parent grid tracks -->
            <div style="grid-column: feature-start / full-end;
                        display: grid;
                        grid-template-columns: subgrid;
                        border: 3px solid rgb(236, 72, 153);
                        margin: 1rem 0;
                        background: rgba(236, 72, 153, 0.05);
                        transition: background 0.2s ease;"
                 onmouseenter="this.style.background='rgba(236, 72, 153, 0.15)'"
                 onmouseleave="this.style.background='rgba(236, 72, 153, 0.05)'">
              <!-- Parent label -->
              <div style="grid-column: 1 / -1;
                          font-size: 0.625rem;
                          font-family: monospace;
                          color: rgb(157, 23, 77);
                          padding: 0.5rem;
                          background: rgba(236, 72, 153, 0.1);">
                Parent: .col-feature-right .grid-cols-breakout-subgrid
              </div>
              <!-- Child spanning feature (wider, lighter) -->
              <div style="grid-column: feature;
                          background: rgba(236, 72, 153, 0.3);
                          padding: 0.5rem;
                          margin: 0.5rem 0;
                          font-size: 0.625rem;
                          font-family: monospace;
                          color: rgb(157, 23, 77);">
                Child: .col-feature (aligns to feature area)
              </div>
              <!-- Child using subgrid to align to content (darker) -->
              <div style="grid-column: content;
                          background: rgb(236, 72, 153);
                          color: white;
                          padding: 0.75rem 1rem;
                          margin: 0.5rem 0;
                          font-size: 0.75rem;
                          font-weight: 700;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="font-family: monospace; margin-bottom: 0.5rem;">Child: .col-content</div>
                <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">Subgrid lets children align to parent's named lines</div>
                <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature-right grid-cols-breakout-subgrid"&gt;
  &lt;div class="col-feature"&gt;Aligns to feature!&lt;/div&gt;
  &lt;div class="col-content"&gt;Aligns to content!&lt;/div&gt;
&lt;/div&gt;</pre>
                <div style="margin-top: 0.75rem;">
                  <a href="https://caniuse.com/css-subgrid" target="_blank" rel="noopener" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.3);">Check browser support</a>
                  <span style="font-size: 0.5rem; opacity: 0.7; margin-left: 0.5rem;">(~90% as of Jan 2025)</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Grid Overlay (hidden in Advanced mode) -->
          <div x-show="!showAdvanced" class="grid-cols-breakout" style="height: 100%; position: relative;">
            <template x-for="area in gridAreas" :key="area.name">
              <div :class="'col-' + area.name"
                   @click="selectArea(area.name)"
                   @mouseenter="hoveredArea = area.name"
                   @mouseleave="hoveredArea = null"
                   :style="{
                     backgroundColor: (hoveredArea === area.name || isSelected(area.name)) ? area.color.replace('0.25', '0.6') : area.color,
                     borderLeft: '1px solid ' + area.borderColor,
                     borderRight: '1px solid ' + area.borderColor,
                     position: 'relative',
                     height: '100%',
                     pointerEvents: 'auto',
                     cursor: 'pointer',
                     transition: 'background-color 0.2s'
                   }">

                <!-- Label (centered) -->
                <div x-show="showLabels"
                     :style="{
                       position: 'absolute',
                       top: '50%',
                       left: '50%',
                       transform: 'translate(-50%, -50%)',
                       backgroundColor: area.borderColor,
                       color: 'white',
                       padding: '0.75rem 1rem',
                       borderRadius: '0.375rem',
                       fontSize: '0.75rem',
                       fontWeight: '600',
                       textTransform: 'uppercase',
                       letterSpacing: '0.05em',
                       whiteSpace: 'nowrap',
                       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                       opacity: isSelected(area.name) ? '1' : '0.8',
                       textAlign: 'center',
                       zIndex: '10'
                     }">
                  <div x-text="area.label"></div>
                  <div x-show="showClassNames"
                       :style="{
                    fontSize: '0.625rem',
                    fontWeight: '500',
                    textTransform: 'none',
                    marginTop: '0.25rem',
                    opacity: '0.9',
                    fontFamily: 'monospace'
                  }" x-text="area.className"></div>
                </div>

                <!-- Lorem Ipsum Content (behind label) -->
                <div x-show="showLoremIpsum"
                     :style="{
                       position: 'absolute',
                       inset: '0',
                       padding: showGapPadding ? 'var(--gap)' : (showBreakoutPadding ? 'var(--breakout-padding)' : '1.5rem 0'),
                       boxSizing: 'border-box',
                       overflow: 'hidden',
                       whiteSpace: 'pre-line',
                       fontSize: '1.125rem',
                       lineHeight: '1.75',
                       color: 'white',
                       textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                       zIndex: '1'
                     }" x-text="loremContent"></div>

                <!-- p-gap / px-gap Padding Overlay -->
                <div x-show="showGapPadding"
                     :style="{
                       position: 'absolute',
                       inset: 'var(--gap)',
                       border: '2px dotted ' + area.borderColor,
                       backgroundColor: area.color.replace('0.1', '0.2'),
                       pointerEvents: 'none',
                       zIndex: '10'
                     }">
                  <div :style="{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    fontSize: '0.625rem',
                    fontWeight: '700',
                    color: area.borderColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }">p-gap</div>
                </div>

                <!-- p-breakout / px-breakout Padding Overlay -->
                <div x-show="showBreakoutPadding"
                     :style="{
                       position: 'absolute',
                       inset: 'var(--breakout-padding)',
                       border: '3px dashed ' + area.borderColor,
                       backgroundColor: area.color.replace('0.1', '0.25'),
                       pointerEvents: 'none',
                       zIndex: '10'
                     }">
                  <div :style="{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    fontSize: '0.625rem',
                    fontWeight: '700',
                    color: area.borderColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }">p-breakout</div>
                </div>

                <!-- Drag Handle - Left (edit mode only, for resizable columns) -->
                <div x-show="editMode && hoveredArea === area.name && getResizeConfig(area.name)"
                     @mousedown.stop="startColumnResize($event, getResizeConfig(area.name))"
                     :style="{
                       position: 'absolute',
                       left: '-4px',
                       top: '0',
                       width: '16px',
                       height: '100%',
                       cursor: 'ew-resize',
                       pointerEvents: 'auto',
                       zIndex: '100',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                    <div :style="{
                      width: '10px',
                      height: '100px',
                      background: area.borderColor,
                      borderRadius: '5px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      border: '2px solid white'
                    }"></div>
                    <div :style="{
                      background: area.borderColor,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '700',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }" x-text="area.name === 'narrow' ? '← min' : '↔'"></div>
                  </div>
                </div>

                <!-- Narrow Min/Base/Max Visual Guides with integrated handles (edit mode only) -->
                <template x-if="editMode && area.name === 'narrow'">
                  <div style="position: absolute; inset: 0; pointer-events: none; z-index: 50; overflow: visible;">
                    <!-- Max boundary (outer, dotted) with drag handle - can overflow to show full width -->
                    <div :style="{
                      position: 'absolute',
                      top: '0',
                      bottom: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: editValues.narrowMax || configOptions.narrowMax.value,
                      border: '3px dotted rgba(139, 92, 246, 0.9)',
                      boxSizing: 'border-box',
                      background: 'rgba(139, 92, 246, 0.05)'
                    }">
                      <div style="position: absolute; top: 8px; right: 8px; background: rgba(139, 92, 246, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                        max: <span x-text="editValues.narrowMax || configOptions.narrowMax.value"></span>
                      </div>
                      <!-- Max drag handle on right edge, at top - show on hover or when selected -->
                      <div x-show="hoveredArea === 'narrow' || selectedArea === 'narrow'"
                           @mousedown.stop="startColumnResize($event, 'narrowMax')"
                           style="position: absolute; right: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 8px; height: 100%; background: rgb(139, 92, 246); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                      </div>
                    </div>
                    <!-- Base boundary (middle, solid) - half height, inset, can overflow -->
                    <div :style="{
                      position: 'absolute',
                      top: '25%',
                      bottom: '25%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: editValues.narrowBase || configOptions.narrowBase.value,
                      border: '3px solid rgba(236, 72, 153, 1)',
                      background: 'rgba(236, 72, 153, 0.25)',
                      boxSizing: 'border-box',
                      borderRadius: '4px'
                    }">
                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(236, 72, 153, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; white-space: nowrap;">
                        base: <span x-text="editValues.narrowBase || configOptions.narrowBase.value"></span>
                      </div>
                      <!-- Base drag handle on right edge - show on hover or when selected -->
                      <div x-show="hoveredArea === 'narrow' || selectedArea === 'narrow'"
                           @mousedown.stop="startColumnResize($event, 'narrowBase')"
                           style="position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 16px; height: 40px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 8px; height: 100%; background: rgb(236, 72, 153); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                      </div>
                    </div>
                    <!-- Min boundary (inner, dashed) with drag handle - can overflow to show full width -->
                    <div :style="{
                      position: 'absolute',
                      top: '0',
                      bottom: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: editValues.narrowMin || configOptions.narrowMin.value,
                      border: '3px dashed rgba(168, 85, 247, 0.9)',
                      background: 'rgba(168, 85, 247, 0.15)',
                      boxSizing: 'border-box'
                    }">
                      <div style="position: absolute; top: 8px; left: 8px; background: rgba(168, 85, 247, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                        min: <span x-text="editValues.narrowMin || configOptions.narrowMin.value"></span>
                      </div>
                      <!-- Min drag handle on left edge, at top - show on hover or when selected -->
                      <div x-show="hoveredArea === 'narrow' || selectedArea === 'narrow'"
                           @mousedown.stop="startColumnResize($event, 'narrowMin')"
                           style="position: absolute; left: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 8px; height: 100%; background: rgb(168, 85, 247); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>


          <!-- Control Panel -->
          <div :style="{
                 position: 'fixed',
                 bottom: '1rem',
                 right: '1rem',
                 pointerEvents: 'auto',
                 background: 'white',
                 borderRadius: '0.5rem',
                 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                 padding: '0.75rem',
                 maxWidth: editMode ? '380px' : '280px',
                 fontFamily: 'system-ui, -apple-system, sans-serif',
                 zIndex: '10000',
                 transition: 'max-width 0.2s ease'
               }">

            <!-- Header with viewport -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 1rem;">
              <div>
                <span style="font-weight: 700; font-size: 0.75rem; color: #111827;">Grid</span>
                <span style="font-size: 0.625rem; color: #9ca3af; margin-left: 0.25rem;" x-text="version"></span>
                <span style="font-size: 0.75rem; color: #6b7280; margin-left: 0.5rem; font-variant-numeric: tabular-nums;" x-text="viewportWidth + 'px'"></span>
              </div>
              <button @click="toggle()"
                      style="background: #ef4444; color: white; border: none; border-radius: 0.25rem; padding: 0.125rem 0.5rem; font-size: 0.625rem; font-weight: 600; cursor: pointer;">
                Close
              </button>
            </div>

            <!-- CSS Variables (read-only when not in edit mode) -->
            <div x-show="showMeasurements && !editMode" style="margin-bottom: 0.5rem; background: #f9fafb; border-radius: 0.25rem; padding: 0.375rem; font-size: 0.625rem; font-family: 'Monaco', 'Courier New', monospace;">
              <template x-for="key in Object.keys(configOptions).slice(0, 5)" :key="key">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.125rem 0;">
                  <span style="color: #6b7280;" x-text="key"></span>
                  <span style="color: #111827; font-weight: 600;" x-text="configOptions[key].cssVar ? getCSSVariable(configOptions[key].cssVar) : configOptions[key].value"></span>
                </div>
              </template>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem;">
              <button @click="openEditor()"
                      :style="{
                        flex: 1,
                        padding: '0.375rem 0.5rem',
                        fontSize: '0.625rem',
                        fontWeight: '600',
                        border: showEditor ? 'none' : '1px solid #f59e0b',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        background: showEditor ? '#f59e0b' : 'white',
                        color: showEditor ? 'white' : '#f59e0b'
                      }">
                Edit Config
              </button>
              <button @click="showDiagram = !showDiagram; if(showDiagram && Object.keys(editValues).length === 0) loadCurrentValues()"
                      :style="{
                        flex: 1,
                        padding: '0.375rem 0.5rem',
                        fontSize: '0.625rem',
                        fontWeight: '600',
                        border: showDiagram ? 'none' : '1px solid #6366f1',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        background: showDiagram ? '#6366f1' : 'white',
                        color: showDiagram ? 'white' : '#6366f1'
                      }">
                Diagram
              </button>
            </div>

            <!-- Toggles -->
            <div style="display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.5rem;">
              <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.625rem; color: #374151;">
                <input type="checkbox" x-model="showLabels" style="margin-right: 0.25rem; cursor: pointer; width: 12px; height: 12px;">
                Labels
              </label>
              <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.625rem; color: #374151;">
                <input type="checkbox" x-model="showClassNames" style="margin-right: 0.25rem; cursor: pointer; width: 12px; height: 12px;">
                Classes
              </label>
              <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.625rem; color: #374151;">
                <input type="checkbox" x-model="showMeasurements" style="margin-right: 0.25rem; cursor: pointer; width: 12px; height: 12px;">
                Values
              </label>
              <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.625rem; color: #10b981;">
                <input type="checkbox" x-model="showGapPadding" style="margin-right: 0.25rem; cursor: pointer; width: 12px; height: 12px;">
                p-gap
              </label>
              <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.625rem; color: #3b82f6;">
                <input type="checkbox" x-model="showBreakoutPadding" style="margin-right: 0.25rem; cursor: pointer; width: 12px; height: 12px;">
                p-breakout
              </label>
              <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.625rem; color: #6b7280;">
                <input type="checkbox" x-model="showLoremIpsum" style="margin-right: 0.25rem; cursor: pointer; width: 12px; height: 12px;">
                Lorem Ipsum
              </label>
            </div>

            <!-- Advanced Toggle -->
            <button @click="showAdvanced = !showAdvanced"
                    :style="{
                      width: '100%',
                      padding: '0.375rem 0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.625rem',
                      fontWeight: '600',
                      border: showAdvanced ? 'none' : '1px solid #8b5cf6',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      background: showAdvanced ? '#8b5cf6' : 'white',
                      color: showAdvanced ? 'white' : '#8b5cf6'
                    }">
              <span x-text="showAdvanced ? '✓ Advanced Spans' : 'Show Advanced Spans'"></span>
            </button>

            <!-- Keyboard Shortcut -->
            <div style="font-size: 0.5rem; color: #9ca3af; text-align: center;">
              <kbd style="background: #f3f4f6; padding: 0.0625rem 0.25rem; border-radius: 0.125rem; font-weight: 600; color: #374151;">⌘G</kbd> toggle
            </div>

            <!-- Selected Area Info -->
            <div x-show="selectedArea" style="margin-top: 0.5rem; padding: 0.5rem; background: #eff6ff; border-radius: 0.25rem; border-left: 2px solid #3b82f6;">
              <div style="font-size: 0.75rem; color: #1e3a8a; font-weight: 700; font-family: monospace;" x-text="gridAreas.find(a => a.name === selectedArea)?.className || ''"></div>
            </div>

          </div>

          <!-- Floating Editor Window -->
          <div x-show="showEditor"
               @mousedown.self="startDrag($event)"
               @mousemove.window="onDrag($event)"
               @mouseup.window="stopDrag()"
               :style="{
                 position: 'fixed',
                 left: editorPos.x + 'px',
                 top: editorPos.y + 'px',
                 width: '320px',
                 maxHeight: '80vh',
                 background: 'white',
                 borderRadius: '0.5rem',
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                 pointerEvents: 'auto',
                 zIndex: '10001',
                 overflow: 'hidden'
               }">
            <!-- Editor Header (draggable) -->
            <div @mousedown="startDrag($event)"
                 style="padding: 0.75rem; background: #f59e0b; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 0.75rem;">Edit Config</span>
              <button @click="closeEditor()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.625rem; font-weight: 600;">Close</button>
            </div>
            <!-- Editor Content -->
            <div style="padding: 1rem; max-height: calc(80vh - 3rem); overflow-y: auto;">
              <!-- Base Measurements -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Base Measurements</div>
              <template x-for="key in ['baseGap', 'maxGap', 'narrowMin', 'narrowMax', 'narrowBase']" :key="'ed_'+key">
                <div style="margin-bottom: 0.5rem;">
                  <label style="display: block; color: #78716c; font-weight: 600; font-size: 0.6875rem; font-family: Monaco, monospace; margin-bottom: 0.125rem;" x-text="key"></label>
                  <div style="display: flex; align-items: center; gap: 0.25rem;">
                    <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                           style="flex: 1; padding: 0.25rem 0.375rem; font-size: 0.6875rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white;">
                    <span style="font-size: 0.6875rem; font-family: Monaco, monospace; color: #78716c; min-width: 2rem;" x-text="getUnit(key)"></span>
                  </div>
                </div>
              </template>

              <!-- Track Widths -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin: 0.75rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 0.5rem; border-top: 1px dashed #fde68a;">Track Widths</div>
              <template x-for="key in ['content', 'popoutWidth', 'featureWidth', 'fullLimit']" :key="'ed_'+key">
                <div style="margin-bottom: 0.5rem;">
                  <label style="display: block; color: #78716c; font-weight: 600; font-size: 0.6875rem; font-family: Monaco, monospace; margin-bottom: 0.125rem;" x-text="key"></label>
                  <div style="display: flex; align-items: center; gap: 0.25rem;">
                    <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                           style="flex: 1; padding: 0.25rem 0.375rem; font-size: 0.6875rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white;">
                    <span style="font-size: 0.6875rem; font-family: Monaco, monospace; color: #78716c; min-width: 2rem;" x-text="getUnit(key)"></span>
                  </div>
                </div>
              </template>

              <!-- Gap Scale -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin: 0.75rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 0.5rem; border-top: 1px dashed #fde68a;">gapScale <span style="font-size: 0.5rem; color: #dc2626; font-weight: 400; text-transform: none;">(rebuild)</span></div>
              <template x-for="key in Object.keys(gapScaleOptions)" :key="'ed_gs_'+key">
                <div style="margin-bottom: 0.375rem; display: flex; gap: 0.5rem; align-items: center;">
                  <label style="color: #78716c; font-weight: 600; font-size: 0.625rem; font-family: Monaco, monospace; min-width: 2.5rem;" x-text="key + ':'"></label>
                  <input type="number" :value="getGapScaleNumeric(key)" @input="updateGapScaleNumeric(key, $event.target.value)" step="1"
                         style="flex: 1; padding: 0.25rem 0.375rem; font-size: 0.625rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white;">
                  <span style="font-size: 0.625rem; font-family: Monaco, monospace; color: #78716c;" x-text="getGapScaleUnit(key)"></span>
                </div>
              </template>

              <!-- Utilities Reference -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin: 0.75rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 0.5rem; border-top: 1px dashed #fde68a;">Padding Utilities</div>
              <div style="font-size: 0.5625rem; font-family: Monaco, monospace; color: #374151; line-height: 1.5;">
                <div><span style="color: #3b82f6;">px-breakout</span> = popoutWidth</div>
                <div><span style="color: #059669;">px-popout-to-content</span></div>
                <div><span style="color: #059669;">px-feature-to-content</span></div>
              </div>

              <!-- Action Buttons -->
              <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                <button @click="copyConfig()" :style="{ flex: 1, padding: '0.5rem', fontSize: '0.6875rem', fontWeight: '700', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', background: copySuccess ? '#10b981' : '#1e40af', color: 'white' }">
                  <span x-text="copySuccess ? '✓ Copied!' : 'Copy Config'"></span>
                </button>
                <button @click="downloadCSS()" style="flex: 1; padding: 0.5rem; font-size: 0.6875rem; font-weight: 700; border: none; border-radius: 0.25rem; cursor: pointer; background: #059669; color: white;">
                  Download CSS
                </button>
              </div>
              <div style="font-size: 0.5rem; color: #9ca3af; text-align: center; margin-top: 0.375rem;">
                Config for Tailwind • CSS for standalone use
              </div>
            </div>
          </div>

          <!-- Grid Diagram -->
          <div x-show="showDiagram"
               style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 0.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); pointer-events: auto; z-index: 10001; padding: 1.5rem; max-width: 90vw;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-weight: 700; font-size: 0.875rem; color: #111827;">Breakout Grid Structure</span>
              <button @click="showDiagram = false" style="background: #ef4444; border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.625rem; font-weight: 600;">Close</button>
            </div>
            <!-- Visual Diagram -->
            <div style="font-family: Monaco, monospace; font-size: 0.625rem; line-height: 1.8;">
              <!-- Column structure visualization -->
              <div style="display: flex; align-items: stretch; border: 2px solid #e5e7eb; border-radius: 0.25rem; overflow: hidden; min-height: 120px;">
                <!-- Full left -->
                <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
                  <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
                  <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
                </div>
                <!-- Feature left -->
                <div style="background: rgba(234, 179, 8, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 50px;">
                  <div style="color: #b45309; font-weight: 600;">feature</div>
                  <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.featureWidth || configOptions.featureWidth.value"></div>
                </div>
                <!-- Popout left -->
                <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
                  <div style="color: #15803d; font-weight: 600;">popout</div>
                  <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
                </div>
                <!-- Content -->
                <div style="background: rgba(59, 130, 246, 0.2); padding: 0.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1; min-width: 80px;">
                  <div style="color: #1d4ed8; font-weight: 700;">content</div>
                  <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.content || configOptions.content.value"></div>
                  <div style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: rgba(168, 85, 247, 0.3); border-radius: 0.125rem; color: #7c3aed; font-size: 0.5rem;">
                    narrow <span x-text="'(' + (editValues.narrowMin || configOptions.narrowMin.value) + ' - ' + (editValues.narrowMax || configOptions.narrowMax.value) + ')'"></span>
                  </div>
                </div>
                <!-- Popout right -->
                <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
                  <div style="color: #15803d; font-weight: 600;">popout</div>
                  <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
                </div>
                <!-- Feature right -->
                <div style="background: rgba(234, 179, 8, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 50px;">
                  <div style="color: #b45309; font-weight: 600;">feature</div>
                  <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.featureWidth || configOptions.featureWidth.value"></div>
                </div>
                <!-- Full right -->
                <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
                  <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
                  <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
                </div>
              </div>
              <!-- Legend -->
              <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.5625rem;">
                <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(239, 68, 68, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-full</div>
                <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(234, 179, 8, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-feature</div>
                <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(34, 197, 94, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-popout</div>
                <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(59, 130, 246, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-content</div>
                <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(168, 85, 247, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-narrow</div>
              </div>
              <!-- Padding explanation -->
              <div style="margin-top: 1rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.25rem; font-size: 0.5625rem; color: #4b5563;">
                <div style="font-weight: 700; margin-bottom: 0.25rem;">px-breakout aligns full-width content:</div>
                <div>Uses <span style="color: #3b82f6;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></span> padding so content aligns with .col-content edge</div>
              </div>
            </div>
          </div>

        </div>
      `
    }));
  });

  // Auto-inject component if Alpine is loaded
  if (window.Alpine) {
    console.log('✅ Alpine.js detected - Breakout Grid Visualizer ready');
  } else {
    console.warn('⚠️ Alpine.js not detected - Breakout Grid Visualizer requires Alpine.js v3.x');
  }

})();
