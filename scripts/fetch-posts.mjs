// Runs in CI (see .github/workflows/fetch-posts.yml) on a schedule and
// commits the result, so the site reads a same-origin JSON file instead
// of fetching the Ghost RSS feed client-side (which has no CORS headers).
import { writeFile } from "node:fs/promises";

const FEED_URL = "https://theboredcoder.com/rss/";
const OUT_FILE = new URL("../data/posts.json", import.meta.url);
const MAX_POSTS = 6;

function extract(tag, block) {
  const match = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))</${tag}>`));
  if (!match) return "";
  return (match[1] ?? match[2] ?? "").trim();
}

function decodeEntities(str) {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

const xml = await fetch(FEED_URL).then((r) => {
  if (!r.ok) throw new Error(`RSS fetch failed: ${r.status}`);
  return r.text();
});

const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

const posts = items.slice(0, MAX_POSTS).map((block) => {
  const imageMatch = block.match(/<media:content url="([^"]+)"/);
  const excerpt = decodeEntities(extract("description", block)).replace(/<[^>]+>/g, "").trim();
  return {
    title: decodeEntities(extract("title", block)),
    link: extract("link", block),
    excerpt,
    category: decodeEntities(extract("category", block)),
    pubDate: extract("pubDate", block),
    image: imageMatch ? decodeEntities(imageMatch[1]) : null,
  };
});

await writeFile(OUT_FILE, JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 2) + "\n");
console.log(`Wrote ${posts.length} posts to ${OUT_FILE.pathname}`);
