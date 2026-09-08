# AIOS Skills

Przenośny katalog zgodny z [Agent Skills](https://agentskills.io/specification).
Te same skille działają w Claude Code, Cursorze, Codexie i Groku.

Kurowane przez [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl).

Każdy `SKILL.md` używa standardowego frontmatteru. Dane produktu
(`pricing`, `verified`, `completeness`, warstwa AIOS) są osobno w
[`catalog.yaml`](catalog.yaml).

Kontrakt: [`docs/skill-contract.md`](docs/skill-contract.md) · routing:
[`docs/routing.md`](docs/routing.md) · audyt:
[`docs/audit.md`](docs/audit.md)

---

## Skills

| Skill | Typ | Co robi | Status |
|-------|-----|---------|--------|
| [end-session](skills/end-session/) | Command | Zapisuje stan sesji — co zrobiono, co dalej | Darmowy |
| [prime](skills/prime/) | Command | Inicjalizacja sesji — kontekst projektu i gotowość | Darmowy |
| [status](skills/status/) | Command | Szybki raport stanu projektu | Darmowy |
| [writing-style](skills/writing-style/) | Skill | Eliminuje sztuczny styl AI z prozy | Darmowy |
| [reddit](skills/reddit/) | Skill | Szukaj i analizuj dyskusje na Reddit (zero API key) | Darmowy |
| [academic](skills/academic/) | Skill | Publikacje naukowe — OpenAlex 250M+, bez API key | Darmowy |
| [firecrawl](skills/firecrawl/) | Skill | Scraping i research stron WWW (JS, PDF, crawl) | Darmowy |
| [supadata](skills/supadata/) | Skill | Transkrypty video i social — YouTube, TikTok, IG, X, FB | Darmowy |
| [diagram](skills/diagram/) | Skill | Diagramy architektury w D2 → PNG | Darmowy |
| [excalidraw](skills/excalidraw/) | Skill | Diagramy z analizy codebase (`.excalidraw`) | Darmowy |
| [notion-page-builder](skills/notion-page-builder/) | Skill | Strony Notion (wymaga Notion MCP na hoście) | Darmowy |
| [brainstorm](skills/brainstorm/) | Command | Strategiczna eksploracja pomysłów | Premium (stub) |
| [deep-research](skills/deep-research/) | Command | Multi-agentowy research na wielu platformach | Premium (stub) |
| [ui-ux-pro-max](skills/ui-ux-pro-max/) | Skill | Decyzje UI/UX — style, palety, fonty | Premium (stub) |
| [frontend-design](skills/frontend-design/) | Skill | Produkcyjny frontend bez generycznego „AI slop" | Premium (stub) |
| [new-capability](skills/new-capability/) | Command | Fabryka własnych integracji API | Premium (stub) |

**Stub** = w tym repo jest opis, routing i (gdzie trzeba) zasada; pełna procedura jest w [AIOS Community](https://cyfrowyogarniacz.pl). Agent nie powinien udawać, że ma brakujące etapy.

---

## Jak zainstalować

### Instalacja przenośna (zalecana)

```bash
git clone https://github.com/Ban-Enterprises/aios-skills.git
cd aios-skills
python3 -m pip install -r requirements.txt
python3 scripts/install-skills.py \
  --host portable \
  --target /ścieżka/twojego-projektu
```

`portable` zapisuje do `.agents/skills/`. To neutralna warstwa odkrywana przez
nowoczesne hosty Agent Skills.

Adaptery konkretnego hosta:

```bash
# Claude + Cursor
python3 scripts/install-skills.py --host both --target /ścieżka

# jeden host
python3 scripts/install-skills.py --host claude --target /ścieżka
python3 scripts/install-skills.py --host cursor --target /ścieżka
python3 scripts/install-skills.py --host codex --target /ścieżka
python3 scripts/install-skills.py --host grok --target /ścieżka

# tylko pętla sesji
python3 scripts/install-skills.py --host portable --target /ścieżka \
  --only prime,status,end-session
```

Ścieżki i rozróżnienie command-like/skill żyją w `catalog.yaml`, nie w
przenośnym `SKILL.md`.

### Ręcznie

Skopiuj `skills/<nazwa>/` do `.agents/skills/<nazwa>/` (cały folder, nie sam
markdown, jeśli są `scripts/` albo `references/`).

Klasyczne slash commands Claude instalator umieszcza w `.claude/commands/`.
Pozostali klienci dostają je jako zwykłe skille.

---

## Jak to działa

Każdy skill to folder z `SKILL.md`; opcjonalnie ma `scripts/`, `references/`
i `assets/`. Agent dobiera plik po `description`, a resztę ładuje progresywnie.

Standard wymaga tylko `name` i `description`. AIOS dodaje standardowe pola
opcjonalne `license`, `compatibility` i `metadata` (`author`, `version`).

`Command` i `Skill` w tabeli powyżej są klasyfikacją katalogu AIOS. Nie są
niestandardowym top-level frontmatterem.

Walidacja katalogu:

```bash
python3 -m pip install -r requirements-dev.txt
python3 scripts/check-skills.py
```

Checker uruchamia oficjalną walidację `skills-ref`, sprawdza `catalog.yaml`,
spójność README oraz składnię skryptów Python.

---

## Oznaczenia

| Badge | Znaczenie |
|-------|-----------|
| **Zweryfikowany** | SOP z tego repo da się wykonać; status w `catalog.yaml` |
| **Stub** | Opis i routing; pełne ciało poza katalogiem |
| **AIOS** | Rekomendowany dla AI Operating System |
| **Darmowy** | MIT, w tym repo |
| **Premium** | Pełna wersja w [AIOS Community](https://cyfrowyogarniacz.pl) |

---

## AIOS — AI Operating System

AIOS to metodologia prowadzenia biznesu z AI. Pięć warstw, budowanych jedna po drugiej:

1. **Context** — AI zna Twój biznes (strategia, zespół, procesy)
2. **Data** — AI widzi Twoje liczby (przychody, ruch, pipeline)
3. **Intelligence** — AI obserwuje i syntetyzuje (spotkania, wiadomości, sygnały)
4. **Automate** — Audyt zadań, scoring, automatyzacja jedno po drugim
5. **Build** — Uwolniona przepustowość na wzrost

Skille w tym repo to cegiełki do budowania Twojego AIOS.

Więcej: [cyfrowyogarniacz.pl](https://cyfrowyogarniacz.pl)

---

## Licencja

MIT — rób co chcesz. Atrybucja mile widziana.

---

*Budowane przez [BAN ENTERPRISES](https://banenterprises.com) — AI dla ludzi, którzy ogarniają.*
