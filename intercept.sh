#!/bin/sh
telepresence connect -n huna
telepresence intercept huna-huna-detection --port 3004:http --to-pod 8181 --env-json ./.env || true
