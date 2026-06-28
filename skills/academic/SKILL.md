---
name: academic
description: >
  Wyszukiwanie publikacji naukowych przez OpenAlex (250M+ prac), bez API key.
  Artykuły naukowe, abstrakty, grafy cytowań, darmowe PDFy zza paywalla.
  Academic research, scientific papers, literature review, citations, scholarly search.
type: skill
install: .claude/skills/academic/SKILL.md
pricing: free
verified: false
aios: true
---

# Academic Paper Search

Wyszukiwanie w 250M+ prac naukowych przez OpenAlex. **Zero autoryzacji** — bez klucza API. Dodatkowo Unpaywall (darmowe PDFy publikacji zza paywalla) i przeglądanie grafu cytowań.

## Setup

Skill wozi własny klient w `scripts/academic/client.py`. Skopiuj folder `scripts/` do korzenia projektu (albo uruchamiaj z katalogu skilla), a potem:

```python
from scripts.academic.client import AcademicClient
client = AcademicClient()
```

**Bez zmiennych środowiskowych.** OpenAlex i Unpaywall są darmowe i bez autoryzacji. Dla "polite pool" ustaw swój e-mail w `client.py` (stała `EMAIL`).

## Method Reference

| Method | What | Source |
|--------|------|--------|
| `search(query, limit, year_from, ...)` | Search 250M+ papers by topic | OpenAlex |
| `get_paper(doi=)` | Get paper by DOI | OpenAlex |
| `get_citations(openalex_id, limit)` | Papers that cite a given paper | OpenAlex |
| `find_free_pdf(doi)` | Find free legal PDF of paywalled paper | Unpaywall |
| `get_full_text(url)` | Scrape article page for full text | Firecrawl |
| `research(query, max_papers, ...)` | Full pipeline: search, enrich, extract | All |

## Full Research Pipeline

```python
result = client.research(
    "AI code generation testing verification",
    max_papers=5,
    year_from=2024,
    find_free_pdfs=True,       # look up free PDFs for paywalled papers
    extract_full_text=False,    # set True to scrape full articles (slower)
)

print(f"Found {result['total_found']} papers")
for p in result["papers"]:
    print(f"\n[{p['cited_by']} cites] {p['title']}")
    print(f"  {p['year']} | {', '.join(a['name'] for a in p['authors'][:2])}")
    print(f"  Abstract: {p['abstract'][:200]}...")
```

## Search Parameters

```python
# Basic search (relevance-ranked, 2024+)
papers = client.search("transformer architecture", year_from=2024)

# Highly cited open access papers only
papers = client.search(
    "large language models",
    limit=10,
    year_from=2023,
    open_access_only=True,
    cited_by_min=100,
    sort="cited_by_count:desc",
)

# Recent papers sorted by date
papers = client.search(
    "AI agents software engineering",
    sort="publication_date:desc",
    year_from=2025,
)
```

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| `query` | str | required | Search topic |
| `limit` | int | 10 | Max 200 per page |
| `year_from` | int | None | Minimum publication year |
| `year_to` | int | None | Maximum publication year |
| `open_access_only` | bool | False | Only OA papers |
| `cited_by_min` | int | None | Minimum citation count |
| `sort` | str | `relevance_score:desc` | Also: `cited_by_count:desc`, `publication_date:desc` |

## Paper Fields

| Field | Type | What |
|-------|------|------|
| `title` | str | Paper title |
| `abstract` | str | Reconstructed from inverted index (some papers lack this) |
| `year` | int | Publication year |
| `cited_by` | int | Citation count |
| `doi` | str | DOI (without https://doi.org/ prefix) |
| `open_access` | bool | Is it freely accessible? |
| `oa_url` | str | Open access URL (if available) |
| `authors` | list | `[{"name": "...", "institution": "..."}]` |
| `venue` | str | Journal/conference name |
| `type` | str | article, preprint, book-chapter, etc. |
| `openalex_id` | str | OpenAlex identifier (for citation lookups) |

## Citation Graph

```python
# Find what cites a paper
paper = client.search("attention is all you need", limit=1, year_from=2017, year_to=2017)
citing = client.get_citations(paper[0]["openalex_id"], limit=10)
for c in citing:
    print(f"[{c['cited_by']} cites] {c['title']}")
```

## Finding Free PDFs

```python
# Unpaywall finds free legal copies of paywalled papers
pdf_url = client.find_free_pdf("10.1145/3650212.3680384")
# Returns URL to free PDF, or None
```

The `research()` pipeline does this automatically for paywalled papers when `find_free_pdfs=True`.

## Rate Limits

| API | Limit | Notes |
|-----|-------|-------|
| OpenAlex | 100 req/s (shared) | Include email in User-Agent for polite pool |
| Unpaywall | 100K req/day | Generous |
| Client delay | 200ms between requests | Enforced automatically |

---

## Maintenance

> **Self-improvement rule:** If you used this skill and discovered something not documented here, add it below.

### Known Gotchas

1. Not all papers have abstracts in OpenAlex. The `abstract_inverted_index` field is missing for ~20-30% of papers. The client returns empty string for these.
2. OpenAlex deduplicates poorly. The same paper can appear twice in search results (seen with slightly different OpenAlex IDs).
3. The "Attention Is All You Need" search returns "Squeeze-and-Excitation Networks" as top result, not the Transformer paper. Use DOI lookup for known papers: `client.get_paper(doi="10.48550/arXiv.1706.03762")`.
4. `sort="relevance_score:desc"` sometimes ranks low-citation recent papers above seminal older papers. Use `sort="cited_by_count:desc"` when you want the most influential papers.
5. Unpaywall returns 404 for arXiv DOIs (format `10.48550/arxiv.*`). These papers are already OA via arXiv directly.
6. Full text extraction via Firecrawl works on OA article pages but many publisher sites return cookie walls or paywalls that Firecrawl can't bypass.
7. OpenAlex requires polite usage: include `mailto:email@domain.com` in User-Agent. The client does this automatically.

### Improvement Backlog

- Add arXiv-specific search for CS/Math preprints (arXiv API has no auth, good for recent preprints)
- Consider Semantic Scholar for citation graph when their rate limiting stabilizes
- Add PDF text extraction (download PDF then pdfplumber/PyMuPDF to plain text)
