#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
for path in ${DIR}/../examples/*/; do
    echo "$path"
    [ -f "$path/gulpfile.js" ] || continue # if no gulpfile.js, skip
    (cd "$path" && npm install && gulp bundle)
done