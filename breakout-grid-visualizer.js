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
      editMode: false,
      viewportWidth: window.innerWidth,
      selectedArea: null,
      hoveredArea: null,
      editValues: {},
      originalValues: {},
      copySuccess: false,

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
        baseGap: { value: '1rem', desc: 'Minimum gap between columns (mobile)', cssVar: '--config-base-gap', liveVar: '--base-gap' },
        maxGap: { value: '15rem', desc: 'Maximum gap cap for ultra-wide screens', cssVar: '--config-max-gap', liveVar: '--max-gap' },
        narrowMin: { value: '40rem', desc: 'Minimum width for readable text', cssVar: '--config-narrow-min', liveVar: '--narrow-min' },
        narrowMax: { value: '50rem', desc: 'Maximum before text gets hard to read', cssVar: '--config-narrow-max', liveVar: '--narrow-max' },
        narrowBase: { value: '52vw', desc: 'Preferred width for narrow sections', cssVar: '--config-narrow-base', liveVar: '--narrow-base' },
        // Track widths
        content: { value: '4vw', desc: 'Content rail width. Affects col-content', cssVar: '--config-content', liveVar: null },
        popoutWidth: { value: '5rem', desc: 'How far popout extends beyond content', cssVar: '--config-popout', liveVar: null },
        featureWidth: { value: '12vw', desc: 'How far feature extends (images, heroes)', cssVar: '--config-feature', liveVar: null },
        fullLimit: { value: '90rem', desc: 'Max width for col-full-limit (≤ feature)', cssVar: '--config-full-limit', liveVar: '--full-limit' },
        // Default column
        defaultCol: { value: 'content', desc: 'Default column when no col-* class', type: 'select', options: ['narrow', 'content', 'popout', 'feature', 'full'], cssVar: '--config-default-col' },
      },
      gapScaleOptions: {
        default: { value: '4vw', desc: 'Mobile/default gap scaling' },
        lg: { value: '5vw', desc: 'Large screens (1024px+)' },
        xl: { value: '6vw', desc: 'Extra large screens (1280px+)' },
      },
      breakoutPaddingOptions: {
        base: { value: '1.5rem', desc: 'Mobile (p-6 equivalent)' },
        md: { value: '4rem', desc: 'Medium screens (p-16)' },
        lg: { value: '5rem', desc: 'Large screens (p-20)' },
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
        // Try to read breakoutPadding base from CSS
        const bpBase = this.getCSSVariable('--breakout-padding');
        if (bpBase && bpBase !== 'Not set') {
          this.editValues['breakoutPadding_base'] = bpBase;
        }
        Object.keys(this.breakoutPaddingOptions).forEach(key => {
          if (!this.editValues[`breakoutPadding_${key}`]) {
            this.editValues[`breakoutPadding_${key}`] = this.breakoutPaddingOptions[key].value;
          }
        });
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
        config.breakoutPadding = {};
        Object.keys(this.breakoutPaddingOptions).forEach(key => {
          config.breakoutPadding[key] = this.editValues[`breakoutPadding_${key}`] || this.breakoutPaddingOptions[key].value;
        });
        return config;
      },

      // Copy config to clipboard
      copyConfig() {
        const config = this.generateConfigExport();
        const configStr = `breakoutGrid(${JSON.stringify(config, null, 2)})`;
        navigator.clipboard.writeText(configStr).then(() => {
          this.copySuccess = true;
          setTimeout(() => this.copySuccess = false, 2000);
        });
      },

      // Update a config value (and live CSS var if applicable)
      updateConfigValue(key, value) {
        this.editValues[key] = value;
        const opt = this.configOptions[key];
        if (opt && opt.liveVar) {
          document.documentElement.style.setProperty(opt.liveVar, value);
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

      // Template for the visualizer UI
      template: `
        <div x-show="isVisible"
             x-transition
             class="breakout-grid-visualizer"
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

            <!-- To center point: full-start to center -->
            <div style="grid-column: full-start / center;
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
                <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-start-full .col-end-center</div>
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
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <div>
                <span style="font-weight: 700; font-size: 0.75rem; color: #111827;">Grid</span>
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

            <!-- Edit Mode - Full Config Editor -->
            <div x-show="editMode" style="margin-bottom: 0.5rem; background: #fffbeb; border: 1px solid #f59e0b; border-radius: 0.375rem; padding: 1rem; max-height: 60vh; overflow-y: auto;">

              <!-- Base Measurements -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Base Measurements</div>
              <template x-for="key in ['baseGap', 'maxGap', 'narrowMin', 'narrowMax', 'narrowBase']" :key="key">
                <div style="margin-bottom: 0.75rem;">
                  <label style="display: block; color: #78716c; font-weight: 600; font-size: 0.75rem; font-family: Monaco, monospace; margin-bottom: 0.25rem;" x-text="key"></label>
                  <input type="text"
                         :value="editValues[key] || configOptions[key].value"
                         @input="updateConfigValue(key, $event.target.value)"
                         style="width: 100%; padding: 0.375rem 0.5rem; font-size: 0.75rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white; box-sizing: border-box;">
                  <div style="font-size: 0.625rem; color: #a8a29e; margin-top: 0.125rem;" x-text="configOptions[key].desc"></div>
                </div>
              </template>

              <!-- Track Widths -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin: 1rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 0.75rem; border-top: 1px dashed #fde68a;">Track Widths</div>
              <template x-for="key in ['content', 'popoutWidth', 'featureWidth', 'fullLimit']" :key="key">
                <div style="margin-bottom: 0.75rem;">
                  <label style="display: block; color: #78716c; font-weight: 600; font-size: 0.75rem; font-family: Monaco, monospace; margin-bottom: 0.25rem;" x-text="key"></label>
                  <input type="text"
                         :value="editValues[key] || configOptions[key].value"
                         @input="updateConfigValue(key, $event.target.value)"
                         style="width: 100%; padding: 0.375rem 0.5rem; font-size: 0.75rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white; box-sizing: border-box;">
                  <div style="font-size: 0.625rem; color: #a8a29e; margin-top: 0.125rem;" x-text="configOptions[key].desc"></div>
                </div>
              </template>

              <!-- Default Column -->
              <div style="margin-bottom: 0.75rem;">
                <label style="display: block; color: #78716c; font-weight: 600; font-size: 0.75rem; font-family: Monaco, monospace; margin-bottom: 0.25rem;">defaultCol</label>
                <select @change="editValues.defaultCol = $event.target.value"
                        style="width: 100%; padding: 0.375rem 0.5rem; font-size: 0.75rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white; box-sizing: border-box;">
                  <template x-for="opt in configOptions.defaultCol.options" :key="opt">
                    <option :value="opt" :selected="(editValues.defaultCol || configOptions.defaultCol.value) === opt" x-text="opt"></option>
                  </template>
                </select>
                <div style="font-size: 0.625rem; color: #a8a29e; margin-top: 0.125rem;" x-text="configOptions.defaultCol.desc"></div>
              </div>

              <!-- Gap Scale -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin: 1rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 0.75rem; border-top: 1px dashed #fde68a;">gapScale (responsive)</div>
              <template x-for="key in Object.keys(gapScaleOptions)" :key="'gs_'+key">
                <div style="margin-bottom: 0.5rem; display: flex; gap: 0.5rem; align-items: center;">
                  <label style="color: #78716c; font-weight: 600; font-size: 0.6875rem; font-family: Monaco, monospace; min-width: 3.5rem;" x-text="key + ':'"></label>
                  <input type="text"
                         :value="editValues['gapScale_'+key] || gapScaleOptions[key].value"
                         @input="editValues['gapScale_'+key] = $event.target.value"
                         style="flex: 1; padding: 0.25rem 0.375rem; font-size: 0.6875rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white; box-sizing: border-box;">
                </div>
              </template>

              <!-- Breakout Padding -->
              <div style="font-size: 0.6875rem; font-weight: 700; color: #92400e; margin: 1rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 0.75rem; border-top: 1px dashed #fde68a;">breakoutPadding (responsive)</div>
              <template x-for="key in Object.keys(breakoutPaddingOptions)" :key="'bp_'+key">
                <div style="margin-bottom: 0.5rem; display: flex; gap: 0.5rem; align-items: center;">
                  <label style="color: #78716c; font-weight: 600; font-size: 0.6875rem; font-family: Monaco, monospace; min-width: 3.5rem;" x-text="key + ':'"></label>
                  <input type="text"
                         :value="editValues['breakoutPadding_'+key] || breakoutPaddingOptions[key].value"
                         @input="editValues['breakoutPadding_'+key] = $event.target.value"
                         style="flex: 1; padding: 0.25rem 0.375rem; font-size: 0.6875rem; font-family: Monaco, monospace; border: 1px solid #fbbf24; border-radius: 0.25rem; background: white; box-sizing: border-box;">
                </div>
              </template>

              <!-- Copy Config Button -->
              <button @click="copyConfig()"
                      :style="{
                        width: '100%',
                        padding: '0.625rem',
                        marginTop: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        background: copySuccess ? '#10b981' : '#1e40af',
                        color: 'white',
                        transition: 'background 0.2s'
                      }">
                <span x-text="copySuccess ? '✓ Copied to Clipboard!' : 'Copy Config Object'"></span>
              </button>
              <div style="font-size: 0.5625rem; color: #78716c; text-align: center; margin-top: 0.5rem;">
                Exports breakoutGrid({ ... }) for tailwind.config.js
              </div>
            </div>

            <!-- Edit Mode Toggle -->
            <button @click="toggleEditMode()"
                    :style="{
                      width: '100%',
                      padding: '0.25rem 0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.5rem',
                      fontWeight: '600',
                      border: editMode ? 'none' : '1px solid #f59e0b',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      background: editMode ? '#f59e0b' : 'white',
                      color: editMode ? 'white' : '#f59e0b'
                    }">
              <span x-text="editMode ? '✓ Editing Live - Click to Reset' : 'Edit CSS Variables'"></span>
            </button>

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
