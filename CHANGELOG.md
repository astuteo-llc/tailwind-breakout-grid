# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.6] - 2025-10-30

### Fixed

- **Tailwind v4 Compatibility:**
  - Fixed negative margin utilities to use `matchUtilities` API instead of `addUtilities`
  - Negative margins now work properly: `-m-gap`, `-mx-breakout`, etc.
  - Follows Tailwind's built-in pattern for negative value support

## [1.1.5] - 2025-10-30

### Added

- **Margin Breakout Utilities:**
  - `m-breakout`, `mx-breakout`, `my-breakout`, `mt-breakout`, `mr-breakout`, `mb-breakout`, `ml-breakout`
  - Responsive margin utilities matching `p-breakout` pattern for consistent spacing
  - Equivalent to traditional patterns like `mx-6 md:mx-16 lg:mx-20`

- **Negative Margin Utilities:**
  - All margin utilities now have negative versions: `-m-breakout`, `-mx-breakout`, etc.
  - Negative versions for gap-based margins: `-m-gap`, `-mx-gap`, `-m-full-gap`, etc.
  - Negative versions for popout margins: `-m-popout`, `-mx-popout`, etc.
  - Useful for breaking out of padded containers

- **Configuration Validation:**
  - Built-in validation for configuration values with helpful warnings
  - Validates CSS units and provides clear error messages without breaking builds
  - Improved error handling with graceful fallbacks

### Improved

- **Grid Visualizer Enhancements:**
  - Added padding visualization overlays for `p-gap` and `p-breakout` utilities
  - Toggle controls to show/hide padding areas with dotted/dashed borders
  - Added "Show Class Names" toggle (unchecked by default) to display CSS class names
  - Reorganized control panel with "SHOW" heading for better organization
  - All toggles now grouped under clear section heading

- **Module System:**
  - Confirmed CommonJS pattern using `module.exports` for maximum compatibility
  - Follows Tailwind Labs official plugin conventions
  - Works seamlessly with both CommonJS and ESM config files

- **Debug Logging:**
  - Improved debug output to show validated template parameters
  - Better error messages throughout the plugin

## [1.1.2] - 2025-10-30

### Improved

- **Grid Visualizer Enhancements:**
  - Display class names (`.col-full`, `.col-feature`, etc.) below each label in monospace font
  - Add `col-full-limit` as a visible option in the grid overlay
  - Show selected column's class name in control panel
  - Better label styling and spacing

## [1.1.1] - 2025-10-30

### Fixed

- Fixed Tailwind v4 compatibility issue with `p-breakout` utilities
- Changed implementation to use CSS custom properties instead of nested media queries in `addUtilities()`
- Aligns with same pattern used for gap scaling for consistency

## [1.1.0] - 2025-10-30

### Added

- Fixed responsive padding utilities (`p-breakout`, `px-breakout`, etc.) for legacy project integration
- `breakoutPadding` configuration option to customize responsive padding values
- Documentation section on integrating with existing projects using `max-w-*` containers
- Comparison table mapping Tailwind max-width utilities to breakout grid columns
- Migration checklist for converting legacy layouts
- "Using p-breakout for Easy Migration" guide with before/after examples

## [1.0.0] - 2025-10-30

### Added

- Initial release of the Tailwind Breakout Grid plugin
- 7 content width levels: narrow, content, popout, feature, feature-popout, full, and center
- Responsive gap scaling with customizable breakpoints
- Left/right aligned nested grids for asymmetric layouts
- Spacing utilities (p-gap, m-gap, etc.) based on grid measurements
- Fine-grained column control with start/end utilities
- Alpine.js-based grid visualizer for development
- CraftCMS integration template for dev mode only
- Comprehensive documentation and demo HTML
- TypeScript type definitions for IDE support
- Full configuration options with sensible defaults

### Features

- Pure CSS Grid implementation with no JavaScript dependencies
- Fluid responsive design using CSS clamp()
- Optimal reading width constraints (40-50rem for narrow columns)
- Automatic default column assignment for child elements
- Debug mode for template generation logging

[1.1.6]: https://github.com/astuteo-llc/tailwind-breakout-grid/releases/tag/v1.1.6
[1.1.5]: https://github.com/astuteo-llc/tailwind-breakout-grid/releases/tag/v1.1.5
[1.1.2]: https://github.com/astuteo-llc/tailwind-breakout-grid/releases/tag/v1.1.2
[1.1.1]: https://github.com/astuteo-llc/tailwind-breakout-grid/releases/tag/v1.1.1
[1.1.0]: https://github.com/astuteo-llc/tailwind-breakout-grid/releases/tag/v1.1.0
[1.0.0]: https://github.com/astuteo-llc/tailwind-breakout-grid/releases/tag/v1.0.0
