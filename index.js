/**
 * Tailwind Breakout Grid Plugin
 *
 * Creates a flexible, fluid CSS Grid layout system that allows content to "break out"
 * of its default container while maintaining optimal readability. Perfect for editorial
 * layouts, marketing pages, and content-rich applications.
 *
 * Features:
 * - 7 content width levels (narrow, content, popout, feature, feature-popout, full, center)
 * - Responsive gap scaling based on viewport size
 * - Left/right aligned nested grids for asymmetric layouts
 * - Fluid by default using CSS clamp() for smooth adaptation
 *
 * @example
 * // Basic usage in tailwind.config.js
 * import breakoutGrid from './tailwind-plugins/breakout-grid.js'
 *
 * export default {
 *   plugins: [breakoutGrid()]
 * }
 *
 * @example
 * // HTML usage
 * <div class="grid-cols-breakout">
 *   <p class="col-narrow">Readable text</p>
 *   <img class="col-feature" src="wide.jpg" />
 * </div>
 *
 * @see https://www.viget.com/articles/fluid-breakout-layout-css-grid/
 */

// Ordered from widest to narrowest, following the visual hierarchy
const GRID_AREAS = ['full', 'feature-popout', 'feature', 'popout', 'content', 'center', 'narrow']
const BREAKOUT_TYPES = GRID_AREAS.filter(area => area !== 'full')

/**
 * Default configuration values for the grid system.
 * These can be overridden in tailwind.config.js
 *
 * @example
 * // In tailwind.config.js
 * const breakoutGrid = require('./tailwind-plugins/breakout-grid');
 *
 * module.exports = {
 *  plugins: [
 *     breakoutGrid({
 *       // Base measurements
 *       baseGap: '1.5rem',      // Minimum gap between columns
 *       maxGap: '15rem',        // Maximum gap between columns
 *       narrowMin: '40rem',     // Minimum width for narrow text columns
 *       narrowMax: '50rem',     // Maximum width for narrow text columns
 *       narrowBase: '52vw',     // Default width for narrow columns
 *       defaultCol: 'content',  // Default column for elements without a col-* class
 *       featureWidth: '6vw',    // How far feature sections extend
 *       popoutWidth: '2rem',    // How far popout sections extend
 *       content: '4vw',         // Width for content sections
 *       fullLimit: '120rem',    // Maximum width for full sections
 *
 *       // Responsive gap scaling
 *       gapScale: {
 *         default: '4vw',    // Default scaling (mobile)
 *         lg: '5vw',         // Large screens (1024px)
 *         xl: '6vw'          // Extra large screens (1280px)
 *       },
 *
 *       // Debug mode (optional)
 *       debug: false         // Enable debug logging
 *     })
 *   ]
 * }
 */

const defaultConfig = {
  baseGap: '1rem',     // Smallest space between columns (mobile)
  maxGap: '15rem',     // Maximum gap between columns
  narrowMin: '40rem',  // Best width for reading text
  narrowMax: '50rem',  // Max width before text gets hard to read
  narrowBase: '52vw',  // Preferred/default width for narrow sections
  featurePopoutWidth: '5rem', // How far "feature" sections pop out
  featureWidth: '12vw', // How far "feature" sections stick out
  defaultCol: 'content',  // Default column for elements without a col-* class
  fullLimit: '90rem',  // Maximum width for full-limit sections
  popoutWidth: '5rem', // How far "popout" sections stick out
  content: '4vw',      // Width for content sections
  debug: false,        // Enable debug logging
  gapScale: {
    default: '4vw',    // Default scaling
    lg: '5vw',         // Large screens
    xl: '6vw'          // Extra large screens
  }
}

