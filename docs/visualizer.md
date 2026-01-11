# Grid Visualizer

An Alpine.js-powered visual debugging tool that helps designers see and understand the grid structure while building layouts. The visualizer provides real-time feedback about grid behavior and measurements.

## Features

- **Visual overlay** showing all grid columns with color-coded boundaries
- **Interactive column selection** - click any column to highlight and identify
- **Column labels** with both human-readable names and CSS class names
- **Live measurements** displaying current CSS variable values in real-time
- **Viewport width tracker** for responsive debugging
- **Padding visualization** for both `p-gap` and `p-breakout` utilities
- **Keyboard shortcut** (Ctrl/Cmd + G) to toggle visibility
- **Persistent state** remembers visibility and settings across page reloads
- **Responsive updates** automatically refreshes measurements on window resize
- **Version display** in control panel header
- **Config editor** - floating draggable window for live configuration editing
- **Grid structure diagram** - visual representation of the grid template (toggle show/hide)
- **Advanced spans view** - demonstrates start/end utilities and CSS subgrid
- **CSS download (beta)** - export standalone CSS for non-Tailwind projects

## Visual Indicators

The visualizer uses a consistent color scheme to identify different grid areas:

- **Full** (Red) - Edge-to-edge viewport width
- **Feature Popout** (Orange) - Maximum content width
- **Feature** (Yellow) - Extra wide content areas
- **Popout** (Green) - Slightly wider than standard content
- **Content** (Blue) - Standard content width (default)
- **Narrow** (Purple) - Optimal reading width (40-50rem)

## Interactive Controls

- **Labels Toggle** - Show/hide column name labels
- **Class Names Toggle** - Display CSS class names (e.g., `.col-feature`)
- **Values Toggle** - Show/hide live CSS variable measurements
- **p-gap Visualization** - Overlay showing `p-gap` padding areas
- **p-breakout Visualization** - Overlay showing `p-breakout` padding areas
- **Column Selection** - Click any column to highlight and view details

## Installation

The visualizer should only be loaded in development environments. The recommended approach is to dynamically import it and wait for Alpine.js to start.

### Vite/Modern Build Setup

```javascript
// In your main app.js or Alpine initialization file
import Alpine from 'alpinejs'

// Conditionally load visualizer in development
if (import.meta.env.DEV) {
  import('@astuteo/tailwind-breakout-grid/breakout-grid-visualizer.js').then(() => {
    Alpine.start()
  })
} else {
  Alpine.start()
}

window.Alpine = Alpine
```

Then add the component to your page (this can be in production HTML, it won't render unless the visualizer loads):

```html
<div x-data="breakoutGridVisualizer" x-html="template"></div>
```

**Key points:**
- The dynamic import ensures the visualizer only loads in development
- Waiting for the import to complete before calling `Alpine.start()` ensures the component is registered
- The HTML can remain in production builds (it won't render if the component isn't loaded)

### Alternative: Inline Script (Legacy)

If you're not using a build tool:

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script src="/path/to/breakout-grid-visualizer.js"></script>
<div x-data="breakoutGridVisualizer" x-html="template"></div>
```

## Usage

Once loaded, the visualizer can be controlled in three ways:

1. **Keyboard shortcut**: Press `Ctrl/Cmd + G` to toggle
2. **Toggle button**: Add a button that triggers the visualizer
3. **Programmatically**: Access via Alpine's `$data` API

```javascript
// Get the visualizer component
const visualizer = Alpine.$data(document.querySelector('[x-data*="breakoutGridVisualizer"]'));

// Toggle visibility
visualizer.toggle();

// Show/hide options
visualizer.showLabels = false;
visualizer.showClassNames = true;
visualizer.showMeasurements = false;
visualizer.showGapPadding = true;
visualizer.showBreakoutPadding = true;
```

## Controls Panel

When active, the visualizer displays a control panel with:

- **Viewport Width**: Current browser width in pixels
- **Current Values**: Live CSS variable measurements (--gap, --narrow, etc.)
- **Show Options**:
  - **Labels**: Toggle column name labels (e.g., "Full", "Feature", "Content")
  - **Class Names**: Toggle CSS class names (e.g., `.col-full`, `.col-feature`)
  - **Values**: Toggle measurement display
  - **p-gap**: Visualize the padding created by `p-gap`/`px-gap` utilities
  - **p-breakout**: Visualize the padding created by `p-breakout`/`px-breakout` utilities
- **Selected Column**: Click any column to highlight and view its class name

## Config Editor

The visualizer includes a floating config editor that allows real-time adjustment of grid values:

**Live-editable values:**
- `popoutWidth` - Popout extension distance
- `featureWidth` - Feature rail extension
- `content` - Standard content rail width (wrapped in minmax automatically)

**Requires rebuild:**
- `gapScale` - Responsive gap scaling values
- `defaultCol` - Default column for items without col-* class

The editor displays number inputs with unit suffixes (rem, vw, etc.) that support arrow key increment/decrement. Changes are reflected immediately in the visualizer overlay.

To open the editor, click the "Edit Config" button in the control panel. The editor window is draggable and includes:
- Copy button to export the modified config
- Unsaved changes warning when closing with uncommitted edits

## CSS Download (Beta)

Generate a standalone CSS file for projects not using Tailwind:

1. Click "Download CSS" in the control panel
2. A CSS file is generated with all breakout grid utilities
3. Includes CSS custom properties, grid templates, column utilities, and spacing classes

> **Note:** This feature is in beta. The generated CSS may need adjustment for production use.

## Advanced Spans View

Shows usage examples for:
- Start/end column utilities (`col-start-*`, `col-end-*`)
- Left/right span utilities (`col-*-left`, `col-*-right`)
- CSS subgrid with `grid-cols-breakout-subgrid`

The subgrid demo shows how nested elements can inherit and align to the parent grid's named tracks.

## Demo

Open `demo.html` in your browser to see the visualizer in action. Press `Ctrl/Cmd + G` to toggle it on and off.

## Files

- `breakout-grid-visualizer.js` - The Alpine.js component
- `craft-integration.twig` - Complete CraftCMS integration example
- `demo.html` - Interactive demonstration
