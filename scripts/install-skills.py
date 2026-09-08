#!/usr/bin/env python3
"""Install AIOS skills using host adapters declared in catalog.yaml."""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    raise SystemExit(
        "Brak PyYAML. Uruchom: python3 -m pip install -r requirements.txt"
    )


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "catalog.yaml"
SKILLS_DIR = ROOT / "skills"
ALIASES = {
    "both": ("claude", "cursor"),
    "all": ("portable", "claude", "cursor", "codex", "grok"),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Instaluje AIOS Skills do projektu docelowego."
    )
    parser.add_argument(
        "--host",
        default="portable",
        help="portable, claude, cursor, codex, grok, both lub all",
    )
    parser.add_argument("--target", required=True, type=Path)
    parser.add_argument(
        "--only",
        help="Lista nazw oddzielonych przecinkami, np. prime,status,end-session",
    )
    return parser.parse_args()


def load_catalog() -> dict:
    return yaml.safe_load(CATALOG_PATH.read_text(encoding="utf-8"))


def install_skill(source: Path, destination: Path) -> None:
    if destination.name == "SKILL.md":
        target_dir = destination.parent
        if target_dir.exists():
            shutil.rmtree(target_dir)
        shutil.copytree(source, target_dir)
        return

    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source / "SKILL.md", destination)


def main() -> int:
    args = parse_args()
    target = args.target.expanduser().resolve()
    if not target.is_dir():
        print(f"Brak katalogu: {target}", file=sys.stderr)
        return 1

    catalog = load_catalog()
    targets = catalog["install_targets"]
    hosts = ALIASES.get(args.host, (args.host,))
    unknown = [host for host in hosts if host not in targets]
    if unknown:
        allowed = ", ".join([*targets, *ALIASES])
        print(f"Nieznany host: {', '.join(unknown)}. Dostępne: {allowed}", file=sys.stderr)
        return 1

    selected = (
        {name.strip() for name in args.only.split(",") if name.strip()}
        if args.only
        else set(catalog["skills"])
    )
    missing = selected - set(catalog["skills"])
    if missing:
        print(f"Nieznane skille: {', '.join(sorted(missing))}", file=sys.stderr)
        return 1

    installed = 0
    for name, entry in sorted(catalog["skills"].items()):
        if name not in selected:
            continue
        source = SKILLS_DIR / name
        for host in hosts:
            pattern = targets[host][entry["type"]]
            destination = target / pattern.format(name=name)
            install_skill(source, destination)
        print(f"OK {name}")
        installed += 1

    print(f"Zainstalowano {installed} skilli → {target} ({', '.join(hosts)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
