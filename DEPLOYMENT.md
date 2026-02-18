# Simple GitHub Pages Deployment Guide
## Deploy to github.com/PyAIM/ExpLogAdventures

This guide shows you how to deploy directly to GitHub Pages without GitHub Actions - just build locally and push.

---

## Method 1: Deploy from /docs folder (Recommended - Simplest)

This method keeps your source code and built files in the same branch.

### Step 1: Build the Project

```bash
# Navigate to your project
cd ExpLogAdventures-v3.1-final

# Install dependencies
pnpm install

# Build for production (outputs to dist/public)
pnpm run build

# Copy build output to docs folder
rm -rf docs
cp -r dist/public docs
```

### Step 2: Create Repository and Push

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Exponential & Logarithmic Adventures"

# Create repository on GitHub (via website or gh CLI)
# Then connect and push:
git remote add origin https://github.com/PyAIM/ExpLogAdventures.git
git branch -M main
git push -u origin main
```

### Step 3: Configure GitHub Pages

1. Go to: https://github.com/PyAIM/ExpLogAdventures/settings/pages
2. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/docs**
3. Click **Save**

Your site will be live at: **https://pyaim.github.io/ExpLogAdventures/**

### To Update:

```bash
# Make changes, then rebuild
pnpm run build
rm -rf docs
cp -r dist/public docs

# Commit and push
git add .
git commit -m "Update site"
git push
```

---

## Method 2: Deploy from gh-pages branch

This method keeps built files separate from source code.

### Step 1: Build and Create gh-pages Branch

```bash
# Build the project
cd ExpLogAdventures-v3.1-final
pnpm install
pnpm run build

# Create gh-pages branch with only the built files
cd dist/public
git init
git add .
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/PyAIM/ExpLogAdventures.git
git push -f origin gh-pages
```

### Step 2: Configure GitHub Pages

1. Go to: https://github.com/PyAIM/ExpLogAdventures/settings/pages
2. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**
3. Click **Save**

### To Update:

```bash
# In your project root
pnpm run build
cd dist/public
git add .
git commit -m "Update deployment"
git push -f origin gh-pages
```

---

## Troubleshooting

### Issue: Blank page or 404 errors

**Check the base path** in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/ExpLogAdventures/',  // Must match your repo name
  // ...
});
```

Then rebuild:
```bash
pnpm run build
```

### Issue: Assets not loading

Make sure all image URLs are using the CDN URLs (already configured in the clean package).

### Issue: Routing not working

The `404.html` file handles client-side routing. Make sure it's in the deployed folder.

---

## Quick Reference

```bash
# Full deployment from scratch
cd ExpLogAdventures-v3.1-final
pnpm install
pnpm run build
rm -rf docs && cp -r dist/public docs
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/PyAIM/ExpLogAdventures.git
git branch -M main && git push -u origin main

# Then configure Pages in GitHub settings to use main branch /docs folder
```

---

## Notes

- Build time: ~30 seconds
- Deployment time: ~1-2 minutes after push
- No GitHub Actions needed
- Works with free GitHub accounts
- Can use custom domain (add CNAME file to docs folder)
