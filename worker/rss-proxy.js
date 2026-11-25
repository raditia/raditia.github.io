// Deployed as the `boredcoder-rss` Worker on workers.dev. Bot Fight Mode on
// theboredcoder.com blocks GitHub Actions runners, so CI reads the feed here.
// Fixed upstream URL: this is not a general-purpose proxy.
const FEED_URL = "https://theboredcoder.com/rss/";

export default {
  async fetch() {
    const upstream = await fetch(FEED_URL, { cf: { cacheTtl: 600, cacheEverything: true } });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/rss+xml" },
    });
  },
};
