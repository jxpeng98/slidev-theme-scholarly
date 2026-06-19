#!/usr/bin/env bash
set -euo pipefail

# Bump the theme version and sync release-train package versions.
#
# Usage:
#   ./scripts/bump-version.sh <patch|minor|major|new-version>
#   ./scripts/bump-version.sh <new-prerelease> --vscode-prerelease-version <x.y.z>
#
# Examples:
#   ./scripts/bump-version.sh patch           # 1.0.3 → 1.0.4
#   ./scripts/bump-version.sh minor           # 1.0.3 → 1.1.0
#   ./scripts/bump-version.sh major           # 1.0.3 → 2.0.0
#   ./scripts/bump-version.sh 2.0.0-beta.1    # → 2.0.0-beta.1
#   ./scripts/bump-version.sh 1.1.0-rc.2      # → 1.1.0-rc.2
#
# Notes:
#   - Stable theme releases sync the same x.y.z version into the VS Code extension.
#   - Theme prereleases cannot be copied directly to the VS Code extension because
#     Marketplace versions must be plain x.y.z. Pass --vscode-prerelease-version
#     when preparing a Marketplace prerelease build.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INPUT="${1:-}"
VSCODE_PRERELEASE_VERSION=""

if [[ "$#" -gt 0 ]]; then
  shift
fi

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --vscode-prerelease-version)
      VSCODE_PRERELEASE_VERSION="${2:-}"
      if [[ -z "$VSCODE_PRERELEASE_VERSION" ]]; then
        echo "Error: --vscode-prerelease-version requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    *)
      echo "Error: unknown option: $1" >&2
      exit 2
      ;;
  esac
done

if [[ -z "$INPUT" ]]; then
  echo "Usage: $0 <patch|minor|major|new-version> [--vscode-prerelease-version x.y.z]"
  echo ""
  echo "  Semver keywords:"
  echo "    patch           1.0.3 → 1.0.4"
  echo "    minor           1.0.3 → 1.1.0"
  echo "    major           1.0.3 → 2.0.0"
  echo ""
  echo "  Explicit version:"
  echo "    2.0.0-beta.1    → 2.0.0-beta.1"
  echo "    1.1.0-rc.2      → 1.1.0-rc.2"
  echo ""
  echo "  VS Code prerelease mapping:"
  echo "    1.4.0-beta.1 --vscode-prerelease-version 1.3.3"
  exit 2
fi

# --- Read current version from root package.json ---
ROOT_PKG="${ROOT_DIR}/package.json"
CURRENT_VERSION=$(node -p "require('${ROOT_PKG}').version")
echo "[bump-version] Current version: ${CURRENT_VERSION}"

# --- Resolve new version ---
resolve_semver() {
  local current="$1"
  local bump_type="$2"

  # Strip any pre-release suffix (e.g. 1.0.0-beta.1 → 1.0.0)
  local base="${current%%-*}"

  IFS='.' read -r major minor patch <<< "$base"

  case "$bump_type" in
    patch) echo "${major}.${minor}.$((patch + 1))" ;;
    minor) echo "${major}.$((minor + 1)).0" ;;
    major) echo "$((major + 1)).0.0" ;;
    *) echo "" ;;
  esac
}

case "$INPUT" in
  patch|minor|major)
    NEW_VERSION=$(resolve_semver "$CURRENT_VERSION" "$INPUT")
    if [[ -z "$NEW_VERSION" ]]; then
      echo "Error: failed to compute new version" >&2
      exit 1
    fi
    echo "[bump-version] Bumping ${INPUT}: ${CURRENT_VERSION} → ${NEW_VERSION}"
    ;;
  *)
    NEW_VERSION="$INPUT"
    echo "[bump-version] Setting explicit version: ${CURRENT_VERSION} → ${NEW_VERSION}"
    ;;
esac

OLD_ROOT_VERSION=$(node -p "require('${ROOT_PKG}').version")
node -e "
  const fs = require('fs');
  const content = fs.readFileSync('${ROOT_PKG}', 'utf8');
  const pkg = JSON.parse(content);
  pkg.version = '${NEW_VERSION}';
  const match = content.match(/^([ \\t]+)\\\"/m);
  const indent = match ? match[1].length : 2;
  fs.writeFileSync('${ROOT_PKG}', JSON.stringify(pkg, null, indent) + '\\n');
"
echo "  ✓  package.json: ${OLD_ROOT_VERSION} → ${NEW_VERSION}"

SYNC_ARGS=()
if [[ -n "$VSCODE_PRERELEASE_VERSION" ]]; then
  SYNC_ARGS+=(--vscode-prerelease-version "$VSCODE_PRERELEASE_VERSION")
fi

node "${ROOT_DIR}/scripts/sync-version.mjs" "${SYNC_ARGS[@]}"

echo ""
echo "[bump-version] Updated to ${NEW_VERSION}"
echo ""
echo "Next steps:"
if [[ "$NEW_VERSION" == *-* && -z "$VSCODE_PRERELEASE_VERSION" ]]; then
  echo "  Optional VS Code prerelease mapping:"
  echo "    pnpm version:sync -- --vscode-prerelease-version <x.y.z>"
fi
echo "  git add package.json docs/package.json vscode-extension/package.json"
echo "  git commit -m 'chore: bump version to ${NEW_VERSION}'"
echo "  git tag v${NEW_VERSION}"
echo "  git push origin main --tags"
