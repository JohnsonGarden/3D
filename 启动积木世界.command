#!/bin/bash
# Finder double-click entry point. Keep everything relative to downloaded project.
cd "$(dirname "$0")" || exit 1
/bin/bash "./scripts/start-local.sh" "$@"
status=$?
if [ "$status" -ne 0 ] && [ "$status" -ne 130 ] && [ "$status" -ne 143 ] && [ -t 0 ]; then
  printf "\n启动未完成。请查看上方报错。按回车关闭窗口..."
  read -r _
fi
exit "$status"
