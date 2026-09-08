---
name: status
description: >
  Szybki status projektu. Czyta minimum plików, daje maksimum informacji.
  Priorytety, ostatnia sesja, następne kroki. Status, stan projektu, raport.
  NIE do pełnego bootstrapu sesji — skill prime. NIE do zapisu stanu — skill end-session.
license: MIT
metadata:
  author: BAN ENTERPRISES
  version: "1.0.0"
---

# Status

> Szybki przegląd stanu projektu. Minimum plików, maksimum informacji.

## Procedura

Pokaż szybki status projektu. Przeczytaj minimum plików, daj maksimum informacji.

## Protokół

### 1. Przeczytaj (tylko istniejące pliki)
- `SESSION-STATE.md` — co było ostatnio
- `CHANGELOG.md` — ostatnie zmiany (top 5 wpisów)
- `AGENTS.md` albo `CLAUDE.md` — priorytety (jeśli zawiera sekcję priorytetów)

### 2. Wypisz raport

STATUS PROJEKTU — [data]

OSTATNIA SESJA:
[z SESSION-STATE.md — co zrobiono + co niedokończone]

OSTATNIE ZMIANY:
[z CHANGELOG.md — 3-5 ostatnich wpisów]

NASTĘPNE KROKI:
[z SESSION-STATE.md — co zrobić teraz]

### 3. Nie ładuj nic więcej
Ten raport musi być szybki. Nie czytaj kodu, nie analizuj struktury. Czytaj tylko pliki wymienione powyżej.

---

## Co robi

- Czyta 2-3 pliki kontekstowe (SESSION-STATE, CHANGELOG, AGENTS.md lub CLAUDE.md)
- Wypisuje zwięzły raport stanu
- Nie modyfikuje żadnych plików
- Zajmuje 5-10 sekund

## Kiedy używać

- Wracasz do projektu po przerwie
- Chcesz szybko sprawdzić co jest w trakcie
- Zastanawiasz się od czego zacząć

---

*Skill z [AIOS Skills](https://github.com/Ban-Enterprises/aios-skills) — [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl)*
