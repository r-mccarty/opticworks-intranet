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

python3 - <<'PY'
import os
from pathlib import Path

root = Path(os.environ["DEST_DIR"])

for path in root.rglob("*.md"):
    text = path.read_text()
    stripped = text.lstrip()
    if stripped.startswith("---"):
        continue
    title = None
    for line in text.splitlines():
        if line.startswith("# "):
            title = line[2:].strip()
            break
    if not title:
        title = path.stem.replace("-", " ").title()
    frontmatter = f"---\ntitle: {title}\n---\n\n"
    path.write_text(frontmatter + text)
PY

cat <<MSG
Synced agent-harness docs to:
  $DEST_DIR

Included:
  AGENTS.md
  docs/
MSG
