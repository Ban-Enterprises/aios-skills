---
name: deep-research
description: >
  Multi-agentowy research na wielu platformach naraz. Równoległe agenty schodzą
  3+ poziomy w głąb tematu, oceniają wiarygodność źródeł, triangulują twierdzenia
  i zwracają zsyntetyzowany, cytowany raport. Deep research, zbadaj temat, dive deep,
  intelligence gathering, kto jest ekspertem od, co się dzieje w, multi-platform research.
type: command
install: .claude/commands/deep-research.md
pricing: premium
verified: true
aios: true
---

# Deep Research

> Jeden brain dump → zespół równoległych agentów → jeden cytowany raport syntezy.

## Co robi

- Orkiestruje research przez wiele platform naraz: web, video, dyskusje społeczności, dyskurs real-time, publikacje naukowe, podcasty, newslettery.
- Działa dwufazowo: najpierw **rekonesans** (gdzie żyje sygnał), potem **równoległe agenty tematyczne** schodzące głęboko w wybrane kąty.
- Ocenia źródła (signal scoring), trianguluje twierdzenia między platformami i przepuszcza wynik przez agenta-krytyka, zanim powstanie synteza.
- Zwraca raporty per-agent + master-syntezę z cytowaniami.

## Dla kogo

Dla każdego, kto potrzebuje rzetelnego, wielo-źródłowego researchu zamiast jednego
przejścia po Google — analiza rynku, due diligence, mapowanie ekspertów, przegląd tematu.

## Jak wygląda przepływ

```
/deep-research "brain dump tematu"
  → wywiad zakresowy (3–4 pytania)
  → agent rekonesansu → gdzie jest sygnał
  → CHECKPOINT (akceptujesz roster agentów)
  → równoległe agenty tematyczne (głęboko, 3+ poziomy)
  → agent-krytyk → synteza z cytowaniami
```

## Powiązane skille

Najlepiej działa, gdy masz zainstalowane skille-źródła: `firecrawl`, `supadata`,
`reddit`, `academic` (każdy łata jeden kanał sygnału).

---

> **Wersja w tym repo to opis.** Pełna implementacja (orkiestracja agentów, szablony
> promptów, scoring i synteza) jest częścią [AIOS Community](https://cyfrowyogarniacz.pl).
