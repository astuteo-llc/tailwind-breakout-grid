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
      // State
      isVisible: false,
      showLabels: true,
      showClassNames: false,
      showMeasurements: true,
      showGapPadding: false,
      showBreakoutPadding: false,
      showAdvancedSpan: false,
      viewportWidth: window.innerWidth,
      selectedArea: null,

      // Grid areas configuration (matches plugin)
      gridAreas: [
        { name: 'full', label: 'Full', className: '.col-full', color: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgb(239, 68, 68)' },
        { name: 'full-limit', label: 'Full Limit', className: '.col-full-limit', color: 'rgba(220, 38, 38, 0.1)', borderColor: 'rgb(220, 38, 38)' },
        { name: 'feature', label: 'Feature', className: '.col-feature', color: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgb(234, 179, 8)' },
        { name: 'popout', label: 'Popout', className: '.col-popout', color: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgb(34, 197, 94)' },
        { name: 'content', label: 'Content', className: '.col-content', color: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgb(59, 130, 246)' },
        { name: 'narrow', label: 'Narrow', className: '.col-narrow', color: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgb(168, 85, 247)' },
      ],

      // CSS variables to display
      cssVariables: [
        '--gap',
        '--narrow',
        '--content',
        '--popout',
        '--feature'
      ],

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

      // Get all CSS variable values
      getAllCSSVariables() {
        return this.cssVariables.map(varName => ({
          name: varName,
          value: this.getCSSVariable(varName)
        }));
      },

      // Select a grid area
      selectArea(areaName) {
        this.selectedArea = this.selectedArea === areaName ? null : areaName;
      },

      // Check if area is selected
      isSelected(areaName) {
        return this.selectedArea === areaName;
      },

      // Template for the visualizer UI
      template: `
        <div x-show="isVisible"
             x-transition
             class="breakout-grid-visualizer"
             style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;">

          <!-- Advanced Span Example Overlay -->
          <div x-show="showAdvancedSpan"
               class="grid-cols-breakout"
               style="position: absolute; inset: 0; height: 100%; pointer-events: none; z-index: 5;">
            <div style="grid-column: full-start / feature-end;
                        background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
                        border: 3px solid rgb(168, 85, 247);
                        border-radius: 0.5rem;
                        margin: 2rem 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;">
              <div style="background: rgb(139, 92, 246);
                          color: white;
                          padding: 1rem 1.5rem;
                          border-radius: 0.5rem;
                          font-size: 0.875rem;
                          font-weight: 700;
                          text-align: center;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="font-family: monospace; margin-bottom: 0.25rem;">col-start-full col-end-feature</div>
                <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Asymmetric span: left edge to feature boundary</div>
              </div>
            </div>
          </div>

          <!-- Grid Overlay -->
          <div class="grid-cols-breakout" style="height: 100%; position: relative;">
            <template x-for="area in gridAreas" :key="area.name">
              <div :class="'col-' + area.name"
                   @click="selectArea(area.name)"
                   :style="{
                     backgroundColor: isSelected(area.name) ? area.color.replace('0.1', '0.3') : area.color,
                     borderLeft: '1px solid ' + area.borderColor,
                     borderRight: '1px solid ' + area.borderColor,
                     position: 'relative',
                     height: '100%',
                     pointerEvents: 'auto',
                     cursor: 'pointer',
                     transition: 'background-color 0.2s'
                   }">

                <!-- Label -->
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
                       textAlign: 'center'
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
          <div style="position: fixed; bottom: 1rem; right: 1rem; pointer-events: auto; background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 1rem; max-width: 320px; font-family: system-ui, -apple-system, sans-serif;">

            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e5e7eb;">
              <h3 style="font-weight: 700; font-size: 0.875rem; margin: 0; color: #111827;">
                Grid Visualizer
              </h3>
              <button @click="toggle()"
                      style="background: #ef4444; color: white; border: none; border-radius: 0.375rem; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                Close
              </button>
            </div>

            <!-- Viewport Info -->
            <div style="margin-bottom: 1rem; padding: 0.75rem; background: #f3f4f6; border-radius: 0.375rem;">
              <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                Viewport Width
              </div>
              <div style="font-size: 1.25rem; font-weight: 700; color: #111827; font-variant-numeric: tabular-nums;" x-text="viewportWidth + 'px'"></div>
            </div>

            <!-- CSS Variables -->
            <div x-show="showMeasurements" style="margin-bottom: 1rem;">
              <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                Current Values
              </div>
              <div style="background: #f9fafb; border-radius: 0.375rem; padding: 0.5rem; font-size: 0.75rem; font-family: 'Monaco', 'Courier New', monospace;">
                <template x-for="variable in getAllCSSVariables()" :key="variable.name">
                  <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280;" x-text="variable.name"></span>
                    <span style="color: #111827; font-weight: 600;" x-text="variable.value"></span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Toggles -->
            <div style="margin-bottom: 0.75rem;">
              <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                Show
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.75rem; color: #374151;">
                  <input type="checkbox" x-model="showLabels" style="margin-right: 0.375rem; cursor: pointer;">
                  Labels
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.75rem; color: #374151;">
                  <input type="checkbox" x-model="showClassNames" style="margin-right: 0.375rem; cursor: pointer;">
                  Class Names
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.75rem; color: #374151;">
                  <input type="checkbox" x-model="showMeasurements" style="margin-right: 0.375rem; cursor: pointer;">
                  Values
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.75rem; color: #10b981;">
                  <input type="checkbox" x-model="showGapPadding" style="margin-right: 0.375rem; cursor: pointer;">
                  p-gap
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.75rem; color: #3b82f6;">
                  <input type="checkbox" x-model="showBreakoutPadding" style="margin-right: 0.375rem; cursor: pointer;">
                  p-breakout
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.75rem; color: #8b5cf6;">
                  <input type="checkbox" x-model="showAdvancedSpan" style="margin-right: 0.375rem; cursor: pointer;">
                  Span Example
                </label>
              </div>
            </div>

            <!-- Keyboard Shortcut -->
            <div style="font-size: 0.625rem; color: #9ca3af; text-align: center; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
              Press <kbd style="background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-weight: 600; color: #374151;">Ctrl/Cmd + G</kbd> to toggle
            </div>

            <!-- Selected Area Info -->
            <div x-show="selectedArea" style="margin-top: 0.75rem; padding: 0.75rem; background: #eff6ff; border-radius: 0.375rem; border-left: 3px solid #3b82f6;">
              <div style="font-size: 0.75rem; font-weight: 600; color: #1e40af; margin-bottom: 0.25rem;">
                Selected Column
              </div>
              <div style="font-size: 0.875rem; color: #1e3a8a; font-weight: 700; font-family: monospace;" x-text="gridAreas.find(a => a.name === selectedArea)?.className || ''"></div>
              <div style="font-size: 0.625rem; color: #3b82f6; margin-top: 0.25rem;">
                Click another column to compare
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
