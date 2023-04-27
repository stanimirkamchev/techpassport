#!/bin/bash
apt-get update
apt-get install tar
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
SUFFIX=$1
cd dist; tar -czvf ./techpassport-client-${PACKAGE_VERSION}${SUFFIX}.tar.gz *
