---
name: firecrawl
description: >
  Scraping i research stron WWW przez Firecrawl CLI — zamiast WebFetch/WebSearch.
  Scrape URL, fetch page, read article, research online, search the web, crawl docs,
  extract data from site, PDF from URL, competitor research, browse, web research.
  Radzi sobie z JS/SPA, ochroną botów (Cloudflare), PDF/docx i crawlowaniem wielu stron.
  NIE do transkryptów YouTube/TikTok/IG/X/FB — od tego jest skill supadata.
type: skill
install: .claude/skills/firecrawl/SKILL.md
pricing: free
verified: false
aios: true
---

# Firecrawl

CLI do scrapingu WWW — zamienia dowolny URL w czysty markdown gotowy dla LLM. 8 komend.

## Setup

Wymaga konta Firecrawl i klucza API.

```bash
# Instalacja CLI (Node >= 20)
npm install -g firecrawl-cli

# Klucz API
export FIRECRAWL_API_KEY="fc-..."

# Status i pozostałe kredyty
firecrawl --status
```

Autoryzacja przez zmienną `FIRECRAWL_API_KEY` (np. z `.env`). Bez inicjalizacji w kodzie.

## Command Reference

| Command                                  | What it does                        | When to use                                         |
| ---------------------------------------- | ----------------------------------- | --------------------------------------------------- |
| `firecrawl scrape "<url>"`               | Single page → clean markdown        | Have a URL, need its content                        |
| `firecrawl search "query" --scrape`      | Search + pull full page content     | No URL yet, need to find + read pages               |
| `firecrawl crawl "<url>" --limit N`      | Bulk extract entire site section    | Need all /docs/ or all /blog/ pages                 |
| `firecrawl map "<url>"`                  | Discover all URLs in a domain       | Need to find a specific subpage                     |
| `firecrawl agent "<url>" --prompt "..."` | AI-powered structured extraction    | Need structured data (pricing, specs, contact info) |
| `firecrawl browser "<url>"`              | Interactive — clicks, forms, scroll | Scrape failed, content needs interaction            |
| `firecrawl download "<url>"`             | Save entire site as local files     | Offline reference, bulk archival                    |
| `firecrawl credit-usage`                 | Check credit consumption            | Monitor usage                                       |

## Escalation Pattern

Follow this order — start simple, escalate only if needed:

1. **Search** — no URL yet → `firecrawl search "query" --scrape --limit 3`
2. **Scrape** — have a URL → `firecrawl scrape "<url>"`
3. **Map → Scrape** — large site, need a specific subpage → `firecrawl map "<url>" --search "keyword"` then scrape the match
4. **Crawl** — need bulk content from a section → `firecrawl crawl "<url>" --limit 20`
5. **Browser** — scrape failed (JS gating, modals, login, pagination) → `firecrawl browser "<url>"`

## Common Patterns

### Research a topic (no URL)

```bash
firecrawl search "AI agency pricing models 2025" --scrape --limit 5 -o .firecrawl/search-pricing.json
```

### Scrape a specific page

```bash
firecrawl scrape "https://competitor.com/pricing" -o .firecrawl/competitor-pricing.md
```

### Pull all docs from a site

```bash
firecrawl crawl "https://docs.example.com" --limit 50 -o .firecrawl/docs/
```

### Extract structured data with AI

```bash
firecrawl agent "https://example.com" --prompt "Extract: company name, pricing tiers, features per tier" -o .firecrawl/extracted.json
```

### Parallel scrapes

```bash
firecrawl scrape "<url-1>" -o .firecrawl/1.md &
firecrawl scrape "<url-2>" -o .firecrawl/2.md &
firecrawl scrape "<url-3>" -o .firecrawl/3.md &
wait
```

## Output Rules

- Always write to `.firecrawl/` with `-o` — never dump large content inline
- `.firecrawl/` is gitignored and **throwaway temp** — treat it like `/tmp`, not storage
- Naming: `search-{query}.json`, `{site}-{path}.md`
- Never read entire output files at once — use `head -50` or `grep` first
- `search --scrape` already fetches full page content — don't re-scrape those URLs

```bash
# Extract URLs from search output
jq -r '.data.web[].url' .firecrawl/search.json

# Read large file incrementally
wc -l .firecrawl/file.md && head -100 .firecrawl/file.md

# Nuke all temp files when done (end of session or daily)
rm -rf .firecrawl/*
```

**If content is worth keeping past this session, move it before the session ends:**
- Research findings → `reference/research/YYYY-MM-DD-{topic}.md`
- Competitor intel → `outputs/` or the relevant project folder
- Doc dumps → wherever you'd actually look for it again

Nothing in `.firecrawl/` should be the permanent home for anything.

## Credits

Każdy scrape/crawl kosztuje kredyty. Saldo: `firecrawl --status` lub `firecrawl credit-usage`.

## Scraping Tool Decision

| Need                                 | Tool                                        |
| ------------------------------------ | ------------------------------------------- |
| Any webpage / article / docs         | **Firecrawl** (this skill)                  |
| PDF or docx from a URL               | **Firecrawl** (only tool that handles docs) |
| JS-heavy or bot-blocked site         | **Firecrawl browser**                       |
| YouTube / TikTok / social transcript | **Supadata**                                |
| YouTube search / channel data        | **Supadata**                                |

---

## Maintenance

> **Self-improvement rule:** Discovered a gotcha, quirk, or better pattern while using this? Add it below before finishing. Keep entries to one line each. Refactor into the main body above once this hits 10 items.

### Known Gotchas

- Always quote URLs in bash — `?` and `&` are shell special characters that break unquoted URLs
- `firecrawl-cli` lubi Node >= 22; na v20 pojawiają się ostrzeżenia, ale działa
- `search --scrape` fetches full content already — don't run a separate scrape on those same URLs

### Improvement Backlog

(none yet)
