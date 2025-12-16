#!/usr/bin/env bash
set -euo pipefail

pnpm build
pnpm publish -r --filter "@splicetree/*" --filter "!@splicetree/docs"

