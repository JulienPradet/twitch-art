#!/bin/bash

git stash
git pull --rebase
git stash pop
git add output
git commit -m "Automatically update output from server data"
git push