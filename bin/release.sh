#!/bin/bash
############################################
# document how I do releases in this repo
############################################

# git release 2.8.1 # https://github.com/visionmedia/git-extras#git-release
                    # currently using https://github.com/chmontgomery/git-extras/commits/master
# npm publish ./

############################################
# pre-commit
############################################
# Run gulp shrinkwrap on every commit so that we always have the most recent
# dependencies checked in.

#npm prune > /dev/null
#error=$(gulp shrinkwrap)
#if [[ $? -ne 0 ]] ; then
#  echo "$error"
#  exit 1
#fi

# If modified adds file(s) and includes them in commit.
#git add package.json
#git add npm-shrinkwrap.json