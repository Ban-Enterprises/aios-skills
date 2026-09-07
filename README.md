# AIOS Skills

Gotowe umiejętności dla agentów (Claude Code, Cursor i inne hosty z katalogiem skilli).

Kurowane przez [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl).

Kontrakt katalogu: [`docs/skill-contract.md`](docs/skill-contract.md) · routing: [`docs/routing.md`](docs/routing.md) · audyt: [`docs/audit.md`](docs/audit.md)

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

### Skrypt (Claude i/lub Cursor)

```bash
git clone https://github.com/Ban-Enterprises/aios-skills.git
cd aios-skills
./scripts/install-skills.sh --host both --target /ścieżka/twojego-projektu
# tylko sesja:
./scripts/install-skills.sh --host cursor --target /ścieżka --only prime,status,end-session
```

- `--host claude` → `.claude/commands/` i `.claude/skills/`
- `--host cursor` → `.cursor/skills/<nazwa>/SKILL.md`
- `--host both` → oba

### Ręcznie

Skopiuj `skills/<nazwa>/` (cały folder, nie sam markdown, jeśli są `scripts/` albo `references/`).

Command na Claude: treść do `.claude/commands/<nazwa>.md`. Na Cursorze command też ląduje jako skill.

---

## Jak to działa

Każdy skill to `SKILL.md` z kontraktem w frontmatterze. Agent dobiera plik po `description` (triggery + **NIE do**).

- **Command** — wywołanie z nazwy (`/prime` w Claude Code; w Cursorze ta sama treść jako skill).
- **Skill** — ładuje się, gdy temat pojawi się w rozmowie.

Walidacja katalogu:

```bash
python3 scripts/check-skills.py
```

---

## Oznaczenia

| Badge | Znaczenie |
|-------|-----------|
| **Zweryfikowany** | SOP z tego repo da się wykonać (`verified: true` + `completeness: full`) |
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
