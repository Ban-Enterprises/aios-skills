import urllib.request
import urllib.parse
import json
import time

class RedditClient:
    """Zero-auth Reddit research via public .json endpoints."""

    BASE = "https://www.reddit.com"
    HEADERS = {"User-Agent": "AIOS-Research/1.0"}
    DELAY = 6.5  # seconds between requests (rate limit: 10/min)

    def __init__(self):
        self._last_request = 0

    def _get(self, url):
        now = time.time()
        wait = self.DELAY - (now - self._last_request)
        if wait > 0:
            time.sleep(wait)
        req = urllib.request.Request(url, headers=self.HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            self._last_request = time.time()
            return json.loads(resp.read().decode())

    def search(self, query, sort="relevance", time_filter="year", limit=15, subreddit=None):
        """Search r/all or a specific subreddit."""
        base = f"{self.BASE}/r/{subreddit}" if subreddit else self.BASE
        params = urllib.parse.urlencode({
            "q": query, "sort": sort, "t": time_filter, "limit": limit
        })
        data = self._get(f"{base}/search.json?{params}&restrict_sr=1" if subreddit
                         else f"{base}/search.json?{params}")
        return [self._parse_post(p["data"]) for p in data["data"]["children"]]

    def find_subreddits(self, query, limit=5):
        """Auto-detect relevant subreddits for a topic."""
        params = urllib.parse.urlencode({"q": query, "limit": limit})
        data = self._get(f"{self.BASE}/subreddits/search.json?{params}")
        return [{"name": s["data"]["display_name"],
                 "subscribers": s["data"].get("subscribers", 0),
                 "description": s["data"].get("public_description", "")[:200]}
                for s in data["data"]["children"]]

    def hot(self, subreddit, limit=10):
        data = self._get(f"{self.BASE}/r/{subreddit}/hot.json?limit={limit}")
        return [self._parse_post(p["data"]) for p in data["data"]["children"]]

    def top(self, subreddit, time_filter="week", limit=10):
        data = self._get(f"{self.BASE}/r/{subreddit}/top.json?t={time_filter}&limit={limit}")
        return [self._parse_post(p["data"]) for p in data["data"]["children"]]

    def extract_thread(self, url, comment_limit=25):
        """Full post body + top N comments with scores."""
        clean = url.rstrip("/")
        if "?" in clean:
            clean = clean.split("?")[0]
        data = self._get(f"{clean}.json?limit={comment_limit}&sort=confidence")
        post = self._parse_post(data[0]["data"]["children"][0]["data"])
        comments = []
        for c in data[1]["data"]["children"][:comment_limit]:
            if c["kind"] != "t1":
                continue
            cd = c["data"]
            comments.append({
                "author": cd.get("author", "[deleted]"),
                "body": cd.get("body", ""),
                "score": cd.get("score", 0),
                "is_op": cd.get("is_submitter", False),
            })
        post["comments"] = comments
        post["comments_extracted"] = len(comments)
        return post

    def research(self, query, time_filter="year", max_threads=5, max_comments=25,
                 subreddits=None, auto_detect_subreddits=True, max_subreddits=3):
        """Full pipeline: detect subreddits -> search -> extract top threads."""
        detected = []
        if auto_detect_subreddits and not subreddits:
            detected = self.find_subreddits(query, limit=max_subreddits)
            subreddits = [s["name"] for s in detected]

        all_posts = self.search(query, time_filter=time_filter, limit=25)
        for sub in (subreddits or []):
            all_posts += self.search(query, subreddit=sub, time_filter=time_filter, limit=15)

        seen = set()
        unique = []
        for p in sorted(all_posts, key=lambda x: x["score"], reverse=True):
            if p["url"] not in seen:
                seen.add(p["url"])
                unique.append(p)

        threads = []
        for p in unique[:max_threads]:
            try:
                thread = self.extract_thread(p["url"], comment_limit=max_comments)
                threads.append(thread)
            except Exception:
                continue

        return {
            "query": query,
            "subreddits_searched": ["all"] + (subreddits or []),
            "subreddits_detected": detected,
            "posts_found": len(unique),
            "threads_extracted": len(threads),
            "threads": threads,
        }

    def _parse_post(self, d):
        return {
            "title": d.get("title", ""),
            "selftext": d.get("selftext", ""),
            "score": d.get("score", 0),
            "num_comments": d.get("num_comments", 0),
            "subreddit": d.get("subreddit", ""),
            "author": d.get("author", "[deleted]"),
            "url": f"{self.BASE}{d.get('permalink', '')}",
            "upvote_ratio": d.get("upvote_ratio", 0),
        }
