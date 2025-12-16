#!/usr/bin/env bash
set -euo pipefail

pnpm build
pnpm version-packages
pnpm publish -r --filter "@splicetree/*" --filter "!@splicetree/docs"

