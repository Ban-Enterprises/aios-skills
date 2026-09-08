#!/usr/bin/env bash
# Wygodny wrapper; właściwy, przenośny instalator jest w Pythonie.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "$here/install-skills.py" "$@"
