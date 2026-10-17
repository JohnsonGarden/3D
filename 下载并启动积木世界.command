#!/bin/bash
# Standalone first-install bootstrap for Mac Finder.
# Downloads ONLY this user's public GitHub dev branch; does NOT pipe remote text into bash.
set -Eeuo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

HOME_DIR="${BRICK_WORLD_HOME:-$HOME/BrickWorld3D}"
ARCHIVE_URL="https://github.com/JohnsonGarden/3D/archive/refs/heads/feat/lego-world-harness-v0.zip"

# Abort BEFORE download, mkdir, or reuse of an old installed script.
# Standalone bootstrap intentionally does not depend on adjacent project files.
if [[ "${EUID:-$(id -u)}" == "0" ]]; then
  cat >&2 <<'BRICKWORLD_ROOT_ERROR'
积木世界安全检查：当前是 root 身份。Homebrew 不支持 root，安装器不会以 root 下载或执行项目。
请在普通用户终端执行 id -u 确认结果不是 0。
如果当前处于提权后的 root 终端，请先输入 exit 回到普通用户环境，再重新双击本安装器。
不要以管理员最高权限启动游戏，也不要尝试绕过 Homebrew 的安全检查。
BRICKWORLD_ROOT_ERROR
  exit 77
fi

if [[ -d "$HOME_DIR" && -f "$HOME_DIR/package.json" &&
      -f "$HOME_DIR/scripts/start-local.sh" ]]; then
  echo "找到已安装的积木世界：$HOME_DIR"
  echo "直接启动现有版本；不会自动覆盖或删除你的代码和文件。"
elif [[ -e "$HOME_DIR" ]]; then
  echo "安装路径已存在，但不是有效的积木世界工程：$HOME_DIR" >&2
  echo "为保护现有文件，本次不会覆盖。请改用 BRICK_WORLD_HOME 指定新目录。" >&2
  exit 1
else
  if ! command -v curl >/dev/null 2>&1 || ! command -v unzip >/dev/null 2>&1; then
    echo "需要系统自带的 curl 和 unzip 才能下载项目。" >&2
    exit 1
  fi
  echo "准备从 GitHub 下载项目：$ARCHIVE_URL"
  echo "安装路径：$HOME_DIR"
  echo "首次下载和 npm 依赖安装需要联网。"
  scratch="$(mktemp -d "${TMPDIR:-/tmp}/brickworld-install.XXXXXX")"
  cleanup_scratch() { rm -rf -- "$scratch"; }
  trap cleanup_scratch EXIT
  curl --fail --location --silent --show-error --retry 2 --connect-timeout 15     --max-time 180 --proto '=https' --tlsv1.2 --output "$scratch/source.zip"     "$ARCHIVE_URL"
  unzip -q "$scratch/source.zip" -d "$scratch/repository"
  unpacked=""
  for candidate in "$scratch/repository"/*; do
    if [[ -f "$candidate/package.json" && -f "$candidate/scripts/start-local.sh" &&
          -f "$candidate/scripts/serve-local.mjs" ]]; then
      unpacked="$candidate"
      break
    fi
  done
  if [[ -z "$unpacked" ]]; then
    echo "解压后的源码结构与预期不符。停止安装，不运行未知文件。" >&2
    exit 1
  fi
  mkdir -p -- "$(dirname "$HOME_DIR")"
  mv -- "$unpacked" "$HOME_DIR"
  echo "源码安装完成：$HOME_DIR"
  cleanup_scratch
  trap - EXIT
fi

/bin/bash "$HOME_DIR/scripts/start-local.sh" "$@"
exit_code=$?
exit "$exit_code"
