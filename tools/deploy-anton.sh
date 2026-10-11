#!/bin/bash
# Ship the current code to Anton:   tools/deploy-anton.sh
# Builds the image for Anton's x86-64 CPU on this Mac, loads it over SSH and restarts the container.
# The trip log in /mnt/user/appdata/bench-and-bank/data on Anton is not touched.
set -e
cd "$(dirname "$0")/.."
docker buildx build --platform linux/amd64 -t bench-and-bank:anton --load .
docker save bench-and-bank:anton | gzip | ssh anton 'gunzip -c | docker load'
scp -q deploy/anton-compose.yml anton:/mnt/user/appdata/bench-and-bank/docker-compose.yml
ssh anton 'cd /mnt/user/appdata/bench-and-bank && docker compose up -d'
