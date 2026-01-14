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

import {
  VERSION,
  LOREM_CONTENT,
  GRID_AREAS,
  CONFIG_OPTIONS,
  GAP_SCALE_OPTIONS,
  BREAKOUT_OPTIONS,
  createInitialState
} from './state.js';
import { generateCSSExport, CSS_EXPORT_VERSION } from './css-export.js';

import { methods } from './methods.js';
import { template } from './template.js';

(function() {
  'use strict';

  // Register Alpine.js component
  document.addEventListener('alpine:init', () => {
    Alpine.data('breakoutGridVisualizer', () => ({
      // Constants
      version: VERSION,
      loremContent: LOREM_CONTENT,

      // Configuration
      gridAreas: GRID_AREAS,
      configOptions: CONFIG_OPTIONS,
      gapScaleOptions: GAP_SCALE_OPTIONS,
      breakoutOptions: BREAKOUT_OPTIONS,

      // State
      ...createInitialState(),

      // Methods
      ...methods,

      // CSS export
      generateCSSExport,
      cssExportVersion: CSS_EXPORT_VERSION,

      // Template
      template
    }));
  });

  // Auto-inject component if Alpine is loaded
  if (window.Alpine) {
    console.log('Alpine.js detected - Breakout Grid Visualizer ready');
  } else {
    console.warn('Alpine.js not detected - Breakout Grid Visualizer requires Alpine.js v3.x');
  }

})();
