# Simplifying the Grid

The breakout grid includes 7 column levels by default. If your project doesn't need all of them, you can collapse unused tracks to zero width. The grid lines still exist (so utilities won't break), but they take no space.

## Collapsing Unused Tracks

Set any track width to `'0'` in your config:

```js
// tailwind.config.js
import breakoutGrid from '@astuteo/tailwind-breakout-grid'

export default {
  plugins: [
    breakoutGrid({
      // Collapse feature-popout (you just need full → feature → content → narrow)
      featurePopoutWidth: '0',

      // Collapse popout too if you only need feature and content
      popoutWidth: '0',
    })
  ]
}
```

## Common Simplified Configurations

### Minimal: Just Full, Content, and Narrow

For simple editorial layouts that only need three widths:

```js
breakoutGrid({
  featurePopoutWidth: '0',
  featureWidth: '0',
  popoutWidth: '0',
})
```

This gives you:
- `col-full` - Edge to edge
- `col-content` - Standard content width
- `col-narrow` - Optimal reading width

The `col-feature`, `col-popout`, and `col-feature-popout` classes still work—they just resolve to the same width as `col-content`.

### No Popout Levels

If you want full, feature, content, and narrow but don't need the popout variations:

```js
breakoutGrid({
  featurePopoutWidth: '0',
  popoutWidth: '0',
})
```

### Make Narrow Equal Content

If you don't need a separate narrow reading column:

```js
breakoutGrid({
  // Set narrow to match your content width
  narrowMin: '100%',
  narrowMax: '100%',
  narrowBase: '100%',
})
```

Now `col-narrow` and `col-content` produce the same width.

## Why This Works

CSS Grid handles zero-width tracks efficiently—they're just collapsed grid lines with no performance cost. The grid-line names (`narrow-start`, `feature-end`, etc.) still exist, so all `col-*` utilities continue to work. They just resolve to the nearest non-zero track.

This approach is better than conditionally removing tracks because:

1. **Your utilities always work** - No need to remember which tracks exist in each project
2. **Simpler code** - The plugin doesn't need complex conditional logic
3. **Easy to expand later** - Just change `'0'` to a real value if needs change
