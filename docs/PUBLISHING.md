# Publishing to npm

This guide explains how to publish the `@astuteo/tailwind-breakout-grid` plugin to npm.

## Quick Release (TL;DR)

```bash
# 1. Commit all changes first
git add .
git commit -m "Your changes"

# 2. Remove private flag (if present)
# Check package.json - if "private": true exists, remove it before publishing

# 3. Build, bump version, and push (pick one)
npm run release:patch   # 3.1.1 → 3.1.2 (bug fixes)
npm run release:minor   # 3.1.1 → 3.2.0 (new features)
npm run release:major   # 3.1.1 → 4.0.0 (breaking changes)

# 4. Publish to npm
npm publish
```

That's it. The `release:*` scripts handle: build → version bump → git push → push tags.

**Note:** The package may have `"private": true` in package.json during development. Remove this line before publishing to npm.

---

## Prerequisites

1. **npm account**: Create one at [npmjs.com](https://www.npmjs.com/signup) if you don't have one
2. **Organization access**: Ensure you have publish rights to the `@astuteo` organization on npm
3. **Git repository**: Push your code to GitHub first
4. **npm CLI**: Ensure npm is installed and up to date

## Pre-publication Checklist

Before publishing, verify:

- [ ] All tests pass (if you add tests later)
- [ ] Version number in `package.json` is correct
- [ ] `CHANGELOG.md` is updated with changes
- [ ] `README.md` is complete and accurate
- [ ] TypeScript types (`index.d.ts`) are correct
- [ ] All files are committed to git
- [ ] You've created a git tag for the version

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

### 2. Verify Package Contents

See what will be published:

```bash
npm pack --dry-run
```

This shows you exactly which files will be included in the package. The output should include:
- `index.js`
- `index.d.ts`
- `breakout-grid-visualizer.js`
- `craft-integration.twig`
- `README.md`
- `LICENSE`
- `package.json`

And should **NOT** include:
- `demo.html`
- `.git/` directory
- `node_modules/`

### 3. Test the Package Locally

Create a tarball and test it in another project:

```bash
npm pack
```

This creates a `.tgz` file. In a test project:

```bash
npm install /path/to/astuteo-tailwind-breakout-grid-1.0.0.tgz
```

Test that the plugin works as expected.

### 4. Create a Git Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 5. Publish to npm

For the first publish:

```bash
npm publish --access public
```

> **Note**: The `--access public` flag is required for scoped packages (@astuteo/...) on the first publish.

For subsequent publishes:

```bash
npm publish
```

### 6. Verify Publication

Check that your package is live:

```bash
npm view @astuteo/tailwind-breakout-grid
```

Or visit: https://www.npmjs.com/package/@astuteo/tailwind-breakout-grid

## Version Updates

When releasing a new version:

1. **Update the version**:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **Update CHANGELOG.md** with new changes

3. **Commit the changes**:
   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git push
   ```

4. **Push the tag** (created automatically by `npm version`):
   ```bash
   git push --tags
   ```

5. **Publish**:
   ```bash
   npm publish
   ```

## Semantic Versioning Guide

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
  - Removing utility classes
  - Changing default configuration values
  - Requiring new peer dependencies

- **MINOR** (1.0.0 -> 1.1.0): New features (backwards compatible)
  - Adding new utility classes
  - Adding new configuration options
  - New features that don't break existing usage

- **PATCH** (1.0.0 -> 1.0.1): Bug fixes
  - Fixing CSS output bugs
  - Documentation updates
  - Performance improvements

## Troubleshooting

### "You do not have permission to publish"

Solution: Ensure you're logged in with the correct npm account and have access to the `@astuteo` organization:

```bash
npm whoami
npm org ls @astuteo
```

### "Package name already exists"

Solution: The package name is already taken. Choose a different name or contact the owner.

### "Version already published"

Solution: You need to bump the version number:

```bash
npm version patch
```

## Unpublishing (Emergency Only)

If you need to unpublish a version within 72 hours of publishing:

```bash
npm unpublish @astuteo/tailwind-breakout-grid@1.0.0
```

> **Warning**: Unpublishing is permanent and can break projects depending on that version. Only use in emergencies.

## Best Practices

1. **Test before publishing**: Always test locally first
2. **Document changes**: Keep CHANGELOG.md up to date
3. **Use tags**: Tag releases in git for traceability
4. **Semantic versioning**: Follow semver strictly
5. **Deprecate, don't unpublish**: If you need to retire a version, deprecate it:
   ```bash
   npm deprecate @astuteo/tailwind-breakout-grid@1.0.0 "Please upgrade to 1.0.1"
   ```

## Support

- npm documentation: https://docs.npmjs.com/
- npm support: https://www.npmjs.com/support
- Semantic Versioning: https://semver.org/
