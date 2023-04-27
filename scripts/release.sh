#!/bin/bash
SOURCE_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
git checkout -b "release/${VERSION}"
git push origin "release/${VERSION}"
git push origin "release/${VERSION}" --tags
git checkout $SOURCE_BRANCH;

