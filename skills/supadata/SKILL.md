---
name: supadata
description: >
  Transkrypty video i social z dowolnego URL — YouTube, TikTok, Instagram, X, Facebook.
  Pull a transcript, get captions, YouTube search (keyword/competitor research),
  web scraping (page → markdown, crawl site), metadane social (views, likes, engagement),
  dane kanałów i playlist. Transcript, transcription, video captions, YouTube search.
type: skill
install: .claude/skills/supadata/SKILL.md
pricing: free
verified: false
aios: true
---

# Supadata API

API do ekstrakcji treści z YouTube, social mediów i stron WWW. 21 endpointów, rozliczenie kredytowe. Wymaga konta Supadata i klucza API.

## Setup

Skill wozi własny klient w `scripts/utils/supadata.py`. Skopiuj folder `scripts/` do korzenia projektu, ustaw klucz i zainicjuj:

```bash
export SUPADATA_API_KEY="sd-..."
```

```python
from scripts.utils.supadata import SupadataClient
client = SupadataClient()  # czyta SUPADATA_API_KEY ze środowiska / .env
```

## Method Reference

| Method                                                                    | Description                                        | Credits                       |
| ------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------- |
| `transcript(url, text=False, lang=None, mode=None)`                       | Universal transcript (YT, TikTok, IG, X, FB)       | 1 (native), 2/min (generated) |
| `transcript_text(url, lang=None)`                                         | Convenience: plain text string or None             | 1                             |
| `transcript_status(job_id)`                                               | Poll async transcript job (>20 min videos)         | 0                             |
| `youtube_transcript_translate(url_or_id, target_lang)`                    | Translate YT transcript                            | 30/min                        |
| `youtube_transcript_batch(video_ids=, playlist_id=, channel_id=)`         | Batch transcripts (paid)                           | 1 + 1/video                   |
| `youtube_video(url_or_id)`                                                | Single video metadata                              | 1                             |
| `youtube_video_batch(video_ids=, playlist_id=, channel_id=)`              | Batch video metadata (paid)                        | 1 + 1/video                   |
| `youtube_batch_status(job_id)`                                            | Poll batch job                                     | 0                             |
| `youtube_channel(id_or_handle)`                                           | Channel metadata (subs, videos, views)             | 1                             |
| `youtube_channel_videos(id_or_handle, limit=, type=)`                     | List video IDs from channel                        | 1                             |
| `youtube_playlist(id_or_url)`                                             | Playlist metadata                                  | 1                             |
| `youtube_playlist_videos(id_or_url, limit=)`                              | List video IDs from playlist                       | 1                             |
| `youtube_search(query, upload_date=, type=, duration=, sort_by=, limit=)` | Search YouTube                                     | 1/page (~20 results)          |
| `metadata(url)`                                                           | Social media post metadata (YT, TikTok, IG, X, FB) | 1                             |
| `extract(url, prompt=, schema=)`                                          | AI structured data extraction from video           | FREE (beta)                   |
| `extract_status(job_id)`                                                  | Poll extraction job                                | 0                             |
| `web_scrape(url, no_links=False, lang=None)`                              | Scrape webpage to clean Markdown                   | 1                             |
| `web_map(url)`                                                            | Discover all URLs linked from a page               | 1                             |
| `web_crawl(url, limit=)`                                                  | Async full-site crawl (paid)                       | 1 + 1/page                    |
| `web_crawl_status(job_id, skip=)`                                         | Poll crawl job                                     | 0                             |
| `me()`                                                                    | Account info (plan, credits)                       | 1                             |

## Common Patterns

### Get a transcript as plain text

```python
text = client.transcript_text("https://youtube.com/watch?v=VIDEO_ID")
```

### Search YouTube

```python
results = client.youtube_search("AI agency", upload_date="month", sort_by="views", duration="long")
for r in results["results"]:
    print(f"{r['title']} — {r['viewCount']} views")
```

### Scrape a webpage to markdown

```python
page = client.web_scrape("https://example.com")
print(page["content"])  # clean markdown
```

## Credits & Pricing

Stan kredytów: `client.me()`. Kredyty nie przechodzą na kolejny okres. 1 kredyt = większość pojedynczych operacji.

## Async Jobs

Videos >20 min and batch/crawl operations return `{"jobId": "..."}`. Poll with the corresponding `_status()` method until `status == "completed"`.

> **Full endpoint documentation:** `references/endpoints.md`

---

## Maintenance

> **Self-improvement rule:** If you used this skill and discovered something not documented here — a gotcha, API quirk, new pattern, or better approach — add it below before finishing your task. Keep entries concise (one line each). If this section grows beyond 10 items, refactor learnings into the main body above.

### Known Gotchas

(none yet)
