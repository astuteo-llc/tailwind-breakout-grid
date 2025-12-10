# Installing from Private GitHub Repository

This plugin is currently private and hosted at:
**https://github.com/astuteo-llc/tailwind-breakout-grid**

## Installation Methods

### Method 1: SSH (Recommended)

**Prerequisites:** Team members must have SSH keys added to their GitHub account.

```bash
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git
```

Or shorter syntax:
```bash
npm install astuteo-llc/tailwind-breakout-grid
```

### Method 2: Install Specific Version/Branch

**Install from a specific tag (recommended for production):**
```bash
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git#v1.0.0
```

**Install from a branch:**
```bash
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git#develop
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git#main
```

**Install from a specific commit:**
```bash
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git#abc1234
```

## Usage in package.json

Add to your project's `package.json`:

```json
{
  "dependencies": {
    "@astuteo/tailwind-breakout-grid": "git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git#v1.0.0"
  }
}
```

Then run:
```bash
npm install
```

## Configure Tailwind

In your `tailwind.config.js`:

```js
import breakoutGrid from '@astuteo/tailwind-breakout-grid'

export default {
  content: [
    './templates/**/*.{twig,html}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: [
    breakoutGrid({
      // Optional: customize the defaults
      baseGap: '1.5rem',
      maxGap: '15rem',
      narrowMin: '40rem',
      narrowMax: '50rem',
    })
  ]
}
```

## Updating the Plugin

### Update to Latest on Current Branch
```bash
npm update @astuteo/tailwind-breakout-grid
```

Or:
```bash
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git
```

### Update to Specific Version
```bash
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git#v1.1.0
```

## For CraftCMS Projects

### 1. Install the Plugin

```bash
npm install git+ssh://git@github.com:astuteo-llc/tailwind-breakout-grid.git#v1.0.0
```

### 2. Configure Tailwind

```js
// tailwind.config.js
import breakoutGrid from '@astuteo/tailwind-breakout-grid'

export default {
  content: [
    './templates/**/*.twig',
    './src/**/*.{js,ts}'
  ],
  plugins: [breakoutGrid()]
}
```

### 3. Use in Templates

```twig
<article class="grid-cols-breakout">
  <h1 class="col-content">{{ entry.title }}</h1>

  <div class="col-narrow">
    {{ entry.body }}
  </div>

  <img class="col-feature" src="{{ entry.heroImage.url }}" alt="{{ entry.heroImage.title }}">

  <div class="col-full bg-gray-100 p-gap">
    {{ entry.calloutContent }}
  </div>
</article>
```

### 4. Optional: Add Grid Visualizer (Dev Mode Only)

See `craft-integration.twig` for complete example.

In your layout template:

```twig
{% if craft.app.config.general.devMode %}
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script src="/assets/js/breakout-grid-visualizer.js"></script>
  <div x-data="breakoutGridVisualizer" x-html="template"></div>
{% endif %}
```

## Troubleshooting

### "Permission denied (publickey)"

Your SSH key isn't set up with GitHub. Either:
1. Add your SSH key to GitHub: https://github.com/settings/keys
2. Or use HTTPS with a personal access token

### "Repository not found"

Ensure you have access to the `astuteo-llc` organization on GitHub.

### Package not updating

Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Version History

| Version | Date | Notes |
|---------|------|-------|
| v1.0.0  | 2025-10-30 | Initial release |

## Support

For issues or questions:
- GitHub Issues: https://github.com/astuteo-llc/tailwind-breakout-grid/issues
- Contact: Astuteo LLC team

## When Ready to Publish Publicly

When we decide to make this public:

1. Remove `"private": true` from `package.json`
2. Follow `PUBLISHING.md` guide
3. Team can switch to: `npm install @astuteo/tailwind-breakout-grid`
