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

All options are optional and have sensible defaults. The plugin includes built-in validation that will warn about invalid CSS units or configuration issues without breaking your build:

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
  debug: false            // Enable console logging and template generation details
})
```

### Configuration Validation

The plugin automatically validates your configuration and provides helpful warnings for common issues:

```js
// ❌ Invalid CSS units will generate warnings
breakoutGrid({
  baseGap: 'invalid-unit',     // Warning: Invalid CSS unit
  narrowMax: '50',             // Warning: Missing unit (should be '50rem')
  gapScale: {
    lg: 'bad-value'            // Warning: Invalid CSS unit for gapScale.lg
  }
})

// ✅ Valid configuration
breakoutGrid({
  baseGap: '1.5rem',           // Valid CSS unit
  narrowMax: '50rem',          // Valid CSS unit with rem
  gapScale: {
    lg: '5vw'                  // Valid CSS unit with vw
  }
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

#### Basic Column Utilities

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

  <!-- Center: Single point (rarely used directly) -->
  <div class="col-center">
    Centered at the exact middle point of the layout
  </div>
</div>
```

#### Grid Template Classes

The plugin provides several grid template classes for different layout contexts:

**Main Grid Template:**
- `grid-cols-breakout` - The primary centered grid template with all column areas

**Left-Aligned Templates:**
- `grid-cols-feature-popout-left` - Feature-popout width container, left-aligned
- `grid-cols-feature-left` - Feature width container, left-aligned
- `grid-cols-popout-left` - Popout width container, left-aligned
- `grid-cols-content-left` - Content width container, left-aligned
- `grid-cols-narrow-left` - Narrow width container, left-aligned

**Right-Aligned Templates:**
- `grid-cols-feature-popout-right` - Feature-popout width container, right-aligned
- `grid-cols-feature-right` - Feature width container, right-aligned
- `grid-cols-popout-right` - Popout width container, right-aligned
- `grid-cols-content-right` - Content width container, right-aligned
- `grid-cols-narrow-right` - Narrow width container, right-aligned

### Spacing Utilities

The plugin generates spacing utilities based on grid measurements for consistent layouts:

#### Gap-Based Spacing

Uses the responsive grid gap value (`--gap` CSS variable):

```html
<!-- Padding utilities -->
<div class="p-gap">Padding equal to grid gap on all sides</div>
<div class="px-gap">Horizontal padding (left and right)</div>
<div class="py-gap">Vertical padding (top and bottom)</div>
<div class="pt-gap">Top padding only</div>
<div class="pr-gap">Right padding only</div>
<div class="pb-gap">Bottom padding only</div>
<div class="pl-gap">Left padding only</div>

<!-- Margin utilities -->
<div class="m-gap">Margin equal to grid gap on all sides</div>
<div class="mx-gap">Horizontal margin (left and right)</div>
<div class="my-gap">Vertical margin (top and bottom)</div>
<div class="mt-gap">Top margin only</div>
<div class="mr-gap">Right margin only</div>
<div class="mb-gap">Bottom margin only</div>
<div class="ml-gap">Left margin only</div>
```

#### Computed Gap Spacing

Uses the computed gap value for larger spacing:

```html
<!-- Padding with computed gap (larger than regular gap) -->
<div class="p-full-gap">Larger padding for full-width sections</div>
<div class="px-full-gap">Horizontal computed gap padding</div>
<div class="py-full-gap">Vertical computed gap padding</div>
<div class="pt-full-gap">Top computed gap padding</div>
<div class="pr-full-gap">Right computed gap padding</div>
<div class="pb-full-gap">Bottom computed gap padding</div>
<div class="pl-full-gap">Left computed gap padding</div>

<!-- Margin with computed gap -->
<div class="m-full-gap">Computed gap margin on all sides</div>
<div class="mx-full-gap">Horizontal computed gap margin</div>
<div class="my-full-gap">Vertical computed gap margin</div>
<div class="mt-full-gap">Top computed gap margin</div>
<div class="mr-full-gap">Right computed gap margin</div>
<div class="mb-full-gap">Bottom computed gap margin</div>
<div class="ml-full-gap">Left computed gap margin</div>
```

#### Popout-Based Spacing

Uses the popout width value for specialized spacing:

```html
<!-- Padding with popout width -->
<div class="p-popout">Padding equal to popout extension</div>
<div class="px-popout">Horizontal popout padding</div>
<div class="py-popout">Vertical popout padding</div>
<div class="pt-popout">Top popout padding</div>
<div class="pr-popout">Right popout padding</div>
<div class="pb-popout">Bottom popout padding</div>
<div class="pl-popout">Left popout padding</div>

<!-- Margin with popout width -->
<div class="m-popout">Popout margin on all sides</div>
<div class="mx-popout">Horizontal popout margin</div>
<div class="my-popout">Vertical popout margin</div>
<div class="mt-popout">Top popout margin</div>
<div class="mr-popout">Right popout margin</div>
<div class="mb-popout">Bottom popout margin</div>
<div class="ml-popout">Left popout margin</div>
```

#### When to Use Each Spacing Type

- **`*-gap`**: Standard spacing that matches the grid's responsive gap
- **`*-full-gap`**: Larger spacing for full-width sections and major layout breaks
- **`*-popout`**: Specialized spacing that matches the popout extension distance
- **`p-breakout`**: Fixed responsive padding for legacy project integration (see below)

### Fixed Responsive Spacing (p-breakout & m-breakout)

For legacy projects that need traditional fixed spacing with responsive breakpoints:

#### Padding Utilities

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

#### Margin Utilities

```html
<!-- m-breakout: Responsive margin with built-in breakpoints -->
<div class="m-breakout">
  <!-- Equivalent to: m-6 md:m-16 lg:m-20 -->
  Fixed margin that scales with breakpoints
</div>

<!-- Directional variants -->
<div class="mx-breakout">Horizontal margin only</div>
<div class="my-breakout">Vertical margin only</div>
<div class="mt-breakout mr-breakout mb-breakout ml-breakout">Individual sides</div>

<!-- Negative margins (useful for breaking out of containers) -->
<div class="-mx-breakout">
  <!-- Equivalent to: -mx-6 md:-mx-16 lg:-mx-20 -->
  Negative horizontal margin
</div>
<div class="-my-breakout">Negative vertical margin</div>
<div class="-mt-breakout -mr-breakout -mb-breakout -ml-breakout">Individual negative sides</div>
```

**Default values:**
- Base (mobile): `1.5rem` (equivalent to spacing-6)
- Medium screens: `4rem` (equivalent to spacing-16)
- Large screens: `5rem` (equivalent to spacing-20)

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

**When to use breakout spacing vs gap spacing:**
- Use **p-breakout/m-breakout** for fixed, predictable spacing that matches traditional Tailwind patterns
- Use **p-gap/m-gap** for dynamic spacing that adapts to the grid's responsive gap values
- Use **p-breakout/m-breakout** when migrating legacy projects with existing `p-6 md:p-16` patterns

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

#### Available Nested Grid Classes

**Left-Aligned Grids** (content flows from left edge):
- `grid-cols-feature-popout-left` - Feature-popout width, left-aligned
- `grid-cols-feature-left` - Feature width, left-aligned  
- `grid-cols-popout-left` - Popout width, left-aligned
- `grid-cols-content-left` - Content width, left-aligned
- `grid-cols-narrow-left` - Narrow width, left-aligned

**Right-Aligned Grids** (content flows from right edge):
- `grid-cols-feature-popout-right` - Feature-popout width, right-aligned
- `grid-cols-feature-right` - Feature width, right-aligned
- `grid-cols-popout-right` - Popout width, right-aligned  
- `grid-cols-content-right` - Content width, right-aligned
- `grid-cols-narrow-right` - Narrow width, right-aligned

**Key Difference**: Left/right grids use `--narrow-inset` instead of `--narrow` for proper text width in nested contexts.

### Advanced: Fine-Grained Control

Use start/end utilities for custom spans and precise positioning:

```html
<div class="grid-cols-breakout">
  <!-- Span from content-start to feature-end -->
  <div class="col-start-content col-end-feature">
    Custom width spanning multiple grid tracks
  </div>

  <!-- Span from narrow-start to popout-end -->
  <div class="col-start-narrow col-end-popout">
    Spans from narrow column start to popout column end
  </div>

  <!-- Start at feature-popout-start, end at center -->
  <div class="col-start-feature-popout col-end-center">
    Complex asymmetric layout spanning to center point
  </div>
</div>
```

#### Available Start/End Utilities

**Column Start Utilities:**
- `col-start-full` - Start at viewport edge
- `col-start-feature-popout` - Start at feature-popout boundary
- `col-start-feature` - Start at feature boundary
- `col-start-popout` - Start at popout boundary
- `col-start-content` - Start at content boundary
- `col-start-narrow` - Start at narrow column boundary
- `col-start-center` - Start at center point

**Column End Utilities:**
- `col-end-center` - End at center point
- `col-end-narrow` - End at narrow column boundary
- `col-end-content` - End at content boundary
- `col-end-popout` - End at popout boundary
- `col-end-feature` - End at feature boundary
- `col-end-feature-popout` - End at feature-popout boundary
- `col-end-full` - End at viewport edge

#### Left/Right Aligned Utilities

For content that spans from one edge to a specific column:

```html
<div class="grid-cols-breakout">
  <!-- Left-aligned: spans from left edge to specified column end -->
  <div class="col-full-left">Full width from left edge</div>
  <div class="col-feature-popout-left">From left edge to feature-popout-end</div>
  <div class="col-feature-left">From left edge to feature-end</div>
  <div class="col-popout-left">From left edge to popout-end</div>
  <div class="col-content-left">From left edge to content-end</div>
  <div class="col-narrow-left">From left edge to narrow-end</div>

  <!-- Right-aligned: spans from specified column start to right edge -->
  <div class="col-narrow-right">From narrow-start to right edge</div>
  <div class="col-content-right">From content-start to right edge</div>
  <div class="col-popout-right">From popout-start to right edge</div>
  <div class="col-feature-right">From feature-start to right edge</div>
  <div class="col-feature-popout-right">From feature-popout-start to right edge</div>
</div>
```

**Use cases for left/right utilities:**
- Asymmetric hero sections
- Image galleries with text overlays
- Split-screen layouts
- Progressive disclosure interfaces

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

### Advanced Layout Examples

#### Complex Editorial Layout

```html
<article class="grid-cols-breakout gap-y-8">
  <!-- Hero section with overlay text -->
  <div class="col-full relative">
    <img src="hero.jpg" class="w-full h-96 object-cover" />
    <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
      <h1 class="text-white text-5xl font-bold text-center">Article Title</h1>
    </div>
  </div>

  <!-- Intro paragraph -->
  <p class="col-content text-xl leading-relaxed">
    Introduction paragraph at content width for emphasis.
  </p>

  <!-- Body text -->
  <p class="col-narrow">
    Main body text at optimal reading width...
  </p>

  <!-- Pull quote spanning from narrow to popout -->
  <blockquote class="col-start-narrow col-end-popout bg-blue-50 p-gap border-l-4 border-blue-500">
    <p class="text-2xl italic">"This quote spans from narrow-start to popout-end for visual impact."</p>
  </blockquote>

  <!-- Image gallery -->
  <div class="col-feature grid grid-cols-2 gap-4">
    <img src="image1.jpg" class="w-full h-48 object-cover rounded" />
    <img src="image2.jpg" class="w-full h-48 object-cover rounded" />
  </div>

  <!-- Sidebar-style content using nested grid -->
  <div class="col-feature grid-cols-feature-left gap-8">
    <div class="col-feature">
      <img src="chart.jpg" class="w-full h-64 object-cover rounded" />
    </div>
    <div class="col-narrow bg-gray-50 p-gap rounded">
      <h3 class="font-bold mb-2">Key Insights</h3>
      <ul class="space-y-2 text-sm">
        <li>• Insight one</li>
        <li>• Insight two</li>
        <li>• Insight three</li>
      </ul>
    </div>
  </div>

  <!-- Call-to-action -->
  <div class="col-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-gap py-16">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold">
        Learn More
      </button>
    </div>
  </div>
</article>
```

#### Product Landing Page

```html
<main class="grid-cols-breakout">
  <!-- Hero with asymmetric layout -->
  <section class="col-feature-popout grid-cols-feature-popout-left gap-12 py-20">
    <div class="col-feature-popout">
      <img src="product.jpg" class="w-full h-96 object-cover rounded-lg shadow-xl" />
    </div>
    <div class="col-content flex flex-col justify-center">
      <h1 class="text-4xl font-bold mb-4">Revolutionary Product</h1>
      <p class="col-narrow text-lg mb-6">
        Product description at optimal reading width within the content column.
      </p>
      <div class="flex gap-4">
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg">Buy Now</button>
        <button class="border border-gray-300 px-6 py-3 rounded-lg">Learn More</button>
      </div>
    </div>
  </section>

  <!-- Feature grid -->
  <section class="col-feature-popout py-16">
    <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4"></div>
        <h3 class="font-bold mb-2">Feature One</h3>
        <p class="text-gray-600">Feature description</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4"></div>
        <h3 class="font-bold mb-2">Feature Two</h3>
        <p class="text-gray-600">Feature description</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4"></div>
        <h3 class="font-bold mb-2">Feature Three</h3>
        <p class="text-gray-600">Feature description</p>
      </div>
    </div>
  </section>

  <!-- Testimonial with custom span -->
  <blockquote class="col-start-content col-end-feature bg-gray-50 p-gap py-12 text-center">
    <p class="text-2xl italic mb-4">"This product changed everything for our team."</p>
    <cite class="text-gray-600">— Happy Customer</cite>
  </blockquote>
</main>
```

## Utility Reference

### Complete Class List

#### Grid Template Classes
- `grid-cols-breakout` - Main centered grid template
- `grid-cols-feature-popout-left` / `grid-cols-feature-popout-right`
- `grid-cols-feature-left` / `grid-cols-feature-right`
- `grid-cols-popout-left` / `grid-cols-popout-right`
- `grid-cols-content-left` / `grid-cols-content-right`
- `grid-cols-narrow-left` / `grid-cols-narrow-right`

#### Column Placement Classes
- `col-full` - Full viewport width
- `col-feature-popout` - Maximum content width
- `col-feature` - Extra wide content
- `col-popout` - Slightly wider content
- `col-content` - Standard content width (default)
- `col-narrow` - Optimal reading width
- `col-center` - Center point
- `col-full-limit` - Full width with max-width constraint

#### Column Start Classes
- `col-start-full` - Start at viewport edge
- `col-start-feature-popout` - Start at feature-popout boundary
- `col-start-feature` - Start at feature boundary
- `col-start-popout` - Start at popout boundary
- `col-start-content` - Start at content boundary
- `col-start-narrow` - Start at narrow boundary
- `col-start-center` - Start at center point

#### Column End Classes
- `col-end-center` - End at center point
- `col-end-narrow` - End at narrow boundary
- `col-end-content` - End at content boundary
- `col-end-popout` - End at popout boundary
- `col-end-feature` - End at feature boundary
- `col-end-feature-popout` - End at feature-popout boundary
- `col-end-full` - End at viewport edge

#### Left/Right Span Classes
- `col-feature-popout-left` / `col-feature-popout-right`
- `col-feature-left` / `col-feature-right`
- `col-popout-left` / `col-popout-right`
- `col-content-left` / `col-content-right`
- `col-narrow-left` / `col-narrow-right`

#### Spacing Classes

**Gap-based spacing:**
- `p-gap`, `px-gap`, `py-gap`, `pt-gap`, `pr-gap`, `pb-gap`, `pl-gap`
- `m-gap`, `mx-gap`, `my-gap`, `mt-gap`, `mr-gap`, `mb-gap`, `ml-gap`
- `-m-gap`, `-mx-gap`, `-my-gap`, `-mt-gap`, `-mr-gap`, `-mb-gap`, `-ml-gap` (negative margins)

**Computed gap spacing:**
- `p-full-gap`, `px-full-gap`, `py-full-gap`, `pt-full-gap`, `pr-full-gap`, `pb-full-gap`, `pl-full-gap`
- `m-full-gap`, `mx-full-gap`, `my-full-gap`, `mt-full-gap`, `mr-full-gap`, `mb-full-gap`, `ml-full-gap`
- `-m-full-gap`, `-mx-full-gap`, `-my-full-gap`, `-mt-full-gap`, `-mr-full-gap`, `-mb-full-gap`, `-ml-full-gap` (negative margins)

**Popout-based spacing:**
- `p-popout`, `px-popout`, `py-popout`, `pt-popout`, `pr-popout`, `pb-popout`, `pl-popout`
- `m-popout`, `mx-popout`, `my-popout`, `mt-popout`, `mr-popout`, `mb-popout`, `ml-popout`
- `-m-popout`, `-mx-popout`, `-my-popout`, `-mt-popout`, `-mr-popout`, `-mb-popout`, `-ml-popout` (negative margins)

**Fixed responsive spacing:**
- `p-breakout`, `px-breakout`, `py-breakout`, `pt-breakout`, `pr-breakout`, `pb-breakout`, `pl-breakout`
- `m-breakout`, `mx-breakout`, `my-breakout`, `mt-breakout`, `mr-breakout`, `mb-breakout`, `ml-breakout`
- `-m-breakout`, `-mx-breakout`, `-my-breakout`, `-mt-breakout`, `-mr-breakout`, `-mb-breakout`, `-ml-breakout` (negative margins)

### CSS Custom Properties

The plugin generates these CSS variables that you can use in custom CSS:

- `--gap` - Current responsive gap value
- `--computed-gap` - Computed gap for larger spacing
- `--narrow` - Narrow column width (centered layouts)
- `--narrow-inset` - Narrow column width (nested layouts)
- `--content` - Content column extension
- `--popout` - Popout column extension
- `--feature` - Feature column extension
- `--feature-popout` - Feature-popout column extension
- `--full` - Full column definition
- `--breakout-padding` - Current responsive breakout padding

## Best Practices

1. **Use semantic HTML** - The grid system works with any HTML elements
2. **Start with col-narrow for text** - Optimal reading width improves readability
3. **Combine with Tailwind utilities** - Use `p-gap` with background colors on breakout sections
4. **Test responsively** - The gaps scale automatically, but test your content at different viewports
5. **Don't nest breakout grids deeply** - Use left/right aligned grids instead
6. **Use col-full-limit for wide containers** - Prevents excessive width on ultra-wide screens
7. **Leverage the visualizer** - Use Ctrl/Cmd + G during development to understand layouts
8. **Validate configuration** - Pay attention to console warnings about invalid CSS units

## Grid Visualizer (Development Tool)

An Alpine.js-powered visual debugging tool that helps designers see and understand the grid structure while building layouts. The visualizer provides real-time feedback about grid behavior and measurements.

### Features

- **Visual overlay** showing all grid columns with color-coded boundaries
- **Interactive column selection** - click any column to highlight and identify
- **Column labels** with both human-readable names and CSS class names
- **Live measurements** displaying current CSS variable values in real-time
- **Viewport width tracker** for responsive debugging
- **Padding visualization** for both `p-gap` and `p-breakout` utilities
- **Keyboard shortcut** (Ctrl/Cmd + G) to toggle visibility
- **Persistent state** remembers visibility and settings across page reloads
- **Responsive updates** automatically refreshes measurements on window resize

### Visual Indicators

The visualizer uses a consistent color scheme to identify different grid areas:

- **Full** (Red) - Edge-to-edge viewport width
- **Feature Popout** (Orange) - Maximum content width
- **Feature** (Yellow) - Extra wide content areas
- **Popout** (Green) - Slightly wider than standard content
- **Content** (Blue) - Standard content width (default)
- **Narrow** (Purple) - Optimal reading width (40-50rem)

### Interactive Controls

- **Labels Toggle** - Show/hide column name labels
- **Class Names Toggle** - Display CSS class names (e.g., `.col-feature`)
- **Values Toggle** - Show/hide live CSS variable measurements
- **p-gap Visualization** - Overlay showing `p-gap` padding areas
- **p-breakout Visualization** - Overlay showing `p-breakout` padding areas
- **Column Selection** - Click any column to highlight and view details

### Installation

The visualizer should only be loaded in development environments. The recommended approach is to dynamically import it and wait for Alpine.js to start:

**Vite/Modern Build Setup:**

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

**Alternative: Inline Script (Legacy)**

If you're not using a build tool:

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script src="/path/to/breakout-grid-visualizer.js"></script>
<div x-data="breakoutGridVisualizer" x-html="template"></div>
```

### CraftCMS Integration (Dev Mode Only)

For CraftCMS projects using Vite:

```javascript
// In your main app.js
import Alpine from 'alpinejs'

if (import.meta.env.DEV) {
  import('@astuteo/tailwind-breakout-grid/breakout-grid-visualizer.js').then(() => {
    Alpine.start()
  })
} else {
  Alpine.start()
}

window.Alpine = Alpine
```

```twig
{# In your layout template #}
{% if craft.app.config.general.devMode %}
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

// Show/hide options
visualizer.showLabels = false;
visualizer.showClassNames = true;
visualizer.showMeasurements = false;
visualizer.showGapPadding = true;
visualizer.showBreakoutPadding = true;
```

### Controls

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

### Demo

Open `demo.html` in your browser to see the visualizer in action. Press `Ctrl/Cmd + G` to toggle it on and off.

### Files

- `breakout-grid-visualizer.js` - The Alpine.js component
- `craft-integration.twig` - Complete CraftCMS integration example
- `demo.html` - Interactive demonstration

## Debugging

### Debug Mode

Enable debug mode to see detailed information about grid template generation:

```js
breakoutGrid({
  debug: true
})
```

When debug mode is enabled, you'll see console output showing:
- Generated grid templates for each layout type
- CSS custom property values
- Configuration validation results
- Template creation process

### Using the Grid Visualizer

The most effective way to debug layouts is using the built-in Grid Visualizer:

1. **Load the visualizer** in development (see Grid Visualizer section above)
2. **Press Ctrl/Cmd + G** to toggle the overlay
3. **Click columns** to identify which grid area elements are using
4. **Check measurements** to see current CSS variable values
5. **Toggle padding visualization** to see `p-gap` and `p-breakout` areas

### Common Issues and Solutions

#### Content Not Breaking Out

**Problem**: Elements with `col-full` or `col-feature` aren't spanning the expected width.

**Solution**: Check that the parent container doesn't have constraining styles:

```html
<!-- ❌ Container prevents breakout -->
<div class="max-w-7xl mx-auto px-4">
  <div class="grid-cols-breakout">
    <div class="col-full">Not actually full width!</div>
  </div>
</div>

<!-- ✅ Let the grid span full viewport -->
<div class="grid-cols-breakout">
  <div class="col-full">Actually full width!</div>
</div>
```

#### Text Too Wide or Narrow

**Problem**: Text in `col-narrow` doesn't look right at certain viewport sizes.

**Solution**: Adjust the narrow column configuration:

```js
breakoutGrid({
  narrowMin: '35rem',    // Smaller minimum for mobile
  narrowMax: '45rem',    // Smaller maximum for tighter text
  narrowBase: '48vw'     // Adjust viewport-based width
})
```

#### Gaps Too Large or Small

**Problem**: Spacing between columns doesn't feel right.

**Solution**: Adjust gap scaling configuration:

```js
breakoutGrid({
  baseGap: '0.75rem',    // Smaller minimum gap
  maxGap: '12rem',       // Smaller maximum gap
  gapScale: {
    default: '3vw',      // Less aggressive scaling
    lg: '4vw',
    xl: '5vw'
  }
})
```

#### Nested Grids Not Working

**Problem**: Content in nested grids (left/right aligned) doesn't align properly.

**Solution**: Ensure you're using the correct nested grid class and column utilities:

```html
<!-- ✅ Correct nested grid usage -->
<div class="col-feature grid-cols-feature-left">
  <img class="col-feature" src="image.jpg" />
  <div class="col-narrow">Text content</div>
</div>
```

### Browser Developer Tools

Use browser dev tools to inspect the grid:

1. **Right-click** on a grid container and select "Inspect"
2. **Look for the grid badge** in the HTML panel
3. **Click the grid badge** to see grid lines overlay
4. **Check the Computed tab** to see CSS custom property values
5. **Use the Console** to check CSS variables: `getComputedStyle(document.documentElement).getPropertyValue('--gap')`

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
