#! /usr/bin/bash

if command -v npm &> /dev/null; then
  npm ci --foreground-scripts 2>&1 && exit 0 || exit 1;
fi

echo "npm is not in your path!" >&2
exit 1
