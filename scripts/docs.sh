#!/bin/bash
apt-get update
apt-get install zip unzip
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
cd documentation; zip -r ../dist/techpassport-client-docs-$PACKAGE_VERSION.zip *
