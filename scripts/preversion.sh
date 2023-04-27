#!/bin/bash
if [ -z "$(git status --porcelain)" ]; then
  echo 'Repository is clean'
else
  echo 'You have uncommitted changes, reverting tags...'
  git tag -l | xargs git tag -d
  git fetch --tags && exit 1;
fi
