---
name: prime
description: >
  Inicjalizacja sesji. Claude czyta kontekst projektu, podsumowuje stan,
  potwierdza gotowość do pracy. Uruchom na start każdej sesji.
  Prime, start sesji, inicjalizacja, orientacja.
type: command
install: .claude/commands/prime.md
pricing: free
verified: true
aios: true
---

# Prime

> Zainicjalizuj sesję z pełnym kontekstem projektu.

## Instalacja

Skopiuj sekcję **"Komenda"** poniżej do pliku `.claude/commands/prime.md` w swoim projekcie.

Po instalacji wywołuj komendą `/prime` na start każdej sesji.

---

## Komenda

```markdown
Zainicjalizuj tę sesję z kontekstem projektu. Przeczytaj pliki w tej kolejności:

1. `CLAUDE.md` — struktura workspace, komendy, skille (jeśli istnieje)
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

Każda sesja z Claude zaczyna się od zera — nie wie co robiliście wcześniej. `/prime` daje mu orientację w 10 sekund zamiast 5 minut tłumaczenia.

## Para idealna

Używaj razem z `/end-session`:
1. Na koniec sesji: `/end-session` — zapisuje stan
2. Na start następnej: `/prime` — czyta stan i kontynuuje

---

*Skill z [AIOS Skills](https://github.com/Ban-Enterprises/aios-skills) — [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl)*
