#!/usr/bin/env bash
set -euo pipefail

AGENT_HARNESS_DIR="${AGENT_HARNESS_DIR:-$HOME/agent-harness}"
DEST_DIR="${DEST_DIR:-$(pwd)/src/content/docs/sources/agent-harness}"

if [[ ! -d "$AGENT_HARNESS_DIR" ]]; then
  echo "Agent harness dir not found: $AGENT_HARNESS_DIR" >&2
  exit 1
fi

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

cp "$AGENT_HARNESS_DIR/AGENTS.md" "$DEST_DIR/AGENTS.md"
cp -R "$AGENT_HARNESS_DIR/docs" "$DEST_DIR/docs"

cat <<MSG
Synced agent-harness docs to:
  $DEST_DIR

Included:
  AGENTS.md
  docs/
MSG
