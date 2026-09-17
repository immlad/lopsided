#!/usr/bin/env bash
# Builds the app and collects a static, GitHub Pages ready site into ./dist
set -euo pipefail

bun run build

OUT=""
for dir in .output/public dist/client build/client; do
  if [ -d "$dir" ]; then OUT="$dir"; break; fi
done

if [ -z "$OUT" ]; then
  echo "No static build output found" >&2
  exit 1
fi

echo "Collecting static output from $OUT"
TMP="$(mktemp -d)"
cp -r "$OUT"/. "$TMP"/
rm -rf dist
mkdir -p dist
cp -r "$TMP"/. dist/
rm -rf "$TMP"

# SPA fallback so deep links work on GitHub Pages
if [ -f dist/index.html ]; then cp dist/index.html dist/404.html; fi
touch dist/.nojekyll

echo "dist/ is ready for GitHub Pages"
