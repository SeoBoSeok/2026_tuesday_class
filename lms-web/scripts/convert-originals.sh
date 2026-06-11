#!/bin/bash
# CLAUDE_BASIC/ 원본 PDF를 웹에서 볼 수 있게 페이지별 WebP 이미지로 변환한다.
# 결과: public/originals/<slug>/page-N.webp + manifest.json
# 재실행하면 전체 재생성 (PDF 추가 시 다시 실행)
set -euo pipefail

SRC="$(cd "$(dirname "$0")/../.." && pwd)/CLAUDE_BASIC"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/originals"
DPI=110
QUALITY=70

rm -rf "$OUT"
mkdir -p "$OUT"

manifest="{"
first=1

for pdf in "$SRC"/*.pdf; do
  base="$(basename "$pdf" .pdf)"
  # slug 규칙: 한글정리 md 파일명과 일치시킴
  if [ "$base" = "Claude Code Cheat Sheet" ]; then
    slug="claude-code-cheat-sheet"
  else
    slug="$base"
  fi
  dir="$OUT/$slug"
  mkdir -p "$dir"

  tmp=$(mktemp -d)
  pdftoppm -r "$DPI" -jpeg -jpegopt quality=85 "$pdf" "$tmp/p"
  pages=()
  i=0
  for jpg in "$tmp"/p-*.jpg "$tmp"/p-*.jpeg; do
    [ -e "$jpg" ] || continue
    i=$((i+1))
    out="$dir/page-$i.webp"
    cwebp -quiet -q "$QUALITY" "$jpg" -o "$out"
    pages+=("\"/originals/$slug/page-$i.webp\"")
  done
  rm -rf "$tmp"

  entry="\"$slug\": {\"images\": [$(IFS=,; echo "${pages[*]}")]"
  # 치트시트는 PDF 원본도 함께 (다운로드용)
  if [ "$slug" = "claude-code-cheat-sheet" ]; then
    cp "$pdf" "$dir/original.pdf"
    entry="$entry, \"pdf\": \"/originals/$slug/original.pdf\""
  fi
  entry="$entry}"

  [ $first -eq 0 ] && manifest="$manifest,"
  manifest="$manifest$entry"
  first=0
  echo "✓ $slug ($i페이지)"
done

# llm-wiki HTML 슬라이드는 그대로 복사 (iframe으로 표시)
if [ -f "$SRC/llm-wiki-slides-bilingual.html" ]; then
  mkdir -p "$OUT/llm-wiki-slides"
  cp "$SRC/llm-wiki-slides-bilingual.html" "$OUT/llm-wiki-slides/original.html"
  [ $first -eq 0 ] && manifest="$manifest,"
  manifest="$manifest\"llm-wiki-slides\": {\"images\": [], \"html\": \"/originals/llm-wiki-slides/original.html\"}"
  echo "✓ llm-wiki-slides (html)"
fi

manifest="$manifest}"
echo "$manifest" | python3 -m json.tool > "$OUT/manifest.json"
echo "── 완료: $(du -sh "$OUT" | cut -f1) ──"
