# Kontrakt skilla

AIOS używa dwóch warstw:

1. `skills/<id>/SKILL.md` — przenośny [Agent Skills standard](https://agentskills.io/specification).
2. `catalog.yaml` — produkt, lifecycle, klasyfikacja AIOS i adaptery instalacji.

Skill opisuje **zamiar i procedurę**. Host (Claude Code, Cursor, Codex, Grok) i dane handlowe nie należą do jego przenośnego kontraktu.

## Warstwy

| Warstwa | Żyje w | Przykłady |
|---------|--------|-----------|
| Przenośny skill | `SKILL.md`, `scripts/`, `references/`, `assets/` | routing, kroki, kod deterministyczny |
| Katalog AIOS | `catalog.yaml` | pricing, completeness, verified, warstwa AIOS |
| Adapter hosta | `catalog.yaml: install_targets` + instalator | `.agents`, `.claude`, `.cursor`, `.codex`, `.grok` |

## Standardowy frontmatter

Wymagane są wyłącznie `name` i `description`. AIOS dodaje standardowe pola opcjonalne, gdy mają sens:

```yaml
---
name: example
description: Co robi i kiedy agent powinien go użyć.
license: MIT
compatibility: Requires Python 3.10+ and internet access.
metadata:
  author: BAN ENTERPRISES
  version: "1.0.0"
---
```

Dozwolone top-level fields:

- `name`, `description` — wymagane przez standard,
- `license`, `compatibility`, `metadata` — opcjonalne,
- `allowed-tools` — eksperymentalne; używaj tylko przy realnym wsparciu hostów.

Nie wkładaj do `SKILL.md`: `type`, `pricing`, `completeness`, `verified`, `aios`, `hosts`, `install`. Te pola są w `catalog.yaml`.

`metadata` jest mapą `string → string`. Nie chowaj w niej złożonego manifestu produktu.

## Ciało SKILL.md

Kolejność sekcji:

1. Jednozdaniowy cel.
2. **Kiedy nie** — gdy istnieje sąsiedni, łatwy do pomylenia skill.
3. Wymagane wejścia i dostęp.
4. Procedura albo tabela metod.
5. Jak zweryfikować wynik.
6. Granice approval dla działań zewnętrznych.
7. Oczekiwany format wyjścia.
8. Fallback przy 401 / 429 / braku narzędzia.

Detale endpointów i przykłady idą do `references/`, nie puchnij SKILL.md.

## Progressive disclosure

- Startup: host widzi `name` + `description`.
- Aktywacja: host czyta pełny `SKILL.md` (cel: poniżej 500 linii).
- Wykonanie: czyta `references/` lub uruchamia `scripts/` dopiero, gdy trzeba.

## Katalog AIOS

`catalog.yaml` jest źródłem prawdy dla:

- `type`: `skill` lub command-like,
- `pricing`: `free` / `premium`,
- `completeness`: `full` / `stub`,
- `verified`,
- `aios` i `aios_layer`,
- ścieżek instalacyjnych hostów.

Stub premium może istnieć, ale `description` musi jasno powiedzieć, że pełna procedura jest poza repo. Stub nie może być `verified: true`.

## Walidacja

```bash
python3 -m pip install -r requirements-dev.txt
python3 scripts/check-skills.py
```

Checker używa oficjalnej biblioteki `skills-ref` do walidacji `SKILL.md`, a osobno sprawdza `catalog.yaml`.
