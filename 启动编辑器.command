#!/bin/zsh
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  osascript -e 'display dialog "请先安装 Node.js 22 或更高版本。" buttons {"好"} with icon stop'
  exit 1
fi
npm run dev
