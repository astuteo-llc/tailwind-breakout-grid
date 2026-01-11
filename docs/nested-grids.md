# Nested Grid Modifiers

When nesting a `grid-cols-breakout` grid inside another layout (such as a sidebar layout), the outer tracks of the breakout grid can create unwanted spacing since they're calculated based on viewport width, not the container width.

The `breakout-to-*` modifier classes solve this by collapsing the outer tracks, allowing the nested grid to fill its container while preserving the named grid lines so your `col-*` utilities continue to work.

## Available Modifiers

| Class | Effect |
|-------|--------|
| `breakout-to-narrow` | Collapses all outer tracks. Content spans full container width. |
| `breakout-to-content` | Keeps `--content` margins, collapses everything outside. |
| `breakout-to-popout` | Keeps `--popout` and `--content` margins. |
| `breakout-to-feature` | Keeps `--feature`, `--popout`, and `--content` margins. |

## How It Works

The standard `grid-cols-breakout` creates a grid with tracks for each breakout level:

```
[full] [feature] [popout] [content] [narrow] [content] [popout] [feature] [full]
```

When nested inside a constrained container, those outer tracks (especially `--full` which uses `minmax(var(--gap), 1fr)`) still try to claim space based on viewport calculations.

The `breakout-to-*` modifiers redefine `grid-template-columns` to collapse the unwanted outer tracks to zero while stacking their grid line names at the container edges. This means:

1. The grid fills its container properly
2. All `col-*` utilities still work (the grid lines exist, they just resolve to the same position)
3. Inner tracks (`--content`, `--popout`, etc.) can optionally be preserved

## Usage Examples

### Basic Nested Grid

A two-column layout with a sidebar and a nested breakout grid:

```html
<div class="grid-cols-breakout">
  <div class="col-content grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">

    <aside>
      Sidebar content
    </aside>

    <div class="grid-cols-breakout breakout-to-content">
      <!-- This grid now fills the available space -->
      <div class="col-full bg-blue-100">
        Spans full width of the container (not viewport)
      </div>
      <p class="col-narrow">
        Reading content at optimal width
      </p>
    </div>

  </div>
</div>
```

### Full-Width Nested Content

When you want a nested grid to have no margins at all:

```html
<div class="grid-cols-breakout">
  <section class="col-feature">
    <div class="grid-cols-breakout breakout-to-narrow">
      <!-- All content spans full width of the feature column -->
      <h2>Section Title</h2>
      <p>All text fills the container.</p>
      <img src="image.jpg" class="col-full" alt="Also fills container" />
    </div>
  </section>
</div>
```

### Preserving Some Margins

If you want to keep content margins but collapse the outer tracks:

```html
<div class="layout-wrapper">
  <div class="grid-cols-breakout breakout-to-content">
    <!-- col-full, col-feature, col-popout all resolve to container edges -->
    <!-- col-content and col-narrow still have their normal margins -->

    <div class="col-full bg-gray-100 p-8">
      Full width band
    </div>

    <p class="col-content">
      Content with standard margins
    </p>

    <p class="col-narrow">
      Narrow reading column centered within content
    </p>
  </div>
</div>
```

## Choosing the Right Modifier

- **`breakout-to-narrow`**: Use when the nested grid should fill 100% of its container with no margins. All `col-*` classes will span the full width.

- **`breakout-to-content`**: Use when you want to remove the viewport-based outer tracks but keep the `--content` margins for consistent spacing.

- **`breakout-to-popout`**: Use when you need slightly more breakout room than content but don't need the full feature/full widths.

- **`breakout-to-feature`**: Use when you only need to collapse the outermost `--full` track but want to preserve all the inner breakout levels.

## Technical Details

Each modifier redefines `grid-template-columns` with a simplified template. For example, `breakout-to-content` generates:

```css
.grid-cols-breakout.breakout-to-content {
  grid-template-columns:
    [full-start feature-start popout-start content-start]
    var(--content)
    [narrow-start center-start]
    minmax(0, 1fr)
    [center-end narrow-end]
    var(--content)
    [content-end popout-end feature-end full-end];
}
```

Key points:
- Outer grid line names are stacked at the edges (e.g., `full-start`, `feature-start`, etc. all at the same position)
- The center column uses `minmax(0, 1fr)` to fill available space
- Inner track variables (like `var(--content)`) are preserved where appropriate

## Common Patterns

### Sidebar Layout with Breakout Content

```html
<main class="grid-cols-breakout">
  <div class="col-content grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

    <nav class="lg:sticky lg:top-8 lg:self-start">
      <h2>Navigation</h2>
      <ul>
        <li><a href="#section-1">Section 1</a></li>
        <li><a href="#section-2">Section 2</a></li>
      </ul>
    </nav>

    <article class="grid-cols-breakout breakout-to-content">
      <h1 class="col-content">Article Title</h1>

      <p class="col-narrow">
        Body text at optimal reading width.
      </p>

      <figure class="col-full">
        <img src="diagram.jpg" alt="Full-width diagram" />
        <figcaption>Diagram caption</figcaption>
      </figure>

      <blockquote class="col-popout bg-blue-50 p-6">
        "A quote that breaks out slightly for emphasis"
      </blockquote>
    </article>

  </div>
</main>
```

### Card Grid with Breakout Interior

```html
<div class="grid-cols-breakout">
  <div class="col-feature grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="grid-cols-breakout breakout-to-narrow">
        <img class="col-full" src="card-image.jpg" alt="" />
        <div class="p-6">
          <h3>Card Title</h3>
          <p>Card description text.</p>
        </div>
      </div>
    </div>

    <!-- More cards... -->

  </div>
</div>
```

## Browser Support

The `breakout-to-*` modifiers use the same CSS Grid features as the base plugin and work in all modern browsers.
