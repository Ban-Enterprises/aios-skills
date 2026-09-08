# ADR 0001: oddziel Agent Skill od katalogu AIOS

Status: accepted · 2026-09-08

## Kontekst

AIOS potrzebuje danych handlowych i operacyjnych (`pricing`, `verified`,
`completeness`, warstwa AIOS, ścieżki hostów). Agent Skills wymaga tylko
`name` i `description`, a opcjonalnie definiuje `license`, `compatibility`,
`metadata` i eksperymentalne `allowed-tools`.

Wpisanie całego modelu AIOS do frontmatteru `SKILL.md` tworzy własny dialekt.
Oficjalny `skills-ref` odrzuca nieznane top-level fields, a przenośność między
Claude, Cursor, Codex i Grok staje się pozorna.

## Decyzja

- `skills/<name>/` jest czystą, przenośną paczką Agent Skills.
- `catalog.yaml` jest manifestem produktu AIOS.
- `install_targets` w katalogu są adapterami hostów.
- `scripts/check-skills.py` waliduje obie warstwy osobno.
- `metadata` w `SKILL.md` zawiera tylko stringowe dane, które mogą podróżować
  razem ze skillem (autor, wersja).

## Konsekwencje

- Pojedynczy skill można skopiować bez całego repo i bez wiedzy o AIOS.
- Zmiana ceny, statusu QA albo ścieżki hosta nie zmienia instrukcji agenta.
- Publikacja marketplace/plugin może generować manifest z `catalog.yaml`.
- README powiela wybrane pola katalogu, więc checker pilnuje ich spójności.
- Command-like to klasyfikacja dystrybucji, nie część otwartego standardu.

## Odrzucona alternatywa

Własny obowiązkowy frontmatter (`type`, `pricing`, `completeness`, `verified`,
`aios`, `hosts`, `install`) w każdym skillu. Jest wygodny dla katalogu, ale
niezgodny z oficjalnym walidatorem i wiąże przenośną procedurę z produktem.
