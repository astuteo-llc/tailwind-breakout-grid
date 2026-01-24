/**
 * Breakout Grid Visualizer Lite - Alpine.js Component
 *
 * A lightweight, read-only visualizer for users of the standalone CSS export.
 * Shows grid overlay and measurements without config editing or CSS export.
 *
 * ⚠️  DEVELOPMENT ONLY - Never include in production builds!
 *
 * Press Ctrl/Cmd + G to toggle.
 *
 * @requires Alpine.js v3.x
 * @requires Breakout Grid CSS (standalone export)
 *
 * Usage with standalone CSS:
 *   <link rel="stylesheet" href="breakout-grid.css">
 *   <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
 *   <script defer src="breakout-grid-visualizer-lite.js"></script>
 */

import {
  VERSION,
  LOREM_CONTENT,
  GRID_AREAS,
  createInitialStateLite
} from './state-lite.js';

import { methodsLite } from './methods-lite.js';
import { templateLite } from './template-lite.js';

(function() {
  'use strict';

  // Register Alpine.js component
  document.addEventListener('alpine:init', () => {
    Alpine.data('breakoutGridVisualizer', () => ({
      // Constants
      version: VERSION,
      loremContent: LOREM_CONTENT,

      // Configuration (read-only)
      gridAreas: GRID_AREAS,

      // State
      ...createInitialStateLite(),

      // Methods
      ...methodsLite,

      // Template
      template: templateLite
    }));
  });

  // Auto-inject visualizer into DOM
  function injectVisualizer() {
    // Check if already injected
    if (document.getElementById('breakout-grid-visualizer-root')) return;

    // Create container with Alpine directives
    const container = document.createElement('div');
    container.id = 'breakout-grid-visualizer-root';
    container.setAttribute('x-data', 'breakoutGridVisualizer');
    container.setAttribute('x-html', 'template');

    // Append to body
    document.body.appendChild(container);
    console.log('Breakout Grid Visualizer (Lite) injected. Press Ctrl/Cmd + G to toggle.');
  }

  // Wait for Alpine and DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Give Alpine a moment to initialize
      setTimeout(injectVisualizer, 10);
    });
  } else {
    // DOM already loaded, inject after Alpine initializes
    document.addEventListener('alpine:initialized', injectVisualizer);
    // Fallback if alpine:initialized already fired
    setTimeout(injectVisualizer, 100);
  }

})();
