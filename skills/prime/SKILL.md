---
name: prime
description: >
  Inicjalizacja sesji. Agent czyta kontekst projektu, podsumowuje stan,
  potwierdza gotowość do pracy. Uruchom na start każdej sesji.
  Prime, start sesji, inicjalizacja, orientacja.
  NIE do szybkiego statusu w trakcie dnia — skill status.
type: command
pricing: free
completeness: full
verified: true
aios: true
hosts: claude, cursor
install:
  claude: .claude/commands/prime.md
  cursor: .cursor/skills/prime/SKILL.md
---

# Prime

> Zainicjalizuj sesję z pełnym kontekstem projektu.

## Instalacja

Skopiuj ten plik:

- Claude Code: `.claude/commands/prime.md` — wywołuj `/prime`
- Cursor: `.cursor/skills/prime/SKILL.md` — na start sesji napisz „prime” albo @ skill

Albo: `./scripts/install-skills.sh --host both --target /ścieżka/projektu`

Po instalacji uruchamiaj na start każdej sesji.

---

## Komenda

```markdown
Zainicjalizuj tę sesję z kontekstem projektu. Przeczytaj pliki w tej kolejności:

1. `AGENTS.md` albo `CLAUDE.md` — struktura workspace, komendy, skille (pierwszy który istnieje)
2. `SESSION-STATE.md` — co było ostatnio (jeśli istnieje)
3. `CHANGELOG.md` — ostatnie zmiany (jeśli istnieje)
4. `README.md` — opis projektu (jeśli powyższe nie istnieją)

Czytaj tylko pliki które istnieją. Nie twórz brakujących.

## Podsumowanie

Po przeczytaniu podaj:

1. **Projekt** — co to jest, krótki opis
2. **Ostatnia sesja** — co zrobiono ostatnio (z SESSION-STATE.md)
3. **Aktualny stan** — kluczowe informacje z przeczytanych plików
4. **Następne kroki** — co zrobić teraz (z SESSION-STATE.md lub własna ocena)
5. **Gotowość** — potwierdź że jesteś zorientowany i gotowy do pracy

Bądź zwięzły. Chodzi o orientację, nie raport.
```

---

## Co robi

- Czyta kluczowe pliki projektu na start sesji
- Podsumowuje co było ostatnio (z SESSION-STATE.md)
- Potwierdza gotowość do pracy z pełnym kontekstem
- Nie tworzy żadnych plików — tylko czyta i raportuje

## Dlaczego to ważne

Każda sesja z agentem zaczyna się od zera — nie wie co robiliście wcześniej. Prime daje orientację w kilkanaście sekund zamiast tłumaczenia od nowa.

## Para idealna

Używaj razem z `/end-session`:
1. Na koniec sesji: `/end-session` — zapisuje stan
2. Na start następnej: `/prime` — czyta stan i kontynuuje

---

*Skill z [AIOS Skills](https://github.com/Ban-Enterprises/aios-skills) — [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl)*
