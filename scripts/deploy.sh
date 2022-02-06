#!/bin/bash

export $(cat .env | xargs)
ssh $SERVER "cd $UPLOAD_PATH; sh scripts/saveOutput.sh"
ssh $SERVER "cd $UPLOAD_PATH; git pull;"
ssh $SERVER "cd $UPLOAD_PATH; NODEJS_VERSION=16 npm install; NODEJS_VERSION=16 npm run build;"
curl -X POST --basic --user "$ALWAYSDATA_TOKEN:" https://api.alwaysdata.com/v1/site/$ALWAYSDATA_SITE_ID/restart/
