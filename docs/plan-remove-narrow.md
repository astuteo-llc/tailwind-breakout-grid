# RFC: Simplifying the Grid Column Structure

**Status:** Under discussion
**Decision needed by:** TBD
**Stakeholders:** Development team

---

## TL;DR - Three Options

### Option A: Remove Narrow (Breaking Change)
Merge narrow into content. Content becomes the fluid reading width.

| Pros | Cons |
|------|------|
| Simpler (5 levels vs 6) | Breaking change for `col-narrow` |
| Fewer config options | Popout relationship changes |
| Less mental overhead | Need to verify visual results |

**Migration:** Find/replace `col-narrow` → `col-content`

---

### Option B: Rename Narrow → Prose (Non-Breaking)
Keep the architecture, improve naming clarity.

| Pros | Cons |
|------|------|
| No breaking changes | Doesn't simplify the grid |
| Clearer purpose ("prose" = reading text) | Still 6 levels to understand |
| Easy migration path (alias) | |

**Migration:** Add `col-prose` as alias, deprecate `col-narrow` over time

---

### Option C: Keep As-Is
Leave the current structure, improve documentation.

| Pros | Cons |
|------|------|
| Zero effort | Doesn't address confusion |
| No risk | |

---

# Full Analysis: Removing the Narrow Column

## Current Architecture

The grid currently has 6 width levels (widest to narrowest):
```
full → feature → popout → content → center → narrow
```

The default grid template:
```css
[full-start] var(--full)
[feature-start] var(--feature)
[popout-start] var(--popout)
[content-start] var(--content)
[narrow-start] var(--narrow-half) [center-start center-end] var(--narrow-half) [narrow-end]
var(--content) [content-end]
var(--popout) [popout-end]
var(--feature) [feature-end]
var(--full) [full-end]
```

### How Narrow Works Today

```css
--narrow-min: 40rem;   /* Floor - never narrower */
--narrow-max: 50rem;   /* Ceiling - never wider */
--narrow-base: 52vw;   /* Preferred width (viewport-based) */

--narrow: min(
  clamp(var(--narrow-min), var(--narrow-base), var(--narrow-max)),
  100% - var(--gap) * 2
);
```

The narrow column is the **innermost content area** with fluid width clamped between 40-50rem. It's designed for optimal reading width (65-75 characters per line).

### How Content Works Today

```css
--content: minmax(0, 4vw);
```

Content is just a **fixed-width track** (4vw) that creates spacing between popout and narrow. It's not fluid - it's a consistent "rail" width.

---

## Proposal: Remove Narrow, Make Content Fluid

### New Architecture

Reduce to 5 width levels:
```
full → feature → popout → content → center
```

Content would absorb narrow's behavior:
```css
--content-min: 40rem;
--content-max: 50rem;
--content-base: 52vw;

--content: min(
  clamp(var(--content-min), var(--content-base), var(--content-max)),
  100% - var(--gap) * 2
);
```

New grid template:
```css
[full-start] var(--full)
[feature-start] var(--feature)
[popout-start] var(--popout)
[content-start] var(--content-half) [center-start center-end] var(--content-half) [content-end]
var(--popout) [popout-end]
var(--feature) [feature-end]
var(--full) [full-end]
```

---

## Consequences

### Positive

| Aspect | Benefit |
|--------|---------|
| **Simpler mental model** | 5 levels instead of 6. Less to remember. |
| **Fewer config options** | Remove `narrowMin`, `narrowMax`, `narrowBase`. Rename to `contentMin`, etc. |
| **Cleaner templates** | Fewer grid tracks = simpler CSS output |
| **Less confusion** | Users often don't understand content vs narrow distinction |
| **Smaller CSS** | Fewer utility classes generated |

### Negative

| Aspect | Problem |
|--------|---------|
| **Breaking change** | All `col-narrow` classes become invalid |
| **Lost granularity** | Can't have different widths for "general content" vs "reading text" |
| **Migration burden** | Every project using `col-narrow` needs updates |
| **Popout loses meaning** | Currently popout = "wider than content but narrower than feature". If content IS the reading width, what does popout mean? |

### The Popout Problem

Today's hierarchy:
```
feature: hero images, full-bleed media
popout:  callouts, quotes, tables (slightly wider than text)
content: general UI elements, forms
narrow:  body text, optimal reading width
```

If narrow is removed:
```
feature: hero images, full-bleed media
popout:  ??? what goes here now?
content: body text AND general UI (same thing)
```

**Popout becomes awkward** - it's "wider than reading text" but what's the use case if content IS reading text?

---

## Alternative: Rename Instead of Remove

Keep the same structure but rename for clarity:

| Current | Proposed | Purpose |
|---------|----------|---------|
| `col-narrow` | `col-prose` | Optimal reading width |
| `col-content` | `col-content` | General content + UI |
| `col-popout` | `col-wide` | Emphasis breakout |
| `col-feature` | `col-feature` | Hero/media breakout |

This preserves functionality while improving naming.

---

## Migration Path (If Removing)

