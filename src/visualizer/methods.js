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

    // Load spacing panel position and state
    const spacingPos = localStorage.getItem('breakoutGridSpacingPos');
    if (spacingPos) {
      try {
        this.spacingPanelPos = JSON.parse(spacingPos);
      } catch (e) {}
    }
    const spacingCollapsed = localStorage.getItem('breakoutGridSpacingCollapsed');
    if (spacingCollapsed !== null) {
      this.spacingPanelCollapsed = spacingCollapsed === 'true';
    }

    // Keyboard shortcut: Ctrl/Cmd + G
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Update viewport width, column widths, and breakpoint on resize
    window.addEventListener('resize', () => {
      this.viewportWidth = window.innerWidth;
      this.updateColumnWidths();
      this.updateCurrentBreakpoint();
      if (this.editMode) {
        this.updateGapLive();
      }
    });

    // Initialize breakpoint
    this.updateCurrentBreakpoint();

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

  // Detect current breakpoint based on viewport width
  updateCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1280) {
      this.currentBreakpoint = 'xl';
    } else if (width >= 1024) {
      this.currentBreakpoint = 'lg';
    } else {
      this.currentBreakpoint = 'mobile';
    }
  },

  // Update --gap live based on current breakpoint and edit values
  updateGapLive() {
    const scaleKey = this.currentBreakpoint === 'mobile' ? 'default' : this.currentBreakpoint;
    const base = this.editValues.baseGap || this.configOptions.baseGap.value;
    const max = this.editValues.maxGap || this.configOptions.maxGap.value;
    const scale = this.editValues[`gapScale_${scaleKey}`] || this.gapScaleOptions[scaleKey].value;

    document.documentElement.style.setProperty('--gap', `clamp(${base}, ${scale}, ${max})`);
    this.updateColumnWidths();
  },

  // Check if content width exceeds comfortable reading width (55rem)
  getContentReadabilityWarning() {
    const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value);
    if (contentMax > 55) {
      return `Content max (${contentMax}rem) exceeds 55rem—may be wide for reading. Ideal for prose: 45–55rem.`;
    }
    return null;
  },

  // Check if configured track widths would exceed viewport
  getTrackOverflowWarning() {
    const contentMax = parseFloat(this.editValues.contentMax || this.configOptions.contentMax.value) * 16;
    const featureMax = parseFloat(this.editValues.featureMax || this.configOptions.featureMax.value) * 16;
    const popoutWidth = parseFloat(this.editValues.popoutWidth || this.configOptions.popoutWidth.value) * 16;

    // Feature max is in rem, convert to px
    const featurePx = featureMax * 2;
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

  // Helper to load options from CSS variables
  loadOptionsFromCSS(options, prefix = '') {
    Object.keys(options).forEach(key => {
      const opt = options[key];
      const editKey = prefix ? `${prefix}_${key}` : key;
      if (opt.cssVar) {
        const computed = this.getCSSVariable(opt.cssVar);
        this.editValues[editKey] = (computed && computed !== 'Not set' && computed !== '') ? computed : opt.value;
      } else {
        this.editValues[editKey] = opt.value;
      }
    });
  },

  // Load current values from CSS variables where available
  loadCurrentValues() {
    this.loadOptionsFromCSS(this.configOptions);
    this.loadOptionsFromCSS(this.gapScaleOptions, 'gapScale');
    this.loadOptionsFromCSS(this.breakoutOptions, 'breakout');
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
    // Add breakout values
    config.breakoutMin = this.editValues.breakout_min || this.breakoutOptions.min.value;
    config.breakoutScale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
    return config;
  },

  // Format config object with single quotes for values, no quotes for keys
  formatConfig(obj, indent = 2) {
    const pad = ' '.repeat(indent);
    const lines = ['{'];
    const entries = Object.entries(obj);
    entries.forEach(([key, value], i) => {
      const comma = i < entries.length - 1 ? ',' : '';
      if (typeof value === 'object' && value !== null) {
        lines.push(`${pad}${key}: ${this.formatConfig(value, indent + 2).replace(/\n/g, '\n' + pad)}${comma}`);
      } else {
        lines.push(`${pad}${key}: '${value}'${comma}`);
      }
    });
    lines.push('}');
    return lines.join('\n');
  },

  // Copy config to clipboard
  copyConfig() {
    const config = this.generateConfigExport();
    const configStr = `breakoutGrid(${this.formatConfig(config)})`;
    navigator.clipboard.writeText(configStr).then(() => {
      this.copySuccess = true;
      this.configCopied = true;
      setTimeout(() => this.copySuccess = false, 2000);
    });
  },

  // Generate and download standalone CSS file
  downloadCSS() {
    const css = this.generateCSSExport(this.generateConfigExport());
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breakout-grid-${this.cssExportVersion}.css`;
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
    if ((key === 'featureMin' || key === 'featureScale' || key === 'featureMax') && num < 0) num = 0;
    const unit = this.getUnit(key);
    this.updateConfigValue(key, num + unit);
  },

  // Generic getter for prefixed options (gapScale, breakout)
  getPrefixedNumeric(prefix, options, key) {
    const val = this.editValues[`${prefix}_${key}`] || options[key].value;
    return this.parseValue(val).num;
  },

  getPrefixedUnit(prefix, options, key) {
    const val = this.editValues[`${prefix}_${key}`] || options[key].value;
    return this.parseValue(val).unit;
  },

  // Gap scale helpers (use generic)
  getGapScaleNumeric(key) { return this.getPrefixedNumeric('gapScale', this.gapScaleOptions, key); },
  getGapScaleUnit(key) { return this.getPrefixedUnit('gapScale', this.gapScaleOptions, key); },
  updateGapScaleNumeric(key, num) {
    this.editValues[`gapScale_${key}`] = num + this.getGapScaleUnit(key);
    this.configCopied = false;
    this.updateGapLive();
  },

  // Breakout helpers (use generic)
  getBreakoutNumeric(key) { return this.getPrefixedNumeric('breakout', this.breakoutOptions, key); },
  getBreakoutUnit(key) { return this.getPrefixedUnit('breakout', this.breakoutOptions, key); },
  updateBreakoutNumeric(key, num) {
    this.editValues[`breakout_${key}`] = num + this.getBreakoutUnit(key);
    this.configCopied = false;
    this.updateBreakoutLive();
  },

  // Update --breakout-padding live
  updateBreakoutLive() {
    const min = this.editValues.breakout_min || this.breakoutOptions.min.value;
    const scale = this.editValues.breakout_scale || this.breakoutOptions.scale.value;
    const max = this.editValues.popoutWidth || this.configOptions.popoutWidth.value;
    document.documentElement.style.setProperty('--breakout-padding', `clamp(${min}, ${scale}, ${max})`);
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
      this.updateBreakoutLive(); // Update breakout padding with new popout ceiling
    }
    if (key === 'featureMin' || key === 'featureScale' || key === 'featureMax') {
      const featureMin = this.editValues.featureMin || this.configOptions.featureMin.value;
      const featureScale = this.editValues.featureScale || this.configOptions.featureScale.value;
      const featureMax = this.editValues.featureMax || this.configOptions.featureMax.value;
      document.documentElement.style.setProperty('--feature', `minmax(0, clamp(${featureMin}, ${featureScale}, ${featureMax}))`);
    }
    if (key === 'content') {
      document.documentElement.style.setProperty('--content', `minmax(0, ${value})`);
    }
    // Update gap live when min/max change
    if (key === 'baseGap' || key === 'maxGap') {
      this.updateGapLive();
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

  // Generic drag handling for panels
  _dragConfigs: {
    editor: { pos: 'editorPos', dragging: 'isDragging', offset: 'dragOffset', storage: 'breakoutGridEditorPos' },
    spacing: { pos: 'spacingPanelPos', dragging: 'isDraggingSpacing', offset: 'dragOffsetSpacing', storage: 'breakoutGridSpacingPos' }
  },

  startPanelDrag(e, panel) {
    const cfg = this._dragConfigs[panel];
    this[cfg.dragging] = true;
    this[cfg.offset] = { x: e.clientX - this[cfg.pos].x, y: e.clientY - this[cfg.pos].y };
  },

  onPanelDrag(e, panel) {
    const cfg = this._dragConfigs[panel];
    if (this[cfg.dragging]) {
      this[cfg.pos] = { x: e.clientX - this[cfg.offset].x, y: e.clientY - this[cfg.offset].y };
    }
  },

  stopPanelDrag(panel) {
    const cfg = this._dragConfigs[panel];
    if (this[cfg.dragging]) localStorage.setItem(cfg.storage, JSON.stringify(this[cfg.pos]));
    this[cfg.dragging] = false;
  },

  // Editor drag (shorthand)
  startDrag(e) { this.startPanelDrag(e, 'editor'); },
  onDrag(e) { this.onPanelDrag(e, 'editor'); },
  stopDrag() { this.stopPanelDrag('editor'); },

  // Spacing drag (shorthand)
  startDragSpacing(e) { this.startPanelDrag(e, 'spacing'); },
  onDragSpacing(e) { this.onPanelDrag(e, 'spacing'); },
  stopDragSpacing() { this.stopPanelDrag('spacing'); },

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
    this.updateColumnWidths();
  },

  stopColumnResize() {
    this.resizingColumn = null;
  },

  // Map column names to their config keys for resizing
  getResizeConfig(colName) {
    const map = {
      'full-limit': 'fullLimit',
      'feature': 'featureScale',
      'popout': 'popoutWidth'
      // content has its own integrated handles for min/max/base
      // feature has its own integrated handles for min/scale/max
    };
    return map[colName] || null;
  },

  // Parse a config string (from copyConfig output) into an object
  parseConfigString(input) {
    // Strip breakoutGrid( wrapper and trailing )
    let str = input.trim();
    const match = str.match(/^breakoutGrid\s*\(([\s\S]*)\)\s*,?\s*$/);
    if (match) {
      str = match[1];
    }

    // Convert to valid JSON:
    str = str
      // Strip single-line comments (// ...)
      .replace(/\/\/.*$/gm, '')
      // Strip multi-line comments (/* ... */)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Handle keys without quotes: "  key:" -> "  "key":"
      .replace(/^\s*(\w+)\s*:/gm, '"$1":')
      // Convert single quotes to double quotes for values
      .replace(/'/g, '"')
      // Remove trailing commas before } or ]
      .replace(/,(\s*[}\]])/g, '$1');

    try {
      return JSON.parse(str);
    } catch (e) {
      throw new Error('Invalid config format. Paste the output from "Copy Config".');
    }
  },

  // Open restore modal
  openRestoreModal() {
    this.showRestoreModal = true;
    this.restoreInput = '';
    this.restoreError = null;
  },

  // Close restore modal
  closeRestoreModal() {
    this.showRestoreModal = false;
    this.restoreInput = '';
    this.restoreError = null;
  },

  // Apply a parsed config to the editor
  restoreConfig() {
    this.restoreError = null;

    try {
      const config = this.parseConfigString(this.restoreInput);

      // Apply main config values
      Object.keys(this.configOptions).forEach(key => {
        if (config[key] !== undefined) {
          this.editValues[key] = config[key];
          this.updateConfigValue(key, config[key]);
        }
      });

      // Apply gapScale values
      if (config.gapScale) {
        Object.keys(this.gapScaleOptions).forEach(key => {
          if (config.gapScale[key] !== undefined) {
            this.editValues[`gapScale_${key}`] = config.gapScale[key];
          }
        });
        this.updateGapLive();
      }

      // Apply breakout values
      if (config.breakoutMin !== undefined) {
        this.editValues.breakout_min = config.breakoutMin;
      }
      if (config.breakoutScale !== undefined) {
        this.editValues.breakout_scale = config.breakoutScale;
      }
      this.updateBreakoutLive();

      // Update column widths display
      this.updateColumnWidths();

      // Close modal on success
      this.closeRestoreModal();
      this.configCopied = false;

    } catch (e) {
      this.restoreError = e.message;
    }
  },
};
