import { PluginCreator } from 'tailwindcss/types/config';

/**
 * Configuration options for the breakout grid plugin
 */
export interface BreakoutGridConfig {
  /**
   * Minimum gap between columns on mobile
   * @default '1rem'
   */
  baseGap?: string;

  /**
   * Maximum gap between columns on ultra-wide screens
   * @default '15rem'
   */
  maxGap?: string;

  /**
   * Minimum width for narrow reading columns
   * @default '40rem'
   */
  narrowMin?: string;

  /**
   * Maximum width for narrow reading columns
   * @default '50rem'
   */
  narrowMax?: string;

  /**
   * Preferred/default width for narrow columns (viewport-based)
   * @default '52vw'
   */
  narrowBase?: string;

  /**
   * Width for standard content sections
   * @default '4vw'
   */
  content?: string;

  /**
   * How far popout sections extend beyond content
   * @default '5rem'
   */
  popoutWidth?: string;

  /**
   * How far feature sections extend beyond content
   * @default '12vw'
   */
  featureWidth?: string;

  /**
   * Additional extension for feature-popout sections
   * @default '5rem'
   */
  featurePopoutWidth?: string;

  /**
   * Default column for elements without a col-* class
   * @default 'content'
   */
  defaultCol?: 'narrow' | 'content' | 'popout' | 'feature' | 'feature-popout' | 'full';

  /**
   * Maximum width for col-full-limit sections
   * @default '90rem'
   */
  fullLimit?: string;

  /**
   * Responsive gap scaling configuration
   * Can be a string (applied to all breakpoints) or an object with breakpoint-specific values
   * @default { default: '4vw', lg: '5vw', xl: '6vw' }
   */
  gapScale?: string | {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    [key: string]: string | undefined;
  };

  /**
   * Enable debug logging to console
   * @default false
   */
  debug?: boolean;
}

/**
 * Tailwind CSS Breakout Grid Plugin
 *
 * Creates a flexible, fluid CSS Grid layout system that allows content to "break out"
 * of its default container while maintaining optimal readability.
 *
 * @example
 * ```js
 * // tailwind.config.js
 * import breakoutGrid from '@astuteo/tailwind-breakout-grid'
 *
 * export default {
 *   plugins: [
 *     breakoutGrid({
 *       baseGap: '1.5rem',
 *       narrowMax: '50rem'
 *     })
 *   ]
 * }
 * ```
 *
 * @example
 * ```html
 * <!-- HTML usage -->
 * <div class="grid-cols-breakout">
 *   <p class="col-narrow">Readable text width</p>
 *   <img class="col-feature" src="wide.jpg" />
 *   <div class="col-full bg-gray-100">Full width section</div>
 * </div>
 * ```
 */
declare const breakoutGrid: {
  (config?: BreakoutGridConfig): {
    handler: PluginCreator;
  };
  __isOptionsFunction: true;
};

export default breakoutGrid;
