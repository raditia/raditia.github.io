#!/bin/sh
# Cron entry on the blog server: refresh data/posts.json from the local Ghost
# feed and push it. See scripts/fetch-posts.mjs for why this runs there.
set -eu
cd "$(dirname "$0")/.."
git pull --ff-only --quiet
FEED_URL=http://127.0.0.1:2368/rss/ node scripts/fetch-posts.mjs
git add data/posts.json
git diff --cached --quiet || { git commit --quiet -m "Update latest blog posts" && git push --quiet; }