/**
 * Creates CSS Custom Properties for the grid system.
 * These CSS variables are added to :root and derived from the plugin configuration.
 *
 * Grid column types and their relative widths:
 *
 *    viewport width →
 *    ┌─────────────────────────────┐
 *    │ ╔═════════col-full════════╗ │ full: edge-to-edge with gap
 *    │ ║    spans all columns    ║ │
 *    │ ╚═════════════════════════╝ │
 *    │   ╔═col-feature-popout═╗    │ feature-popout: widest content
 *    │   ║     widest text    ║    │ (~5rem + feature width)
 *    │   ╚════════════════════╝    │
 *    │     ╔═══col-feature═══╗     │ feature: extra wide content
 *    │     ║   extra wide    ║     │ (~12vw on each side)
 *    │     ╚═════════════════╝     │
 *    │       ╔═══col-popout═══╗    │ popout: slightly wider
 *    │       ║   wider text   ║    │ (~5rem on each side)
 *    │       ╚════════════════╝    │
 *    │         ╔═col-content═╗     │ content: standard width
 *    │         ║    normal   ║     │ (~4vw on each side)
 *    │         ╚═════════════╝     │
 *    │           ╔col-narrow╗      │ narrow: reading width
 *    │           ║   text   ║      │ (40-50rem optimal)
 *    │           ╚══════════╝      │
 *    └─────────────────────────────┘
 *
 * Important Variable Differences:
 * --narrow: Used in centered layouts, accounts for gaps on both sides
 *          Formula: width = narrow-width - (gap * 2)
 *
 * --narrow-inset: Used in left/right aligned nested grids, accounts for single gap
 *                Formula: width = narrow-width - gap
 *                Critical for maintaining proper reading width in nested contexts
 *
 * @param {Object} pluginConfig - Merged plugin configuration
 * @returns {Object} CSS custom properties object
 * @private
 */
const createRootCSS = (pluginConfig) => ({
  '--base-gap': pluginConfig.baseGap,
  '--max-gap': pluginConfig.maxGap,
  '--narrow-min': pluginConfig.narrowMin,
  '--narrow-max': pluginConfig.narrowMax,
  '--narrow-base': pluginConfig.narrowBase,
  '--gap': `clamp(var(--base-gap), ${pluginConfig.gapScale.default}, var(--max-gap))`,
  '--computed-gap': 'max(var(--gap), calc((100vw - var(--narrow)) / 10))',
  '--full-limit': pluginConfig.fullLimit,
  '--narrow-inset': 'min(clamp(var(--narrow-min), var(--narrow-base), var(--narrow-max)), calc(100% - var(--gap)))',
  '--full': 'minmax(var(--gap), 1fr)',
  '--feature-popout': `minmax(0, ${pluginConfig.featurePopoutWidth})`,
  '--feature': `minmax(0, ${pluginConfig.featureWidth})`,
  '--popout': `minmax(0, ${pluginConfig.popoutWidth})`,
  '--content': `minmax(0, ${pluginConfig.content})`,
  '--narrow': 'min(clamp(var(--narrow-min), var(--narrow-base), var(--narrow-max)), 100% - var(--gap) * 2)',
  '--narrow-half': 'calc(var(--narrow) / 2)',
})

/**
 * Helper function for debug logging.
 * Only logs to console when debug mode is enabled in config.
 *
 * @param {Object} config - Plugin configuration
 * @param {...*} args - Arguments to log
 * @private
 */
const debugLog = (config, ...args) => {
  if (config.debug) {
    console.log(...args)
  }
}

/**
 * Generates spacing utilities for gaps, computed gaps, and popout widths.
 * Creates utilities for both padding and margin with various directional options.
 *
 * Generated classes:
 * - .p-gap, .px-gap, .py-gap, .pt-gap, .pr-gap, .pb-gap, .pl-gap
 * - .m-gap, .mx-gap, .my-gap, .mt-gap, .mr-gap, .mb-gap, .ml-gap
 * - .p-full-gap, .px-full-gap, etc. (using computed gap)
 * - .p-popout, .px-popout, etc. (using popout width)
 *
 * @returns {Object} Spacing utility classes
 * @private
 */
