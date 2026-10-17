#!/usr/bin/env bash
# Shared, testable safety preflight. No file creation, package install, or privilege changes.
require_normal_user() {
  local effective_uid="${1:-${EUID:-$(id -u)}}"
  if [[ "$effective_uid" == "0" ]]; then
    cat >&2 <<'BRICKWORLD_ROOT_ERROR'
积木世界安全检查：当前终端正在以 root（管理员最高权限）身份运行。
Homebrew 不支持 root 运行，且游戏安装与 npm 构建也不应该以 root 执行。

请关闭当前 root 会话，回到 Mac 的普通用户终端再试：
  1. 运行 id -u；返回 0 表示 root，返回非 0 才是普通用户。
  2. 如果当前通过 sudo -s / sudo -i 进入 root，请运行 exit 退出。
  3. 以普通用户身份双击安装器，或执行 bash scripts/start-local.sh。
不要加 sudo，不要修改 Homebrew 的安全保护。
BRICKWORLD_ROOT_ERROR
    return 77
  fi
}
