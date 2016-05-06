#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
for path in ${DIR}/../examples/*/; do
    echo "$path"
    (cd "$path" && rm -r node_modules && ncu -u -a && npm install)
done