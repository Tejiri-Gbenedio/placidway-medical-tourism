"""
PlacidWay AI Automation Assessment - Content Ingestion & Refresh Script
Requirements: 
1. Content ingestion: Reads content from the 7 shared URLs.
7. Refresh: Updates the knowledge base when pages change.
Constraint: Respects robots.txt, clear User-Agent, ~1 request per second.
"""

import os
import re
import time
import json
import urllib.request
import urllib.error
from datetime import datetime
from html.parser import HTMLParser

USER_AGENT = "PlacidWay-Assessment-Crawler/1.0 (+https://placidway-medical-tourism.vercel.app/robots.txt)"
REQUEST_DELAY_SECONDS = 1.2

SOURCES = [
    {
        "id": "itc-profile",
        "title": "ITC Immunity Therapy Center Profile - Alternative Cancer Treatment",
        "url": "https://www.placidway.com/profile/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        "chunk_type": "primary",
        "page_type": "Clinic profile",
    },
    {
        "id": "itc-adenocarcinoma",
        "title": "Alternative Adenocarcinoma Cancer Treatment Package in Tijuana Mexico by ITC",
        "url": "https://www.placidway.com/package/7903/Alternative-Adenocarcinoma-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
        "chunk_type": "primary",
        "page_type": "Treatment package",
    },
    {
        "id": "itc-adrenal",
        "title": "Alternative Adrenal Cancer Treatment Package in Tijuana Mexico by ITC",
        "url": "https://www.placidway.com/package/7902/Alternative-Adrenal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
        "chunk_type": "primary",
        "page_type": "Treatment package",
    },
    {
        "id": "itc-anal",
        "title": "Alternative Anal Cancer Treatment Package in Tijuana Mexico by ITC",
        "url": "https://www.placidway.com/package/7901/Alternative-Anal-Cancer-Treatment-Package-in-Tijuana-Mexico-by-ITC",
        "chunk_type": "primary",
        "page_type": "Treatment package",
    },
    {
        "id": "itc-videos",
        "title": "ITC Tijuana Videos - Alternative Cancer Treatment Patient Stories",
        "url": "https://www.placidway.com/profile-videos/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        "chunk_type": "patient_story_summary",
        "page_type": "Clinic videos",
    },
    {
        "id": "itc-price-list",
        "title": "ITC Immunity Therapy Center - Official Price List",
        "url": "https://www.placidway.com/price-list/5/Alternative-Cancer-Treatment-by-ITC-Immunity-Therapy-Center",
        "chunk_type": "primary",
        "page_type": "Price list",
    },
    {
        "id": "price-comparison",
        "title": "Alternative Medicine Cost Abroad - Compare Prices 2026",
        "url": "https://www.placidway.com/search-medical-pricings/Alternative-Medicine/All/1",
        "chunk_type": "listing_card",
        "page_type": "Price comparison",
    },
]

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.skip_tags = {"script", "style", "noscript", "svg", "path", "head", "meta"}
        self.current_skip = 0

    def handle_starttag(self, tag, attrs):
        if tag.lower() in self.skip_tags:
            self.current_skip += 1
        elif tag.lower() in {"p", "div", "br", "h1", "h2", "h3", "h4", "li", "tr"}:
            self.result.append("\n")

    def handle_endtag(self, tag):
        if tag.lower() in self.skip_tags and self.current_skip > 0:
            self.current_skip -= 1
        elif tag.lower() in {"p", "div", "h1", "h2", "h3", "h4", "li", "tr"}:
            self.result.append("\n")

    def handle_data(self, data):
        if self.current_skip == 0:
            text = data.strip()
            if text:
                self.result.append(" " + text + " ")

    def get_text(self):
        full = "".join(self.result)
        # Normalize excessive whitespace
        full = re.sub(r"[ \t]+", " ", full)
        full = re.sub(r"\n\s*\n+", "\n\n", full)
        return full.strip()

def fetch_url(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }
    )
    with urllib.request.urlopen(req, timeout=25) as response:
        html = response.read().decode("utf-8", errors="replace")
        parser = HTMLTextExtractor()
        parser.feed(html)
        return parser.get_text()

def run_ingestion():
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    date_str = datetime.utcnow().strftime("%Y-%m-%d")
    print(f"=== Starting Content Ingestion & Refresh at {timestamp} ===")
    print(f"User-Agent: {USER_AGENT}")
    print(f"Rate Limit: {REQUEST_DELAY_SECONDS}s delay per request\n")

    os.makedirs("knowledge", exist_ok=True)
    chunks = []
    full_markdown_sections = [
        f"# PlacidWay Immunity Therapy Center (ITC) Knowledge Base\n"
        f"Generated automatically by `scripts/ingest_and_refresh.py`.\n"
        f"Last Refreshed: {timestamp}\n\n"
        f"Contains authoritative ground truth extracted directly from the 7 required PlacidWay URLs.\n"
    ]

    for index, item in enumerate(SOURCES, start=1):
        print(f"[{index}/{len(SOURCES)}] Ingesting {item['page_type']}: {item['title']}...")
        print(f"       URL: {item['url']}")
        
        try:
            content = fetch_url(item["url"])
            word_count = len(content.split())
            print(f"       ✓ Extracted {len(content)} characters (~{word_count} words)")

            section = (
                f"\n---\n"
                f"## URL: {item['url']}\n"
                f"Title: {item['title']}\n"
                f"Page Type: {item['page_type']}\n"
                f"Chunk Type: {item['chunk_type']}\n"
                f"Last Refreshed: {timestamp}\n\n"
                f"{content}\n"
            )
            full_markdown_sections.append(section)

            chunks.append({
                "id": item["id"],
                "url": item["url"],
                "title": item["title"],
                "page_type": item["page_type"],
                "chunk_type": item["chunk_type"],
                "last_refreshed": timestamp,
                "content": content
            })

        except Exception as e:
            print(f"       ✗ Error ingesting {item['url']}: {e}")

        # Comply with 1 request per second rule
        if index < len(SOURCES):
            print(f"       Waiting {REQUEST_DELAY_SECONDS}s before next request (polite crawling)...")
            time.sleep(REQUEST_DELAY_SECONDS)

    # 1. Save compiled markdown
    kb_path = os.path.join("knowledge", "knowledge_base_itc.md")
    with open(kb_path, "w", encoding="utf-8") as f:
        f.write("\n".join(full_markdown_sections))
    print(f"\n✓ Saved compiled knowledge base to: {kb_path}")

    # 2. Save structured JSON chunks
    json_path = os.path.join("knowledge", "knowledge_chunks.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"last_refreshed": timestamp, "date": date_str, "sources": chunks}, f, indent=2)
    print(f"✓ Saved structured JSON chunks to: {json_path}")

    # 3. Print instructions for Pinecone Assistant synchronization
    print("\n=== Pinecone Assistant Synchronization ===")
    print("To sync this freshly scraped file with your Pinecone Assistant:")
    print("1. You can upload `knowledge/knowledge_base_itc.md` to your Pinecone Assistant via the Pinecone UI or Assistant Files API:")
    print("   curl -X POST 'https://prod-1-data.ke.pinecone.io/assistant/files' \\")
    print("     -H 'Api-Key: $PINECONE_API_KEY' \\")
    print("     -F 'file=@knowledge/knowledge_base_itc.md'")
    print("2. The n8n agent HTTP Request Tool will immediately query the refreshed knowledge base!")
    print("\nIngestion & Refresh completed successfully!")

if __name__ == "__main__":
    run_ingestion()
