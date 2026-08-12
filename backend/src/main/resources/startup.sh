#!/bin/sh

export HOME=/home
export XDG_CONFIG_HOME=/home/.config
export PATH="/home/.local/bin:${PATH}"

mkdir -p /home/.local/bin /home/.config

if [ ! -x /home/.local/bin/agy ]; then
  if command -v python3 >/dev/null 2>&1; then
    python3 -c 'import urllib.request; print(urllib.request.urlopen("https://antigravity.google/cli/install.sh").read().decode())' | sh || true
  elif command -v wget >/dev/null 2>&1; then
    wget -O- https://antigravity.google/cli/install.sh | sh || true
  elif command -v curl >/dev/null 2>&1; then
    curl -fsSL https://antigravity.google/cli/install.sh | sh || true
  else
    echo "python3, wget, curl 중 하나가 필요합니다." >&2
  fi
fi

exec java --enable-native-access=ALL-UNNAMED -cp /home/site/wwwroot org.springframework.boot.loader.launch.JarLauncher
