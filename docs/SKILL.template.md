---
name: example
description: >
  Jedno zdanie co robi. Triggery (słowa użytkownika).
  NIE do X — od tego jest skill Y.
type: skill
pricing: free
completeness: full
verified: false
aios: true
hosts: claude, cursor
install:
  claude: .claude/skills/example/SKILL.md
  cursor: .cursor/skills/example/SKILL.md
---

# Tytuł

Jedno zdanie celu.

## Kiedy nie

- Nie do X — skill `y`.

## Setup

Adapter: CLI / env / skrypt. Brak twardej ścieżki jednego hosta.

## Procedura

Kroki albo tabela metod.

## Fallback

Co zrobić przy braku klucza, 401, 429. Albo: brak fallbacku, przerwij i powiedz dlaczego.
