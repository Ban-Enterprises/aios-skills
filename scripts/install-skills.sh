#!/usr/bin/env bash
# Instaluje skille z tego repo do projektu-docelu (Claude Code i/lub Cursor).
#   ./scripts/install-skills.sh --host both --target /ścieżka/projektu
#   ./scripts/install-skills.sh --host cursor --only prime,status,end-session
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
host="both"
target=""
only=""

while [ $# -gt 0 ]; do
  case "$1" in
    --host) host="${2:?}"; shift 2 ;;
    --target) target="${2:?}"; shift 2 ;;
    --only) only="${2:?}"; shift 2 ;;
    -h|--help)
      sed -n '2,5p' "$0"
      exit 0
      ;;
    *) echo "Nieznany argument: $1" >&2; exit 1 ;;
  esac
done

if [ -z "$target" ]; then
  echo "Podaj --target /ścieżka/projektu" >&2
  exit 1
fi
if [ ! -d "$target" ]; then
  echo "Brak katalogu: $target" >&2
  exit 1
fi
case "$host" in
  claude|cursor|both) ;;
  *) echo "--host: claude | cursor | both" >&2; exit 1 ;;
esac

want() {
  local name="$1"
  if [ -z "$only" ]; then return 0; fi
  echo ",$only," | grep -q ",$name,"
}

copy_tree() {
  local src="$1" dest="$2"
  mkdir -p "$(dirname "$dest")"
  if [ -d "$src" ]; then
    rm -rf "$dest"
    cp -R "$src" "$dest"
  fi
}

installed=0
for skill_dir in "$here/skills"/*/; do
  [ -f "$skill_dir/SKILL.md" ] || continue
  name="$(basename "$skill_dir")"
  want "$name" || continue

  claude_path=""
  cursor_path=""
  in_install=0
  while IFS= read -r line; do
    [ "$line" = "---" ] && [ "$in_install" -eq 0 ] && continue
    if [ "$line" = "install:" ]; then in_install=1; continue; fi
    if [ "$in_install" -eq 1 ]; then
      case "$line" in
        "  claude:"*) claude_path="${line#*: }"; claude_path="${claude_path#"${claude_path%%[![:space:]]*}"}" ;;
        "  cursor:"*) cursor_path="${line#*: }"; cursor_path="${cursor_path#"${cursor_path%%[![:space:]]*}"}" ;;
        [a-z]*) break ;;
        ---) break ;;
      esac
    fi
  done < "$skill_dir/SKILL.md"

  if [ "$host" = "claude" ] || [ "$host" = "both" ]; then
    if [ -z "$claude_path" ]; then
      echo "Brak install.claude w $name" >&2
      exit 1
    fi
    dest="$target/$claude_path"
    mkdir -p "$(dirname "$dest")"
    cp "$skill_dir/SKILL.md" "$dest"
    skill_root="$(dirname "$dest")"
    # Przy .claude/skills/<id>/SKILL.md kopiuj references + scripts obok
    if [ "$(basename "$dest")" = "SKILL.md" ]; then
      copy_tree "$skill_dir/references" "$skill_root/references"
      copy_tree "$skill_dir/scripts" "$skill_root/scripts"
    fi
  fi

  if [ "$host" = "cursor" ] || [ "$host" = "both" ]; then
    if [ -z "$cursor_path" ]; then
      echo "Brak install.cursor w $name" >&2
      exit 1
    fi
    dest="$target/$cursor_path"
    mkdir -p "$(dirname "$dest")"
    cp "$skill_dir/SKILL.md" "$dest"
    skill_root="$(dirname "$dest")"
    copy_tree "$skill_dir/references" "$skill_root/references"
    copy_tree "$skill_dir/scripts" "$skill_root/scripts"
  fi

  echo "OK $name"
  installed=$((installed + 1))
done

echo "Zainstalowano $installed skilli → $target ($host)"
