#!/usr/bin/env bash
# Mac Finder one-click / Linux terminal launch of local built version.
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd -P)"
cd "$ROOT"
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"

PORT="${BRICK_WORLD_PORT:-4173}"
OPEN_BROWSER=1
BUILD_ONLY=0
CHECK_ONLY=0
SHOW_HELP=0
for arg in "$@"; do
  case "$arg" in
    --no-open) OPEN_BROWSER=0 ;;
    --build-only) BUILD_ONLY=1 ;;
    --check) CHECK_ONLY=1 ;;
    --help|-h) SHOW_HELP=1 ;;
    *) echo "未知参数: $arg"; exit 2 ;;
  esac
done
if (( SHOW_HELP )); then
  cat <<'HELP'
积木世界一键本地启动
  ./启动积木世界.command        安装依赖、构建、打开浏览器并运行
  bash scripts/start-local.sh --check       仅检查 Node/npm 环境
  bash scripts/start-local.sh --build-only  仅安装依赖并构建
  bash scripts/start-local.sh --no-open     运行但不打开浏览器
  BRICK_WORLD_PORT=4174 bash scripts/start-local.sh --no-open
  在终端按 Ctrl+C 可停止本次启动的本地服务。
仅绑定 127.0.0.1，不会对局域网开放。
HELP
  exit 0
fi
if ! [[ "$PORT" =~ ^[0-9]{1,5}$ ]] || (( 10#$PORT < 1024 || 10#$PORT > 65535 )); then
  echo "端口必须是 1024 到 65535 之间的数字，例如 BRICK_WORLD_PORT=4174。" >&2
  exit 2
fi
PORT="$((10#$PORT))"
URL="http://127.0.0.1:$PORT"

# Finder does not always inherit Terminal's PATH. Prefer an installed brew Node 22.
use_brew_node() {
  if ! command -v brew >/dev/null 2>&1; then return 1; fi
  local prefix
  prefix="$(brew --prefix node@22 2>/dev/null || true)"
  if [[ -n "$prefix" && -x "$prefix/bin/node" ]]; then
    export PATH="$prefix/bin:$PATH"
    return 0
  fi
  return 1
}
node_ready() {
  command -v node >/dev/null 2>&1 &&
    command -v npm >/dev/null 2>&1 &&
    node -e 'const [major,minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1)' >/dev/null 2>&1
}
if ! node_ready; then
  use_brew_node || true
fi
if ! node_ready && (( ! CHECK_ONLY )) && [[ "$(uname -s)" == "Darwin" ]] &&
  command -v brew >/dev/null 2>&1 && [[ -t 0 ]]; then
  echo "未检测到 Node.js 22.12 或以上版本。"
  printf "是否允许 Homebrew 安装 node@22？[y/N] "
  read -r answer
  if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    brew install node@22
    use_brew_node || true
  fi
fi
if ! node_ready; then
  echo "需要 Node.js >= 22.12 和 npm。请到 https://nodejs.org/en/download 安装 Node.js LTS，或使用 Homebrew：brew install node@22" >&2
  echo "安装后重新双击 启动积木世界.command。" >&2
  exit 1
fi
echo "Node $(node -v) · npm $(npm -v)"
if (( CHECK_ONLY )); then
  echo "环境检查完成；没有安装依赖、构建或启动服务器。"
  exit 0
fi
if [[ ! -f package.json || ! -f scripts/serve-local.mjs ]]; then
  echo "当前文件夹不是完整的 3DLEGOWORLD 项目，请解压整个开发分支 ZIP。" >&2
  exit 1
fi

launch_browser() {
  if (( ! OPEN_BROWSER )); then return; fi
  if [[ "$(uname -s)" == "Darwin" ]]; then
    open "$URL" || echo "请手动在浏览器打开 $URL"
  elif command -v xdg-open >/dev/null 2>&1 &&
       [[ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ]]; then
    xdg-open "$URL" >/dev/null 2>&1 || true
  fi
}

# Avoid interfering with unrelated processes and don't rebuild when already served.
if command -v curl >/dev/null 2>&1; then
  health="$(curl --silent --max-time 2 "$URL/__brickworld/health" || true)"
  if [[ "$health" == *'"app":"brickworld3d"'* ]]; then
    echo "积木世界已经运行：$URL"
    launch_browser
    exit 0
  fi
  status="$(curl --silent --output /dev/null --max-time 2 --write-out '%{http_code}' "$URL/" || true)"
  if [[ "$status" != "000" && -n "$status" ]]; then
    echo "端口 $PORT 已被其他程序占用。请先结束占用，或换端口：BRICK_WORLD_PORT=4174 bash scripts/start-local.sh" >&2
    exit 1
  fi
fi

if [[ ! -x node_modules/.bin/vite || ! -x node_modules/.bin/tsc ||
      package.json -nt node_modules/.package-lock.json ]]; then
  echo "首次启动 / 依赖更新：安装 npm 依赖（需要联网）..."
  if [[ -f package-lock.json ]]; then
    npm ci --no-audit --no-fund
  else
    npm install --prefer-offline --no-audit --no-fund
  fi
fi
echo "正在构建本地正式版本..."
npm run build
if (( BUILD_ONLY )); then
  echo "构建完成：$ROOT/dist"
  exit 0
fi
echo "仅在本机运行，不提供局域网访问：$URL"
BRICK_WORLD_PORT="$PORT" node scripts/serve-local.mjs &
server_pid=$!
cleanup() {
  if kill -0 "$server_pid" 2>/dev/null; then
    kill "$server_pid" 2>/dev/null || true
  fi
  wait "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

ready=0
for i in {1..50}; do
  if ! kill -0 "$server_pid" 2>/dev/null; then break; fi
  if command -v curl >/dev/null 2>&1 &&
     curl --silent --fail --max-time 1 "$URL/__brickworld/health" | grep -q '"app":"brickworld3d"'; then
    ready=1
    break
  fi
  sleep 0.2
done
if (( ! ready )); then
  echo "服务未成功就绪。请检查上方报错（或端口是否已被其他程序占用）。" >&2
  exit 1
fi
echo "已就绪！按 Ctrl+C 停止本次启动的本地服务。"
launch_browser
wait "$server_pid"