const createSpacingUtilities = () => {
  const spacingTypes = {
    p: 'padding',
    px: ['padding-left', 'padding-right'],
    py: ['padding-top', 'padding-bottom'],
    pt: 'padding-top',
    pr: 'padding-right',
    pb: 'padding-bottom',
    pl: 'padding-left',
    m: 'margin',
    mx: ['margin-left', 'margin-right'],
    my: ['margin-top', 'margin-bottom'],
    mt: 'margin-top',
    mr: 'margin-right',
    mb: 'margin-bottom',
    ml: 'margin-left',
  }

  return Object.entries(spacingTypes)
    .reduce((acc, [key, properties]) => {
      const utilities = {
        [`.${key}-gap`]: [properties].flat()
          .reduce((styles, prop) => ({
            ...styles,
            [prop]: 'var(--gap)'
          }), {}),
        [`.${key}-full-gap`]: [properties].flat()
          .reduce((styles, prop) => ({
            ...styles,
            [prop]: 'var(--computed-gap)'
          }), {}),
        [`.${key}-popout`]: [properties].flat()
          .reduce((styles, prop) => ({
            ...styles,
            [prop]: 'var(--popout)'
          }), {})
      }
      return { ...acc, ...utilities }
    }, {})
}

/**
 * Generates grid templates for different section types and alignments.
 */
const createGridTemplate = (config, type = 'full', align = 'center') => {
  debugLog(config, `Creating grid template for type: ${type}, align: ${align}`)

  // Validate that type exists in our allowed types (except 'full' which is default)
  if (type !== 'full' && !BREAKOUT_TYPES.includes(type)) {
    console.warn(`Invalid grid type: ${type}`)
    return ''
  }

  if (type === 'feature-popout' && align === 'left') {
    const template = `[full-start] var(--full)
    [feature-popout-start] var(--feature-popout)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--feature-popout) [feature-popout-end full-end]`
    debugLog(config, 'Generated feature-popout-left template:', template)
    return template
  }

  if (type === 'feature-popout' && align === 'right') {
    const template = `[full-start feature-popout-start] var(--feature-popout)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--feature-popout) [feature-popout-end]
    var(--full) [full-end]`
    debugLog(config, 'Generated feature-popout-right template:', template)
    return template
  }

  /**
   * Feature Left Template
   */
  if (type === 'feature' && align === 'left') {
    const template = `[full-start] var(--full)
    [feature-popout-start] var(--feature-popout)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end full-end]`
    debugLog(config, 'Generated feature-left template:', template)
    return template
  }

  /**
   * Feature Right Template
   */
  if (type === 'feature' && align === 'right') {
    const template = `[full-start feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--feature-popout) [feature-popout-end]
    var(--full) [full-end]`
    debugLog(config, 'Generated feature-right template:', template)
    return template
  }

  /**
   * Content Left Template
   */
  if (type === 'content' && align === 'left') {
    const template = `[full-start] var(--full)
    [feature-popout-start] var(--feature-popout)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end full-end]`
    debugLog(config, 'Generated content-left template:', template)
    return template
  }

  /**
   * Content Right Template
   */
  if (type === 'content' && align === 'right') {
    const template = `[full-start content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--feature-popout) [feature-popout-end]
    var(--full) [full-end]`
    debugLog(config, 'Generated content-right template:', template)
    return template
  }

  /**
   * Popout Left Template
   */
  if (type === 'popout' && align === 'left') {
    const template = `[full-start] var(--full)
    [feature-popout-start] var(--feature-popout)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end full-end]`
    debugLog(config, 'Generated popout-left template:', template)
    return template
  }

  /**
   * Popout Right Template
   */
  if (type === 'popout' && align === 'right') {
    const template = `[full-start popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--feature-popout) [feature-popout-end]
    var(--full) [full-end]`
    debugLog(config, 'Generated popout-right template:', template)
    return template
  }

  /**
   * Narrow Left Template
   */
  if (type === 'narrow' && align === 'left') {
    const template = `[full-start] var(--full)
    [feature-popout-start] var(--feature-popout)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-inset) [narrow-end full-end]`
    debugLog(config, 'Generated narrow-left template:', template)
    return template
  }

  /**
   * Narrow Right Template
   */
  if (type === 'narrow' && align === 'right') {
    const template = `[full-start narrow-start] var(--narrow-inset) [narrow-end content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--feature-popout) [feature-popout-end]
    var(--full) [full-end]`
    debugLog(config, 'Generated narrow-right template:', template)
    return template
  }

  /**
   * Default (Center) Template
   */
  const template = `[full-start] var(--full)
    [feature-popout-start] var(--feature-popout)
    [feature-start] var(--feature)
    [popout-start] var(--popout)
    [content-start] var(--content)
    [narrow-start] var(--narrow-half) [center-start center-end] var(--narrow-half) [narrow-end]
    var(--content) [content-end]
    var(--popout) [popout-end]
    var(--feature) [feature-end]
    var(--feature-popout) [feature-popout-end]
    var(--full) [full-end]`
  debugLog(config, 'Generated default template:', template)
  return template
}

