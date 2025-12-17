#!/usr/bin/env bash
set -euo pipefail

pnpm build
pnpm version-packages
node scripts/aggregate-changeset.js
pnpm publish -r --filter "@splicetree/*" --filter "!@splicetree/docs"
