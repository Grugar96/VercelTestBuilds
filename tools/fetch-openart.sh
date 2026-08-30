#!/usr/bin/env bash
# Download the four OpenArt generations into assets/img/ under the filenames the
# markup expects, then wire them in.
#
# Run this from your own machine: the build sandbox's egress proxy blocks
# cdn.openart.ai, which is why these were not fetched automatically.
#
#   bash tools/fetch-openart.sh && python3 tools/wire_images.py
#
# The URLs are OpenArt CDN links and may expire. If one 404s, re-download that
# image from https://openart.ai/my-creations and save it under the same name.

set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/img

fetch() {
  local name="$1" url="$2"
  printf '%-20s ' "$name"
  if curl -fsSL --max-time 180 -o "assets/img/${name}.png" "$url"; then
    echo "$(du -h "assets/img/${name}.png" | cut -f1)"
  else
    echo "FAILED — re-download manually from openart.ai/my-creations"
  fi
}

# hero — 2720x1536 (16:9)
fetch hero-refinery \
  "https://cdn.openart.ai/openart-ai/production/2026-08/create-image/MqY66WgmTUBRrMxQVciz/cd8609e1bf07cc8161e9289d779000d5-997acf4b-4c66-4610-a073-494817e5c24a_1788078987956_c0d23570.png"

# sector cards — 1760x2368 (3:4)
fetch sector-minerals \
  "https://cdn.openart.ai/openart-ai/production/2026-08/create-image/MqY66WgmTUBRrMxQVciz/6d8dace507fbedb4a13da3ee11af7bdc-c38bd331-ebac-4b1e-a579-7ab17825a486_1788079104645_57fe43de.png"

fetch sector-agro \
  "https://cdn.openart.ai/openart-ai/production/2026-08/create-image/MqY66WgmTUBRrMxQVciz/e152d8b9ac4c2f1ebdded443ea768db0-ea6a92f5-7fe7-42bf-a919-c827a07d7590_1788079112187_92362ab8.png"

fetch sector-logistics \
  "https://cdn.openart.ai/openart-ai/production/2026-08/create-image/MqY66WgmTUBRrMxQVciz/2bfda88afec0f035280990295830b413-9edcca22-f949-4b9a-b989-9a6f59812f2c_1788079120977_bf46d1bd.png"

echo
echo "Next:  python3 tools/wire_images.py"
