#!/bin/sh
set -eu

: "${API_URL:=http://localhost:8080/api}"

envsubst '${API_URL}' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec "$@"
