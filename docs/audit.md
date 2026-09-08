# Audyt katalogu aios-skills

Stan repo: `main` @ `c4d907c` · 7 września 2026 · 16 skilli.

Cel audytu: routing agenta, lock-in hosta, szczerość kontraktu (pełny SOP vs teaser), konflikty między skillami, odporność na zmianę vendora.

> Status: findings zachowujemy jako zapis stanu sprzed zmian. Implementacja
> rozdziela teraz standardowy `SKILL.md` od danych produktu w `catalog.yaml`.
> Własny rozbudowany frontmatter zaproponowany w pierwszej wersji audytu został
> wycofany po porównaniu z Anthropic, Cursor, Codex, Matt Pocock i Grok Bot.

Skala: **P0** blokuje poprawny routing albo kłamie agentowi · **P1** lock-in / kruchość · **P2** spójność katalogu.

---

## Werdykt

Katalog jest dobrym zalążkiem produktu (pętla sesji, eskalacja Firecrawl, anty-marketplace w `new-capability`), ale **nie jest jeszcze pakietem zdolności agenta**. Jest paczką markdownu pod Claude Code. Description pięciu skilli premium obiecuje workflow, którego w repo nie ma. Research skilli nachodzą na siebie (WWW vs transkrypt vs papers vs Reddit), a tylko `firecrawl` i `reddit` mówią „kiedy nie”.

Nie dodawaj nowych skilli, dopóki ten kontrakt nie jest spójny.

---

## P0 — routing i szczerość

| ID | Finding | Gdzie |
|----|---------|--------|
| P0-1 | Description skilli premium brzmi jak działający SOP. Ciało mówi „to tylko opis, reszta w Community”. Agent wczyta teaser i **wymyśli** 4-etapowy brainstorm / orkiestrację deep-research. | `brainstorm`, `deep-research`, `frontend-design`, `ui-ux-pro-max`, `new-capability` |
| P0-2 | `supadata` description reklamuje też web scrape / crawl / map — to jest powierzchnia `firecrawl`. Konflikt „zescrapuj stronę”. | `supadata` vs `firecrawl` |
| P0-3 | `academic.research(..., extract_full_text=True)` woła Firecrawl, ale description nie mówi „nie do news/blogów / nie do transkryptów”. | `academic` |
| P0-4 | `deep-research` ma być orkiestratorem (`firecrawl` + `supadata` + `reddit` + `academic`), ale w repo nie ma procedury. Description i tak triggeruje na „zbadaj temat”. | `deep-research` |
| P0-5 | `frontend-design` i `ui-ux-pro-max` triggerują na to samo: landing, dashboard, UI. Bez anty-triggera agent wczyta oba teasery. | te dwa |
| P0-6 | `diagram` i `excalidraw` triggerują na „architecture diagram”. Inny artefakt (D2/PNG vs `.excalidraw`), brak rozróżnienia w description. | te dwa |

Anty-trigger w description (to, co agent widzi **zanim** otworzy plik) mają tylko: `firecrawl`. `reddit` ma go w gotchas, nie w description. Reszta: zero.

---

## P1 — host, vendor, instalacja

| ID | Finding |
|----|---------|
| P1-1 | Wszystkie 16 `install:` wskazują `.claude/...`. README i ciała `prime` / `status` / `end-session` / `writing-style` mówią wyłącznie o Claude Code. Cursor, Codex, AGENTS.md: zero. |
| P1-2 | Komendy sesji czytają `CLAUDE.md`, nie `AGENTS.md`. W Cursorze pętla sesji nie wstanie po skopiowaniu pliku. |
| P1-3 | `notion-page-builder` jest skilliem = wrapper na Notion MCP (`ReadMcpResourceTool`, `notion-create-pages`). Padnie MCP albo zmieni się host — skill jest martwy. Brak kontraktu „strona Notion” vs adapter. |
| P1-4 | Klienci: `academic` i `supadata` są w `scripts/`, `reddit` każe **wkleić klasę z SKILL.md**. Niespójny model dystrybucji. |
| P1-5 | `academic` ma `EMAIL = "your@email.com"` — OpenAlex polite pool nie działa out of the box. |
| P1-6 | `supadata` docstring: „Morningside workspace” i `from utils.supadata import` — leftover z innego projektu, rozjeżdża się z instrukcją `from scripts.utils.supadata`. |
| P1-7 | `diagram` instaluje D2 przez `brew install d2` (macOS). Brak Linux/Windows. |
| P1-8 | Zero pinów wersji CLI/API per skill. `requirements.txt` jest globalny (`requests`, `python-dotenv`) i nie pokrywa Firecrawl CLI / D2 / Playwright (excalidraw export). |
| P1-9 | Brak testów i evali routingu. `verified: true` na teaseraach premium nie znaczy „SOP działa w tym repo”. |

---

## P2 — katalog i metadane

| ID | Finding |
|----|---------|
| P2-1 | `verified: false` na `status`, `firecrawl`, `academic`, `supadata`, `diagram`, `excalidraw`, `notion` — a `verified: true` na premium bez ciała. Sygnał jest odwrotny do zaufania. |
| P2-2 | `aios: false` tylko na `writing-style` i `reddit`, bez wyjaśnienia. |
| P2-3 | `writing-style` description: „każdy output tekstowy” — koliduje z kodem i commit message’ami, jeśli agent wczyta go zawsze. |
| P2-4 | Brak `skill_version`, changelog per skill, szablonu SKILL.md. |
| P2-5 | README obiecuje „kopiuj, wklej agentowi, gotowe” wyłącznie dla Claude. |

---

## Co zostaje (nie ruszać bez potrzeby)

- Pętla `prime` → praca → `end-session` + `SESSION-STATE.md` — unikalna wartość.
- Eskalacja Firecrawl (search → scrape → map → crawl → browser) i tabela vs Supadata.
- `new-capability`: zasada anty-marketplace (MCP ≠ skill).
- `excalidraw/references/` jako progressive disclosure (ciało + refs).
- Klienci HTTP w `academic` / `supadata` — dobry kierunek adaptera, byle posprzątać leftovery.

---

## Zakres poprawek po tym audycie

Zrealizowane:

1. Standard Agent Skills (`name`, `description`, standardowe optional fields)
   walidowany przez `skills-ref`.
2. Dane AIOS i produktu przeniesione do `catalog.yaml`.
3. Macierz routingu + evale zdań hit/miss.
4. Description i sekcja „Kiedy nie” na skillach z konfliktem; teasery premium
   oznaczone jako stub w katalogu.
5. Adapter instalacji: portable `.agents/skills` oraz Claude, Cursor, Codex,
   Grok.
6. Session pack czyta `AGENTS.md` albo `CLAUDE.md`.
7. Reddit client jako plik, nie wklejanka; docstring Supadata.

Świadomie poza zakresem: pełne workflow premium, pinowanie Firecrawl CLI, fixture testy HTTP, wypięcie Notion z MCP, Linuxowy installer D2.