/**
 * Generates all possible grid template variations.
 * Creates templates for each combination of section type and alignment.
 *
 * Generated templates:
 * - default: Center-aligned grid (used by .grid-cols-breakout)
 * - featurePopoutLeft/Right: Feature popout aligned grids
 * - featureLeft/Right: Feature aligned grids
 * - popoutLeft/Right: Popout aligned grids
 * - contentLeft/Right: Content aligned grids
 * - narrowLeft/Right: Narrow aligned grids
 *
 * @param {Object} config - Plugin configuration
 * @returns {Object} Map of template names to grid-template-columns values
 * @private
 */
const generateTemplates = (config) => {
  debugLog(config, 'Generating all templates')

  // Start with the default template
  const templates = {
    default: createGridTemplate(config)
  }

  // Generate left and right templates for each breakout type
  BREAKOUT_TYPES.forEach(type => {
    // Convert kebab-case to camelCase for template names
    const templateType = type.replace(/-([a-z])/g, g => g[1].toUpperCase())

    templates[`${templateType}Left`] = createGridTemplate(config, type, 'left')
    templates[`${templateType}Right`] = createGridTemplate(config, type, 'right')
  })

  debugLog(config, 'Generated templates:', templates)
  return templates
}

/**
 * Generates column placement utilities for the grid system.
 * Creates utilities for basic placement, spans, and fine-grained control.
 */
const createColumnUtilities = (templates) => {
  return GRID_AREAS.reduce((acc, area) => ({
    ...acc,
    [`.col-${area}`]: { 'grid-column': area },
    [`.col-start-${area}`]: { 'grid-column-start': `${area}-start` },
    [`.col-end-${area}`]: { 'grid-column-end': `${area}-end` },
    ...(area !== 'full' && {
      [`.col-${area}-left`]: { 'grid-column': `full-start / ${area}-end` },
      [`.col-${area}-right`]: { 'grid-column': `${area}-start / full-end` }
    })
  }), {})
}

/**
 * Generates grid template utilities for different section types.
 * Creates the classes that define the grid structure.
 */
const createGridUtilities = (config, templates) => {
  debugLog(config, 'Creating grid utilities with templates:', templates)

  const utilities = BREAKOUT_TYPES.reduce((acc, type) => {
    const leftClass = `.grid-cols-${type}-left`
    const rightClass = `.grid-cols-${type}-right`
    // Convert kebab-case to camelCase for template lookup
    const templateType = type.replace(/-([a-z])/g, g => g[1].toUpperCase())
    const leftTemplate = templates[`${templateType}Left`]
    const rightTemplate = templates[`${templateType}Right`]

    debugLog(config, `Creating utility classes: ${leftClass}, ${rightClass}`)

    return {
      ...acc,
      [leftClass]: {
        'display': 'grid',
        'grid-template-columns': leftTemplate
      },
      [rightClass]: {
        'display': 'grid',
        'grid-template-columns': rightTemplate
      }
    }
  }, {
    '.grid-cols-breakout': {
      'display': 'grid',
      'grid-template-columns': templates.default
    }
  })

  debugLog(config, 'Generated utilities:', utilities)
  return utilities
}

