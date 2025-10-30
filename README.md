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

  // Fixed responsive padding (for legacy project integration)
  breakoutPadding: {
    base: '1.5rem',       // Mobile padding (p-6 equivalent)
    md: '4rem',           // Medium screens (p-16 equivalent)
    lg: '5rem'            // Large screens (p-20 equivalent)
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

### Fixed Responsive Padding (p-breakout)

For legacy projects that need traditional fixed padding with responsive breakpoints:

```html
<!-- p-breakout: Responsive padding with built-in breakpoints -->
<div class="col-full bg-gray-100 p-breakout">
  <!-- Equivalent to: p-6 md:p-16 lg:p-20 -->
  Fixed padding that scales with breakpoints
</div>

<!-- Directional variants -->
<div class="px-breakout">Horizontal padding only</div>
<div class="py-breakout">Vertical padding only</div>
<div class="pt-breakout pr-breakout pb-breakout pl-breakout">Individual sides</div>
```

**Default values:**
- Base (mobile): `1.5rem` (equivalent to `p-6`)
- Medium screens: `4rem` (equivalent to `p-16`)
- Large screens: `5rem` (equivalent to `p-20`)

**Customize in config:**
```js
breakoutGrid({
  breakoutPadding: {
    base: '2rem',   // Mobile
    md: '5rem',     // Medium screens
    lg: '6rem',     // Large screens
    xl: '8rem'      // Extra large screens
  }
})
```

**When to use p-breakout vs p-gap:**
- Use **p-breakout** for fixed, predictable padding that matches traditional Tailwind patterns
- Use **p-gap** for dynamic padding that adapts to the grid's responsive gap values
- Use **p-breakout** when migrating legacy projects with existing `p-6 md:p-16` patterns

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

## Integrating with Existing Projects

If your project already uses traditional Tailwind max-width containers (like `max-w-7xl`), here's how to integrate the breakout grid system.

### Understanding the Conflict

**Traditional Approach:**
```html
<!-- ❌ This prevents children from breaking out -->
<div class="max-w-7xl mx-auto px-4">
  <h1>Title</h1>
  <p>Content is trapped inside the container</p>
  <img src="wide.jpg" />  <!-- Can't break out! -->
</div>
```

**Breakout Grid Approach:**
```html
<!-- ✅ Children can break out to different widths -->
<div class="grid-cols-breakout">
  <h1 class="col-content">Title</h1>
  <p class="col-narrow">Optimal reading width</p>
  <img class="col-feature" src="wide.jpg" />  <!-- Breaks out! -->
</div>
```

**The Problem:** Traditional max-width containers constrain ALL children. The breakout grid needs to span the full viewport to allow children to break out.

### Strategy 1: Replace Containers with Breakout Grid

**Before:**
```html
<article class="max-w-7xl mx-auto px-4">
  <h1>Article Title</h1>
  <p>Lorem ipsum dolor sit amet...</p>
  <img src="hero.jpg" alt="Hero" />
</article>
```

**After:**
```html
<article class="grid-cols-breakout">
  <h1 class="col-content">Article Title</h1>
  <p class="col-narrow">Lorem ipsum dolor sit amet...</p>
  <img class="col-feature" src="hero.jpg" alt="Hero" />
</article>
```

### Strategy 2: Mix Both Approaches (Different Sections)

Use traditional containers where you don't need breakout behavior, and breakout grids where you do:

```html
<main>
  <!-- Traditional container for simple content -->
  <section class="max-w-7xl mx-auto px-4 py-12">
    <h2>Simple Section</h2>
    <p>All content same width</p>
  </section>

  <!-- Breakout grid for complex layout -->
  <article class="grid-cols-breakout py-12">
    <h2 class="col-content">Complex Article</h2>
    <p class="col-narrow">Body text with optimal reading width</p>
    <img class="col-feature" src="wide.jpg" />
    <div class="col-full bg-gray-100 p-gap">
      Full-width callout section
    </div>
  </article>

  <!-- Back to traditional -->
  <section class="max-w-7xl mx-auto px-4 py-12">
    <h2>Another Simple Section</h2>
  </section>
</main>
```

### Strategy 3: Use col-full-limit for Max-Width Behavior

If you need to maintain a maximum width similar to `max-w-7xl` (1280px / 80rem):

```js
// tailwind.config.js
breakoutGrid({
  fullLimit: '80rem',  // Matches max-w-7xl (1280px)
})
```

Then use `col-full-limit` for sections that should respect this maximum:

```html
<div class="grid-cols-breakout">
  <!-- Normal breakout content -->
  <p class="col-narrow">Reading text</p>

  <!-- Full width but with max-width constraint -->
  <div class="col-full-limit bg-gray-100 p-gap">
    <div class="grid grid-cols-3 gap-8">
      <!-- Complex layout that shouldn't get too wide -->
    </div>
  </div>
</div>
```

### Strategy 4: Nested Grids Inside Traditional Containers

For gradual migration, you can use breakout grids inside traditional containers for specific sections:

```html
<main class="max-w-7xl mx-auto px-4">
  <!-- Regular content -->
  <h1>Page Title</h1>

  <!-- Break out of the container for this section -->
  <article class="-mx-4 md:-mx-8 lg:-mx-12 grid-cols-breakout">
    <!-- Now using negative margins to escape the container padding -->
    <p class="col-narrow">Body text</p>
    <img class="col-feature" src="wide.jpg" />
  </article>

  <!-- Back to regular content -->
  <p>More content</p>
</main>
```

> **Note:** This requires careful management of negative margins and may not work on ultra-wide screens.

### Comparing Widths: max-w-* vs col-*

Here's how breakout grid columns map to common Tailwind max-width utilities:

| Tailwind Utility | Approx. Width | Breakout Grid Equivalent | Notes |
|------------------|---------------|--------------------------|-------|
| `max-w-prose` | ~65ch (520px) | `col-narrow` | Optimal reading width |
| `max-w-2xl` | 42rem (672px) | `col-narrow` + custom config | Adjust `narrowMax` |
| `max-w-4xl` | 56rem (896px) | `col-content` | Standard content width |
| `max-w-6xl` | 72rem (1152px) | `col-popout` | Slightly wider |
| `max-w-7xl` | 80rem (1280px) | `col-feature` or `col-full-limit` | Wide sections |
| `max-w-full` | 100% | `col-full` | Edge-to-edge |

### Migration Checklist

When converting an existing page:

1. **Identify sections** that need breakout behavior (articles, hero sections, image galleries)
2. **Remove wrapping containers** (`max-w-*`, `container`) from those sections
3. **Add `grid-cols-breakout`** to the parent
4. **Classify children** with appropriate `col-*` classes:
   - Long text → `col-narrow`
   - Headlines, short content → `col-content`
   - Images, callouts → `col-popout` or `col-feature`
   - Full-width bands → `col-full`
5. **Test responsive behavior** at different viewport sizes
6. **Adjust configuration** if needed (gap sizes, width constraints)

### Common Gotchas

**❌ Don't wrap breakout grids in containers:**
```html
<!-- BAD: Container prevents breakout -->
<div class="max-w-7xl mx-auto">
  <div class="grid-cols-breakout">
    <img class="col-full" src="wide.jpg" />  <!-- Can't reach full viewport! -->
  </div>
</div>
```

**✅ Let breakout grids span the full viewport:**
```html
<!-- GOOD: Grid can span full viewport -->
<div class="grid-cols-breakout">
  <img class="col-full" src="wide.jpg" />  <!-- Spans viewport correctly -->
</div>
```

**❌ Don't use padding on breakout grid containers:**
```html
<!-- BAD: Padding prevents full-width children -->
<div class="grid-cols-breakout px-4">
  <div class="col-full bg-gray-100">Not actually full width!</div>
</div>
```

**✅ Add padding to individual children instead:**
```html
<!-- GOOD: Use p-gap on children that need it -->
<div class="grid-cols-breakout">
  <div class="col-full bg-gray-100 p-gap">
    Actually full width with inner padding!
  </div>
</div>
```

### Using p-breakout for Easy Migration

If your legacy project uses consistent padding patterns like `p-6 md:px-16`, use `p-breakout` utilities to quickly replace them:

**Before (Legacy):**
```html
<section class="bg-blue-900 p-6 md:px-16 md:pt-12 md:pb-20 relative z-10">
  <h2>Section Title</h2>
  <p>Content here...</p>
</section>
```

**After (Quick Migration):**
```html
<section class="col-full bg-blue-900 p-breakout relative z-10">
  <h2>Section Title</h2>
  <p>Content here...</p>
</section>
```

**Customize if needed:**
```js
// tailwind.config.js - Match your existing padding patterns
breakoutGrid({
  breakoutPadding: {
    base: '1.5rem',  // Matches p-6
    md: '4rem',      // Matches md:px-16/pt-12
    lg: '5rem'       // Matches lg:px-20
  }
})
```

This approach lets you:
- ✅ Keep familiar padding values from your legacy project
- ✅ Reduce HTML verbosity (one class vs multiple responsive classes)
- ✅ Maintain design consistency across the migration
- ✅ Easily adjust all breakout padding globally via config

### Real-World Example: Converting a Blog Post

**Before (Traditional):**
```html
<article class="max-w-4xl mx-auto px-4 py-12">
  <h1 class="text-4xl font-bold mb-4">Article Title</h1>
  <p class="text-lg mb-4">Lorem ipsum...</p>
  <img class="w-full mb-4" src="hero.jpg" />
  <p class="text-lg mb-4">More content...</p>
  <blockquote class="border-l-4 pl-4 italic">Quote</blockquote>
</article>
```

**After (Breakout Grid):**
```html
<article class="grid-cols-breakout py-12 gap-y-4">
  <h1 class="col-content text-4xl font-bold">Article Title</h1>
  <p class="col-narrow text-lg">Lorem ipsum...</p>
  <img class="col-feature" src="hero.jpg" />
  <p class="col-narrow text-lg">More content...</p>
  <blockquote class="col-popout border-l-4 pl-4 italic bg-gray-50 p-gap">
    Quote
  </blockquote>
</article>
```

**Benefits of the conversion:**
- ✅ Text is optimally readable at `col-narrow` (~50rem)
- ✅ Hero image can break out wider for impact
- ✅ Blockquote visually distinct with `col-popout`
- ✅ More design flexibility without changing HTML structure

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
