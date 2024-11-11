#!/usr/bin/env bash
cd "$(dirname "$0")"
set -e

podman-compose build
