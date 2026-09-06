#!/usr/bin/env bash
# Kopiuje canvas do katalogu, w którym Cursor go wykrywa:
#   ~/.cursor/projects/<workspace>/canvases/
# Użycie:
#   ./canvases/install.sh              # wykryj workspace z nazwy repo
#   ./canvases/install.sh <workspace>  # wskaż nazwę katalogu projektu
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src="$here/skills-walkthrough.canvas.tsx"
projects="$HOME/.cursor/projects"

if [ ! -f "$src" ]; then
  echo "Brak pliku: $src" >&2
  exit 1
fi

if [ $# -ge 1 ]; then
  workspace="$1"
else
  repo_root="$(git -C "$here" rev-parse --show-toplevel 2>/dev/null || dirname "$here")"
  workspace="$(basename "$repo_root")"
fi

target="$projects/$workspace/canvases"
mkdir -p "$target"
cp "$src" "$target/"
echo "Zainstalowano: $target/skills-walkthrough.canvas.tsx"

if [ -d "$projects" ]; then
  echo "Katalogi projektów w $projects:"
  ls -1 "$projects"
  echo "Jeśli powyższa nazwa workspace'u nie pasuje, uruchom ponownie z właściwą: ./canvases/install.sh <nazwa>"
fi
