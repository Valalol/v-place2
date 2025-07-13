#!/bin/sh
set -e

if [ ! -f /app/tmp/db.sqlite3 ]; then
  node ace migration:run --force
  node ace db:seed
fi

exec node ./bin/server.js