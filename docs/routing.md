# Macierz routingu

Agent widzi tylko `description`. Ta tabela jest źródłem prawdy, co w niej ma być.

Kolumny: intent użytkownika → zwycięzca → przegrani (NIE do).

| Intent | Skill | Nie |
|--------|-------|-----|
| Start sesji, orientacja w projekcie | `prime` | `status` (status = szybki odczyt w trakcie, nie bootstrap) |
| Szybki stan w trakcie pracy | `status` | `prime` (nie ładuj pełnego bootstrapu) |
| Koniec dnia, zapisz ciągłość | `end-session` | — |
| Ściągnij / zescrapuj stronę, docs, PDF z URL, JS/SPA | `firecrawl` | `supadata` (web_* to zapas, nie default), `academic`, `reddit` |
| Transkrypt YouTube / TikTok / IG / X / FB, metadane kanału | `supadata` | `firecrawl` |
| Dyskusja na Reddit | `reddit` | `firecrawl`, `supadata` (ich scrape pada na reddit.com) |
| Paper, DOI, cytowania, PDF spoza paywalla (OpenAlex) | `academic` | news, blogi, transkrypty |
| Research na wielu kanałach naraz | `deep-research` (stub: orkiestracja poza repo; wołaj skille-źródła osobno) | nie zastępuje firecrawl/reddit/academic/supadata |
| Diagram jako kod D2 → PNG | `diagram` | `excalidraw` |
| Diagram z analizy repo jako `.excalidraw` | `excalidraw` | `diagram` |
| Działający kod UI (landing, app) | `frontend-design` (stub bez biblioteki przykładów) | `ui-ux-pro-max` jako jedyne źródło kodu |
| Decyzje UX: paleta, font, review, a11y | `ui-ux-pro-max` (stub) | nie generuje pełnego frontu |
| Strona w Notion | `notion-page-builder` | wymaga MCP Notion na hoście; nie do HTML/React |
| Nowy API / integracja | `new-capability` (stub + zasada: MCP z marketplace to nie skill) | — |
| Styl tekstu, anti-slop | `writing-style` | nie narzuca stylu na kod i diffy |
| Strategiczny kierunek biznesu | `brainstorm` (stub) | nie jest research pipeline |

Gdy dwa skille pasują, wygrywa **węższy kanał źródła**, nie orkiestrator i nie skill z szerszym description.
