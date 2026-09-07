#!/usr/bin/env python3
"""Waliduje kontrakt frontmatteru wszystkich skills/*/SKILL.md."""
from __future__ import annotations

import py_compile
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
README = ROOT / "README.md"

REQUIRED = (
    "name",
    "description",
    "type",
    "pricing",
    "completeness",
    "verified",
    "aios",
    "hosts",
)
NIE_RE = re.compile(r"\bNIE do\b|\bnie do\b|\bNIE instaluj\b|\bNIE zastępuje\b", re.I)


def parse_frontmatter(text: str) -> dict[str, str]:
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        raise ValueError("brak frontmatteru ---")
    raw = m.group(1)
    data: dict[str, str] = {}
    key: str | None = None
    acc: list[str] = []
    install: dict[str, str] = {}
    in_install = False

    def flush() -> None:
        if key is not None:
            data[key] = " ".join(acc).strip().strip('"')

    for line in raw.splitlines():
        if line == "install:":
            flush()
            key = None
            acc = []
            in_install = True
            continue
        if in_install:
            sm = re.match(r"^  (claude|cursor):\s*(.+)$", line)
            if sm:
                install[sm.group(1)] = sm.group(2).strip()
                continue
            in_install = False
        kv = re.match(r"^([a-z_]+):\s*(.*)$", line)
        if kv and not line.startswith(" "):
            flush()
            key, val = kv.group(1), kv.group(2)
            if val in (">", "|", ">-"):
                acc = []
            else:
                acc = [val]
            continue
        if key is not None:
            acc.append(line.strip())
    flush()
    if install:
        data["install.claude"] = install.get("claude", "")
        data["install.cursor"] = install.get("cursor", "")
    data["_description"] = data.get("description", "")
    return data


def main() -> int:
    errors: list[str] = []
    names: list[str] = []
    readme = README.read_text(encoding="utf-8")

    for path in sorted(SKILLS.glob("*/SKILL.md")):
        name = path.parent.name
        names.append(name)
        text = path.read_text(encoding="utf-8")
        try:
            fm = parse_frontmatter(text)
        except ValueError as e:
            errors.append(f"{name}: {e}")
            continue

        if fm.get("name") != name:
            errors.append(f"{name}: name={fm.get('name')!r} != katalog")

        for k in REQUIRED:
            if not fm.get(k):
                errors.append(f"{name}: brak pola {k}")

        if fm.get("type") not in ("skill", "command"):
            errors.append(f"{name}: type musi być skill|command")
        if fm.get("pricing") not in ("free", "premium"):
            errors.append(f"{name}: pricing musi być free|premium")
        if fm.get("completeness") not in ("full", "stub"):
            errors.append(f"{name}: completeness musi być full|stub")
        if fm.get("verified") not in ("true", "false"):
            errors.append(f"{name}: verified musi być true|false")
        if fm.get("completeness") == "stub" and fm.get("verified") == "true":
            errors.append(f"{name}: stub nie może mieć verified: true")
        if fm.get("completeness") == "stub" and "poza" not in fm.get("_description", "").lower():
            errors.append(f"{name}: stub description musi mówić że pełna procedura jest poza repo")
        if not NIE_RE.search(fm.get("_description", "")):
            errors.append(f"{name}: description bez anty-triggera (NIE do …)")
        if "claude" not in fm.get("hosts", ""):
            errors.append(f"{name}: hosts musi zawierać claude")
        if "cursor" not in fm.get("hosts", ""):
            errors.append(f"{name}: hosts musi zawierać cursor")
        if not fm.get("install.claude", "").startswith(".claude/"):
            errors.append(f"{name}: install.claude musi zaczynać się od .claude/")
        if not fm.get("install.cursor", "").startswith(".cursor/skills/"):
            errors.append(f"{name}: install.cursor musi zaczynać się od .cursor/skills/")
        if f"skills/{name}/" not in readme:
            errors.append(f"{name}: brak wpisu w README.md")

    for py in sorted(SKILLS.glob("*/scripts/**/*.py")):
        try:
            py_compile.compile(str(py), doraise=True)
        except py_compile.PyCompileError as e:
            errors.append(f"{py.relative_to(ROOT)}: {e.msg}")

    if errors:
        print("check-skills: FAIL")
        for e in errors:
            print(f"  - {e}")
        return 1
    print(f"check-skills: OK ({len(names)} skilli)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
