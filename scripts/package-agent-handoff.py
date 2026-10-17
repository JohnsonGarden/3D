#!/usr/bin/env python3
"""Build self-contained, photo-free handoff ZIPs from the current checkout.

Intentionally excludes the six original IMG_07xx.HEIC photos, .git and local
browser/storage secrets. Supports an exact base SHA supplied via SOURCE_SHA.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "dist-handoff"
OUT.mkdir(exist_ok=True)
ALLOWED = ("docs", "specs", ".specify", ".github", "scripts", "tests")
ROOT_DOCS = (
    "AGENTS.md", "CLAUDE.md", "README.md", "LICENSE",
    "package.json", "package-lock.json", ".gitignore",
    "playwright.config.ts", "tsconfig.json", "vite.config.ts"
)
SOURCE_ROOTS = ("src",)
SOURCE_FILES = ("index.html", "启动积木世界.command", "下载并启动积木世界.command")

def files_for(full: bool):
    entries: set[Path] = set()
    for name in (*ALLOWED, *((*SOURCE_ROOTS,) if full else ())):
        base = ROOT / name
        if base.exists():
            entries.update(p for p in base.rglob("*") if p.is_file())
    for name in (*ROOT_DOCS, *(SOURCE_FILES if full else ())):
        p = ROOT / name
        if p.is_file():
            entries.add(p)
    return sorted(
        (p for p in entries
         if not any(part in (".git", "node_modules", "dist", "dist-handoff") for part in p.relative_to(ROOT).parts)
         and p.suffix.lower() not in (".heic", ".jpg", ".jpeg", ".png", ".mp4", ".mov")
         and not p.name.startswith(".env")),
        key=lambda p: p.as_posix(),
    )

def build(full: bool):
    kind = "full-source-no-photos" if full else "planning-harness"
    name = "3DLEGOWORLD-" + kind + ".zip"
    entries = files_for(full)
    manifest = {
      "project": "3DLEGOWORLD",
      "source_repository": "https://github.com/JohnsonGarden/3D",
      "source_ref": "docs/018-local-agent-handoff",
      "source_sha": __import__("os").environ.get("SOURCE_SHA", "unknown"),
      "kind": kind,
      "photos_included": False,
      "file_count": len(entries),
      "files": [
          {"path":p.relative_to(ROOT).as_posix(),"bytes":p.stat().st_size,
           "sha256":hashlib.sha256(p.read_bytes()).hexdigest()} for p in entries
      ]
    }
    with ZipFile(OUT / name,"w",compression=ZIP_DEFLATED,compresslevel=9) as zf:
        for p in entries:
            zf.write(p,arcname=p.relative_to(ROOT).as_posix())
        zf.writestr("HANDOFF-MANIFEST.json",json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
    print(OUT/name, "files=",len(entries))
    assert len(entries) > (90 if full else 80), "unexpectedly incomplete handoff"
    assert not any("IMG_07" in item["path"] for item in manifest["files"]), "photo privacy violation"

if __name__ == "__main__":
    build(False)
    build(True)
