#!/usr/bin/env python3
"""Validate the open Agent Skills layer and the separate AIOS catalog."""
from __future__ import annotations

import py_compile
import re
import sys
from pathlib import Path

try:
    import yaml
    from skills_ref.validator import validate as validate_agent_skill
except ImportError:
    raise SystemExit(
        "Brak zależności developerskich. Uruchom: "
        "python3 -m pip install -r requirements-dev.txt"
    )


ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
CATALOG_PATH = ROOT / "catalog.yaml"
README_PATH = ROOT / "README.md"

CATALOG_FIELDS = {
    "type",
    "category",
    "pricing",
    "completeness",
    "verified",
    "aios",
    "aios_layer",
}
TYPES = {"skill", "command"}
PRICING = {"free", "premium"}
COMPLETENESS = {"full", "stub"}
AIOS_LAYERS = {"context", "data", "intelligence", "automate", "build"}
REQUIRED_TARGETS = {"portable", "claude", "cursor", "codex", "grok"}


def load_yaml(path: Path) -> dict:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path.name}: dokument musi być mapą YAML")
    return data


def read_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not match:
        return {}
    data = yaml.safe_load(match.group(1))
    return data if isinstance(data, dict) else {}


def check_catalog(catalog: dict, errors: list[str]) -> dict[str, dict]:
    if catalog.get("schema_version") != "1":
        errors.append("catalog.yaml: schema_version musi być stringiem \"1\"")

    skills = catalog.get("skills")
    if not isinstance(skills, dict):
        errors.append("catalog.yaml: skills musi być mapą")
        return {}

    targets = catalog.get("install_targets")
    if not isinstance(targets, dict):
        errors.append("catalog.yaml: install_targets musi być mapą")
    else:
        missing_targets = REQUIRED_TARGETS - set(targets)
        if missing_targets:
            errors.append(
                f"catalog.yaml: brak install_targets: {', '.join(sorted(missing_targets))}"
            )
        for host, mapping in targets.items():
            if not isinstance(mapping, dict) or set(mapping) != TYPES:
                errors.append(
                    f"catalog.yaml: target {host} wymaga ścieżek skill i command"
                )
                continue
            for kind, pattern in mapping.items():
                if not isinstance(pattern, str) or "{name}" not in pattern:
                    errors.append(
                        f"catalog.yaml: target {host}.{kind} wymaga placeholdera {{name}}"
                    )

    for name, entry in skills.items():
        if not isinstance(entry, dict):
            errors.append(f"catalog.yaml: {name} musi być mapą")
            continue
        missing = CATALOG_FIELDS - set(entry)
        extra = set(entry) - CATALOG_FIELDS
        if missing:
            errors.append(f"catalog.yaml: {name} brak: {', '.join(sorted(missing))}")
        if extra:
            errors.append(f"catalog.yaml: {name} nieznane pola: {', '.join(sorted(extra))}")
        if entry.get("type") not in TYPES:
            errors.append(f"catalog.yaml: {name}.type musi być skill|command")
        if entry.get("pricing") not in PRICING:
            errors.append(f"catalog.yaml: {name}.pricing musi być free|premium")
        if entry.get("completeness") not in COMPLETENESS:
            errors.append(f"catalog.yaml: {name}.completeness musi być full|stub")
        if not isinstance(entry.get("verified"), bool):
            errors.append(f"catalog.yaml: {name}.verified musi być boolean")
        if not isinstance(entry.get("aios"), bool):
            errors.append(f"catalog.yaml: {name}.aios musi być boolean")
        if entry.get("aios_layer") not in AIOS_LAYERS:
            errors.append(f"catalog.yaml: {name}.aios_layer spoza pięciu warstw AIOS")
        if entry.get("completeness") == "stub" and entry.get("verified") is True:
            errors.append(f"catalog.yaml: {name} stub nie może być verified")
    return skills


def main() -> int:
    errors: list[str] = []
    try:
        catalog = load_yaml(CATALOG_PATH)
    except (OSError, ValueError, yaml.YAMLError) as exc:
        print(f"check-skills: FAIL\n  - {exc}")
        return 1

    catalog_skills = check_catalog(catalog, errors)
    disk_skills = {path.parent.name: path.parent for path in SKILLS_DIR.glob("*/SKILL.md")}

    missing_on_disk = set(catalog_skills) - set(disk_skills)
    missing_in_catalog = set(disk_skills) - set(catalog_skills)
    if missing_on_disk:
        errors.append(f"catalog bez katalogu skilla: {', '.join(sorted(missing_on_disk))}")
    if missing_in_catalog:
        errors.append(f"skill bez wpisu w catalog.yaml: {', '.join(sorted(missing_in_catalog))}")

    readme = README_PATH.read_text(encoding="utf-8")
    for name, skill_dir in sorted(disk_skills.items()):
        for message in validate_agent_skill(skill_dir):
            errors.append(f"{name}: Agent Skills spec: {message}")

        frontmatter = read_frontmatter(skill_dir / "SKILL.md")
        metadata = frontmatter.get("metadata", {})
        if metadata and (
            not isinstance(metadata, dict)
            or any(not isinstance(key, str) or not isinstance(value, str) for key, value in metadata.items())
        ):
            errors.append(f"{name}: metadata musi być mapą string → string")

        if catalog_skills.get(name, {}).get("completeness") == "stub":
            description = str(frontmatter.get("description", "")).lower()
            if "poza" not in description:
                errors.append(f"{name}: stub description musi mówić, że pełna procedura jest poza repo")

        if f"skills/{name}/" not in readme:
            errors.append(f"{name}: brak wpisu w README.md")
        else:
            row = re.search(
                rf"^\| \[{re.escape(name)}\]\(skills/{re.escape(name)}/\)"
                r" \| ([^|]+) \| [^|]+ \| ([^|]+) \|$",
                readme,
                re.M,
            )
            if not row:
                errors.append(f"{name}: niepoprawny wiersz tabeli w README.md")
            else:
                entry = catalog_skills.get(name, {})
                expected_type = "Command" if entry.get("type") == "command" else "Skill"
                expected_status = (
                    "Darmowy"
                    if entry.get("pricing") == "free"
                    else "Premium (stub)"
                    if entry.get("completeness") == "stub"
                    else "Premium"
                )
                if row.group(1).strip() != expected_type:
                    errors.append(
                        f"{name}: README typ {row.group(1).strip()!r}, "
                        f"catalog {expected_type!r}"
                    )
                if row.group(2).strip() != expected_status:
                    errors.append(
                        f"{name}: README status {row.group(2).strip()!r}, "
                        f"catalog {expected_status!r}"
                    )

    for py in sorted(SKILLS_DIR.glob("*/scripts/**/*.py")):
        try:
            py_compile.compile(str(py), doraise=True)
        except py_compile.PyCompileError as exc:
            errors.append(f"{py.relative_to(ROOT)}: {exc.msg}")

    if errors:
        print("check-skills: FAIL")
        for error in errors:
            print(f"  - {error}")
        return 1

    print(
        "check-skills: OK "
        f"({len(disk_skills)} standardowych skilli, "
        f"{len(catalog_skills)} wpisów AIOS)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
