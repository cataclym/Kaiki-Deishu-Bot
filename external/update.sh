#! /usr/bin/bash
currentTag="$(git describe)"
git fetch &> /dev/null
latestTag="$(git tag | sort -V | tail -1)"

if [[ "$latestTag" != "$currentTag" ]]; then
  echo "New version detected. Updating from ${currentTag} to ${latestTag}..."
  git checkout "$latestTag" 2>&1 && currentTag="$(git describe)"

  if [[ "$latestTag" == "$currentTag" ]]; then
    echo "Successfully updated to ${latestTag}!"
    exit 0
  else
    echo "Error, unable to update..." >&2
    exit 1
  fi
fi

echo "No update available."
exit 0
