/**
 * Breakout Grid Visualizer - Methods
 * All component methods
 */

export const methods = {
  // Initialize
  init() {
    // Load saved state
    const saved = localStorage.getItem('breakoutGridVisualizerVisible');
    if (saved !== null) {
      this.isVisible = saved === 'true';
    }

    // Load config editor state
    const editorOpen = localStorage.getItem('breakoutGridEditorOpen');
    if (editorOpen === 'true') {
      this.showEditor = true;
      this.editMode = true;
      this.$nextTick(() => this.loadCurrentValues());
    }

    // Load config editor position
    const editorPos = localStorage.getItem('breakoutGridEditorPos');
    if (editorPos) {
      try {
        this.editorPos = JSON.parse(editorPos);
      } catch (e) {}
    }

    // Keyboard shortcut: Ctrl/Cmd + G
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Update viewport width and column widths on resize
    window.addEventListener('resize', () => {
      this.viewportWidth = window.innerWidth;
      this.updateColumnWidths();
    });

    console.log('Breakout Grid Visualizer loaded. Press Ctrl/Cmd + G to toggle.');
  },

  // Toggle visibility
  toggle() {
    this.isVisible = !this.isVisible;
    localStorage.setItem('breakoutGridVisualizerVisible', this.isVisible);
  },

  // Update column widths by querying DOM elements
  updateColumnWidths() {
    this.$nextTick(() => {
      this.gridAreas.forEach(area => {
        const el = document.querySelector(`.breakout-visualizer-grid .col-${area.name}`);
        if (el) {
          this.columnWidths[area.name] = Math.round(el.getBoundingClientRect().width);
        }
      });
    });
  },

  // Check if configured track widths would exceed viewport
  getTrackOverflowWarning() {
    const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value) * 16;
    const featureWidth = parseFloat(this.editValues.featureWidth || this.configOptions.featureWidth.value);
    const popoutWidth = parseFloat(this.editValues.popoutWidth || this.configOptions.popoutWidth.value) * 16;

    // Calculate feature in pixels (vw to px)
    const featurePx = (featureWidth / 100) * this.viewportWidth * 2;
    const popoutPx = popoutWidth * 2;
    const totalFixed = contentMax + featurePx + popoutPx;

    if (totalFixed > this.viewportWidth) {
      return `Tracks exceed viewport by ~${Math.round(totalFixed - this.viewportWidth)}px — outer columns will compress`;
    }
    return null;
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
  --content-min: ${c.contentMin};
  --content-max: ${c.contentMax};
  --content-base: ${c.contentBase};

  /* Computed values */
  --gap: clamp(var(--base-gap), ${c.gapScale?.default || '4vw'}, var(--max-gap));
  --content: min(clamp(var(--content-min), var(--content-base), var(--content-max)), 100% - var(--gap) * 2);
  --content-half: calc(var(--content) / 2);

  /* Track widths */
  --full: minmax(var(--gap), 1fr);
  --feature: minmax(0, ${c.featureWidth});
  --popout: minmax(0, ${c.popoutWidth});
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
    [content-start] var(--content-half) [center-start center-end] var(--content-half) [content-end]
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

  // Restore all CSS variable overrides to original values
  restoreCSSVariables() {
    Object.keys(this.configOptions).forEach(key => {
      const opt = this.configOptions[key];
      if (opt.liveVar) {
        document.documentElement.style.removeProperty(opt.liveVar);
      }
    });
    // Also restore track widths (set via minmax wrapper)
    document.documentElement.style.removeProperty('--popout');
    document.documentElement.style.removeProperty('--feature');
    document.documentElement.style.removeProperty('--content');
    document.documentElement.style.removeProperty('--breakout-padding');
    document.documentElement.style.removeProperty('--popout-to-content');
    this.editValues = {};
    this.configCopied = false;
  },

  // Toggle edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.loadCurrentValues();
    } else {
      this.restoreCSSVariables();
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
    localStorage.setItem('breakoutGridEditorOpen', 'true');
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
    this.restoreCSSVariables();
    localStorage.setItem('breakoutGridEditorOpen', 'false');
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
    if (this.isDragging) {
      localStorage.setItem('breakoutGridEditorPos', JSON.stringify(this.editorPos));
    }
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

    // For right-edge handles (contentMax, contentBase), dragging right increases value
    // For left-edge handles (contentMin, others), dragging left increases value (inverted)
    const isRightHandle = col === 'contentMax' || col === 'contentBase';
    const delta = isRightHandle ? (deltaX / pxPerUnit) : (-deltaX / pxPerUnit);
    let newValue = this.resizeStartValue + delta;

    // Enforce minimums
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
      'popout': 'popoutWidth'
      // content has its own integrated handles for min/max/base
    };
    return map[colName] || null;
  },
};
