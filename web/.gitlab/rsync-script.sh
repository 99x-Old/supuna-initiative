#!/bin/bash -e

url=$1
local_folder=$2


if [ -z "$SSH_PRIVATE_KEY" ]; then
	>&2 echo "Set SSH_PRIVATE_KEY environment variable"
	exit 1
fi

ssh_host=$(echo $url | sed 's/.*@//' | sed 's/[:/].*//')
if [ -z "$ssh_host" ]; then
	>&2 echo "Usage: $0 <user@host:folder> [<branch>]"
	exit 1
fi

## support for different port not yet ported

# TODO: skip on multiple runs
mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ssh_key
chmod 600 ssh_key
ssh-keyscan -H -t rsa "$ssh_host"  >> ~/.ssh/known_hosts
echo "Executing: rsync -avzr  -e "ssh -i ssh_key" $local_folder $url"
rsync -avzr  -e "ssh -i ssh_key" "$local_folder" "$url"
rm ssh_key

