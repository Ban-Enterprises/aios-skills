# Ewaluacja routingu

Nie oceniaj jakości odpowiedzi. Oceń, **który skill** agent powinien wczytać (albo że żaden).
Źródło prawdy: `docs/routing.md`.

Legenda: **hit** = ten skill, **miss** = nie ten, **conflict** = para, w której wygrywa węższy.

## Hit

| Prompt | Skill |
|--------|-------|
| Prime — zorientuj się w projekcie | `prime` |
| Jaki jest status projektu, bez czytania kodu? | `status` |
| Zakończ sesję i zapisz stan | `end-session` |
| Zescrapuj https://docs.example.com/pricing do markdown | `firecrawl` |
| Crawlnij całą sekcję /docs | `firecrawl` |
| Daj transkrypt z tego filmu na YouTube | `supadata` |
| Co ludzie na r/SaaS mówią o wycenie agencji? | `reddit` |
| Znajdź papers o LLM-as-judge i darmowe PDF | `academic` |
| Narysuj architekturę w D2 i wyrenderuj PNG | `diagram` |
| Wygeneruj plik .excalidraw z analizy tego repo | `excalidraw` |
| Zbuduj stronę Notion jako lead magnet | `notion-page-builder` |
| Napisz ten newsletter bez AI slop | `writing-style` |
| Dodaj capability do oficjalnego API tej usługi | `new-capability` |

## Miss (nie wolno wczytać skilla z kolumny)

| Prompt | Nie |
|--------|-----|
| Daj transkrypt z YouTube | `firecrawl` |
| Zescrapuj docs.example.com | `supadata` |
| Co na Reddit o X? | `firecrawl`, `supadata` |
| Znajdź paper o transformerach | `firecrawl` |
| Poprawa samego kerningu i kontrastu, bez kodu | `frontend-design` |
| Zaimplementuj landing w Next.js | `ui-ux-pro-max` jako jedyny skill |
| Diagram D2 | `excalidraw` |
| Plik excalidraw | `diagram` |
| Szybki status w środku dnia | `prime` |
| Commit message / diff | `writing-style` |

## Stubby premium

Przy promptach poniżej wolno wczytać skill **tylko jako opis + odesłanie**. Nie wolno udawać pełnego workflow.

| Prompt | Skill (stub) | Zachowanie |
|--------|--------------|------------|
| Zrób deep research kto rządzi tą niszą | `deep-research` | Wołaj skille-źródła albo powiedz, że orkiestracja jest poza repo |
| Brainstorm: podcast czy newsletter? | `brainstorm` | Nie odtwarzaj 4 etapów Community z głowy |
| Zbuduj wyróżniający się landing | `frontend-design` | Brak biblioteki 9 przykładów w tym repo |
| Dobierz paletę i fonty | `ui-ux-pro-max` | Brak bazy 67 stylów w tym repo |
