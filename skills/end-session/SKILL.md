---
name: end-session
description: >
  Zapisuje stan sesji pracy na koniec rozmowy z Claude.
  Tworzy SESSION-STATE.md z podsumowaniem co zrobiono, co w trakcie, co dalej.
  Buduje ciągłość między sesjami. End session, zakończ sesję, koniec pracy.
type: command
install: .claude/commands/end-session.md
pricing: free
verified: true
aios: true
---

# End Session

> Zakończ sesję pracy i zapisz kontekst dla następnej sesji.

## Instalacja

Skopiuj sekcję **"Komenda"** poniżej do pliku `.claude/commands/end-session.md` w swoim projekcie.

Jeśli folder `.claude/commands/` nie istnieje — utwórz go.

Po instalacji wywołuj komendę wpisując `/end-session` w czacie z Claude.

---

## Komenda

```markdown
Zakończ sesję pracy i zapisz kontekst dla następnej sesji. Uruchom na koniec każdej sesji.

## Protokół końca sesji

### 1. Zapisz stan sesji

Utwórz lub zaktualizuj plik `SESSION-STATE.md` w katalogu głównym projektu.

Jeśli plik już istnieje — przenieś obecną treść pod nagłówek "Poprzednia sesja", a na górze zapisz nowy blok.

Format:

## Ostatnia sesja — [dzisiejsza data]

**Co zrobiono:**
- [lista konkretnych rzeczy ukończonych w tej sesji]

**W trakcie (niedokończone):**
- [co nie zostało dokończone i wymaga kontynuacji]

**Następna sesja — zacznij od:**
- [2-3 konkretne kroki na start następnej sesji]

---

### 2. Zaktualizuj changelog (jeśli istnieje)

Jeśli w projekcie istnieje plik `CHANGELOG.md` — dodaj wpis z dzisiejszą datą opisujący co się zmieniło.

Jeśli nie istnieje — pomiń ten krok. Nie twórz go na siłę.

### 3. Potwierdź

Wypisz:

"Sesja zamknięta. Stan zapisany w SESSION-STATE.md. Gotowe do nowej rozmowy."
```

---

## Co robi

- Zapisuje co zrobiliście w tej sesji
- Zapisuje co jest w trakcie (niedokończone)
- Zapisuje 2-3 konkretne kroki na start następnej sesji
- Aktualizuje CHANGELOG.md jeśli istnieje

## Dlaczego to ważne

Bez tego Claude traktuje każdą rozmowę jako zupełnie nową. Nie wie co robiliście wczoraj, co jest w trakcie, jakie były decyzje. Z `/end-session` budujesz ciągłość — każda sesja jest kontynuacją poprzedniej.

---

*Skill z [AIOS Skills](https://github.com/Ban-Enterprises/aios-skills) — [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl)*
