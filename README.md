# AIOS Skills

Gotowe umiejętności dla Claude Code. Zainstaluj w jednym kroku — kopiuj plik, wklej agentowi, gotowe.

Kurowane i weryfikowane przez [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl).

---

## Skills

| Skill | Typ | Co robi | Status |
|-------|-----|---------|--------|
| [end-session](skills/end-session/) | Command | Zapisuje stan sesji — co zrobiono, co dalej | Darmowy |
| [prime](skills/prime/) | Command | Inicjalizacja sesji — Claude czyta kontekst i potwierdza gotowość | Darmowy |
| [status](skills/status/) | Command | Szybki raport stanu projektu | Darmowy |
| [writing-style](skills/writing-style/) | Skill | Eliminuje sztuczny styl AI z każdego tekstu | Darmowy |
| [reddit](skills/reddit/) | Skill | Szukaj i analizuj dyskusje na Reddit (zero API key) | Darmowy |
| [academic](skills/academic/) | Skill | Wyszukiwanie publikacji naukowych — OpenAlex 250M+, bez API key | Darmowy |
| [firecrawl](skills/firecrawl/) | Skill | Scraping i research stron WWW (JS, PDF, crawl) | Darmowy |
| [supadata](skills/supadata/) | Skill | Transkrypty video i social — YouTube, TikTok, IG, X, FB | Darmowy |
| [diagram](skills/diagram/) | Skill | Diagramy architektury w D2 → PNG | Darmowy |
| [excalidraw](skills/excalidraw/) | Skill | Diagramy architektury z analizy codebase (.excalidraw) | Darmowy |
| [notion-page-builder](skills/notion-page-builder/) | Skill | Budowanie pięknych stron Notion (Notion MCP) | Darmowy |
| [brainstorm](skills/brainstorm/) | Command | Strategiczna eksploracja pomysłów | Premium |
| [deep-research](skills/deep-research/) | Command | Multi-agentowy research na wielu platformach naraz | Premium |
| [ui-ux-pro-max](skills/ui-ux-pro-max/) | Skill | Inteligencja projektowa UI/UX — style, palety, fonty | Premium |
| [frontend-design](skills/frontend-design/) | Skill | Produkcyjny frontend bez generycznego „AI slop" | Premium |
| [new-capability](skills/new-capability/) | Command | Fabryka własnych integracji API | Premium |

---

## Jak zainstalować

### Metoda 1: Kopiuj pojedynczy skill

1. Otwórz folder skilla (np. `skills/end-session/`)
2. Skopiuj treść `SKILL.md`
3. Wklej agentowi w Claude Code — sam zainstaluje

### Metoda 2: Klonuj całe repo

```bash
git clone https://github.com/Ban-Enterprises/aios-skills.git
```

Potem skopiuj wybrane skille do swojego projektu:

```bash
# Command (wywoływany ręcznie jako /nazwa)
cp aios-skills/skills/end-session/SKILL.md twoj-projekt/.claude/commands/end-session.md

# Skill (ładuje się automatycznie)
cp -r aios-skills/skills/writing-style/ twoj-projekt/.claude/skills/writing-style/
```

### Metoda 3: Wklej agentowi cały plik

Otwórz `SKILL.md` na GitHubie, kliknij "Raw", skopiuj treść, wklej w czacie z Claude. Agent przeczyta instrukcje i zainstaluje skill automatycznie.

---

## Jak to działa

Każdy skill to plik markdown (`SKILL.md`) z instrukcjami dla Claude Code.

Są dwa typy:

- **Command** — komenda wywoływana ręcznie wpisując `/nazwa` w czacie. Instalujesz w `.claude/commands/`.
- **Skill** — umiejętność ładowana automatycznie gdy temat pojawi się w rozmowie. Instalujesz w `.claude/skills/`.

### Struktura folderów Claude Code

```
twoj-projekt/
├── .claude/
│   ├── commands/          ← komendy (/end-session, /prime, /status)
│   │   ├── end-session.md
│   │   ├── prime.md
│   │   └── status.md
│   └── skills/            ← umiejętności (auto-trigger)
│       ├── writing-style/
│       │   └── SKILL.md
│       └── reddit/
│           └── SKILL.md
```

---

## Oznaczenia

| Badge | Znaczenie |
|-------|-----------|
| **Zweryfikowany** | Przetestowany i zatwierdzony przez Łukasza Banacha |
| **AIOS** | Rekomendowany dla AI Operating System |
| **Darmowy** | Bez opłat, open-source (MIT) |
| **Premium** | Opis dostępny, pełna wersja w [AIOS Community](https://cyfrowyogarniacz.pl) |

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
