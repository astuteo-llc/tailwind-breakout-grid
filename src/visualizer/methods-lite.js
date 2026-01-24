/**
 * Breakout Grid Visualizer Lite - Methods
 * Read-only methods (no config editing, no CSS export)
 */

export const methodsLite = {
  // Initialize
  init() {
    // Load saved visibility state
    const saved = localStorage.getItem('breakoutGridVisualizerVisible');
    if (saved !== null) {
      this.isVisible = saved === 'true';
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
    });

    // Initialize breakpoint
    this.updateCurrentBreakpoint();

    console.log('Breakout Grid Visualizer (Lite) loaded. Press Ctrl/Cmd + G to toggle.');
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

  // Select a grid area
  selectArea(areaName) {
    this.selectedArea = this.selectedArea === areaName ? null : areaName;
  },

  // Check if area is selected
  isSelected(areaName) {
    return this.selectedArea === areaName;
  },

  // Spacing panel drag handling
  startDragSpacing(e) {
    this.isDraggingSpacing = true;
    this.dragOffsetSpacing = {
      x: e.clientX - this.spacingPanelPos.x,
      y: e.clientY - this.spacingPanelPos.y
    };
  },

  onDragSpacing(e) {
    if (this.isDraggingSpacing) {
      this.spacingPanelPos = {
        x: e.clientX - this.dragOffsetSpacing.x,
        y: e.clientY - this.dragOffsetSpacing.y
      };
    }
  },

  stopDragSpacing() {
    if (this.isDraggingSpacing) {
      localStorage.setItem('breakoutGridSpacingPos', JSON.stringify(this.spacingPanelPos));
    }
    this.isDraggingSpacing = false;
  },
};
