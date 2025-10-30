# Tailwind Breakout Grid Plugin

A Tailwind CSS plugin that creates a flexible, fluid grid layout system allowing content to "break out" of its container while maintaining optimal readability. Perfect for modern editorial layouts, marketing pages, and content-rich applications.

Inspired by [Viget's Fluid Breakout Layout](https://www.viget.com/articles/fluid-breakout-layout-css-grid/).

## Features

- **7 content width levels** - From narrow reading columns to full viewport width
- **Responsive spacing** - Automatic gap scaling based on viewport size
- **Left/right alignment** - Nested grids for asymmetric layouts
- **Fluid by default** - Uses CSS clamp() for smooth viewport adaptation
- **Zero dependencies** - Pure CSS Grid implementation
- **Tailwind-first** - Integrates seamlessly with Tailwind's utility system

## Installation

### Via npm (Recommended)

Install the plugin from npm:

```bash
npm install @astuteo/tailwind-breakout-grid
```

Then register it in your `tailwind.config.js`:

```js
import breakoutGrid from '@astuteo/tailwind-breakout-grid'

export default {
  plugins: [
    breakoutGrid({
      // Optional: customize the defaults
      baseGap: '1.5rem',
      maxGap: '15rem',
      narrowMin: '40rem',
      narrowMax: '50rem',
      // ... see Configuration section for all options
    })
  ]
}
```

### Manual Installation

Alternatively, copy `index.js` to your project (e.g., `./tailwind-plugins/breakout-grid.js`):

```js
import breakoutGrid from './tailwind-plugins/breakout-grid.js'

export default {
  plugins: [breakoutGrid()]
}
```

## Quick Start

Apply the base grid class to a container, then use column utilities on children:

```html
<div class="grid-cols-breakout">
  <p>Standard content width (uses defaultCol setting)</p>
  <p class="col-narrow">Optimal reading width (40-50rem)</p>
  <img class="col-feature" src="hero.jpg" alt="Wide feature image" />
  <div class="col-full bg-gray-100">Full viewport width</div>
</div>
```

## Configuration

All options are optional and have sensible defaults:

```js
breakoutGrid({
  // Base gap measurements
  baseGap: '1rem',        // Minimum gap on mobile
  maxGap: '15rem',        // Maximum gap on ultra-wide screens

  // Reading width constraints
  narrowMin: '40rem',     // Minimum width for narrow columns
  narrowMax: '50rem',     // Maximum width for narrow columns
  narrowBase: '52vw',     // Preferred width (viewport-based)

  // Breakout distances
  content: '4vw',         // Standard content rail width
  popoutWidth: '5rem',    // Popout extension distance
  featureWidth: '12vw',   // Feature rail extension
  featurePopoutWidth: '5rem', // Extra feature extension

  // Layout behavior
  defaultCol: 'content',  // Default column for items without col-* class
  fullLimit: '90rem',     // Maximum width for col-full-limit

  // Responsive gap scaling
  gapScale: {
    default: '4vw',       // Mobile/default gap
    lg: '5vw',            // Large screens (1024px+)
    xl: '6vw'             // Extra large screens (1280px+)
  },

  // Development
  debug: false            // Enable console logging
})
```

## Column Width Hierarchy

From narrowest to widest:

```
Viewport edges
┌─────────────────────────────────────────┐
│ ╔══════════col-full════════════╗        │ Full width (with gap padding)
│ ║                              ║        │
│ ╚══════════════════════════════╝        │
│   ╔════col-feature-popout════╗          │ Widest content
│   ║     ~featurePopoutWidth  ║          │
│   ╚══════════════════════════╝          │
│     ╔════col-feature═══════╗            │ Extra wide content
│     ║    ~featureWidth     ║            │
│     ╚══════════════════════╝            │
│       ╔═══col-popout══════╗             │ Slightly wider
│       ║   ~popoutWidth    ║             │
│       ╚═══════════════════╝             │
│         ╔═col-content════╗              │ Standard width (default)
│         ║   ~content     ║              │
│         ╚════════════════╝              │
│           ╔col-narrow══╗                │ Reading width (40-50rem)
│           ║   text     ║                │
│           ╚════════════╝                │
│             [center]                    │ Single point (rarely used)
└─────────────────────────────────────────┘
```

## Usage

### Basic Grid Container

```html
<article class="grid-cols-breakout">
  <h1>Article Title</h1>
  <p>Body content automatically uses the defaultCol setting.</p>
</article>
```

### Column Width Classes

```html
<div class="grid-cols-breakout">
  <!-- Narrow: Optimal reading width (40-50rem) -->
  <p class="col-narrow">
    Long-form text content for comfortable reading.
  </p>

  <!-- Content: Standard width (default if no class specified) -->
  <p class="col-content">
    Regular content at the main content rail width.
  </p>

  <!-- Popout: Breaks into side margins slightly -->
  <blockquote class="col-popout bg-blue-50 p-gap">
    "A visually distinct callout that extends into the margins."
  </blockquote>

  <!-- Feature: Wide emphasis content -->
  <img class="col-feature" src="hero.jpg" alt="Hero image" />

  <!-- Feature Popout: Maximum content width -->
  <div class="col-feature-popout bg-gradient-to-r from-blue-500 to-purple-600 text-white p-gap">
    <h2>Hero Section</h2>
  </div>

  <!-- Full: Edge-to-edge (respects gap padding) -->
  <div class="col-full bg-gray-100 p-gap">
    <p class="max-w-4xl mx-auto">
      Full-width band with centered inner content
    </p>
  </div>

  <!-- Full Limit: Full width with max-width constraint -->
  <div class="col-full-limit">
    Content that spans full but never exceeds fullLimit (90rem default)
  </div>
</div>
```

### Spacing Utilities

The plugin generates spacing utilities based on grid measurements:

```html
<!-- Gap-based spacing (matches grid gap) -->
<div class="p-gap">Padding equal to grid gap</div>
<div class="px-gap">Horizontal padding</div>
<div class="py-gap">Vertical padding</div>
<div class="mt-gap">Top margin</div>

<!-- Popout-based spacing -->
<div class="pl-popout">Padding equal to popout width</div>

<!-- All directional variants available: p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml -->
```

### Nested Grids (Left/Right Alignment)

For asymmetric layouts, use left/right aligned nested grids:

```html
<div class="grid-cols-breakout">
  <!-- Feature content on the left, narrow reading column on right -->
  <section class="col-feature grid-cols-feature-left">
    <img class="col-feature" src="image.jpg" alt="Feature" />
    <div class="col-narrow">
      <h2>Title</h2>
      <p>Reading content aligns to the right side</p>
    </div>
  </section>

  <!-- Content grid aligned to the right -->
  <section class="col-content grid-cols-content-right">
    <p class="col-narrow">Text appears on the right side</p>
    <img class="col-content" src="small.jpg" alt="Detail" />
  </section>
</div>
```

Available nested grid classes:
- `grid-cols-feature-popout-left` / `grid-cols-feature-popout-right`
- `grid-cols-feature-left` / `grid-cols-feature-right`
- `grid-cols-popout-left` / `grid-cols-popout-right`
- `grid-cols-content-left` / `grid-cols-content-right`
- `grid-cols-narrow-left` / `grid-cols-narrow-right`

### Advanced: Fine-Grained Control

Use start/end utilities for custom spans:

```html
<div class="grid-cols-breakout">
  <!-- Span from content-start to feature-end -->
  <div class="col-start-content col-end-feature">
    Custom width spanning multiple grid tracks
  </div>

  <!-- Left-aligned columns (start at full-start, end at specified column) -->
  <div class="col-feature-left">Spans from left edge to feature-end</div>
  <div class="col-content-left">Spans from left edge to content-end</div>

  <!-- Right-aligned columns (start at specified column, end at full-end) -->
  <div class="col-feature-right">Spans from feature-start to right edge</div>
  <div class="col-narrow-right">Spans from narrow-start to right edge</div>
</div>
```

## Common Patterns

### Article Layout

```html
<article class="grid-cols-breakout">
  <h1 class="col-content text-4xl font-bold">Article Title</h1>

  <p class="col-narrow">
    Body paragraphs use the narrow column for optimal reading.
  </p>

  <img class="col-feature" src="header.jpg" alt="Header" />

  <p class="col-narrow">
    More readable content in the narrow column.
  </p>

  <blockquote class="col-popout bg-blue-50 p-gap italic">
    "Blockquotes break out slightly for visual emphasis."
  </blockquote>

  <div class="col-full bg-gray-900 text-white p-gap">
    <div class="max-w-4xl mx-auto">
      <h2>Full-width section with centered content</h2>
    </div>
  </div>
</article>
```

### Marketing Hero

```html
<section class="grid-cols-breakout">
  <div class="col-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-gap py-20">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-5xl font-bold mb-4">Hero Headline</h1>
      <p class="text-xl">Compelling subheadline</p>
    </div>
  </div>

  <div class="col-feature-popout grid grid-cols-2 gap-8 py-12">
    <div>Feature 1</div>
    <div>Feature 2</div>
  </div>
</section>
```

### Split Content Layout

```html
<div class="grid-cols-breakout">
  <section class="col-feature grid-cols-feature-left gap-8">
    <img class="col-feature" src="product.jpg" alt="Product" />
    <div class="col-content">
      <h2>Product Name</h2>
      <p>Description aligned to the right</p>
    </div>
  </section>
</div>
```

## Best Practices

1. **Use semantic HTML** - The grid system works with any HTML elements
2. **Start with col-narrow for text** - Optimal reading width improves readability
3. **Combine with Tailwind utilities** - Use `p-gap` with background colors on breakout sections
4. **Test responsively** - The gaps scale automatically, but test your content at different viewports
5. **Don't nest breakout grids deeply** - Use left/right aligned grids instead
6. **Use col-full-limit for wide containers** - Prevents excessive width on ultra-wide screens

## Grid Visualizer (Development Tool)

An Alpine.js-powered visual debugging tool that helps designers see and understand the grid structure while building layouts.

### Features

- **Visual overlay** showing all grid columns with color coding
- **Column labels** identifying each grid area
- **Live measurements** displaying current CSS variable values
- **Viewport width** tracker for responsive debugging
- **Click to highlight** individual columns
- **Keyboard shortcut** (Ctrl/Cmd + G) to toggle
- **Persistent state** remembers visibility across page reloads

### Installation

1. Include Alpine.js (v3.x) in your project
2. Add the visualizer script:

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script src="/path/to/breakout-grid-visualizer.js"></script>
```

3. Add the component to your page:

```html
<div x-data="breakoutGridVisualizer" x-html="template"></div>
```

### CraftCMS Integration (Dev Mode Only)

For CraftCMS projects, conditionally load the visualizer only in development:

```twig
{% if craft.app.config.general.devMode %}
  {# Load Alpine.js if not already loaded #}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  {# Load the visualizer script #}
  <script src="/assets/js/breakout-grid-visualizer.js"></script>

  {# Add the component #}
  <div x-data="breakoutGridVisualizer" x-html="template"></div>
{% endif %}
```

See `craft-integration.twig` for a complete CraftCMS integration example with a toggle button and dev mode indicator.

### Usage

Once loaded, the visualizer can be controlled in three ways:

1. **Keyboard shortcut**: Press `Ctrl/Cmd + G` to toggle
2. **Toggle button**: Add a button that triggers the visualizer
3. **Programmatically**: Access via Alpine's `$data` API

```javascript
// Get the visualizer component
const visualizer = Alpine.$data(document.querySelector('[x-data*="breakoutGridVisualizer"]'));

// Toggle visibility
visualizer.toggle();

// Show/hide labels
visualizer.showLabels = false;

// Show/hide measurements
visualizer.showMeasurements = false;
```

### Controls

When active, the visualizer displays a control panel with:

- **Viewport Width**: Current browser width in pixels
- **Current Values**: Live CSS variable measurements (--gap, --narrow, etc.)
- **Show Labels**: Toggle column name labels
- **Show Values**: Toggle measurement display
- **Selected Column**: Click any column to highlight and view its class name

### Demo

Open `demo.html` in your browser to see the visualizer in action. Press `Ctrl/Cmd + G` to toggle it on and off.

### Files

- `breakout-grid-visualizer.js` - The Alpine.js component
- `craft-integration.twig` - Complete CraftCMS integration example
- `demo.html` - Interactive demonstration

## Debugging

Enable debug mode to see generated templates in the console:

```js
breakoutGrid({
  debug: true
})
```

## Browser Support

Works in all browsers that support:
- CSS Grid Layout
- CSS Custom Properties
- CSS `clamp()`

This includes all modern browsers and IE11 with appropriate fallbacks.

## Related Resources

- [Original Viget article](https://www.viget.com/articles/fluid-breakout-layout-css-grid/)
- [CSS Grid Layout on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Tailwind CSS Plugin Documentation](https://tailwindcss.com/docs/plugins)

## License

MIT
