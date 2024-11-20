#!/usr/bin/env bash
cd "$(dirname "$0")"
set -e

# Backend
cd backend
podman build -t sunva-backend .

cd ../frontend
podman build -t sunva-frontend .
