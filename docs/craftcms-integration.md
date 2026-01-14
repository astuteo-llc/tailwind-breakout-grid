# CraftCMS Integration

This guide covers integrating the Tailwind Breakout Grid plugin with CraftCMS projects, including the grid visualizer for development.

## Installation

### 1. Install the Plugin

```bash
npm install @astuteo/tailwind-breakout-grid
```

### 2. Configure Tailwind

In your `tailwind.config.js`:

```js
import breakoutGrid from '@astuteo/tailwind-breakout-grid'

export default {
  content: [
    './templates/**/*.twig',
    './templates/**/*.html',
    // ... other paths
  ],
  plugins: [
    breakoutGrid({
      // Optional configuration
      contentMin: '53rem',
      contentMax: '61rem',
      defaultCol: 'content',
    })
  ]
}
```

## Using with Vite (Recommended)

Most modern CraftCMS projects use Vite for asset compilation. Here's how to set up the breakout grid with the visualizer.

### JavaScript Setup

In your main `app.js` or Alpine initialization file:

```javascript
import Alpine from 'alpinejs'

// Conditionally load visualizer only in development
if (import.meta.env.DEV) {
  import('@astuteo/tailwind-breakout-grid/breakout-grid-visualizer.js').then(() => {
    Alpine.start()
  })
} else {
  Alpine.start()
}

window.Alpine = Alpine
```

**Key points:**
- `import.meta.env.DEV` is true during `npm run dev` (Vite dev server)
- The dynamic import ensures the visualizer is only loaded in development
- Waiting for the import before `Alpine.start()` ensures the component is registered
- In production builds, the visualizer code is never included

### Twig Template Setup

Add the visualizer component to your base layout template (e.g., `_layouts/default.twig`):

```twig
{# Only render in devMode - the JS won't load in production anyway,
   but this keeps the HTML clean #}
{% if craft.app.config.general.devMode %}
  <div x-data="breakoutGridVisualizer" x-html="template"></div>
{% endif %}
```

## Complete Layout Template Example

Here's a full example of a CraftCMS layout template using the breakout grid:

```twig
{# _layouts/default.twig #}
<!DOCTYPE html>
<html lang="{{ craft.app.language }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ siteName }}</title>
  {{ craft.vite.script('src/js/app.js') }}
</head>
<body class="min-h-screen flex flex-col">

  <header class="grid-cols-breakout bg-white border-b">
    <nav class="col-content flex items-center justify-between py-4">
      <a href="/" class="text-xl font-bold">{{ siteName }}</a>
      {% include '_partials/navigation' %}
    </nav>
  </header>

  <main class="flex-1 grid-cols-breakout">
    {% block content %}{% endblock %}
  </main>

  <footer class="grid-cols-breakout bg-gray-900 text-white">
    <div class="col-content py-12">
      {% include '_partials/footer' %}
    </div>
  </footer>

  {# Grid Visualizer - dev mode only #}
  {% if craft.app.config.general.devMode %}
    <div x-data="breakoutGridVisualizer" x-html="template"></div>
  {% endif %}

</body>
</html>
```

## Adding a Toggle Button

For easier access to the visualizer during development, add a visible toggle button:

```twig
{% if craft.app.config.general.devMode %}
  {# Visualizer Component #}
  <div x-data="breakoutGridVisualizer" x-html="template"></div>

  {# Toggle Button #}
  <div x-data="{ show: true }"
       x-show="show"
       style="position: fixed; bottom: 1rem; left: 1rem; z-index: 9998;"
       x-transition>
    <button @click="show = false; $dispatch('toggle-grid-visualizer')"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 transition">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"></path>
      </svg>
      Grid Visualizer (Ctrl+G)
    </button>
  </div>

  {# Handle the custom event #}
  <script>
    document.addEventListener('toggle-grid-visualizer', () => {
      const visualizer = Alpine.$data(document.querySelector('[x-data*="breakoutGridVisualizer"]'));
      if (visualizer) {
        visualizer.toggle();
      }
    });
  </script>

  {# Dev mode indicator #}
  <div style="position: fixed; top: 0; left: 0; background: #ef4444; color: white; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; z-index: 9999; border-bottom-right-radius: 0.375rem; font-family: system-ui, -apple-system, sans-serif;">
    DEV MODE
  </div>
{% endif %}
```

> **Tip:** You can also copy the complete `craft-integration.twig` file from the plugin package for a ready-to-use template partial.

## Entry Templates

### Basic Entry Template

```twig
{# templates/blog/_entry.twig #}
{% extends '_layouts/default' %}

{% block content %}
  <article class="py-12">
    <h1 class="col-content text-4xl font-bold mb-4">{{ entry.title }}</h1>

    <div class="col-content text-gray-600 mb-8">
      <time datetime="{{ entry.postDate|date('c') }}">
        {{ entry.postDate|date('F j, Y') }}
      </time>
    </div>

    {% if entry.heroImage.one() %}
      <img class="col-feature mb-8" src="{{ entry.heroImage.one().url }}" alt="{{ entry.heroImage.one().title }}">
    {% endif %}

    <div class="col-content prose prose-lg">
      {{ entry.body }}
    </div>
  </article>
{% endblock %}
```