/**
 * Main plugin export that sets up the grid system.
 * Combines all utilities and adds them to Tailwind's utility system.
 *
 * @param {Object} config - Plugin configuration options
 * @param {string} [config.baseGap='1rem'] - Minimum gap on mobile
 * @param {string} [config.maxGap='15rem'] - Maximum gap on ultra-wide screens
 * @param {string} [config.narrowMin='40rem'] - Minimum width for narrow columns
 * @param {string} [config.narrowMax='50rem'] - Maximum width for narrow columns
 * @param {string} [config.narrowBase='52vw'] - Preferred width (viewport-based)
 * @param {string} [config.content='4vw'] - Standard content rail width
 * @param {string} [config.popoutWidth='5rem'] - Popout extension distance
 * @param {string} [config.featureWidth='12vw'] - Feature rail extension
 * @param {string} [config.featurePopoutWidth='5rem'] - Extra feature extension
 * @param {string} [config.defaultCol='content'] - Default column for items without col-* class
 * @param {string} [config.fullLimit='90rem'] - Maximum width for col-full-limit
 * @param {Object|string} [config.gapScale] - Responsive gap scaling
 * @param {string} [config.gapScale.default='4vw'] - Mobile/default gap
 * @param {string} [config.gapScale.lg='5vw'] - Large screens (1024px+)
 * @param {string} [config.gapScale.xl='6vw'] - Extra large screens (1280px+)
 * @param {boolean} [config.debug=false] - Enable console logging
 *
 * @returns {Function} Tailwind CSS plugin function
 *
 * @example
 * // Minimal configuration
 * breakoutGrid()
 *
 * @example
 * // Custom configuration
 * breakoutGrid({
 *   baseGap: '2rem',
 *   narrowMax: '60rem',
 *   gapScale: {
 *     default: '5vw',
 *     xl: '8vw'
 *   }
 * })
 */
export default (config = {}) => {
  const pluginConfig = {
    ...defaultConfig,
    ...config,
    gapScale: {
      ...defaultConfig.gapScale,
      ...(typeof config.gapScale === 'string' ? { default: config.gapScale } : config.gapScale || {})
    }
  }

  return ({
    addBase,
    theme,
    addUtilities
  }) => {
    const screens = theme('screens', {})
    const templates = generateTemplates(pluginConfig)
    const rootCSS = createRootCSS(pluginConfig)

    // Add responsive gap scaling
    const mediaQueries = Object.entries(screens)
      .reduce((acc, [breakpoint, minWidth]) => {
        if (pluginConfig.gapScale[breakpoint]) {
          acc[`@media (min-width: ${minWidth})`] = {
            '--gap': `clamp(var(--base-gap), ${pluginConfig.gapScale[breakpoint]}, var(--max-gap))`
          }
        }
        return acc
      }, {})

    // Add base styles
    addBase({
      ':root': { ...rootCSS, ...mediaQueries },
      '[class*=\'grid-cols-breakout\'] > *:not([class*=\'col-\'])': {
        'grid-column': pluginConfig.defaultCol
      }
    })

    // Add all utility classes
    addUtilities({
      ...createSpacingUtilities(),
      ...createGridUtilities(pluginConfig, templates),
      ...createColumnUtilities(templates),
      '.col-full-limit': {
        'grid-column': 'full',
        'width': '100%',
        'max-width': 'var(--full-limit)',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'box-sizing': 'border-box'
      }
    })
  }
};