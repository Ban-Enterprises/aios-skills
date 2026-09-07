# Kontrakt skilla

Skill opisuje **zamiar i kontrakt**. Host (Claude Code, Cursor, Codex) i vendor (CLI, HTTP, MCP) to adaptery.

Każdy katalog `skills/<id>/` spełnia ten plik zanim trafi do tabeli w README.

## Warstwy

| Warstwa | Żyje w | Zmienia się |
|---------|--------|-------------|
| Kontrakt | frontmatter + pierwsze 40 linii SKILL.md | rzadko (major) |
| Procedura | reszta SKILL.md, `references/` | gdy zmienia się sposób pracy |
| Adapter | `scripts/`, komendy CLI, MCP | gdy zmienia się vendor albo host |

Ciało procedury nie zawiera twardej ścieżki jednego hosta (`.claude/commands/...` tylko w frontmatter `install`).

## Frontmatter

Wymagane pola — egzekwuje `scripts/check-skills.py`:

```yaml
---
name: example                 # = nazwa katalogu
description: >                # router agenta: triggery + NIE do czego
  ...
type: skill                   # skill = auto | command = wywołanie z nazwy
pricing: free                 # free | premium
completeness: full            # full = SOP w tym repo | stub = opis + routing
verified: false               # true tylko gdy SOP z tego repo da się wykonać
aios: true
hosts: claude, cursor
install:
  claude: .claude/skills/example/SKILL.md
  cursor: .cursor/skills/example/SKILL.md
---
```

Dla `type: command` ścieżka Claude to `.claude/commands/<name>.md`.

`description` musi zawierać frazę `NIE do` albo `nie do` — inaczej check padnie. To jedyny sygnał routingu, który agent widzi przed otwarciem pliku.

`completeness: stub` wymaga w description informacji, że pełna procedura jest poza tym repo. Agent nie ma udawać, że ma 7 etapów.

`verified: true` tylko przy `completeness: full`.

## Ciało SKILL.md

Kolejność sekcji:

1. Jednozdaniowy cel
2. **Kiedy nie** — konkretne skille-sąsiedzi, nie ogólniki
3. Setup / adapter (CLI, env, skrypt)
4. Procedura albo tabela metod
5. Fallback przy 401 / 429 / braku narzędzia (albo jawne „brak fallbacku”)
6. Gotchas (krótko)

Detale endpointów i przykłady idą do `references/`, nie puchnij SKILL.md.

## Typy

| type | Zachowanie |
|------|------------|
| `skill` | Agent czyta, gdy description zmatchuje intent |
| `command` | Ta sama treść, plus slash / nazwa (`/prime`). Na Cursorze i tak ląduje jako skill |

## Premium

Wolno trzymać stub w otwartym katalogu. Nie wolno w description obiecywać kroków, których nie ma w pliku. Szablon form integracji (`new-capability`) może być skrócony; pełny generator może zostać za paywallem.
