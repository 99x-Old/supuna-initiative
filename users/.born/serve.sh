#!/bin/bash

if [[ $ENVIRONMENT == "development" ]]
then
  yarn && yarn start
else
  yarn && yarn production
fi
