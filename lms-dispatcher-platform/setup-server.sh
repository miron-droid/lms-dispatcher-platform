#!/bin/bash
set -e

echo "=== Installing Docker ==="
apt-get update -q
apt-get install -y -q ca-certificates curl gnupg lsb-release

if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
  apt-get install -y -q docker-compose-plugin
fi

echo "=== Docker version ==="
docker --version
docker compose version 2>/dev/null || docker-compose --version

echo "=== Server setup complete ==="