### Step 1: Deprecation Phase
1. Add console warnings when `col-narrow` is used
2. Document migration path
3. Provide codemod or find/replace patterns

### Step 2: Code Changes

**index.js:**
- Remove `narrow` from `GRID_AREAS`
- Rename config: `narrowMin` → `contentMin`, etc.
- Update `createRootCSS()` to use new variable names
- Update all grid templates to remove narrow track
- Remove `col-narrow`, `col-narrow-left`, `col-narrow-right` utilities

**visualizer:**
- Remove narrow from `gridAreas` array
- Update diagram
- Update config editor fields

**docs:**
- Update all examples
- Add migration guide section

### Step 3: User Migration

Find/replace in projects:
```
col-narrow     → col-content
col-narrow-left  → col-content-left
col-narrow-right → col-content-right
col-start-narrow → col-start-content
col-end-narrow   → col-end-content
```

---

## Recommendation

**Don't remove narrow.** The complexity it adds is justified:

1. **Reading width matters** - 40-50rem is a specific, research-backed range for readability
2. **Content vs prose is a real distinction** - Forms, UI, navigation want different widths than body text
3. **Popout makes sense** - It's "wider than prose" which is a common editorial pattern
4. **Migration cost is high** - Every project needs updates

**If simplification is the goal**, consider:
- Better documentation explaining when to use each
- Rename `narrow` → `prose` for clarity
- Make `col-prose` the default instead of `col-content`

---

## Files That Would Change

If proceeding with removal:

```
index.js                      - Core plugin, templates, utilities
breakout-grid-visualizer.js   - Remove narrow from UI
docs/nested-grids.md          - Update examples
docs/layout-examples.md       - Update all code samples
docs/visualizer.md            - Update feature list
docs/migration-guide.md       - Add v3 migration section
README.md                     - Update examples
CHANGELOG.md                  - Document breaking change
demo/*.html                   - Update all demos
```

---

## Your Usage Pattern

Based on discussion:
- **Default column:** `col-content` (for body text)
- **Both used?** Sometimes - narrow used occasionally for tighter widths
- **Migration burden:** Low (internal use only)

This means the change is more viable than for a public plugin.

---

## Try It First: Visualizer Test

Before committing to the change, test it visually using the existing visualizer:

### Step 1: Modify CSS Variables Live

In browser devtools, override on `:root`:

```css
:root {
  /* Make content behave like narrow */
  --content: minmax(0, 0);  /* Collapse the rail to zero */
}
```

This simulates removing the content "rail" between popout and narrow. The grid becomes:
```
popout → (no gap) → narrow
```

### Step 2: Observe the Results

- Does `col-popout` still look right relative to `col-narrow`?
- Is the 5rem popout extension enough, or was the 4vw content rail adding needed space?
- Do callouts/quotes feel too close to body text?

### Step 3: Try Different Popout Widths

If it feels cramped, test increasing popout:
```css
:root {
  --popout: minmax(0, 8rem);  /* Increase from 5rem */
}
```

---

## Decision Point

After visual testing:

| Result | Action |
|--------|--------|
| Looks good with `--content: 0` | Proceed with removal |
| Needs larger popout | Remove narrow, increase popout width |
| Feels wrong | Keep narrow, maybe rename to `prose` |

---

## Option B Detail: Rename to Prose

If Option B is chosen, here's what changes:

### New Class Names

| Current | New (alias) | Purpose |
|---------|-------------|---------|
| `col-narrow` | `col-prose` | Optimal reading width |
| `col-narrow-left` | `col-prose-left` | Left-aligned prose |
| `col-narrow-right` | `col-prose-right` | Right-aligned prose |
| `col-start-narrow` | `col-start-prose` | Grid line start |
| `col-end-narrow` | `col-end-prose` | Grid line end |

### Config Options

| Current | New (alias) |
|---------|-------------|
| `narrowMin` | `proseMin` |
| `narrowMax` | `proseMax` |
| `narrowBase` | `proseBase` |

### Implementation Approach

**Phase 1: Add aliases (non-breaking)**
- Add `col-prose` as alias for `col-narrow`
- Add `proseMin/Max/Base` as config aliases
- Both old and new names work

**Phase 2: Update documentation**
- All examples use `col-prose`
- Note that `col-narrow` still works

**Phase 3: Deprecation (optional, later)**
- Add console warnings for `col-narrow`
- Eventual removal in major version

### Why "Prose"?

- Tailwind uses `prose` for typography (via @tailwindcss/typography)
- Clearly communicates "this is for reading text"
- Distinguishes from "content" which sounds generic
- Common term in publishing/editorial contexts

---

## Questions for Team Discussion

1. ~~Do we use both `col-content` AND `col-narrow` in the same project?~~ → Sometimes
2. ~~What percentage of usage is `col-narrow` vs `col-content`?~~ → Low direct usage
3. Is the confusion worth solving, or is it a documentation problem?
4. Does "prose" resonate better than "narrow"?
5. Should we test Option A visually before deciding?