### Matrix/CKEditor Content

For entries with Matrix or CKEditor fields containing various block types:

```twig
{# templates/blog/_entry.twig #}
{% extends '_layouts/default' %}

{% block content %}
  <article class="py-12">
    <h1 class="col-content text-4xl font-bold mb-8">{{ entry.title }}</h1>

    {% for block in entry.contentBlocks.all() %}

      {% if block.type == 'text' %}
        <div class="col-content prose prose-lg mb-8">
          {{ block.text }}
        </div>

      {% elseif block.type == 'image' %}
        {% set image = block.image.one() %}
        {% if image %}
          <figure class="col-{{ block.width ?? 'feature' }} mb-8">
            <img src="{{ image.url }}" alt="{{ image.title }}">
            {% if block.caption %}
              <figcaption class="text-center text-gray-600 mt-2">{{ block.caption }}</figcaption>
            {% endif %}
          </figure>
        {% endif %}

      {% elseif block.type == 'quote' %}
        <blockquote class="col-popout bg-blue-50 p-gap border-l-4 border-blue-500 mb-8">
          <p class="text-xl italic">{{ block.quote }}</p>
          {% if block.attribution %}
            <cite class="block mt-4 text-gray-600">— {{ block.attribution }}</cite>
          {% endif %}
        </blockquote>

      {% elseif block.type == 'callout' %}
        <div class="col-full bg-gray-900 text-white p-gap py-16 mb-8">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-4">{{ block.heading }}</h2>
            {{ block.text }}
          </div>
        </div>

      {% elseif block.type == 'gallery' %}
        <div class="col-feature grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {% for image in block.images.all() %}
            <img src="{{ image.url }}" alt="{{ image.title }}" class="w-full h-48 object-cover rounded">
          {% endfor %}
        </div>

      {% endif %}

    {% endfor %}
  </article>
{% endblock %}
```

## Dynamic Column Classes

Use Twig to dynamically set column classes based on CMS fields:

```twig
{# Allow editors to choose image width in the CMS #}
{% set widthClass = {
  'content': 'col-content',
  'popout': 'col-popout',
  'feature': 'col-feature',
  'full': 'col-full'
}[block.imageWidth] ?? 'col-feature' %}

<img class="{{ widthClass }}" src="{{ image.url }}" alt="{{ image.title }}">
```

## Common Patterns

### Hero Section with Entry Image

```twig
{% set heroImage = entry.heroImage.one() %}
{% if heroImage %}
  <div class="col-full relative h-96 md:h-[500px]">
    <img src="{{ heroImage.url }}" alt="{{ heroImage.title }}" class="w-full h-full object-cover">
    <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
      <h1 class="text-white text-4xl md:text-5xl font-bold text-center px-4">{{ entry.title }}</h1>
    </div>
  </div>
{% endif %}
```

### Related Entries Grid

```twig
{% set relatedEntries = craft.entries.section('blog').relatedTo(entry).limit(3).all() %}
{% if relatedEntries|length %}
  <section class="col-feature py-12">
    <h2 class="text-2xl font-bold mb-8">Related Posts</h2>
    <div class="grid md:grid-cols-3 gap-8">
      {% for related in relatedEntries %}
        <article class="bg-white rounded-lg shadow overflow-hidden">
          {% if related.heroImage.one() %}
            <img src="{{ related.heroImage.one().url }}" alt="" class="w-full h-48 object-cover">
          {% endif %}
          <div class="p-6">
            <h3 class="font-bold mb-2">
              <a href="{{ related.url }}" class="hover:text-blue-600">{{ related.title }}</a>
            </h3>
            <p class="text-gray-600 text-sm">{{ related.postDate|date('M j, Y') }}</p>
          </div>
        </article>
      {% endfor %}
    </div>
  </section>
{% endif %}
```

## Troubleshooting

### Visualizer Not Appearing

1. **Check devMode**: Ensure `devMode` is `true` in your `config/general.php` for development
2. **Check Vite**: Make sure the Vite dev server is running (`npm run dev`)
3. **Check Console**: Look for JavaScript errors in the browser console
4. **Check Alpine**: Verify Alpine.js is loading before the visualizer script

### Grid Not Spanning Full Width

Make sure your layout doesn't have constraining containers:

```twig
{# BAD - container constrains the grid #}
<div class="container mx-auto">
  <main class="grid-cols-breakout">
    ...
  </main>
</div>

{# GOOD - grid can span full viewport #}
<main class="grid-cols-breakout">
  ...
</main>
```

### Nested Grid Issues

If using breakout grids inside sidebars or other constrained layouts, use the `breakout-to-*` modifiers:

```twig
<div class="col-content grid grid-cols-[250px_1fr] gap-8">
  <aside>Sidebar</aside>
  <main class="grid-cols-breakout breakout-to-content">
    {# Grid fills available space #}
  </main>
</div>
```

See [Nested Grid Modifiers](nested-grids.md) for more details.

## Files Reference

The plugin includes these files useful for CraftCMS integration:

- `craft-integration.twig` - Complete template partial with visualizer, toggle button, and dev mode indicator
- `breakout-grid-visualizer.js` - The Alpine.js visualizer component
- `demo.html` - Interactive demo showing all features
