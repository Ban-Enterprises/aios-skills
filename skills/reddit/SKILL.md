---
name: reddit
description: >
  Reddit search i ekstrakcja treści przez publiczne .json endpoints.
  Zero API key. Szukaj postów, komentarzy, auto-detect subreddity.
  Reddit threads, Reddit comments, subreddit posts, community discussion.
  NIE do ogólnego WWW — skill firecrawl. NIE do transkryptów — skill supadata.
license: MIT
compatibility: Requires Python 3 and network access to Reddit public JSON endpoints.
metadata:
  author: BAN ENTERPRISES
  version: "1.0.0"
---

# Reddit Search & Extraction

Szukaj i analizuj dyskusje na Reddit bez żadnego API key. Używa publicznych .json endpoints — dodaj `.json` do dowolnego URL-a Reddit i masz dane.

## Kiedy nie

- Ogólny scrape WWW — skill `firecrawl`.
- Transkrypty video/social — skill `supadata`.
- Firecrawl i Supadata padają na URL-ach reddit.com; nie używaj ich jako fallback.

---

## Setup

Klient jest w `scripts/reddit/client.py`. Skopiuj folder `scripts/` do korzenia projektu (albo uruchamiaj z katalogu skilla). Instalator `scripts/install-skills.sh` kopiuje go sam.

Zero API key. Rate limit: 10 req/min — client wymusza 6.5s przerwy.

## Użycie

```python
from scripts.reddit.client import RedditClient

client = RedditClient()

# Szukaj na całym Reddit
posts = client.search("Claude Code tips", time_filter="month")

# Szukaj w konkretnym subreddit
posts = client.search("automation", subreddit="SaaS")

# Auto-detect subreddity + szukaj + wyciągnij wątki
result = client.research("AI automation agency pricing", max_threads=5)
for t in result["threads"]:
    print(f"[{t['score']} pts] r/{t['subreddit']}: {t['title']}")
    for c in t["comments"][:3]:
        print(f"  [{c['score']}] {c['body'][:100]}")
```

---

## Metody

| Metoda | Co robi | Rate |
|--------|---------|------|
| `search(query, sort, time_filter, limit)` | Szukaj postów na Reddit | 1 req |
| `find_subreddits(query, limit)` | Znajdź subreddity dla tematu | 1 req |
| `hot(subreddit, limit)` | Gorące posty z subreddita | 1 req |
| `top(subreddit, time_filter, limit)` | Top posty po czasie | 1 req |
| `extract_thread(url, comment_limit)` | Pełny post + komentarze | 1 req |
| `research(query, ...)` | Pełny pipeline: detect + search + extract | 5-8 req |

---

## Rate Limits

| Limit | Wartość |
|-------|---------|
| Requests bez auth | 10/min (IP-based) |
| Delay między requests | 6.5s (wymuszony przez client) |
| Typowy research() | 5-8 requests, ~40-50 sekund |

---

## Known Gotchas

1. User-Agent jest wymagany — pusty = prawie zero rate limit. Client ustawia `AIOS-Research/1.0`.
2. `time_filter` działa tylko z `sort="relevance"` i `sort="top"`. Ignorowany przy `sort="new"`.
3. `selftext` to pusty string (nie None) dla link postów. `link_url` ma zewnętrzny URL.
4. Komentarze to tylko top-level (sorted by "best"). Nested replies nie są śledzone. Top 25 komentarzy pokrywa 90%+ wartości.
5. Firecrawl i Supadata nie działają na Reddit URLs. Nie używaj ich jako fallback.

---

*Skill z [AIOS Skills](https://github.com/Ban-Enterprises/aios-skills) — [Cyfrowy Ogarniacz](https://cyfrowyogarniacz.pl)*
